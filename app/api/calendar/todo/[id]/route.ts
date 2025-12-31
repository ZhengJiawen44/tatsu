import { auth } from "@/app/auth";
import { UnauthorizedError, BadRequestError } from "@/lib/customError";
import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
import { todoSchema } from "@/schema";
import { Priority } from "@prisma/client";
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

    //for pinning todos
    const isPin = req.nextUrl.searchParams.get("pin");
    if (isPin != undefined || null) {
      if (isPin === "true") {
        //pin todo
        await prisma.todo.update({
          where: { id, userID: user.id },
          data: { pinned: true },
        });
      } else {
        await prisma.todo.update({
          where: { id, userID: user.id },
          data: { pinned: false },
        });
      }

      return NextResponse.json({ message: "pin updated" }, { status: 200 });
    }

    //for updating todos priority
    const priority = req.nextUrl.searchParams.get("priority");

    if (priority && ["Low", "Medium", "High"].includes(priority)) {
      //patch todo priority
      await prisma.todo.updateMany({
        where: { id, userID: user.id },
        data: { priority: priority as Priority },
      });

      return NextResponse.json(
        { message: "priority updated" },
        { status: 200 },
      );
    }

    //update todo
    let body = await req.json();
    body = {
      ...body,
      dtstart: new Date(body.dtstart),
      due: new Date(body.due),
    };
    const parsedObj = todoSchema.partial().safeParse(body);
    if (!parsedObj.success) throw new BadRequestError("Invalid request body");

    const {
      title,
      description,
      priority: newPriority,
      dtstart,
      due,
      rrule,
    } = parsedObj.data;

    if (!dtstart) throw new BadRequestError("empty dtstart");

    // Update todo

    await prisma.todo.update({
      where: { id, userID: user.id },
      data: {
        title: title,
        description: description,
        priority: newPriority as Priority,
        dtstart,
        due,
        rrule,
      },
    });

    //updating a todo just overwrites the override
    // await prisma.todoInstance.updateMany({
    //   where: {
    //     todoId: id,
    //     instanceDate: dtstart,
    //   },
    //   data: {
    //     overriddenTitle: title,
    //     overriddenDescription: description,
    //     overriddenPriority: newPriority as Priority,
    //     overriddenDtstart: dtstart,
    //     overriddenDue: due,
    //   },
    // });

    return NextResponse.json({ message: "Todo updated" }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
