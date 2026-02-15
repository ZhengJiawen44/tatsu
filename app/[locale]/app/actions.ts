"use server";
import { auth } from "@/app/auth";
import { UnauthorizedError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { resolveTimezone } from "@/lib/resolveTimeZone";
import { TodoItemType, recurringTodoItemType } from "@/types";
import { startOfDay, endOfDay } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import expandAndMergeTodos from "@/lib/RRule/expandAndMergeTodos";

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

  // Fetch all Recurring todos
  const recurringTodos = (await prisma.todo.findMany({
    where: {
      userID: user.id,
      rrule: { not: null },
      dtstart: { not: null, lte: dateRangeEnd },
      completed: false,
    },
    include: { instances: true },
  })) as recurringTodoItemType[];

  const ghostTodos = expandAndMergeTodos(
    recurringTodos,
    timeZone,
    dateRangeStart,
    dateRangeEnd,
  );

  //remove ghosts that are either overdue or completed
  const filteredGhosts = ghostTodos.filter((todo) => {
    return (
      (!todo.due || todo.due >= dateRangeStart) && todo.completed === false
    );
  });

  // Normalize one-off todos to match TodoItemType (add instanceDate: null)
  const normalizedOneOffTodos: TodoItemType[] = oneOffTodos.map((todo) => ({
    ...todo,
    instanceDate: null,
    instances: null,
  }));

  const allTodos = [...normalizedOneOffTodos, ...filteredGhosts].sort(
    (a, b) => a.order - b.order,
  );

  const todoWithFormattedID = allTodos.map((todo) => {
    const todoId = `${todo.id}:${todo.instanceDate?.getTime() || null}`;
    return {
      ...todo,
      id: todoId,
    };
  });
  return todoWithFormattedID;
}
