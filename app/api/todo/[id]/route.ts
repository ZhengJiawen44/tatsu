import { NextRequest, NextResponse } from "next/server";
import {
  BaseServerError,
  UnauthorizedError,
  BadRequestError,
  InternalError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { auth } from "@/app/auth";
import { todoSchema } from "@/schema";
import { errorHandler } from "@/lib/errorHandler";
import { z } from "zod";
import createCaldavClientFromDB from "@/lib/sync/createCaldavClientFromDB";
import { parseIcsToVeventComponent } from "@/lib/sync/parseIcsToComponent";
import ICAL from "ical.js";
import { updateIcs } from "@/lib/sync/updateIcs";

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
    if (!id) throw new BadRequestError("Invalid request, ID is required");

    const todo = await prisma.todo.findUnique({
      where: {
        id,
        userID: user.id,
      },
      select: {
        syncMetaData: {
          select: {
            remoteUrl: true,
            etag: true,
          },
        },
      },
    });
    if (!todo) throw new InternalError("cannot find the todo to delete");
    //if todo is a remote data then delete todo from remote
    if (todo.syncMetaData) {
      try {
        const { calDavClient } = await createCaldavClientFromDB(user.id);
        await calDavClient.deleteCalendarObject({
          calendarObject: {
            url: todo.syncMetaData.remoteUrl,
            etag: todo.syncMetaData.etag,
          },
        });
      } catch {
        throw new InternalError("could not delete object from remote server");
      }
    }

    // Find and delete the todo item
    await prisma.todo.delete({
      where: {
        id,
        userID: user.id,
      },
    });

    return NextResponse.json({ message: "todo deleted" }, { status: 200 });
  } catch (error) {
    // Handle custom error
    if (error instanceof BaseServerError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    // Handle generic error
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message.slice(0, 50)
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new UnauthorizedError("You must be logged in to do this");
    }

    const { id } = await params;
    if (!id) {
      throw new BadRequestError("Todo ID is required");
    }

    const rawBody = await req.json();

    const parsed = todoSchema
      .partial()
      .extend({
        dtstart: z.date().optional().nullable(),
        due: z.date().optional().nullable(),
        dateChanged: z.boolean().optional(),
        rruleChanged: z.boolean().optional(),
        pinned: z.boolean().optional(),
        completed: z.boolean().optional(),
        instanceDate: z.date().optional(),
      })
      .safeParse({
        ...rawBody,
        dtstart: rawBody.dtstart
          ? new Date(rawBody.dtstart)
          : rawBody.dateChanged
            ? null
            : undefined,
        due: rawBody.due
          ? new Date(rawBody.due)
          : rawBody.dateChanged
            ? null
            : undefined,
        instanceDate: rawBody.instanceDate
          ? new Date(rawBody.instanceDate)
          : undefined,
      });

    if (!parsed.success) {
      throw new BadRequestError("Invalid request body");
    }
    const {
      title,
      description,
      priority,
      pinned,
      completed,
      dtstart,
      due,
      instanceDate,
      rrule,
      dateChanged,
      rruleChanged,
      projectID,
    } = parsed.data;

    const todoToUpdate = await prisma.todo.findUnique({
      where: {
        id,
        userID: userId,
      },
      include: {
        syncMetaData: true,
      },
    });
    if (!todoToUpdate) throw new InternalError("todo not found");
    const syncMetaData = todoToUpdate.syncMetaData;
    //guard against changes that might break events on the remote caldav server
    if (dateChanged && syncMetaData && (dtstart == null || due == null))
      throw new BadRequestError(
        "cannot change date time to null for remote todos",
      );

    await prisma.todo.update({
      where: {
        id,
        userID: userId,
      },
      data: {
        title,
        description,
        priority,
        pinned,
        completed,
        dtstart: dateChanged || rruleChanged ? dtstart : undefined,
        due: dateChanged || rruleChanged ? due : undefined,
        durationMinutes:
          dateChanged && dtstart && due
            ? (due?.getTime() - dtstart?.getTime()) / (1000 * 60)
            : undefined,
        rrule,
        projectID,
      },
    });
    //if todo exists on the remote calDav, sync the changes
    if (syncMetaData && syncMetaData.icsData) {
      const comp = parseIcsToVeventComponent(syncMetaData.icsData);
      const vevent = comp.getFirstSubcomponent("vevent");
      if (!vevent)
        throw new Error(
          "could not find vevent subcomponent in parsed ICS data",
        );
      if (title !== undefined) vevent.updatePropertyWithValue("summary", title);
      if (description !== undefined)
        vevent.updatePropertyWithValue("description", description);
      if (dtstart != undefined)
        vevent.updatePropertyWithValue(
          "dtstart",
          ICAL.Time.fromJSDate(dtstart),
        );
      if (due != undefined)
        vevent.updatePropertyWithValue("dtend", ICAL.Time.fromJSDate(due));
      if (rrule !== undefined) {
        if (rrule === null) {
          vevent.removeProperty("rrule");
          vevent.removeAllProperties("exdate");
        } else {
          vevent.updatePropertyWithValue("rrule", ICAL.Recur.fromString(rrule));
        }
      }

      const updatedIcsComp = ICAL.stringify(comp.toJSON());
      const { calDavClient } = await createCaldavClientFromDB(userId);
      const res = await calDavClient.updateCalendarObject({
        calendarObject: {
          url: syncMetaData.remoteUrl,
          etag: syncMetaData.etag,
          data: updatedIcsComp,
        },
      });

      const etag = res.headers.get("etag") ?? "";
      if (!etag)
        throw new InternalError("error updating remote calendar Objects");
      //sync local sync data
      const icsUpdates = [];
      if (title !== undefined)
        icsUpdates.push({ name: "summary", value: title });
      if (description !== undefined)
        icsUpdates.push({ name: "description", value: description });
      if (dtstart !== undefined)
        icsUpdates.push({
          name: "dtstart",
          value: ICAL.Time.fromJSDate(dtstart),
        });
      if (due !== undefined)
        icsUpdates.push({ name: "due", value: ICAL.Time.fromJSDate(due) });
      if (rrule !== undefined) {
        icsUpdates.push({
          name: "rrule",
          value: rrule ? ICAL.Recur.fromString(rrule) : null,
        });
      }
      if (rrule === null) {
        icsUpdates.push({
          name: "exdate",
          value: null,
        });
      }
      const updatedLocalIcs = updateIcs(syncMetaData.icsData, icsUpdates);
      await prisma.syncMetaData.update({
        where: { todoId: todoToUpdate.id },
        data: { etag, icsData: updatedLocalIcs },
      });
    }

    /**
     * if todo is a repeating todo and its dates or rrules were changed, remove all overriding instance,
     * this is to avoid drifting todo instance problem.
     */
    if (instanceDate && (dateChanged || rruleChanged)) {
      await prisma.todo.update({
        where: { id, userID: userId },
        data: {
          instances: { deleteMany: {} },
          exdates: [],
        },
      });
    }
    //otherwise just make all instances up to date with master
    else if (rrule && instanceDate) {
      await prisma.todoInstance.updateMany({
        where: { todoId: id },
        data: {
          overriddenTitle: title,
          overriddenDescription: description,
          overriddenPriority: priority,
        },
      });
    }

    return NextResponse.json({ message: "Todo updated" }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
