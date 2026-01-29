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

    const referenceDateString = req.nextUrl.searchParams.get(
      "referenceDateString",
    );
    const cursor = req.nextUrl.searchParams.get("cursor");
    const count = req.nextUrl.searchParams.get("count");

    if (!referenceDateString || !count) {
      throw new BadRequestError("referenceDateString or count not specified");
    }

    const referenceDate = new Date(Number(referenceDateString));
    const take = Number(count);

    const overDueTodos = await prisma.todo.findMany({
      where: {
        userID: user.id,
        completed: false,
        due: { lt: referenceDate },
      },
      orderBy: { order: "desc" },
      take,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
    });

    const nextCursor =
      overDueTodos.length === take
        ? overDueTodos[overDueTodos.length - 1].id
        : null;

    return NextResponse.json(
      { todos: overDueTodos, nextCursor },
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
