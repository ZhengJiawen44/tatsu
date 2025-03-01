import { NextRequest, NextResponse } from "next/server";
import {
  BaseServerError,
  UnauthorizedError,
  InternalError,
  BadRequestError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { auth } from "@/app/auth";
import { noteSchema } from "@/schema";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    // Extract `id` from URL params
    const { id } = await params;
    if (!id) throw new BadRequestError("Invalid request, ID is required");

    // Find and delete the note item
    const deletedNote = await prisma.note.deleteMany({
      where: {
        id,
        userID: user.id,
      },
    });

    if (deletedNote.count === 0)
      throw new InternalError("note not found or not authorized to delete");

    return NextResponse.json({ message: "note deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);

    // Handle custom error
    if (error instanceof BaseServerError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
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
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("You must be logged in to do this");

    const { id } = await params;
    if (!id) throw new BadRequestError("Invalid request, ID is required");

    //for renaming
    const isRename = req.nextUrl.searchParams.get("rename") as string;
    if (isRename?.trim().length <= 0) {
      throw new BadRequestError("name cannot be empty");
    }
    if (isRename?.trim().length > 0) {
      await prisma.note.update({
        where: { id, userID: user.id },
        data: { name: isRename },
      });
      return NextResponse.json({ message: "name updated" }, { status: 200 });
    }

    const body = await req.json();
    const parsedObj = noteSchema.partial().safeParse(body);
    if (!parsedObj.success) throw new BadRequestError("Invalid request body");

    // Update note
    const updatedNote = await prisma.note.updateMany({
      where: { id, userID: user.id },
      data: parsedObj.data,
    });

    if (updatedNote.count === 0)
      throw new InternalError("note not found or not authorized to update");

    return NextResponse.json({ message: "note updated" }, { status: 200 });
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
