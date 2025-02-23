import { auth } from "@/app/auth";
import {
  UnauthorizedError,
  BadRequestError,
  InternalError,
  BaseServerError,
  NotFoundError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    const { id } = await params;
    if (!id) throw new BadRequestError("Invalid request, ID is required");

    //find the key from database
    const file = await prisma.file.findUnique({
      where: { id: id, userID: user.id },
      select: { s3Key: true },
    });

    if (!file) {
      throw new NotFoundError(
        "key not found for deletetion. This file may not belong to you or has already been deleted"
      );
    }
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.s3Key,
    });
    await s3.send(command);

    // Find and delete the File item on server
    const deletedFile = await prisma.file.delete({
      where: {
        id,
        userID: user.id,
      },
    });
    if (!deletedFile)
      throw new InternalError("file not found or not authorized to delete");

    return NextResponse.json({ message: "file deleted" }, { status: 200 });
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
