import { NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/schema";
import { prisma } from "@/lib/prisma/client";
import {
  BaseServerError,
  BadRequestError,
  InternalError,
} from "@/lib/customError";
import { sha256 } from "@noble/hashes/sha256";
import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { randomBytes } from "@noble/hashes/utils";
import { bytesToHex } from "@noble/hashes/utils";

export async function POST(req: NextRequest) {
  try {
    // await the req body
    const body = await req.json();

    // validate the body with zod
    const parsedObj = registrationSchema.safeParse(body);
    if (!parsedObj.success) {
      throw new BadRequestError();
    }
    const { fname, lname, email, password } = parsedObj.data;

    // CASE user registered before
    const userExists = await prisma.user.findUnique({
      where: { email: email },
    });
    if (userExists) {
      throw new BadRequestError("this email is taken");
    }

    // Generate salt and hash password
    const salt = randomBytes(16);
    const saltHex = bytesToHex(salt);

    // Use PBKDF2 for password hashing (more secure than single-pass SHA-256)
    const passwordHash = pbkdf2(sha256, password, salt, {
      c: 10000,
      dkLen: 32,
    });
    const passwordHex = bytesToHex(passwordHash);

    // Store salt:hash
    const hashedPassword = `${saltHex}:${passwordHex}`;

    // create the user in database
    const user = await prisma.user.create({
      data: { name: fname + " " + lname, email, password: hashedPassword },
    });

    // CASE user not created
    if (!user) {
      throw new InternalError("user account not created");
    }

    return NextResponse.json({ message: "account created" }, { status: 200 });
  } catch (error) {
    console.log(error);

    // handle custom error
    if (error instanceof BaseServerError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    // handle generic error
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
