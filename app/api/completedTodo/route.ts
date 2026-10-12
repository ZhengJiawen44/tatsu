import { NextResponse } from "next/server";
import { UnauthorizedError, InternalError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    //get completed todos
    const completedTodos = await prisma.completedTodo.findMany({
      where: { userID: user.id },
      orderBy: { dtstart: "desc" },
    });
    if (!completedTodos)
      throw new InternalError(
        "completed todos cannot be retrieved at this time",
      );

    return NextResponse.json(
      { completedTodos },
      {
        status: 200,
      },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
