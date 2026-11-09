import { auth } from "@/app/auth";
import { UnauthorizedError, BadRequestError } from "@/lib/customError";
import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
import { resolveTimezone } from "@/lib/resolveTimeZone";
import { getClosestOverdueOccuringInstance } from "@/lib/RRule/getClosestOverdueOccuringInstance";
import { getTodoDurationMinutes } from "@/lib/RRule/getTodoDurationMinutes";
import { mergeWithOverrideInstances } from "@/lib/RRule/mergeWithOverrideInstances";
import { recurringTodoItemType, TodoItemType } from "@/types";
import { addMinutes } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      throw new UnauthorizedError("You must be logged in to do this");
    }
    const timeZone = await resolveTimezone(user, req);
    const start = req.nextUrl.searchParams.get("start");
    const end = req.nextUrl.searchParams.get("end");

    if (!start || !end)
      throw new BadRequestError("date range start or from not specified");
    const dateRangeStart = new Date(Number(start));
    const dateRangeEnd = new Date(Number(end));

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

    return NextResponse.json(
      { todos: overdueTodos },
      {
        status: 200,
      },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
