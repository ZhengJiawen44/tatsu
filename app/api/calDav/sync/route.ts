import { NextRequest, NextResponse } from "next/server";
import {
  BadRequestError,
  InternalError,
  UnauthorizedError,
} from "@/lib/customError";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
import { createCalDAVClient } from "@/lib/sync/createDavClient";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    const service = req.nextUrl.searchParams.get("service");
    if (!service)
      throw new BadRequestError("did not specify service to sync to");

    let password = null;
    let username = null;
    let serverUrl = null;
    if (service == "apple" || service == "baikal" || service == "davical") {
      const body = await req.json();
      username = body.username;
      password = body.password;
      serverUrl = body.serverUrl;
      if (!password || !username)
        throw new BadRequestError("username or password not provided");
    }

    //create a caldav client
    const calDavClient = await createCalDAVClient(service, username, password);
    const calendarMetaData = calDavClient.fetchCalendars();

    // encrypt and save credentials to data base
    await prisma.calDavAccount.upsert({
      create: {
        username,
        password,
        serverUrl:
          serverUrl || (service == "apple" && "https://caldav.icloud.com"),
        service,
        userId: user.id,
      },
      update: {
        username,
        password,
        serverUrl:
          serverUrl || (service == "apple" && "https://caldav.icloud.com"),
        service,
        userId: user.id,
      },
      where: { userId: user.id },
    });

    return NextResponse.json({ calendars: calendarMetaData }, { status: 200 });

    throw new InternalError("specified service is unsupported");
  } catch (error) {
    return errorHandler(error);
  }
}

// if (service == "google") {
//   // Get the user's Google access token from DB
//   const account = await prisma.account.findFirst({
//     where: {
//       userId: user.id,
//       provider: "google",
//     },
//   });

//   if (!account?.access_token)
//     throw new UnauthorizedError("No Google account linked");

//   const davAccount = await createAccount({
//     account: {
//       serverUrl: "https://apidata.googleusercontent.com/caldav/v2/",
//       accountType: "caldav",
//       homeUrl: `https://apidata.googleusercontent.com/caldav/v2/${user.email}/`,
//       credentials: {
//         accessToken: account.access_token,
//       },
//     },
//     headers: {
//       authorization: `Bearer ${account.access_token}`,
//     },
//   });

//   const calendars = await fetchCalendars({
//     account: davAccount,
//     headers: {
//       authorization: `Bearer ${account.access_token}`,
//     },
//   });

//   console.log(calendars);
// }
