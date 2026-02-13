import { auth } from "@/app/auth";
import { UnauthorizedError, BadRequestError } from "@/lib/customError";
import { errorHandler } from "@/lib/errorHandler";
import generateTodosFromRRule from "@/lib/generateTodosFromRRule";
import { getMovedInstances } from "@/lib/getMovedInstances";
import { overrideBy } from "@/lib/overrideBy";
import { prisma } from "@/lib/prisma/client";
import { resolveTimezone } from "@/lib/resolveTimeZone";
import { recurringTodoItemType } from "@/types";
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

    // Fetch One-Off Todos scheduled for today
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

    // Fetch all Recurring todos that have already started
    const recurringParents = (await prisma.todo.findMany({
      where: {
        userID: user.id,
        rrule: { not: null },
        dtstart: { lte: dateRangeEnd },
        completed: false,
      },
      include: { instances: true },
    })) as recurringTodoItemType[];

    // Expand RRULEs to generate occurrences happening within date range
    const ghostTodos = generateTodosFromRRule(recurringParents, timeZone, {
      dateRangeStart,
      dateRangeEnd,
    });

    // // Apply overrides
    const mergedUsingRecurrId = overrideBy(ghostTodos, (inst) => inst.recurId);

    //find out of range overrides
    const movedTodos = getMovedInstances(
      mergedUsingRecurrId,
      recurringParents,
      { dateRangeStart, dateRangeEnd },
    );

    const allGhosts = [...mergedUsingRecurrId, ...movedTodos].filter((todo) => {
      return todo.due >= dateRangeStart && todo.completed === false;
    });
    // console.log("one off todos: : ", oneOffTodos);
    // console.log("recurring parents : ", recurringParents);
    // console.log("ghost: ", ghostTodos);
    // console.log("merged with reccur ID: ", mergedUsingRecurrId);
    // console.log("moved todos: ", movedTodos);
    const allTodos = [...oneOffTodos, ...allGhosts].sort(
      (a, b) => a.order - b.order,
    );

    const overdueTodos = allTodos.filter((todo) => {
      return todo.due.getTime() <= dateRangeEnd.getTime();
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
