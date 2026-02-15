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
import { resolveTimezone } from "@/lib/resolveTimeZone";
import { errorHandler } from "@/lib/errorHandler";
import { recurringTodoItemType } from "@/types";
import expandAndMergeTodos from "@/lib/RRule/expandAndMergeTodos";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    //validate req body
    let body = await req.json();

    body = {
      ...body,
      dtstart: body.dtstart ? new Date(body.dtstart) : body.dtstart,
      due: body.due ? new Date(body.due) : body.due,
    };

    const parsedObj = todoSchema.safeParse(body);
    console.log(parsedObj.error);
    if (!parsedObj.success) throw new BadRequestError();

    const { title, description, priority, dtstart, due, rrule, projectID } =
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
        projectID,
        durationMinutes:
          dtstart && due
            ? (due?.getTime() - dtstart?.getTime()) / (1000 * 60)
            : undefined,
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

    const timeZone = await resolveTimezone(user, req);
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
    const allTodos = [...oneOffTodos, ...filteredGhosts].sort(
      (a, b) => a.order - b.order,
    );

    return NextResponse.json(
      { todos: allTodos },
      {
        status: 200,
      },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
