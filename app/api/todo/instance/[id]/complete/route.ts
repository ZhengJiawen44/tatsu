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
      instanceDate: body.instanceDate ? new Date(body.instanceDate) : null,
      due: new Date(body.due),
    };
    if (!todo.instanceDate)
      throw new BadRequestError(
        "invalid instance date recieved for this recurring todo",
      );

    if (!todo) throw new BadRequestError("bad request body recieved");

    let upsertedTodoInstance = null;
    //if this is a one-off todo, mark the todo as complete
    if (!todo.rrule) {
      await prisma.todo.update({
        where: { id, userID: user.id },
        data: { completed: true },
      });
    } else {
      //if this was a repeating todo, only create a overriding instance with completedAt
      upsertedTodoInstance = await prisma.todoInstance.upsert({
        where: {
          todoId_instanceDate: {
            todoId: id,
            instanceDate: todo.instanceDate,
          },
        },
        update: { completedAt: new Date() },
        create: {
          todoId: todo.id,
          recurId: todo.instanceDate.toISOString(),
          instanceDate: todo.instanceDate,
          completedAt: new Date(),
        },
      });
    }

    //insert a new completed todo record
    const currentTime = new Date();
    let completedOnTime = todo.due > currentTime;
    let daysToComplete =
      (Number(currentTime) - Number(todo.dtstart)) / (1000 * 60 * 60 * 24);

    if (upsertedTodoInstance?.overriddenDue)
      completedOnTime = upsertedTodoInstance.overriddenDue > currentTime;
    if (upsertedTodoInstance?.overriddenDtstart)
      daysToComplete =
        (Number(currentTime) - Number(upsertedTodoInstance.overriddenDtstart)) /
        (1000 * 60 * 60 * 24);

    await prisma.completedTodo.create({
      data: {
        originalTodoID: todo.id,
        title: upsertedTodoInstance?.overriddenTitle || todo.title,
        description:
          upsertedTodoInstance?.overriddenDescription || todo.description,
        priority: upsertedTodoInstance?.overriddenPriority || todo.priority,
        createdAt: todo.createdAt,
        dtstart: upsertedTodoInstance?.overriddenDtstart || todo.dtstart,
        due: upsertedTodoInstance?.overriddenDue || todo.due,
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
