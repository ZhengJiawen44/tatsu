import { NextRequest, NextResponse } from "next/server";
import {
  UnauthorizedError,
  BadRequestError,
  InternalError,
} from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { pageSchema } from "@/schema";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    //validate req body
    const body = await req.json();
    const parsedObj = pageSchema.safeParse({...body, from: new Date(body.from), to: new Date(body.to)});
    if (!parsedObj.success) throw new BadRequestError(parsedObj.error.message);

    const { title, from, to } = parsedObj.data;
    const page = await prisma.page.create({
      data: { title, userID: user.id, from, to },
    });
    if (!page)
      throw new InternalError("page cannot be created at this time");

    return NextResponse.json(
      { message: "page created", page },
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    const pages = await prisma.page.findMany({
      where: { userID: user.id },
      orderBy: { id: "desc" },
      select: { id: true, title: true, from: true, to: true },
    });
    if (!pages)
      throw new InternalError("page cannot be found at this time");

    return NextResponse.json({ pages }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
