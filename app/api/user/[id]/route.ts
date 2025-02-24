import { auth } from "@/app/auth";
import {
  UnauthorizedError,
  BadRequestError,
  InternalError,
  BaseServerError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("You must be logged in to do this");

    const id = (await params).id;
    if (!id) throw new BadRequestError("Invalid request, ID is required");

    const queriedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { maxStorage: true, usedStoraged: true },
    });

    if (!queriedUser)
      throw new InternalError("user not found or not authorized to access");

    return NextResponse.json(
      { message: "user found", queriedUser },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    if (error instanceof BaseServerError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message.slice(0, 50)
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
