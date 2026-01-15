import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError, BadRequestError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";
import { TodoItemType } from "@/types";

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

    //for updating todos priority
    const priority = req.nextUrl.searchParams.get(
      "priority",
    ) as TodoItemType["priority"];
    const instanceDate = new Date(
      Number(req.nextUrl.searchParams.get("instanceDate")),
    );
    if (
      !priority ||
      !["Low", "Medium", "High"].includes(priority) ||
      !instanceDate
    )
      throw new BadRequestError("invalid priority value or instance date");

    //upsert todo instance priority
    await prisma.todoInstance.upsert({
      where: {
        todoId_instanceDate: {
          todoId: id,
          instanceDate: instanceDate,
        },
      },
      update: {
        overriddenPriority: priority,
      },
      create: {
        todoId: id,
        instanceDate,
        recurId: instanceDate.toISOString(),
        overriddenPriority: priority,
      },
    });

    return NextResponse.json({ message: "priority updated" }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
