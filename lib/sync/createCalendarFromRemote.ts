import { DAVCalendar } from "tsdav";
import { CalendarComponent } from "@prisma/client";
import { prisma } from "../prisma/client";

type CalendarCredential = {
  id: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  service: string;
  serverUrl: string;
  username: string;
};

const validComponents = new Set(Object.values(CalendarComponent));

export default async function createCalendarFromRemote(
  userId: string,
  calendarCredential: CalendarCredential,
  calendar: DAVCalendar,
) {
  const components = (calendar.components ?? []).filter(
    (c): c is CalendarComponent => validComponents.has(c as CalendarComponent),
  );

  return prisma.caldavCalendar.create({
    data: {
      userId,
      credentialId: calendarCredential.id,
      timezone: calendar.timezone,
      name:
        typeof calendar.displayName === "string"
          ? calendar.displayName
          : undefined,
      source: calendarCredential.service,
      url: calendar.url,
      ctag: calendar.ctag,
      syncToken: calendar.syncToken,
      components,
    },
  });
}
