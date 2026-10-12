import { NextResponse } from "next/server";
import { BaseServerError } from "./customError";
export function errorHandler(error: unknown) {
  console.error("Error:", error);
  if (error instanceof BaseServerError)
    return NextResponse.json(
      { message: `${error.message.slice(0, 500)}` },
      { status: error.status },
    );

  return NextResponse.json(
    {
      message:
        error instanceof Error
          ? `${error.message.slice(0, 500)}`
          : "An unexpected error occurred",
    },
    { status: 500 },
  );
}
