import { NextRequest, NextResponse } from "next/server";
import {
  BaseServerError,
  UnauthorizedError,
  BadRequestError,
  InternalError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { noteSchema } from "@/schema";
import { auth } from "@/app/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    //validate req body
    const body = await req.json();
    const parsedObj = noteSchema.safeParse(body);
    if (!parsedObj.success) throw new BadRequestError();

    //create todo
    const note = await prisma.note.create({
      data: { ...parsedObj.data, userID: user.id },
    });
    if (!note) throw new InternalError("note cannot be created at this time");

    return NextResponse.json(
      { message: "note created", note },
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

    //get notes
    const notes = await prisma.note.findMany({
      where: { userID: user.id },
      orderBy: { createdAt: "desc" },
    });
    if (!notes) throw new InternalError("notes cannot be found at this time");

    return NextResponse.json({ notes }, { status: 200 });
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
