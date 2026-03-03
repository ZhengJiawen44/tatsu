import { NextRequest, NextResponse } from "next/server";
import {
  BadRequestError,
  InternalError,
  UnauthorizedError,
} from "@/lib/customError";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
import { createAccount, fetchCalendars } from "tsdav";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    const service = req.nextUrl.searchParams.get("service");
    if (!service)
      throw new BadRequestError("did not specify service to sync to");

    if (service == "apple") {
      const body = await req.json();
      const { appleId, appSpecificPassword } = body;
      if (!appleId || !appSpecificPassword)
        throw new BadRequestError(
          "apple id or app specific password not provided",
        );

      const authHeader = `Basic ${Buffer.from(`${appleId}:${appSpecificPassword}`, "utf-8").toString("base64")}`;
      console.log(authHeader);
      const davAccount = await createAccount({
        account: {
          serverUrl: "https://caldav.icloud.com",
          accountType: "caldav",
          credentials: {
            password: appSpecificPassword,
            username: appleId,
          },
        },
        headers: {
          authorization: authHeader,
        },
      });

      const calendars = await fetchCalendars({ account: davAccount });

      return NextResponse.json({ calendars }, { status: 200 });
    }

    if (service == "google") {
      // Get the user's Google access token from DB
      const account = await prisma.account.findFirst({
        where: {
          userId: user.id,
          provider: "google",
        },
      });

      if (!account?.access_token)
        throw new UnauthorizedError("No Google account linked");

      const davAccount = await createAccount({
        account: {
          serverUrl: "https://apidata.googleusercontent.com/caldav/v2/",
          accountType: "caldav",
          homeUrl: `https://apidata.googleusercontent.com/caldav/v2/${user.email}/`,
          credentials: {
            accessToken: account.access_token,
          },
        },
        headers: {
          authorization: `Bearer ${account.access_token}`,
        },
      });

      const calendars = await fetchCalendars({
        account: davAccount,
        headers: {
          authorization: `Bearer ${account.access_token}`,
        },
      });

      console.log(calendars);
      return NextResponse.json({ calendars }, { status: 200 });
    }

    throw new InternalError("specified service is unsupported");
  } catch (error) {
    return errorHandler(error);
  }
}
