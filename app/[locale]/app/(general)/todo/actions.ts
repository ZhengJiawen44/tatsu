"use server";
import { auth } from "@/app/auth";
import { UnauthorizedError } from "@/lib/customError";
import generateTodosFromRRule from "@/lib/generateTodosFromRRule";
import { getMovedInstances } from "@/lib/getMovedInstances";
import { overrideBy } from "@/lib/overrideBy";
import { prisma } from "@/lib/prisma/client";
import { resolveTimezone } from "@/lib/resolveTimeZone";
import { TodoItemType, recurringTodoItemType } from "@/types";
import { endOfDay, startOfDay, sub } from "date-fns";
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
        gte: dateRangeStart,
      },
      dtstart: {
        lte: dateRangeEnd,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch all Recurring todos
  const recurringParents = (await prisma.todo.findMany({
    where: {
      userID: user.id,
      rrule: { not: null },
      dtstart: { lte: dateRangeEnd },
      completed: false,
    },
    include: { instances: true },
  })) as recurringTodoItemType[];

  // Expand RRULEs to generate occurrences
  const ghostTodos = generateTodosFromRRule(recurringParents, timeZone, {
    dateRangeStart,
    dateRangeEnd,
  });

  // Apply overrides
  const mergedUsingRecurrId = overrideBy(ghostTodos, (inst) => inst.recurId);

  // Find out of range overrides
  const movedTodos = getMovedInstances(mergedUsingRecurrId, recurringParents, {
    dateRangeStart,
    dateRangeEnd,
  });
  const allGhosts = [...mergedUsingRecurrId, ...movedTodos].filter((todo) => {
    return todo.due >= dateRangeStart && todo.completed === false;
  });
  // Normalize one-off todos to match TodoItemType (add instanceDate: null)
  const normalizedOneOffTodos: TodoItemType[] = oneOffTodos.map((todo) => ({
    ...todo,
    instanceDate: null,
    instances: null,
  }));

  const allTodos = [...normalizedOneOffTodos, ...allGhosts].sort(
    (a, b) => a.order - b.order,
  );
  const overdueTodos = allTodos.filter((todo) => {
    return todo.due.getTime() <= dateRangeEnd.getTime();
  });
  const todoWithFormattedDates = overdueTodos.map((todo) => {
    const todoInstanceDate = todo.instanceDate
      ? new Date(todo.instanceDate)
      : null;
    const todoInstanceDateTime = todoInstanceDate?.getTime();
    const todoId = `${todo.id}:${todoInstanceDateTime}`;

    return {
      ...todo,
      id: todoId,
    };
  });
  return todoWithFormattedDates;
}
