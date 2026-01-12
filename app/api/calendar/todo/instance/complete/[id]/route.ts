import { auth } from "@/app/auth";
import { UnauthorizedError, BadRequestError } from "@/lib/customError";
import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
import { todoSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";

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
    //validate req body
    let body = await req.json();

    body = {
      ...body,
      dtstart: new Date(body.dtstart),
      due: new Date(body.due),
    };

    const parsedObj = todoSchema.safeParse(body);
    if (!parsedObj.success) throw new BadRequestError();

    const { title, description, priority, dtstart, due, rrule } =
      parsedObj.data;

    const instanceDate = new Date(
      Number(req.nextUrl.searchParams.get("instanceDate")),
    );
    const completedAt = new Date();

    // upsert todo instance with the completedAt field filled
    await prisma.todoInstance.upsert({
      where: {
        todoId_instanceDate: {
          todoId: id,
          instanceDate,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        todoId: id,
        recurId: instanceDate.toISOString(),
        instanceDate,
        completedAt,
      },
    });
    //record the completion in completedTodo table
    await prisma.completedTodo.create({
      data: {
        originalTodoID: id,
        userID: user.id,
        title,
        description,
        priority,
        dtstart,
        due,
        rrule,
        createdAt: new Date(),
        completedAt,
        completedOnTime: completedAt <= due ? true : false,
        daysToComplete:
          (Number(completedAt) - Number(dtstart)) / (1000 * 60 * 60 * 24),
      },
    });

    return NextResponse.json({ message: "Todo updated" }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
