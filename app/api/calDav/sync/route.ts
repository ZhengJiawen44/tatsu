import { NextResponse } from "next/server";
import { InternalError, UnauthorizedError } from "@/lib/customError";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";
import { createCalDAVClient } from "@/lib/sync/createDavClient";
import { prisma } from "@/lib/prisma/client";

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

    const calendarMetaData = calDavClient.fetchCalendars();
    return NextResponse.json(
      { calendars: calendarMetaData, message: "synced events" },
      { status: 200 },
    );

    throw new InternalError("specified service is unsupported");
  } catch (error) {
    return errorHandler(error);
  }
}
