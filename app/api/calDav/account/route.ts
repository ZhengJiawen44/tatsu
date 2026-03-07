import { NextRequest, NextResponse } from "next/server";
import {
  UnauthorizedError,
  BadRequestError,
  InternalError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";
import { createCalDAVClient } from "@/lib/sync/createDavClient";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    const body = await req.json();
    const password = body.password;
    const username = body.username;
    const serverUrl = body.serverUrl;
    const service = body.service;

    if (!service)
      throw new BadRequestError("did not specify service to sync to");
    if (!["apple", "baikal", "davical"].includes(service))
      throw new BadRequestError("specified service is unsupported");
    if (!password || !username)
      throw new BadRequestError("username or password not provided");

    //connect to the remote server to confirm credential is valid
    const calDavClient = await createCalDAVClient(
      service,
      username,
      password,
      serverUrl,
    );
    if (!calDavClient) throw new InternalError("invalid calendar credentials");

    //delete previous account and related todos
    await prisma.todo.deleteMany({
      where: {
        syncMetaData: { isNot: null },
      },
    });
    await prisma.calDavAccount.deleteMany({
      where: { userId: user.id },
    });

    // encrypt(havent implemented) and save credentials to data base
    await prisma.calDavAccount.create({
      data: {
        username,
        password,
        serverUrl:
          serverUrl || (service == "apple" && "https://caldav.icloud.com"),
        service,
        userId: user.id,
      },
    });

    return NextResponse.json(
      { message: "caldav account saved" },
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");
    await prisma.calDavAccount.delete({
      where: { userId: user.id },
    });
    return NextResponse.json(
      { message: "caldav account removed" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    errorHandler(error);
  }
}

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");
    const calDavAccount = await prisma.calDavAccount.findUnique({
      where: { userId: user.id },
    });
    return NextResponse.json({ calDavAccount }, { status: 200 });
  } catch (error) {
    console.log(error);
    errorHandler(error);
  }
}
