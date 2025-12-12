import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { UnauthorizedError, BadRequestError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    const { id } = await params;
    if (!id)
      throw new BadRequestError("Invalid request, ID is required");

    //mark completed flag in todo record as true
    const updatedTodo = await prisma.todo.update({ where: { id, userID: user.id }, data: { completed: true } });

    //insert a new completed todo record
    const currentTime = new Date();
    const completedOnTime = updatedTodo.expiresAt > currentTime;
    const daysToComplete = (Number(currentTime) - Number(updatedTodo.startedAt)) / (1000 * 60 * 60 * 24);
    await prisma.completedTodo.create({
      data: {
        originalTodoID: updatedTodo.id,
        title: updatedTodo.title,
        description: updatedTodo.description,
        priority: updatedTodo.priority,
        createdAt: updatedTodo.createdAt,
        startedAt: updatedTodo.startedAt,
        expiresAt: updatedTodo.expiresAt,
        completedAt: new Date(),
        completedOnTime,
        daysToComplete: new Prisma.Decimal(daysToComplete),
        wasRepeating: updatedTodo.repeatInterval && updatedTodo.nextRepeatDate ? true : false,
        userID: updatedTodo.userID
      }
    })
    return NextResponse.json({ message: "todo completed successfully!" }, { status: 200 })

  }
  catch (error) {
    console.error(error);
    if (error instanceof Error) {
      const status = 'status' in error && typeof error.status == 'number'
        ? error.status
        : 500;
      return NextResponse.json({ message: error.message }, { status });
    }
    return NextResponse.json({ message: "a server error occured, more information can be found in the server logs" }, { status: 500 });
  }
}
