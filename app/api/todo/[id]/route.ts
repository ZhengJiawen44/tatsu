import { NextRequest, NextResponse } from "next/server";
import {
  BaseServerError,
  UnauthorizedError,
  InternalError,
  BadRequestError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { auth } from "@/app/auth";
import { todoSchema } from "@/schema";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");
    const a = await params;
    console.log(a);

    const { id } = await params;
    if (!id) throw new BadRequestError("Invalid request, ID is required");

    // Find and delete the todo item
    const deletedTodo = await prisma.todo.deleteMany({
      where: {
        id,
        userID: user.id,
      },
    });

    if (deletedTodo.count === 0)
      throw new InternalError("Todo not found or not authorized to delete");

    return NextResponse.json({ message: "todo deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);

    // Handle custom error
    if (error instanceof BaseServerError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
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
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("You must be logged in to do this");

    const id = (await params).id;
    if (!id) throw new BadRequestError("Invalid request, ID is required");

    //for pinning todos
    const isPin = req.nextUrl.searchParams.get("pin");
    if (isPin != undefined || null) {
      if (isPin === "true") {
        //pin todo
        await prisma.todo.updateMany({
          where: { id, userID: user.id },
          data: { pinned: true },
        });
      } else {
        await prisma.todo.updateMany({
          where: { id, userID: user.id },
          data: { pinned: false },
        });
      }

      return NextResponse.json({ message: "pin updated" }, { status: 200 });
    }

    //for completing todos
    const isComplete = req.nextUrl.searchParams.get("completed");
    if (isComplete != undefined || null) {
      if (isComplete === "true") {
        //complete todo
        await prisma.todo.updateMany({
          where: { id, userID: user.id },
          data: { completed: true },
        });
      } else {
        await prisma.todo.updateMany({
          where: { id, userID: user.id },
          data: { completed: false },
        });
      }

      return NextResponse.json({ message: "pin updated" }, { status: 200 });
    }

    const body = await req.json();
    const parsedObj = todoSchema.partial().safeParse(body);
    if (!parsedObj.success) throw new BadRequestError("Invalid request body");

    // Update todo
    const updatedTodo = await prisma.todo.updateMany({
      where: { id, userID: user.id },
      data: parsedObj.data,
    });

    if (updatedTodo.count === 0)
      throw new InternalError("Todo not found or not authorized to update");

    return NextResponse.json({ message: "Todo updated" }, { status: 200 });
  } catch (error) {
    console.log(error);

    if (error instanceof BaseServerError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message.slice(0, 50)
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
