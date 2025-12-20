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
import { applyOverridesToGhosts } from "@/lib/applyOverridesToGhosts";

export async function POST(req: NextRequest) {
  try {
    // throw new Error("expected error happened");
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    //validate req body
    let body = await req.json();

    body = {
      ...body,
      dtstart: new Date(body.dtstart),
      expiresAt: new Date(body.expiresAt),
    };

    const parsedObj = todoSchema.safeParse(body);
    if (!parsedObj.success) throw new BadRequestError();

    const { title, description, priority, dtstart } = parsedObj.data;
    //create todo
    const todo = await prisma.todo.create({
      data: {
        userID: user.id,
        title,
        description,
        priority: priority as Priority,
        dtstart,
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

    // Fetch One-Off Todos scheduled for today
    const oneOffTodos = await prisma.todo.findMany({
      where: {
        userID: user.id,
        rrule: null,
        dtstart: {
          gte: bounds.todayStartUTC,
          lte: bounds.todayEndUTC,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch all Recurring todos that have already started
    const recurringParents = await prisma.todo.findMany({
      where: {
        userID: user.id,
        rrule: { not: null },
        dtstart: { lte: bounds.todayEndUTC },
        completed: false,
      },
      include: { instances: true },
    });

    // Expand RRULEs to generate occurrences happening "Today" ]
    const ghostTodos = generateTodosFromRRule(
      recurringParents,
      timeZone,
      bounds,
    );

    // Apply overrides
    const mergedRecurringTodos = applyOverridesToGhosts(
      ghostTodos,
      recurringParents,
    );

    const allTodos = [...oneOffTodos, ...mergedRecurringTodos].sort(
      (a, b) => new Date(a.dtstart).getTime() - new Date(b.dtstart).getTime(),
    );

    return NextResponse.json({ todos: allTodos }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
