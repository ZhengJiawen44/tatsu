import { DAVObject } from "tsdav";
import { prisma } from "../prisma/client";
import { parseIcsData } from "./parseIcsDataToLocal";

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
        const { master, instances } = parsed;

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
              title: master.title ?? "Untitled",
              description: master.description,
              dtstart: master.dtstart,
              due: master.due,
              durationMinutes: master.durationMinutes,
              rrule: master.rrule,
              exdates: master.exdates,
              timeZone: master.timeZone,
              priority: master.priority,
              instances: {
                create: instances.map((instance) => {
                  return {
                    recurId: instance.recurId,
                    instanceDate: new Date(instance.recurId),
                    overriddenTitle: instance.overriddenTitle,
                    overriddenDescription: instance.overriddenDescription,
                    overriddenDtstart: instance.overriddenDtstart,
                    overriddenDue: instance.overriddenDue,
                    overriddenPriority: instance.overriddenPriority,
                    overriddenDurationMinutes:
                      instance.overriddenDurationMinutes,
                  };
                }),
              },
              syncMetaData: {
                create: {
                  caldavCalendarId: calendarId,
                  etag: uo.etag ?? "",
                  remoteUrl: fullUrl,
                  icsData: uo.data,
                  uid: master.uid,
                },
              },
            },
          });
        }
        //recreate instances for easy reconcilliation
        await tx.todoInstance.deleteMany({
          where: {
            todoId: syncMetaData.todoId,
          },
        });
        return tx.todo.update({
          where: { id: syncMetaData.todoId },
          data: {
            title: master.title ?? "Untitled",
            description: master.description,
            dtstart: master.dtstart,
            due: master.due,
            durationMinutes: master.durationMinutes,
            rrule: master.rrule,
            exdates: master.exdates,
            timeZone: master.timeZone,
            priority: master.priority,
            instances: {
              create: instances.map((instance) => {
                return {
                  recurId: instance.recurId,
                  instanceDate: new Date(instance.recurId),
                  overriddenTitle: instance.overriddenTitle,
                  overriddenDescription: instance.overriddenDescription,
                  overriddenDtstart: instance.overriddenDtstart,
                  overriddenDue: instance.overriddenDue,
                  overriddenPriority: instance.overriddenPriority,
                  overriddenDurationMinutes: instance.overriddenDurationMinutes,
                };
              }),
            },
            syncMetaData: {
              update: {
                etag: uo.etag ?? "",
                icsData: uo.data,
                uid: master.uid,
              },
            },
          },
        });
      }),
    );

    return results.filter((r) => r !== null);
  });
}
