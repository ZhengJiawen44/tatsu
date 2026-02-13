import { NextRequest, NextResponse } from "next/server";
import {
  BaseServerError,
  UnauthorizedError,
  BadRequestError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { auth } from "@/app/auth";
import { todoSchema } from "@/schema";
import { errorHandler } from "@/lib/errorHandler";
import { z } from "zod";

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

    // Find and delete the todo item
    await prisma.todo.delete({
      where: {
        id,
        userID: user.id,
      },
    });
    return NextResponse.json({ message: "todo deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);

    // Handle custom error
    if (error instanceof BaseServerError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    // Handle generic error
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message.slice(0, 50)
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new UnauthorizedError("You must be logged in to do this");
    }

    const { id } = await params;
    if (!id) {
      throw new BadRequestError("Todo ID is required");
    }

    const rawBody = await req.json();

    const parsed = todoSchema
      .partial()
      .extend({
        dateChanged: z.boolean().optional(),
        rruleChanged: z.boolean().optional(),
        pinned: z.boolean().optional(),
        completed: z.boolean().optional(),
        instanceDate: z.date().optional(),
      })
      .safeParse({
        ...rawBody,
        dtstart: rawBody.dtstart ? new Date(rawBody.dtstart) : undefined,
        due: rawBody.due ? new Date(rawBody.due) : undefined,
        instanceDate: rawBody.instanceDate
          ? new Date(rawBody.instanceDate)
          : undefined,
      });

    if (!parsed.success) {
      throw new BadRequestError("Invalid request body");
    }
    const {
      title,
      description,
      priority,
      pinned,
      completed,
      dtstart,
      due,
      instanceDate,
      rrule,
      dateChanged,
      rruleChanged,
      projectID,
    } = parsed.data;

    if (dateChanged && !dtstart) {
      throw new BadRequestError("dtstart is required when dateChanged is true");
    }

    await prisma.todo.update({
      where: {
        id,
        userID: userId,
      },
      data: {
        title,
        description,
        priority,
        pinned,
        completed,
        dtstart: dateChanged || rruleChanged ? dtstart : undefined,
        due: dateChanged || rruleChanged ? due : undefined,
        durationMinutes:
          dateChanged && dtstart && due
            ? (due?.getTime() - dtstart?.getTime()) / (1000 * 60)
            : undefined,
        rrule,
        projectID,
      },
    });

    /**
     * if rrule changed and is null then delete all exdates and instances
     */
    if (rruleChanged && rrule == null) {
      await prisma.todo.update({
        where: {
          id,
          userID: userId,
        },
        data: {
          instances: { deleteMany: {} },
          exdates: [],
        },
      });
    }

    /**
     * if todo is a repeating todo and its dates or rrules were changed, remove all overriding instance,
     * this is to avoid drifting todo instance problem.
     *
     * otherwise if its dates were not changed, overwrite the instance so the changes are reflected
     * on the instance too
     */
    if (rrule && instanceDate) {
      // If todo has changed dtstart or rrule, clear overridden instances
      if (dateChanged || rruleChanged) {
        await prisma.todoInstance.deleteMany({
          where: { todoId: id },
        });
      }
      //otherwise overwrite the overriding instance
      else {
        await prisma.todoInstance.updateMany({
          where: {
            todoId: id,
          },
          data: {
            overriddenTitle: title,
            overriddenDescription: description,
            overriddenPriority: priority,
          },
        });
      }
    }

    return NextResponse.json({ message: "Todo updated" }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
