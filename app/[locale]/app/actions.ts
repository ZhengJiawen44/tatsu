"use server";

import { auth } from "@/app/auth";
import { UnauthorizedError } from "@/lib/customError";
import generateTodosFromRRule from "@/lib/generateTodosFromRRule";
import { getMovedInstances } from "@/lib/getMovedInstances";
import { overrideBy } from "@/lib/overrideBy";
import { prisma } from "@/lib/prisma/client";
import { resolveTimezone } from "@/lib/resolveTimeZone";
import { TodoItemType, recurringTodoItemType } from "@/types";
import { startOfDay, endOfDay } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

export async function getUserPreferences() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const preferences = await prisma.userPreferences.findUnique({
    where: { userID: session.user.id },
  });
  return preferences;
}

export async function getCompletedTodos() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const completedTodos = await prisma.completedTodo.findMany({
    where: { userID: session.user.id },
    orderBy: { dtstart: "desc" },
  });
  const formatted = completedTodos.map((todo) => {
    return { ...todo, daysToComplete: Number(todo.daysToComplete) };
  });
  return formatted;
}

export async function getProjectMetaData() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const projects = await prisma.project.findMany({
    where: { userID: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true, color: true },
  });
  const projectMap = Object.fromEntries(
    projects.map(({ id, ...rest }) => [id, rest]),
  );
  return projectMap;
}

export async function getUserTimezone() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const timezone = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { timeZone: true },
  });
  return timezone;
}

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
  const todoWithFormattedDates = allTodos.map((todo) => {
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
