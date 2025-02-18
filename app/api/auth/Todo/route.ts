import { NextRequest, NextResponse } from "next/server";
import { BaseServerError, UnauthorizedError } from "@/lib/customError";
import { auth } from "@/app/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      throw new UnauthorizedError("you must be logged in to do this");
    }
    return NextResponse.json({ message: "recieved" }, { status: 200 });
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
