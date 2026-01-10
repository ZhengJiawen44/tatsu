import { NextRequest, NextResponse } from "next/server";
import { Priority } from "@prisma/client";
import {
  BaseServerError,
  UnauthorizedError,
  BadRequestError,
  InternalError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { todoSchema } from "@/schema";
import { auth } from "@/app/auth";
import getTodayBoundaries from "@/lib/getTodayBoundaries";
import generateTodosFromRRule from "@/lib/generateTodosFromRRule";
import { resolveTimezone } from "@/lib/resolveTimeZone";
import { errorHandler } from "@/lib/errorHandler";
import { overrideBy } from "@/lib/overrideBy";
import { recurringTodoWithInstance } from "@/types";

export async function POST(req: NextRequest) {
  try {
    //throw new Error("expected error happened");
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    //validate req body
    let body = await req.json();

    body = {
      ...body,
      dtstart: new Date(body.dtstart),
      due: new Date(body.due),
    };

    const parsedObj = todoSchema.safeParse(body);
    if (!parsedObj.success) throw new BadRequestError();

    const { title, description, priority, dtstart, due, rrule } =
      parsedObj.data;
    //create todo
    const todo = await prisma.todo.create({
      data: {
        userID: user.id,
        title,
        description,
        priority: priority as Priority,
        dtstart,
        due,
        rrule,
      },
    });
    if (!todo) throw new InternalError("todo cannot be created at this time");
    // console.log(todo);

    return NextResponse.json(
      { message: "todo created", todo },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);

    //handle custom error
    if (error instanceof BaseServerError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    //handle generic error
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message.slice(0, 50)
            : "an unexpected error occured",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      throw new UnauthorizedError("You must be logged in to do this");
    }
    const timeZone = await resolveTimezone(user, req);

    const bounds = getTodayBoundaries(timeZone);
    // bounds.todayEndUTC = new Date("2026-01-13T15:59:59.999Z");
    // bounds.todayStartUTC = new Date("2026-01-12T16:00:00.000Z");

    // Fetch One-Off Todos scheduled for today
    const oneOffTodos = await prisma.todo.findMany({
      where: {
        userID: user.id,
        rrule: null,
        completed: false,
        due: {
          gte: bounds.todayStartUTC,
        },
        dtstart: {
          lte: bounds.todayEndUTC,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch all Recurring todos that have already started
    const recurringParents = (await prisma.todo.findMany({
      where: {
        userID: user.id,
        rrule: { not: null },
        dtstart: { lte: bounds.todayEndUTC },
        completed: false,
      },
      include: { instances: true },
    })) as recurringTodoWithInstance[];

    // Expand RRULEs to generate occurrences happening "Today"
    const ghostTodos = generateTodosFromRRule(recurringParents, timeZone, {
      dateRangeStart: bounds.todayStartUTC,
      dateRangeEnd: bounds.todayEndUTC,
    });

    // // Apply overrides
    const mergedUsingRecurrId = overrideBy(ghostTodos, (inst) => inst.recurId);
    const mergedUsingDtstart = overrideBy(mergedUsingRecurrId, (inst) =>
      inst.overriddenDtstart?.toISOString(),
    );

    const validMerged = mergedUsingDtstart.filter((todo) => {
      return todo.due >= bounds.todayStartUTC;
    });
    console.log("one off todos: : ", oneOffTodos);
    console.log("recurring parents : ", recurringParents);
    console.log("ghost: ", ghostTodos);
    console.log("merged with reccur ID: ", mergedUsingRecurrId);
    console.log("merged with dtstart: ", mergedUsingDtstart);

    const allTodos = [...oneOffTodos, ...validMerged].sort(
      (a, b) => a.order - b.order,
    );

    return NextResponse.json({ todos: allTodos }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
