import { auth } from "@/app/auth";
import { UnauthorizedError } from "@/lib/customError";
import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";

export const GET = async()=>{
try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      throw new UnauthorizedError("You must be logged in to do this");
    }
    const caldavCalendars = await prisma.caldavCalendar.findMany({
        where:{userId:user.id},
        orderBy:{name:"asc"}
    })

    return NextResponse.json(
      { caldavCalendars },
      {
        status: 200,
      },
    );
  } catch (error) {
    return errorHandler(error);
  }
}

