import { prisma } from "@/lib/prisma/client";
import { differenceInDays, addDays } from "date-fns";
import { BaseServerError, InternalError } from "@/lib/customError";
import { NextResponse } from "next/server";
import { getNextRepeatDate } from "@/features/todos/lib/getNextRepeatDate";
import { endOfDay } from "date-fns";
export async function GET() {

  try {
    // 1. find todo that has nextRepeatDate > date now
    // 2. edit started at to nextRepeatDate and expires at to old startedAt - old expiresAt
    // 3. edit nextRepeatDate to new nextRepeatDate
    // 4. batch update

    const dateNow = new Date();
    let log = "";

    //get todos with pending nextRepeatDates
    const todos = await prisma.todo.findMany({
      where: {
        nextRepeatDate: {
          lt: dateNow
        }
      }
    });

    if (!todos) throw new InternalError("todos cannot be retrieved at this time");

    log += `These todos are selected for rescheduling:\n${JSON.stringify(
      todos.map(todo => ({
        id: todo.id,
        title: todo.title,
        startedAt: todo.startedAt.toLocaleString("zh-CN"), // <- local time
        expiresAt: todo.expiresAt.toLocaleString("zh-CN"),
        nextRepeatDate: todo.nextRepeatDate!.toLocaleString("zh-CN"),
        RepeatInterval: todo.repeatInterval
      })),
      null,
      2
    )}\n`;

    //reschedule the selected todos 
    const updateOperations = todos.map((todo) => {
      const duration = differenceInDays(todo.expiresAt, todo.startedAt);
      const nextRepeatDate = getNextRepeatDate(todo.startedAt, todo.repeatInterval);

      const newStartedAt = nextRepeatDate!;
      const newExpiresAt = endOfDay(addDays(newStartedAt, duration));
      const newNextRepeatDate = getNextRepeatDate(newStartedAt, todo.repeatInterval);

      log += `scheduled: \n id: ${todo.id}\n title: ${todo.title}\n startedtAt: ${newStartedAt}\n expiresAt: ${newExpiresAt}\n nextRepeatDate: ${newNextRepeatDate} \n`
      log += `duration data: ${duration}\n`

      return prisma.todo.update({
        where: { id: todo.id },
        data: {
          startedAt: newStartedAt,
          expiresAt: newExpiresAt,
          nextRepeatDate: newNextRepeatDate
        }
      })
    });
    await prisma.$transaction(updateOperations);

    //produce a log of the operation
    await prisma.cronLog.create({
      data: {
        runAt: dateNow,
        success: true,
        log
      }
    })

    return NextResponse.json({ message: "todo rescheduled" }, { status: 200 });

  } catch (error) {
    await prisma.cronLog.create({
      data: {
        runAt: new Date(),
        success: false,
        log: String(error).slice(0, 500)
      }
    })

    //handle custom error
    if (error instanceof BaseServerError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    //handle generic error
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message.slice(0, 50)
            : "an unexpected error occured",
      },
      { status: 500 }
    );

  }

}
