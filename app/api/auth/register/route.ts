import { NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/schema";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma/client";
import {
  BaseServerError,
  BadRequestError,
  InternalError,
} from "@/lib/customError";

export async function POST(req: NextRequest) {
  try {
    //await the req body
    const body = await req.json();

    //validate the body with zod
    const parsedObj = registrationSchema.safeParse(body);
    if (!parsedObj.success) {
      throw new BadRequestError();
    }
    const { email, password } = parsedObj.data;

    //CASE user registered before
    const userExists = await prisma.user.findUnique({
      where: { email: email },
    });
    if (userExists) {
      throw new BadRequestError("this email is taken");
    }

    //hash the password
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    //create the user in data base
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    //CASE user not created
    if (!user) {
      throw new InternalError("user account not created");
    }

    return NextResponse.json({ message: "account created" }, { status: 200 });
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
