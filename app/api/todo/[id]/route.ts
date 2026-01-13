import { NextRequest, NextResponse } from "next/server";
import {
  BaseServerError,
  UnauthorizedError,
  BadRequestError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { auth } from "@/app/auth";
import { todoSchema } from "@/schema";
import { Priority } from "@prisma/client";
import { errorHandler } from "@/lib/errorHandler";

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
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("You must be logged in to do this");

    const { id } = await params;
    if (!id) throw new BadRequestError("Invalid request, ID is required");

    //for pinning todos
    const isPin = req.nextUrl.searchParams.get("pin");
    if (isPin != undefined || null) {
      if (isPin === "true") {
        //pin todo
        await prisma.todo.update({
          where: { id, userID: user.id },
          data: { pinned: true },
        });
      } else {
        await prisma.todo.update({
          where: { id, userID: user.id },
          data: { pinned: false },
        });
      }

      return NextResponse.json({ message: "pin updated" }, { status: 200 });
    }

    //for updating todos priority
    const priority = req.nextUrl.searchParams.get("priority");

    if (priority && ["Low", "Medium", "High"].includes(priority)) {
      //patch todo priority
      await prisma.todo.updateMany({
        where: { id, userID: user.id },
        data: { priority: priority as Priority },
      });

      return NextResponse.json(
        { message: "priority updated" },
        { status: 200 },
      );
    }

    //update todo
    let body = await req.json();
    const { dateChanged } = body;
    body = {
      ...body,
      dtstart: new Date(body.dtstart),
      due: new Date(body.due),
    };
    const parsedObj = todoSchema.partial().safeParse(body);
    if (!parsedObj.success) throw new BadRequestError("Invalid request body");

    const {
      title,
      description,
      priority: newPriority,
      dtstart,
      due,
      rrule,
    } = parsedObj.data;

    if (!dtstart) throw new BadRequestError("empty dtstart");
    if (typeof dateChanged == "undefined")
      throw new BadRequestError("empty dateChanged");

    // Update todo
    if (dateChanged) {
      await prisma.todo.update({
        where: { id, userID: user.id },
        data: {
          title: title,
          description: description,
          priority: newPriority as Priority,
          dtstart,
          due,
          rrule,
        },
      });
    } else {
      await prisma.todo.update({
        where: { id, userID: user.id },
        data: {
          title: title,
          description: description,
          priority: newPriority as Priority,
          rrule,
        },
      });
    }

    //updating a todo just overwrites the override, so that overriden todos may also be updated
    await prisma.todoInstance.updateMany({
      where: {
        todoId: id,
        instanceDate: dtstart,
      },
      data: {
        overriddenTitle: title,
        overriddenDescription: description,
        overriddenPriority: newPriority as Priority,
        overriddenDtstart: dtstart,
        overriddenDue: due,
      },
    });

    return NextResponse.json({ message: "Todo updated" }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
