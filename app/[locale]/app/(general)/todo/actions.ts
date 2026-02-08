import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma/client";
import { UnauthorizedError } from "@/lib/customError";
import generateTodosFromRRule from "@/lib/generateTodosFromRRule";
import { resolveTimezone } from "@/lib/resolveTimeZone";
import { overrideBy } from "@/lib/overrideBy";
import { recurringTodoItemType, TodoItemType } from "@/types";
import { getMovedInstances } from "@/lib/getMovedInstances";
import { startOfDay, endOfDay } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export async function getTodayTodos(): Promise<TodoItemType[]> {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    throw new UnauthorizedError("You must be logged in to do this");
  }

  const timeZone = await resolveTimezone(user);
  const now = new Date();
  const userNow = toZonedTime(now, timeZone);
  const dateRangeStart = fromZonedTime(startOfDay(userNow), timeZone);
  const dateRangeEnd = fromZonedTime(endOfDay(userNow), timeZone);
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
  console.log(dateRangeStart, dateRangeEnd);

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
  return allTodos;
}
