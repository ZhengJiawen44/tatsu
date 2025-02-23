import { NextRequest, NextResponse } from "next/server";
import { BaseServerError, BadRequestError } from "@/lib/customError";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    // is request body multipart/form-data?
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.startsWith("multipart/form-data"))
      throw new BadRequestError("Invalid content type");

    //get file
    const formData = await req.formData();
    const file = formData.get("file") as File;
    //convert to Buffer
    let buffer: Buffer;
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    };
    await s3.send(new PutObjectCommand(uploadParams));
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

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
