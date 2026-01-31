import { NextRequest, NextResponse } from "next/server";
import {
  BaseServerError,
  UnauthorizedError,
  BadRequestError,
  InternalError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { projectSchema } from "@/schema";
import { auth } from "@/app/auth";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    //validate req body
    const body = await req.json();
    const parsedObj = projectSchema.safeParse(body);
    if (!parsedObj.success) throw new BadRequestError();

    const { name } = parsedObj.data;
    const project = await prisma.project.create({
      data: { name, userID: user.id },
    });
    if (!project)
      throw new InternalError("note cannot be created at this time");

    return NextResponse.json(
      { message: "project created", project },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);

    //handle custom error
    if (error instanceof BaseServerError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
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
      { status: 500 },
    );
  }
}
