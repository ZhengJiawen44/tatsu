import { BadRequestError, UnauthorizedError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Priority } from "@prisma/client";
import { todoSchema } from "@/schema";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";
// import { addDays, set } from "date-fns";

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

    // const parentTodo = await prisma.todo.findUnique({
    //   where: { id },
    //   select: {
    //     dtstart: true,
    //     due: true,
    //     exdates: true,
    //   },
    // });

    // if (!parentTodo) {
    //   throw new BadRequestError("Parent todo not found");
    // }
    // const masterDurationMs =
    //   parentTodo.due.getTime() - parentTodo.dtstart.getTime();
    // const originalEnd = new Date(dtstart.getTime() + masterDurationMs);

    // const newExdates: Date[] = [];

    // // start cursor at the overridden end (exact time)
    // let cursor = new Date(due!);

    // while (cursor < originalEnd) {
    //   const exDate = set(cursor, {
    //     hours: dtstart.getHours(),
    //     minutes: dtstart.getMinutes(),
    //     seconds: dtstart.getSeconds(),
    //     milliseconds: dtstart.getMilliseconds(),
    //   });
    //   newExdates.push(exDate);
    //   cursor = addDays(cursor, 1);
    // }

    // if (newExdates.length > 0) {
    //   await prisma.todo.update({
    //     where: { id },
    //     data: {
    //       exdates: {
    //         push: newExdates.filter(
    //           (d) =>
    //             !parentTodo.exdates?.some((e) => e.getTime() === d.getTime()),
    //         ),
    //       },
    //     },
    //   });
    // }

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

    // exdate the dtstart if the dtstart was overriden
    // suppose a daily todo, user move today's occurence to tomorrow, this means:
    // 1. an overriding instance is created that moves today's todo to tomorrow.
    // 2. tomorow's occurence is included in exdate (no natural generation, must rely on instance overrides to generate tomorrow's todos)

    //if dtstart was overriden/changed
    if (instanceDate.toISOString() !== dtstart.toISOString()) {
      await prisma.todo.update({
        where: { id },
        data: { exdates: { push: [instanceDate] } },
      });
    }

    return NextResponse.json({ message: "Todo updated" }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
