import { auth } from "@/app/auth";
import { BadRequestError, NotFoundError, UnauthorizedError } from "@/lib/customError";
import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
import { userPreferencesSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    const userPreferences = await prisma.userPreferences.findUnique({
      where: { userID: user.id},
      select:{sortBy:true, groupBy:true, direction:true}
    });
    const userTimezone = await prisma.user.findUnique({
      where: { id: user.id },
      select:{timeZone: true}
    });

    if(!userPreferences || !userTimezone)throw new NotFoundError("no user for the user id found");


    return NextResponse.json({ userID:user.id, userPreferences, userTimezone: userTimezone?.timeZone }, { status: 200 });
  } catch (error) {
    console.log(error);
    return errorHandler(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    const body = await req.json();
    const parsedObj = userPreferencesSchema.partial().safeParse(body);

    if (!parsedObj.success) throw new BadRequestError("Invalid request body");

    const updatedPreferences = await prisma.userPreferences.upsert({
      where: { userID: user.id },
      update: parsedObj.data,
      create: {
        userID: user.id,
        sortBy: parsedObj.data.sortBy,
        groupBy: parsedObj.data.groupBy,
        direction: parsedObj.data.direction,
      },
    });

    return NextResponse.json(
      { userPreferences: updatedPreferences },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return errorHandler(error);
  }
}
