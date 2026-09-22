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

    // for each recurring todo, get the closest instance occurence to query date range
    //remove ghosts that are either overdue or completed
    const recGroup = Object.groupBy(ghostTodos, (item)=>item.id)
    const filteredGhosts = Object.entries(recGroup).flatMap((recurrenceGroup)=>{
        if(!recurrenceGroup[1])return []
        const withinRange =  recurrenceGroup[1].filter((todo) => 
            (!todo.due || todo.due >= dateRangeStart) && todo.completed === false
        );
        if(withinRange.length !==0 ) return withinRange;

        return  recurrenceGroup[1].filter((todo) => 
            (!todo.due || todo.due <= dateRangeStart) && todo.completed === false
        ).at(-1);
    })


    const allTodos = [...oneOffTodos, ...filteredGhosts].sort(
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