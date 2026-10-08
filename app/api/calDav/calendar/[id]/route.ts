import { auth } from "@/app/auth";
import { BadRequestError, NotFoundError, UnauthorizedError } from "@/lib/customError";
import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// patch route only sets the calendar to be selected as true and every other calendar's selected as false
export const PATCH = async(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
)=>{
try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id) 
        throw new UnauthorizedError("You must be logged in to do this");
    
    const { id:caldavCalendarId } = await params;
    if (!caldavCalendarId) 
        throw new BadRequestError("Invalid request, ID is required");

    const caldavCalendars = await prisma.$transaction(async (tx) => {
        await tx.caldavCalendar.updateMany({
            where: { userId: user.id },
            data: { selected: false },
        });
        const selected = await tx.caldavCalendar.updateMany({
            where: { userId: user.id, id: caldavCalendarId, components:{has:"VEVENT"} },
            data: { selected: true },
        });
        if (selected.count === 0)
            throw new NotFoundError("Calendar not found");

        return tx.caldavCalendar.findMany({
            where: { userId: user.id },
        });
    });

    return NextResponse.json(
      { message:"successfully updated selected calendar", data: caldavCalendars},
      {
        status: 200,
      },
    );
  } catch (error) {
    return errorHandler(error);
  }
}