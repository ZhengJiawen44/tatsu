import { DAVCalendar } from "tsdav";
import { prisma } from "../prisma/client";

type caldendarCredential = {
  id: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  service: string;
  serverUrl: string;
  username: string;
};

export default async function createCalendarFromRemote(
  userId: string,
  caldendarCredential: caldendarCredential,
  calendar: DAVCalendar,
) {
  const caldavCalendar = await prisma.caldavCalendar.create({
    data: {
      userId,
      credentialId: caldendarCredential.id,
      timezone: calendar.timezone,
      name:
        typeof calendar.displayName === "string"
          ? calendar.displayName
          : undefined,
      source: caldendarCredential.service,
      url: calendar.url,
      ctag: calendar.ctag,
      syncToken: calendar.syncToken,
    },
  });

  return caldavCalendar;
}
