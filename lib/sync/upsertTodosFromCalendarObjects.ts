import { DAVObject } from "tsdav";
import { prisma } from "../prisma/client";
import { parseIcsData } from "./parseIcsData";

export async function upsertTodosFromCalendarObjects(
  objects: DAVObject[],
  calendarId: string,
  userId: string,
  serverUrl: string,
) {
  return prisma.$transaction(async (tx) => {
    const results = await Promise.all(
      objects.map(async (uo) => {
        const parsed = parseIcsData(uo.data);
        if (!parsed) return null;

        const fullUrl =
          serverUrl && !uo.url.startsWith("http")
            ? `${serverUrl}${uo.url}`
            : uo.url;
        const syncMetaData = await tx.syncMetaData.findUnique({
          where: { remoteUrl: fullUrl },
        });

        if (!syncMetaData) {
          return tx.todo.create({
            data: {
              userID: userId,
              title: parsed.title ?? "Untitled",
              description: parsed.description,
              dtstart: parsed.dtstart,
              due: parsed.due,
              durationMinutes: parsed.durationMinutes,
              rrule: parsed.rrule,
              exdates: parsed.exdates,
              timeZone: parsed.timeZone,
              priority: parsed.priority,
              syncMetaData: {
                create: {
                  caldavCalendarId: calendarId,
                  etag: uo.etag ?? "",
                  remoteUrl: fullUrl,
                  icsData: uo.data,
                  uid: parsed.uid,
                },
              },
            },
          });
        }

        return tx.todo.update({
          where: { id: syncMetaData.todoId },
          data: {
            title: parsed.title ?? "Untitled",
            description: parsed.description,
            dtstart: parsed.dtstart,
            due: parsed.due,
            durationMinutes: parsed.durationMinutes,
            rrule: parsed.rrule,
            exdates: parsed.exdates,
            timeZone: parsed.timeZone,
            priority: parsed.priority,
            syncMetaData: {
              update: {
                etag: uo.etag ?? "",
                icsData: uo.data,
                uid: parsed.uid,
              },
            },
          },
        });
      }),
    );

    return results.filter((r) => r !== null);
  });
}
