import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { UnauthorizedError, BadRequestError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { errorHandler } from "@/lib/errorHandler";
import { TodoItemType } from "@/types";

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

    const body = (await req.json()) as TodoItemType;

    const todo: TodoItemType = {
      ...body,
      createdAt: new Date(body.createdAt),
      dtstart: new Date(body.dtstart),
      due: new Date(body.due),
    };

    if (!todo) throw new BadRequestError("bad request body recieved");

    await prisma.todo.update({
      where: { id, userID: user.id },
      data: { completed: true },
    });

    //insert a new completed todo record
    const currentTime = new Date();
    const completedOnTime = todo.due > currentTime;
    const daysToComplete =
      (Number(currentTime) - Number(todo.dtstart)) / (1000 * 60 * 60 * 24);

    await prisma.completedTodo.create({
      data: {
        originalTodoID: todo.id,
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        dtstart: todo.dtstart,
        due: todo.due,
        completedAt: new Date(),
        completedOnTime,
        daysToComplete: new Prisma.Decimal(daysToComplete),
        rrule: todo.rrule,
        userID: todo.userID,
      },
    });
    return NextResponse.json(
      { message: "todo completed successfully!" },
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
