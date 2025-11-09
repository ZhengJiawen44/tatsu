import { auth } from "@/app/auth";
import {
  UnauthorizedError,
  BadRequestError,
  InternalError,
  BaseServerError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("You must be logged in to do this");

    const { changedTodos }: { changedTodos: { id: string; order: number }[] } =
      await req.json();
    if (!changedTodos) throw new BadRequestError("Invalid request body");

    //run all updates in bulk
    const updatedTodos = await prisma.$executeRaw`
      UPDATE "Todo" SET "order" = updates.new_order
      FROM (VALUES ${Prisma.join(
        changedTodos.map((t) => Prisma.sql`(${t.id}, ${t.order})`)
      )})
      AS updates(id, new_order)
      WHERE "Todo".id = updates.id
    `;
    console.log(updatedTodos);
    // Check if all updates were successful
    const allUpdated = updatedTodos === changedTodos.length;

    if (!allUpdated) {
      throw new InternalError("Failed to update todo order");
    }

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
