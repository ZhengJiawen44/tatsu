import { NextRequest, NextResponse } from "next/server";
import { Priority } from "@prisma/client";
import {
  UnauthorizedError,
  BadRequestError,
  InternalError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { todoSchema } from "@/schema";
import { auth } from "@/app/auth";
import { resolveTimezone } from "@/lib/resolveTimeZone";
import { errorHandler } from "@/lib/errorHandler";
import { recurringTodoItemType } from "@/types";
import expandAndMergeTodos from "@/lib/RRule/expandAndMergeTodos";
import { genICSData } from "@/lib/sync/genIcsDataFromLocal";
import createCaldavClientFromDB from "@/lib/sync/createCaldavClientFromDB";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { endOfDay, startOfDay } from "date-fns";
import { getClosestOccuringInstance } from "@/lib/RRule/getClosestOccuringInstance";
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    //validate req body
    let body = await req.json();

    body = {
      ...body,
      dtstart: body.dtstart ? new Date(body.dtstart) : body.dtstart,
      due: body.due ? new Date(body.due) : body.due,
    };

    const parsedObj = todoSchema.safeParse(body);
    if (!parsedObj.success) throw new BadRequestError();

    const { title, description, priority, dtstart, due, rrule, projectID } =
      parsedObj.data;

    //create todo locally
    const todo = await prisma.todo.create({
      data: {
        userID: user.id,
        title,
        description,
        priority: priority as Priority,
        dtstart,
        due,
        rrule,
        projectID,
        durationMinutes:
          dtstart && due
            ? (due?.getTime() - dtstart?.getTime()) / (1000 * 60)
            : undefined,
      },
    });

    // create todo remotely
    const eventCalendar = await prisma.caldavCalendar.findFirst({
      where: {
        userId: user.id,
        selected: true,
        components: {
          has: "VEVENT",
        },
      },
    });
    if (eventCalendar && todo.dtstart && todo.due) {
      const { calDavClient } = await createCaldavClientFromDB(user.id);
      const uid = crypto.randomUUID();
      const filename = `${uid}.ics`;
      const iCalString = genICSData({
        summary: title,
        description,
        start: todo.dtstart,
        end: todo.due,
        rrule,
        uid,
      });
      const res = await calDavClient.createCalendarObject({
        calendar: {
          ...eventCalendar,
          timezone: eventCalendar.timezone ?? undefined,
          ctag: eventCalendar.ctag ?? undefined,
          syncToken: eventCalendar.syncToken ?? undefined,
          components: eventCalendar.components as string[],
        },
        iCalString,
        filename,
      });

      if (!res.ok) {
        throw new Error(
          `todo created but not synced; CalDAV server rejected the request: ${res.status} ${res.statusText}`,
        );
      }

      const location = res.headers.get("location");
      const remoteUrl = location
        ? new URL(location, eventCalendar.url).href
        : new URL(filename, eventCalendar.url).href;

      let etag = null;
      if (!res.headers.get("etag")) {
        const [object] = await calDavClient.fetchCalendarObjects({
          calendar: { url: eventCalendar.url },
          objectUrls: [remoteUrl],
        });
        etag = object?.etag;
      } else {
        etag = res.headers.get("etag");
      }
      if (!etag)
        throw new InternalError(
          "error creating remote calendar object: no etag",
        );

      await prisma.syncMetaData.create({
        data: {
          uid,
          todoId: todo.id,
          caldavCalendarId: eventCalendar.id,
          remoteUrl,
          etag,
          lastSyncedAt: new Date(),
          icsData: iCalString,
        },
      });
    }

    if (!todo) throw new InternalError("todo cannot be created at this time");

    return NextResponse.json(
      { message: "todo created", todo },
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}

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
    const hasDateRange = start && end;

    let dateRangeStart = new Date(Number(start));
    let dateRangeEnd = new Date(Number(end));
    //start of user's day in their time, represented in utc

    // if no start and end is supplied, it means we want all the todos for this user
    // we still want to have a start and end range tho, since we do not want to return recurring todos that recur infinitely,
    // so we will only expand reccuring todos and pick the instances closest to user's today
    if (!start && !end) {
      dateRangeStart = fromZonedTime(
        startOfDay(toZonedTime(new Date(), timeZone)),
        timeZone,
      );
      dateRangeEnd = fromZonedTime(
        endOfDay(toZonedTime(new Date(), timeZone)),
        timeZone,
      );
    }

    // Fetch One-Off Todos
    const oneOffTodos = await prisma.todo.findMany({
      where: {
        userID: user.id,
        rrule: null,
        completed: false,
        ...(hasDateRange
          ? {
              AND: [
                {
                  OR: [{ due: null }, { due: { gte: dateRangeStart } }],
                },
                {
                  OR: [{ dtstart: null }, { dtstart: { lte: dateRangeEnd } }],
                },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch all Recurring todos
    const recurringTodos = (await prisma.todo.findMany({
      where: {
        userID: user.id,
        rrule: { not: null },
        ...(hasDateRange ? { dtstart: { not: null, lte: dateRangeEnd } } : {}),
        completed: false,
      },
      include: { instances: true },
    })) as recurringTodoItemType[];

    const ghostTodos = expandAndMergeTodos(
      recurringTodos,
      timeZone,
      dateRangeStart,
      dateRangeEnd,
    );

    if (hasDateRange) {
      //remove ghosts that are either overdue or completed
      const filteredGhosts = ghostTodos.filter((todo) => {
        return (
          (!todo.due || todo.due >= dateRangeStart) && todo.completed === false
        );
      });
      return NextResponse.json(
        {
          todos: [...oneOffTodos, ...filteredGhosts].sort(
            (a, b) => a.order - b.order,
          ),
        },
        {
          status: 200,
        },
      );
    } else {
      // get the instances that due after or equal the date range start, or the nearest one to the left of the date range start
      // this is so pinned recurring todos always shows in the pinned todo response, even if their occurence doesnt precisely fall in
      // the date range
      const closestOccuringTodos = getClosestOccuringInstance(
        ghostTodos,
        dateRangeStart,
      );
      return NextResponse.json(
        {
          todos: [...oneOffTodos, ...closestOccuringTodos].sort(
            (a, b) => a.order - b.order,
          ),
        },
        {
          status: 200,
        },
      );
    }
  } catch (error) {
    return errorHandler(error);
  }
}
