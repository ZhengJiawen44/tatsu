import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError, BadRequestError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { projectPatchSchema } from "@/schema";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";
import { Prisma } from "@prisma/client";
import { resolveTimezone } from "@/lib/resolveTimeZone";
import { recurringTodoItemType, TodoItemType } from "@/types";
import { mergeWithOverrideInstances } from "@/lib/RRule/mergeWithOverrideInstances";
import expandAndMergeTodos from "@/lib/RRule/expandAndMergeTodos";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");
    const { id } = await params;
    if (!id) throw new BadRequestError("Invalid request, ID is required");

    const body = await req.json();
    const parsedObj = projectPatchSchema.safeParse(body);

    if (!parsedObj.success) throw new BadRequestError();

    const { name, color } = parsedObj.data;

    const data: Prisma.ProjectUpdateInput = {};

    if (name !== undefined) data.name = name;
    if (color !== undefined) data.color = color;

    if (Object.keys(data).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const project = await prisma.project.update({
      where: {
        id,
        userID: user.id,
      },
      data,
    });

    return NextResponse.json(
      { message: "project updated", project },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return errorHandler(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");
    const { id } = await params;
    if (!id) throw new BadRequestError("Invalid request, ID is required");

    await prisma.project.delete({
      where: {
        id,
        userID: user.id,
      },
    });

    return NextResponse.json({ message: "project deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return errorHandler(error);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      throw new UnauthorizedError("You must be logged in to do this");
    }
    const { id } = await params;
    if (!id) throw new BadRequestError("Invalid request, ID is required");

    const timeZone = await resolveTimezone(user, req);
    const start = req.nextUrl.searchParams.get("start");
    const end = req.nextUrl.searchParams.get("end");

    if (!start || !end)
      throw new BadRequestError("date range start or from not specified");
    const dateRangeStart = new Date(Number(start));
    const dateRangeEnd = new Date(Number(end));

    // Fetch all One-Off Todos for project
    const oneOffTodos = await prisma.todo.findMany({
      where: {
        userID: user.id,
        rrule: null,
        completed: false,
        projectID: id,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch all recurring Todos for project
    const recurringParents = (await prisma.todo.findMany({
      where: {
        userID: user.id,
        dtstart: { not: null },
        rrule: { not: null },
        completed: false,
        projectID: id,
      },
      include: { instances: true },
    })) as recurringTodoItemType[];

    //Collect future reccuring todos
    const futureRecurringTodos = recurringParents.filter(({ dtstart }) => {
      return dtstart > dateRangeEnd;
    });
    //generate ghost todos from first instance occurence of future todo
    const ghostFutureTodos = futureRecurringTodos.map((todo) => {
      return { ...todo, instanceDate: todo.dtstart };
    });

    //Apply overrides
    const mergedFutureGhostTodos = mergeWithOverrideInstances(
      ghostFutureTodos,
    ).sort((a, b) => {
      return a.dtstart.getTime() - b.dtstart.getTime();
    });

    //now get recurring todos in date range
    const ghostTodos = expandAndMergeTodos(
      recurringParents,
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

    const allTodos = [
      ...normalizedOneOffTodos,
      ...mergedFutureGhostTodos,
      ...filteredGhosts,
    ].sort((a, b) => a.order - b.order);

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
