import { BadRequestError, UnauthorizedError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Priority } from "@prisma/client";
import { todoSchema } from "@/schema";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";

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

    let body = await req.json();

    if (!body.instanceDate) {
      throw new BadRequestError(
        "instanceDate is required to update a TodoInstance",
      );
    }

    body = {
      ...body,
      dtstart: new Date(body.dtstart),
      due: new Date(body.due),
      instanceDate: new Date(body.instanceDate),
    };
    const parsedObj = todoSchema.partial().safeParse(body);
    if (!parsedObj.success) throw new BadRequestError("Invalid request body");

    const { title, description, priority, dtstart, due } = parsedObj.data;
    const { instanceDate } = body;

    if (!dtstart) {
      throw new BadRequestError("dtstart is required to update a TodoInstance");
    }

    await prisma.todoInstance.upsert({
      where: {
        todoId_instanceDate: {
          todoId: id,
          instanceDate,
        },
      },
      update: {
        overriddenTitle: title,
        overriddenDescription: description,
        overriddenPriority: priority as Priority,
        overriddenDtstart: dtstart,
        overriddenDue: due,
      },
      create: {
        todoId: id,
        recurId: instanceDate.toISOString(),
        instanceDate: instanceDate,
        overriddenTitle: title,
        overriddenDescription: description,
        overriddenPriority: priority,
        overriddenDtstart: dtstart,
        overriddenDue: due,
      },
    });

    return NextResponse.json({ message: "Todo updated" }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    const { id } = await params;
    const instanceDate = new Date(
      Number(req.nextUrl.searchParams.get("instanceDate")),
    );
    if (!id || !instanceDate)
      throw new BadRequestError(
        "Invalid request, ID or instanceDate is required to do instance delete!",
      );

    // Find and exadate the todo instance
    await prisma.todo.update({
      where: { id },
      data: { exdates: { push: [instanceDate] } },
    });

    return NextResponse.json({ message: "todo deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);

    // Handle custom error
    return errorHandler(error);
  }
}
