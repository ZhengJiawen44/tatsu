"use server";
import { auth } from "@/app/auth";
import { UnauthorizedError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { resolveTimezone } from "@/lib/resolveTimeZone";
import { TodoItemType, recurringTodoItemType } from "@/types";
import { endOfDay, startOfDay, sub } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import expandAndMergeTodos from "@/lib/RRule/expandAndMergeTodos";

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

  const ghostTodos = expandAndMergeTodos(
    recurringParents,
    timeZone,
    dateRangeStart,
    dateRangeEnd,
  );

  // Normalize one-off todos to match TodoItemType (add instanceDate: null)
  const normalizedOneOffTodos: TodoItemType[] = oneOffTodos.map((todo) => ({
    ...todo,
    instanceDate: null,
    instances: null,
  }));
  const allTodos = [...normalizedOneOffTodos, ...ghostTodos].sort(
    (a, b) => a.order - b.order,
  );
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
