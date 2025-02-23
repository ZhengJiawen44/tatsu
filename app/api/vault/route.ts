import { NextRequest, NextResponse } from "next/server";
import {
  BaseServerError,
  BadRequestError,
  UnauthorizedError,
  InternalError,
} from "@/lib/customError";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma/client";
import { s3 } from "@/lib/s3";
import { auth } from "@/app/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    console.log("user", user);
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    // is request body multipart/form-data?
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.startsWith("multipart/form-data"))
      throw new BadRequestError("Invalid content type");

    //get file
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const fileSize = file.size;
    const fileName = `${Date.now()}-${file.name}`;
    //convert to Buffer
    let buffer: Buffer;
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    };
    await s3.send(new PutObjectCommand(uploadParams));
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    //upate database with the file entry
    const uploadedFile = await prisma.file.create({
      data: { name: file.name, url: fileUrl, size: fileSize, userID: user.id },
    });
    if (!uploadedFile) {
      throw new InternalError("could not update database");
    }

    return NextResponse.json(
      { message: "upload success", url: fileUrl },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    //handle custom error
    if (error instanceof BaseServerError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    //handle generic error
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message.slice(0, 50)
            : "an unexpected error occured",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    //get vault
    const vault = await prisma.file.findMany({
      where: { userID: user.id },
      orderBy: { createdAt: "desc" },
    });
    if (!vault) throw new InternalError("vault cannot be found at this time");

    return NextResponse.json(
      { message: "sucessfully found", vault },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    //handle custom error
    if (error instanceof BaseServerError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    //handle generic error
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message.slice(0, 50)
            : "an unexpected error occured",
      },
      { status: 500 }
    );
  }
}
