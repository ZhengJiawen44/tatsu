import { NextResponse } from "next/server";
import { InternalError, UnauthorizedError } from "@/lib/customError";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
import { createTodosFromCalendarObjects } from "@/lib/sync/createTodosFromCalendarObjects";
import createCalendarFromRemote from "@/lib/sync/createCalendarFromRemote";
import createCaldavClientFromDB from "@/lib/sync/createCaldavClientFromDB";
export async function POST() {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    const { calDavClient, caldendarCredential } =
      await createCaldavClientFromDB(user.id!);

    //remote to local sync
    const localCalendars = await prisma.caldavCalendar.findMany();
    const { created, updated, deleted } = await calDavClient.syncCalendars({
      oldCalendars: localCalendars.map((localCalendar) => {
        return {
          displayName: localCalendar.name || undefined,
          syncToken: localCalendar.syncToken || undefined,
          ctag: localCalendar.ctag || undefined,
          url: localCalendar.url,
        };
      }),
      detailedResult: true,
    });

    // created calendars
    await Promise.all(
      created.map(async (newCalendar) => {
        //insert remote calendar to db
        const caldavCalendar = await createCalendarFromRemote(
          user.id!,
          caldendarCredential,
          newCalendar,
        );
        //get all remote objects from calendar
        const calendarObjects = await calDavClient.fetchCalendarObjects({
          calendar: newCalendar,
        });
        //insert remote objects to db
        await createTodosFromCalendarObjects(
          calendarObjects,
          caldavCalendar.id,
          user.id!,
        );
      }),
    );

    // deleted calendars
    for (const deletedCalendar of deleted) {
      await prisma.caldavCalendar.delete({
        where: {
          url: deletedCalendar.url,
        },
      });
    }
    // //updated calendars
    for (const updatedCalendar of updated) {
      const localCalendarToBeUpdated = await prisma.caldavCalendar.findUnique({
        where: {
          url: updatedCalendar.url,
        },
      });
      if (!localCalendarToBeUpdated)
        throw new InternalError(
          "could not find local calendar to update while syncing remote to local",
        );
      //get all synced calendar objects
      const calendarObjects = (await prisma.syncMetaData.findMany()).map(
        (syncMetaData) => {
          return {
            etag: syncMetaData.etag,
            id: syncMetaData.todoId,
            data: syncMetaData.icsData,
            url: syncMetaData.remoteUrl,
          };
        },
      );

      //smart collection sync on the calendar objects
      const {
        created: createdObjects,
        updated: updatedObjects,
        deleted: deletedObjects,
      } = (
        await calDavClient.smartCollectionSync({
          collection: {
            url: localCalendarToBeUpdated.url,
            ctag: localCalendarToBeUpdated.ctag || undefined,
            syncToken: localCalendarToBeUpdated.syncToken || undefined,
            objects: calendarObjects,
            objectMultiGet: calDavClient.calendarMultiGet,
          },
          method: "webdav",
          detailedResult: true,
        })
      ).objects;
      createdObjects.filter((co) => co.url.includes(".ics")).map((co) => {});
    }

    return NextResponse.json(
      { calendars: "remoteCalendarMetaData", message: "synced events" },
      { status: 200 },
    );

    throw new InternalError("specified service is unsupported");
  } catch (error) {
    return errorHandler(error);
  }
}
