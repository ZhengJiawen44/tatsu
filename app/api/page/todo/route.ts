import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { auth } from "@/app/auth";
import { resolveTimezone } from "@/lib/resolveTimeZone";
import { errorHandler } from "@/lib/errorHandler";
import { recurringTodoItemType } from "@/types";
import expandAndMergeTodos from "@/lib/RRule/expandAndMergeTodos";
import { addMinutes, endOfDay } from "date-fns";
import { getClosestOccuringInstance } from "@/lib/RRule/getClosestOccuringInstance";
import { mergeWithOverrideInstances } from "@/lib/RRule/mergeWithOverrideInstances";
import { getTodoDurationMinutes } from "@/lib/RRule/getTodoDurationMinutes";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      throw new UnauthorizedError("You must be logged in to do this");
    }
    const timeZone = await resolveTimezone(user, req);

    const start = req.nextUrl.searchParams.get("start");
    const end = req.nextUrl.searchParams.get("end");

    const dateRangeStart = new Date(Number(start));
    const dateRangeEnd = new Date(Number(end));

    const userTodayEnd = fromZonedTime(
      endOfDay(toZonedTime(new Date(), timeZone)),
      timeZone,
    );

    // Fetch One-Off Todos
    const oneOffTodos = await prisma.todo.findMany({
      where: {
        userID: user.id,
        rrule: null,
        completed: false,
        AND: [
          {
            OR: [{ due: null }, { due: { gte: dateRangeStart } }],
          },
          {
            OR: [{ dtstart: null }, { dtstart: { lte: dateRangeEnd } }],
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch all Recurring todos
    const recurringTodos = (await prisma.todo.findMany({
      where: {
        userID: user.id,
        rrule: { not: null },
        dtstart: { not: null, lte: dateRangeEnd },
        completed: false,
      },
      include: { instances: true },
    })) as recurringTodoItemType[];

    const x = recurringTodos.flatMap((todo) => {
      const instances = expandAndMergeTodos(
        [todo],
        timeZone,
        dateRangeStart,
        dateRangeEnd,
      );
      if (instances.length <= 1) return instances;

      const closestOccurenceDate = getClosestOccuringInstance(
        todo,
        todo.instances,
        timeZone,
        userTodayEnd,
        true,
      );

      if (!closestOccurenceDate) return [];
      const instance = {
        ...todo,
        dtstart: closestOccurenceDate,
        due: addMinutes(closestOccurenceDate, getTodoDurationMinutes(todo)),
        instanceDate: closestOccurenceDate,
      };
      const overridenInstance = mergeWithOverrideInstances([instance]);
      return overridenInstance;
    });
    return NextResponse.json(
      {
        todos: [...oneOffTodos, ...x].sort((a, b) => a.order - b.order),
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
