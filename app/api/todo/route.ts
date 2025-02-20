import { NextRequest, NextResponse } from "next/server";
import {
  BaseServerError,
  UnauthorizedError,
  BadRequestError,
  InternalError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { todoSchema } from "@/schema";
import { auth } from "@/app/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    console.log("user", user);
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    //validate req body
    const body = await req.json();
    const parsedObj = todoSchema.safeParse(body);
    if (!parsedObj.success) throw new BadRequestError();

    //create todo
    const todo = await prisma.todo.create({
      data: { ...parsedObj.data, userID: user.id },
    });
    if (!todo) throw new InternalError("todo cannot be created at this time");

    return NextResponse.json({ message: "todo created" }, { status: 200 });
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
    console.log("user", user);
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    //get todos
    const todos = await prisma.todo.findMany({
      where: { userID: user.id },
      orderBy: { createdAt: "desc" },
    });
    if (!todos) throw new InternalError("todo cannot be created at this time");

    return NextResponse.json({ todos }, { status: 200 });
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
