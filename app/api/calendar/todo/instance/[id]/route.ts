import { auth } from "@/app/auth";
import {
  UnauthorizedError,
  BadRequestError,
  BaseServerError,
} from "@/lib/customError";
// import { errorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma/client";
// import { todoSchema } from "@/schema";
// import { Priority } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    const { id } = await params;
    const instanceDate = new Date(
      Number(req.nextUrl.searchParams.get("instanceDate")),
    );
    if (!id || !instanceDate)
      throw new BadRequestError(
        "Invalid request, ID or instanceDate is required to do instance delete!",
      );

    // Find and exadate the todo instance
    await prisma.todo.update({
      where: { id },
      data: { exdates: { push: [instanceDate] } },
    });

    return NextResponse.json({ message: "todo deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);

    // Handle custom error
    if (error instanceof BaseServerError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    // Handle generic error
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message.slice(0, 50)
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
