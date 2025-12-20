import { NextResponse } from "next/server";
import { BaseServerError } from "./customError";
export function errorHandler(error: unknown) {
  console.error("GET Todos Error:", error);
  if (error instanceof BaseServerError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    },
    { status: 500 },
  );
}
