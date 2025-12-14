import { prisma } from "@/lib/prisma/client";
import { differenceInDays, addDays } from "date-fns";
import { BaseServerError, InternalError, UnauthorizedError } from "@/lib/customError";
import { NextRequest, NextResponse } from "next/server";
import { getNextRepeatDate } from "@/features/todos/lib/getNextRepeatDate";
import { endOfDay as endOfDayUTC } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

export async function GET(req: NextRequest) {
  try {
    //validate cron request
    const cronHeader = req.headers.get("x-cronsecret");
    const userAgent = req.headers.get("user-agent");

    const reqDump = `
      START LINE:
      ${req.method} ${req.url}
      HEADERS:
      ${Array.from(req.headers.entries())
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")}
    `;
    if (cronHeader !== process.env.CRONJOB_SECRET) {
      const reason = !cronHeader
        ? "missing cron secret header"
        : "cron secret header does not match";
      throw new UnauthorizedError(`
        user-agent: ${userAgent}
        failed-reason: ${reason}
        request-dump: ${reqDump}
      `);
    }

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
        startedAt: todo.startedAt.toLocaleString("zh-CN"),
        expiresAt: todo.expiresAt.toLocaleString("zh-CN"),
        nextRepeatDate: todo.nextRepeatDate!.toLocaleString("zh-CN"),
        RepeatInterval: todo.repeatInterval
      })),
      null,
      2
    )}\n`;

    //reschedule the selected todos 
    const updateOperations = [];

    for (const todo of todos) {
      const duration = differenceInDays(todo.expiresAt, todo.startedAt);

      const user = await prisma.user.findUnique({
        where: {
          id: todo.userID
        }
      });

      if (!user) continue;

      const newStartedAt = getNextRepeatDate(todo.startedAt, todo.repeatInterval, user.timeZone)!;
      const newExpiresAt = endOfDay(addDays(newStartedAt, duration), user.timeZone);
      const newNextRepeatDate = getNextRepeatDate(newStartedAt, todo.repeatInterval, user.timeZone);

      log += `scheduled: \n id: ${todo.id}\n title: ${todo.title}\n startedtAt: ${newStartedAt}\n expiresAt: ${newExpiresAt}\n nextRepeatDate: ${newNextRepeatDate} \n`;
      log += `duration data: ${duration}\n`;

      updateOperations.push(
        prisma.todo.update({
          where: { id: todo.id },
          data: {
            startedAt: newStartedAt,
            expiresAt: newExpiresAt,
            nextRepeatDate: newNextRepeatDate,
            completed: false
          }
        })
      );
    }
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
//timezone aware end of day
function endOfDay(date: Date, timeZone?: string | null): Date {
  if (!timeZone) {
    return endOfDayUTC(date);
  }
  // Convert to user's timezone
  const dateInUserTZ = toZonedTime(date, timeZone);
  // Get end of day in user's timezone
  const endOfDayInUserTZ = endOfDayUTC(dateInUserTZ);
  // Convert back to UTC 
  return fromZonedTime(endOfDayInUserTZ, timeZone);
}

