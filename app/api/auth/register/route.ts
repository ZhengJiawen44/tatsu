import { NextRequest, NextResponse } from "next/server";
import { registrationSchema } from "@/schema";
import { prisma } from "@/lib/prisma/client";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedObj = registrationSchema.safeParse(body);
    if (!parsedObj.success) {
      return NextResponse.json({ status: 400 }, { status: 400 });
    }
    const user = await prisma.user.create({ data: parsedObj.data });

    if (!user) {
      throw new Error("user account not created");
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500 });
  }
}
