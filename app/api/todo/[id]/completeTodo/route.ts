import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { UnauthorizedError, BadRequestError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { errorHandler } from "@/lib/errorHandler";

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

    const { todoItem } = await req.json();
    if (!todoItem)
      throw new BadRequestError("Invalid request, body is required");

    const dtstart = new Date(todoItem.dtstart);
    const due = new Date(todoItem.due);
    const createdAt = new Date(todoItem.createdAt);

    let upsertedTodoInstance = null;
    //if this is a one-off todo, mark the todo as complete
    if (!todoItem.rrule) {
      await prisma.todo.update({
        where: { id, userID: user.id },
        data: { completed: true },
      });
    } else {
      //if this was a repeating todo, only create a overriding instance with completedAt
      upsertedTodoInstance = await prisma.todoInstance.upsert({
        where: {
          todoId_instanceDate: {
            todoId: todoItem.id,
            instanceDate: dtstart,
          },
        },
        update: { completedAt: new Date() },
        create: {
          todoId: todoItem.id,
          recurId: dtstart.toISOString(),
          instanceDate: dtstart,
          completedAt: new Date(),
        },
      });
    }

    //insert a new completed todo record
    const currentTime = new Date();
    let completedOnTime = due > currentTime;
    let daysToComplete =
      (Number(currentTime) - Number(dtstart)) / (1000 * 60 * 60 * 24);

    if (upsertedTodoInstance?.overriddenDue)
      completedOnTime = upsertedTodoInstance.overriddenDue > currentTime;
    if (upsertedTodoInstance?.overriddenDtstart)
      daysToComplete =
        (Number(currentTime) - Number(upsertedTodoInstance.overriddenDtstart)) /
        (1000 * 60 * 60 * 24);

    await prisma.completedTodo.create({
      data: {
        originalTodoID: todoItem.id,
        title: upsertedTodoInstance?.overriddenTitle || todoItem.title,
        description:
          upsertedTodoInstance?.overriddenDescription || todoItem.description,
        priority: upsertedTodoInstance?.overriddenPriority || todoItem.priority,
        createdAt,
        dtstart: upsertedTodoInstance?.overriddenDtstart || dtstart,
        due: upsertedTodoInstance?.overriddenDue || due,
        completedAt: new Date(),
        completedOnTime,
        daysToComplete: new Prisma.Decimal(daysToComplete),
        rrule: todoItem.rrule,
        userID: todoItem.userID,
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
