import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("registered!");
  return NextResponse.json({ status: 200 });
}
