import { auth } from "@/app/auth";
import {
  UnauthorizedError,
  BadRequestError,
  InternalError,
} from "@/lib/customError";
import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("You must be logged in to do this");

    const changeMap: { id: string; order: number }[] = await req.json();
    if (!changeMap) throw new BadRequestError("Invalid request body");

    //run all updates in bulk
    const updatedTodos = await prisma.$executeRaw`
      UPDATE "todos" SET "order" = updates.new_order
      FROM (VALUES ${Prisma.join(
        changeMap.map((t) => Prisma.sql`(${t.id}, ${t.order})`),
      )})
      AS updates(id, new_order)
      WHERE "todos".id = updates.id
    `;
    // Check if all updates were successful
    const allUpdated = updatedTodos === changeMap.length;

    if (!allUpdated) {
      throw new InternalError("Failed to update todo order");
    }

    return NextResponse.json({ message: "Todo updated" }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
