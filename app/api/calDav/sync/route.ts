import { NextResponse } from "next/server";
import { InternalError, UnauthorizedError } from "@/lib/customError";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";
import { createCalDAVClient } from "@/lib/sync/createDavClient";
import { prisma } from "@/lib/prisma/client";
import ICAL from "ical.js";
import { Priority } from "@prisma/client";
export async function POST() {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    //create a caldav client
    const caldendarCredential = await prisma.calDavAccount.findUnique({
      where: { userId: user.id },
    });
    if (!caldendarCredential) throw new InternalError("No source to sync to");
    const calDavClient = await createCalDAVClient(
      caldendarCredential.service,
      caldendarCredential.username,
      caldendarCredential.password,
      caldendarCredential.serverUrl,
    );

    //remote to local
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
    for (const newCalendar of created) {
      //create local calendar record
      const caldavCalendar = await prisma.caldavCalendar.create({
        data: {
          userId: user.id,
          credentialId: caldendarCredential.id,
          timezone: newCalendar.timezone,
          name:
            typeof newCalendar.displayName === "string"
              ? newCalendar.displayName
              : undefined,
          source: caldendarCredential.service,
          url: newCalendar.url,
          ctag: newCalendar.ctag,
          syncToken: newCalendar.syncToken,
        },
      });

      //create local todo and sync record
      const calendarObjects = await calDavClient.fetchCalendarObjects({
        calendar: newCalendar,
      });
      await Promise.all(
        calendarObjects.map((co) => {
          const jcalData = ICAL.parse(co.data);
          const comp = new ICAL.Component(jcalData);

          const vevent = comp.getFirstSubcomponent("vevent");
          if (!vevent) return Promise.resolve();

          // --- Core fields ---
          const summary = vevent.getFirstPropertyValue("summary") as
            | string
            | null;
          const description = vevent.getFirstPropertyValue("description") as
            | string
            | null;
          const uid = vevent.getFirstPropertyValue("uid") as string;

          // --- Scheduling fields ---
          const dtstart = vevent.getFirstPropertyValue(
            "dtstart",
          ) as ICAL.Time | null;

          const dtend = vevent.getFirstPropertyValue(
            "dtend",
          ) as ICAL.Time | null;
          const duration = vevent.getFirstPropertyValue(
            "duration",
          ) as ICAL.Duration | null;
          const rrule = vevent.getFirstPropertyValue(
            "rrule",
          ) as ICAL.Recur | null;

          // EXDATE can have multiple values
          const exdateProp = vevent.getAllProperties("exdate");
          const exdates = exdateProp.flatMap((p) =>
            p.getValues().map((v: ICAL.Time) => v.toJSDate()),
          );

          // Derive durationMinutes from either DURATION or DTSTART→DTEND diff
          let durationMinutes = 30;
          if (duration) {
            durationMinutes = duration.toSeconds() / 60;
          } else if (dtstart && dtend) {
            durationMinutes = (dtend.toUnixTime() - dtstart.toUnixTime()) / 60;
          }

          // --- Priority mapping ---
          // VEVENT priority: 1-4 = High, 5 = Medium, 6-9 = Low, 0 = undefined
          const rawPriority = vevent.getFirstPropertyValue("priority") as
            | number
            | null;
          const priority: Priority =
            rawPriority === null || rawPriority === 0
              ? "Low"
              : rawPriority <= 4
                ? "High"
                : rawPriority === 5
                  ? "Medium"
                  : "Low";

          return prisma.todo.create({
            data: {
              userID: user.id!,
              title: summary ?? "Untitled",
              description: description ?? undefined,
              dtstart: dtstart?.toJSDate() ?? undefined,
              due: dtend?.toJSDate() ?? undefined,
              durationMinutes: Math.round(durationMinutes),
              rrule: rrule ? rrule.toString() : undefined,
              exdates: exdates,
              timeZone: dtstart?.zone.tzid ?? "UTC",
              priority,
              syncMetaData: {
                create: {
                  caldavCalendarId: caldavCalendar.id,
                  etag: co.etag ?? "",
                  remoteUrl: co.url,
                  icsData: co.data,
                  uid,
                },
              },
            },
          });
        }),
      );
    }

    // deleted calendars
    for (const deletedCalendar of deleted) {
      await prisma.caldavCalendar.delete({
        where: {
          url: deletedCalendar.url,
        },
      });
    }
    // //updated calendars
    // for (const updatedCalendar of updated) {
    //   const localCalendarToBeUpdated = await prisma.caldavCalendar.findUnique({
    //     where: {
    //       url: updatedCalendar.url,
    //     },
    //   });
    //   if (!localCalendarToBeUpdated)
    //     throw new InternalError(
    //       "could not find local calendar to update while syncing remote to local",
    //     );
    //   //get all synced calendar objects
    //   const calendarObjects = (await prisma.syncMetaData.findMany()).map(
    //     (syncMetaData) => {
    //       return {
    //         etag: syncMetaData.etag,
    //         id: syncMetaData.todoId,
    //         data: syncMetaData.icsData,
    //         url: syncMetaData.remoteUrl,
    //       };
    //     },
    //   );

    //   //smart collection sync on the calendar objects
    //   const {
    //     created: createdObjects,
    //     updated: updatedObjects,
    //     deleted: deletedObjects,
    //   } = (
    //     await calDavClient.smartCollectionSync({
    //       collection: {
    //         url: localCalendarToBeUpdated.url,
    //         ctag: localCalendarToBeUpdated.ctag || undefined,
    //         syncToken: localCalendarToBeUpdated.syncToken || undefined,
    //         objects: calendarObjects,
    //         objectMultiGet: calDavClient.calendarMultiGet,
    //       },
    //       method: "webdav",
    //       detailedResult: true,
    //     })
    //   ).objects;
    //   createdObjects.filter((co) => co.url.includes(".ics")).map((co) => {});
    // }

    // const remoteCalendarMetaData = await calDavClient.fetchCalendars();
    // console.log(remoteCalendarMetaData);
    // // save caldav calendars metadata to local
    // for (const calendarMetadata of remoteCalendarMetaData) {
    //   await prisma.caldavCalendar.create({
    //     data: {
    //       credentialId: caldendarCredential.id,
    //       userId: user.id,
    //       timezone: calendarMetadata.timezone,
    // name:
    //   typeof calendarMetadata.displayName === "string"
    //     ? calendarMetadata.displayName
    //     : undefined,
    // source: caldendarCredential.service,
    // url: calendarMetadata.url,
    // ctag: calendarMetadata.ctag,
    // syncToken: calendarMetadata.syncToken,
    //     },
    //   });
    // }

    return NextResponse.json(
      { calendars: "remoteCalendarMetaData", message: "synced events" },
      { status: 200 },
    );

    throw new InternalError("specified service is unsupported");
  } catch (error) {
    return errorHandler(error);
  }
}
