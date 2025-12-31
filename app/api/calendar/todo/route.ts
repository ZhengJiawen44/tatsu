import { auth } from "@/app/auth";
import { UnauthorizedError } from "@/lib/customError";
import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      throw new UnauthorizedError("You must be logged in to do this");
    }

    // Fetch todos for all time
    const todos = await prisma.todo.findMany({
      where: { completed: false },
      include: { instances: true },
    });

    return NextResponse.json({ todos }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
