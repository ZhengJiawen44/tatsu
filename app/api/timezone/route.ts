import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { UnauthorizedError, BadRequestError, NotFoundError, BaseServerError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    const timeZone = req.headers.get("x-user-timezone");

    if (!timeZone)
      throw new BadRequestError(`missing time zone header! recieved: ${timeZone} for timeZone header`);

    const VALID_TIMEZONES = Intl.supportedValuesOf('timeZone')
    if (!VALID_TIMEZONES.includes(timeZone))
      throw new BadRequestError(`Invalid timezone! recieved ${timeZone} as timezone`);

    if (!/^[A-Za-z_]+\/[A-Za-z_]+$/.test(timeZone))
      throw new BadRequestError(`Invalid timezone format recieved ${timeZone} as timezone`);


    const queriedUser = await prisma.user.findUnique({
      where: {
        id: user.id
      }
    });
    if (!queriedUser)
      throw new NotFoundError("user not found");

    if (queriedUser.timeZone != timeZone) {
      await prisma.user.update({
        where: {
          id: queriedUser.id
        },
        data: {
          timeZone
        }
      })
    }
    return NextResponse.json({ status: 200 });

  } catch (error) {

    //handle custom error
    if (error instanceof BaseServerError) {
      await prisma.eventLog.create({
        data: {
          eventName: "timezone.error",
          capturedTime: new Date(),
          log: error.message.slice(0, 500),
        }
      })
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    await prisma.eventLog.create({
      data: {
        eventName: "timezone.error",
        capturedTime: new Date(),
        log: String(error),
      }
    })
    //handle generic error
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message.slice(0, 50)
            : "an unexpected error occured",
      },
      { status: 500 }
    );

  }
}
