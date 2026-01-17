import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { UnauthorizedError, BadRequestError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
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
      data: { completed: false },
    });

    //delete the completed todo record
    await prisma.completedTodo.deleteMany({
      where: {
        originalTodoID: id,
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
