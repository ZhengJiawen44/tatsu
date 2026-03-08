import { DAVObject } from "tsdav";
import { prisma } from "../prisma/client";
import { parseIcsData } from "./parseIcsData";

export async function createTodosFromCalendarObjects(
  objects: DAVObject[],
  calendarId: string,
  userId: string,
) {
  return prisma.$transaction(
    objects.flatMap((co) => {
      const parsed = parseIcsData(co.data);
      if (!parsed) return [];

      return prisma.todo.create({
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
              etag: co.etag ?? "",
              remoteUrl: co.url,
              icsData: co.data,
              uid: parsed.uid,
            },
          },
        },
      });
    }),
  );
}
