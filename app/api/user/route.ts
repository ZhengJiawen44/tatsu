import { auth } from "@/app/auth";
import {
  UnauthorizedError,
  InternalError,
  BaseServerError,
  BadRequestError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("You must be logged in to do this");

    const queriedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        maxStorage: true,
        usedStoraged: true,
        enableEncryption: true,
        protectedSymmetricKey: true,
      },
    });

    if (!queriedUser)
      throw new InternalError("user not found or not authorized to access");

    return NextResponse.json(
      { message: "user found", queriedUser },
      { status: 200 }
    );
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

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id)
      throw new UnauthorizedError("You must be logged in to do this");

    // **for users to opt in or out of encryption**
    const query = req.nextUrl.searchParams;
    if (query.has("enableEncryption")) {
      const enableEncryption = query.get("enableEncryption") === "true";
      const patchedUser = await prisma.user.update({
        where: { id: user.id },
        data: { enableEncryption: enableEncryption },
      });
      if (!patchedUser)
        throw new InternalError("user not found or not authorized to access");
      return NextResponse.json(
        { message: "enable encryption updated" },
        { status: 200 }
      );
    }

    // **Update User's Protected Symmetric Key**
    const { protectedSymmetricKey } = await req.json();

    if (!protectedSymmetricKey) {
      throw new BadRequestError(
        "Missing required fields: protectedSymmetricKey "
      );
    }

    // Ensure data is in the correct format
    if (typeof protectedSymmetricKey !== "string") {
      throw new BadRequestError(
        "protectedSymmetricKey must be base64-encoded strings"
      );
    }

    // Store encrypted key in the database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        protectedSymmetricKey,
      },
    });

    if (!updatedUser) {
      throw new InternalError("Failed to update protected symmetric key");
    }

    return NextResponse.json(
      { message: "your files are now End to End encrypted!" },
      { status: 200 }
    );
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
