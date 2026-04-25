import { NextResponse } from "next/server";
import { UnauthorizedError } from "@/lib/customError";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
import createCalendarFromRemote from "@/lib/sync/createCalendarFromRemote";
import createCaldavClientFromDB from "@/lib/sync/createCaldavClientFromDB";
import { upsertTodosFromCalendarObjects } from "@/lib/sync/upsertTodosFromCalendarObjects";
export async function POST() {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user || !user.id)
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
        const serverUrl = new URL(newCalendar.url).origin;
        //insert remote objects to db
        await upsertTodosFromCalendarObjects(
          calendarObjects,
          caldavCalendar.id,
          user.id!,
          serverUrl,
        );
      }),
    );

    // deleted calendars
    await Promise.all(
      deleted.map(async (deletedCalendar) => {
        const calendar = await prisma.caldavCalendar.delete({
          where: {
            url: deletedCalendar.url,
          },
        });
        await prisma.todo.deleteMany({
          where: {
            syncMetaData: {
              caldavCalendarId: calendar.id,
            },
          },
        });
      }),
    );

    //get all the updated local calendars to update
    const localCalendarsToBeUpdated = await prisma.caldavCalendar.findMany({
      where: {
        url: {
          in: updated.map((calendar) => calendar.url),
        },
      },
    });
    //updated calendars
    await Promise.all(
      localCalendarsToBeUpdated.map(async (localCalendar) => {
        const serverUrl = new URL(localCalendar.url).origin;
        const syncMetaData = await prisma.syncMetaData.findMany({
          where: {
            caldavCalendarId: localCalendar.id,
          },
        });

        const localCalendarObjects = syncMetaData.map((syncMetaData) => {
          return {
            url: syncMetaData.remoteUrl,
            etag: syncMetaData.etag,
            data: syncMetaData.icsData,
          };
        });

        const {
          created: createdObjects,
          updated: updatedObjects,
          deleted: deletedObjects,
        } = (
          await calDavClient.smartCollectionSync({
            collection: {
              url: localCalendar.url,
              ctag: localCalendar.ctag || undefined,
              syncToken: localCalendar.syncToken || undefined,
              objects: localCalendarObjects,
              objectMultiGet: calDavClient.calendarMultiGet,
            },
            method: "webdav",
            detailedResult: true,
          })
        ).objects;

        await Promise.all([
          // Handle created objects
          upsertTodosFromCalendarObjects(
            createdObjects,
            localCalendar.id,
            user.id!,
            serverUrl,
          ),

          //Handle deleted objects. deletes todo, cascade deletes its syncMetaData
          prisma.todo.deleteMany({
            where: {
              syncMetaData: {
                caldavCalendarId: localCalendar.id,
                remoteUrl: {
                  in: deletedObjects.map((obj) =>
                    serverUrl && !obj.url.startsWith("http")
                      ? `${serverUrl}${obj.url}`
                      : obj.url,
                  ),
                },
              },
            },
          }),

          //handle updated objects
          upsertTodosFromCalendarObjects(
            updatedObjects,
            localCalendar.id,
            user.id!,
            serverUrl,
          ),

          //update local calendar ctag, syncToken, name, timezone
          prisma.caldavCalendar.update({
            where: {
              id: localCalendar.id,
            },
            data: {
              ctag: updated.find(
                (calendar) => calendar.url === localCalendar.url,
              )?.ctag,
              syncToken: updated.find(
                (calendar) => calendar.url === localCalendar.url,
              )?.syncToken,
              name: updated.find(
                (calendar) => calendar.url == localCalendar.url,
              )?.displayName,
              timezone: updated.find(
                (calendar) => calendar.timezone == localCalendar.timezone,
              )?.timezone,
            },
          }),
        ]);
      }),
    );

    return NextResponse.json(
      { calendars: "remoteCalendarMetaData", message: "synced events" },
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
