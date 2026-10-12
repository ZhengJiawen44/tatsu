import { auth } from "@/app/auth";
import {
  UnauthorizedError,
  BadRequestError,
  InternalError,
  NotFoundError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/lib/s3";
import { errorHandler } from "@/lib/errorHandler";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const s3 = getS3Client();
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    const { id } = await params;
    if (!id) throw new BadRequestError("Invalid request, ID is required");

    //find the key from database
    const file = await prisma.file.findUnique({
      where: { id: id, userID: user.id },
      select: { s3Key: true, size: true },
    });

    if (!file) {
      throw new NotFoundError(
        "key not found for deletetion. This file may not belong to you or has already been deleted",
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
    //update user's storage usage
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { usedStoraged: { decrement: file.size } },
    });
    if (!updatedUser) {
      throw new InternalError("could not remove from database");
    }
    return NextResponse.json({ message: "file deleted" }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
