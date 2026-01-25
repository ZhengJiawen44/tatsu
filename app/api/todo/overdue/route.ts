import { auth } from "@/app/auth";
import { BadRequestError, UnauthorizedError } from "@/lib/customError";
import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      throw new UnauthorizedError("You must be logged in to do this");
    }

    //need a reference date to find overdue todos
    const referenceDateString = req.nextUrl.searchParams.get(
      "referenceDateString",
    );

    if (!referenceDateString)
      throw new BadRequestError("referenceDateString not specified");

    const referenceDate = new Date(Number(referenceDateString));
    const overDueTodos = await prisma.todo.findMany({
      where: { completed: false, due: { lt: referenceDate } },
    });
    return NextResponse.json({ todos: overDueTodos }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
