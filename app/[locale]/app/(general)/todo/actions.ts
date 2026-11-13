"use server";
import { auth } from "@/app/auth";
import { UnauthorizedError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { resolveTimezone } from "@/lib/resolveTimeZone";
import expandAndMergeTodos from "@/lib/RRule/expandAndMergeTodos";
import { getClosestOccuringInstance } from "@/lib/RRule/getClosestOccuringInstance";
import { getClosestOverdueOccuringInstance } from "@/lib/RRule/getClosestOverdueOccuringInstance";
import { getTodoDurationMinutes } from "@/lib/RRule/getTodoDurationMinutes";
import { mergeWithOverrideInstances } from "@/lib/RRule/mergeWithOverrideInstances";
import { TodoItemType, recurringTodoItemType } from "@/types";
import { addDays, addMinutes, endOfDay, startOfDay, sub } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

export async function getOverdueTodos(): Promise<TodoItemType[]> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    throw new UnauthorizedError("You must be logged in to do this");
  }
  const timeZone = await resolveTimezone(user);
  const now = new Date();
  const userNow = toZonedTime(now, timeZone);
  // Calculate yesterday in user timezone
  const userYesterday = sub(startOfDay(userNow), { days: 1 });

  const dateRangeStart = fromZonedTime(
    sub(endOfDay(userYesterday), { days: 30 }),
    timeZone,
  );
  const dateRangeEnd = fromZonedTime(endOfDay(userYesterday), timeZone);

  // Fetch One-Off Todos
  const oneOffTodos = await prisma.todo.findMany({
    where: {
      userID: user.id,
      rrule: null,
      completed: false,
      due: {
        not: null,
        gte: dateRangeStart,
      },
      OR: [{ dtstart: { lte: dateRangeEnd } }, { dtstart: null }],
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch all Recurring todos
  const recurringParents = (await prisma.todo.findMany({
    where: {
      userID: user.id,
      rrule: { not: null },
      dtstart: { lte: dateRangeEnd },
      due: { not: null },
      completed: false,
    },
    include: { instances: true },
  })) as recurringTodoItemType[];

  const closestOverdueOccuringTodos = recurringParents.flatMap((todo) => {
    const closestOccurenceDate = getClosestOverdueOccuringInstance(
      todo,
      todo.instances,
      timeZone,
      dateRangeEnd,
    );
    if (!closestOccurenceDate) return [];
    const instance = {
      ...todo,
      dtstart: closestOccurenceDate,
      due: addMinutes(closestOccurenceDate, getTodoDurationMinutes(todo)),
      instanceDate: closestOccurenceDate,
    };
    const overridenInstance = mergeWithOverrideInstances([instance]);
    return overridenInstance;
  });

  // Normalize one-off todos to match TodoItemType (add instanceDate: null)
  const normalizedOneOffTodos: TodoItemType[] = oneOffTodos.map((todo) => ({
    ...todo,
    instanceDate: null,
    instances: null,
  }));
  const allTodos = [
    ...normalizedOneOffTodos,
    ...closestOverdueOccuringTodos,
  ].sort((a, b) => a.order - b.order);

  const overdueTodos = allTodos.filter((todo) => {
    return todo.due!.getTime() <= dateRangeEnd.getTime();
  });

  const todoWithFormattedID = overdueTodos.map((todo) => {
    const todoId = `${todo.id}:${todo.instanceDate?.getTime() || null}`;
    return {
      ...todo,
      id: todoId,
    };
  });
  return todoWithFormattedID;
}

export async function getUpcomingTodo(): Promise<TodoItemType[]> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    throw new UnauthorizedError("You must be logged in to do this");
  }
  const timeZone = await resolveTimezone(user);
  const userNow = toZonedTime(new Date(), timeZone);
  const userTomorrow = addDays(userNow, 1);
  const dateRangeStart = fromZonedTime(startOfDay(userTomorrow), timeZone);
  const dateRangeEnd = fromZonedTime(
    new Date(endOfDay(userTomorrow).getTime() + 365 * 24 * 60 * 60 * 1000),
    timeZone,
  );
  const userTodayEnd = fromZonedTime(endOfDay(userNow), timeZone);

  const oneOffTodos = await prisma.todo.findMany({
    where: {
      userID: user.id,
      rrule: null,
      completed: false,
      AND: [
        {
          OR: [{ due: null }, { due: { gte: dateRangeStart } }],
        },
        {
          OR: [{ dtstart: null }, { dtstart: { lte: dateRangeEnd } }],
        },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const recurringTodos = (await prisma.todo.findMany({
    where: {
      userID: user.id,
      rrule: { not: null },
      dtstart: { not: null, lte: dateRangeEnd },
      completed: false,
    },
    include: { instances: true },
  })) as recurringTodoItemType[];

  const recurringInstances = recurringTodos.flatMap((todo) => {
    const instances = expandAndMergeTodos(
      [todo],
      timeZone,
      dateRangeStart,
      dateRangeEnd,
    );
    if (instances.length <= 1) return instances;

    const closestOccurenceDate = getClosestOccuringInstance(
      todo,
      todo.instances,
      timeZone,
      userTodayEnd,
      true,
    );
    if (!closestOccurenceDate) return [];
    const instance = {
      ...todo,
      dtstart: closestOccurenceDate,
      due: addMinutes(closestOccurenceDate, getTodoDurationMinutes(todo)),
      instanceDate: closestOccurenceDate,
    };
    return mergeWithOverrideInstances([instance]);
  });

  const normalizedOneOffTodos = oneOffTodos.map((todo) => ({
    ...todo,
    instanceDate: null,
    instances: null,
  }));

  return [...normalizedOneOffTodos, ...recurringInstances]
    .sort((a, b) => a.order - b.order)
    .map((todo) => {
      const instanceDate = todo.instanceDate
        ? new Date(todo.instanceDate)
        : null;
      return {
        ...todo,
        id: `${todo.id}:${instanceDate?.getTime() ?? null}`,
        createdAt: new Date(todo.createdAt),
        dtstart: todo.dtstart ? new Date(todo.dtstart) : null,
        due: todo.due ? new Date(todo.due) : null,
        instanceDate,
        instances: todo.instances ?? null,
      };
    });
}
