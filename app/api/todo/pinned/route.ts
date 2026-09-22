// pinned todos are not bound by time, i.e if i pin a todo a year ago it should still display today.

// however a date range is still needed in the query parameter for the following reason:
// when a repeating todo is pinned, its closest occuring instance to the date range is returned.
// if there was no date range query, all the recurring todo's repeating instances(infinite) would have been returned,

// reminder: a recuring rule with no UNTIL rule specified will repeat forever.

import { auth } from "@/app/auth";
import { BadRequestError, UnauthorizedError } from "@/lib/customError";
import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
import { resolveTimezone } from "@/lib/resolveTimeZone";
import expandAndMergeTodos from "@/lib/RRule/expandAndMergeTodos";
import { getClosestOccuringInstance } from "@/lib/RRule/getClosestOccuringInstance";
import { recurringTodoItemType } from "@/types";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      throw new UnauthorizedError("You must be logged in to do this");
    }
    const start = req.nextUrl.searchParams.get("start");
    const end = req.nextUrl.searchParams.get("end");

    if (!start || !end)
      throw new BadRequestError("date range start or from not specified");
    const dateRangeStart = new Date(Number(start));
    const dateRangeEnd = new Date(Number(end));

    // Fetch pinned Todos
    const oneOffTodos = await prisma.todo.findMany({
      where: {
        rrule: null,
        userID: user.id,
        completed: false,
        pinned: true,
      },
      orderBy: { createdAt: "desc" },
    });


   // Fetch all Recurring todos
    const recurringTodos = (await prisma.todo.findMany({
      where: {
        userID: user.id,
        rrule: { not: null },
        completed: false,
        pinned: true
      },
      include: { instances: true },
    })) as recurringTodoItemType[];

    const timeZone = await resolveTimezone(user, req);
    const ghostTodos = expandAndMergeTodos(
      recurringTodos,
      timeZone,
      dateRangeStart,
      dateRangeEnd,
    );

    // get the instances that due after or equal the date range start, or the nearest one to the left of the date range start
    // this is so pinned recurring todos always shows in the pinned todo response, even if their occurence doesnt precisely fall in 
    // the date range
   const closestOccuringInstances =  getClosestOccuringInstance(ghostTodos, dateRangeStart)

    const allTodos = [...oneOffTodos, ...closestOccuringInstances].sort(
      (a, b) => a.order - b.order,
    );

    return NextResponse.json(
      { todos: allTodos },
      {
        status: 200,
      },
    );
  } catch (error) {
    return errorHandler(error);
  }
}