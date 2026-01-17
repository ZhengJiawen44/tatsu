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
      instanceDate: body.instanceDate ? new Date(body.instanceDate) : null,
      due: new Date(body.due),
    };
    if (!todo.instanceDate)
      throw new BadRequestError(
        "invalid instance date recieved for this recurring todo",
      );

    if (!todo) throw new BadRequestError("bad request body recieved");

    console.log(id, todo.instanceDate);
    //update the overriding instance with completedAt
    await prisma.todoInstance.update({
      where: {
        todoId_instanceDate: {
          todoId: id,
          instanceDate: todo.instanceDate,
        },
      },
      data: { completedAt: null },
    });

    await prisma.completedTodo.deleteMany({
      where: {
        originalTodoID: id,
        instanceDate: todo.instanceDate,
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
