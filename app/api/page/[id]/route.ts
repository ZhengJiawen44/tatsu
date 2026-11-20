import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError, BadRequestError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { pagePatchSchema } from "@/schema";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");
    const { id } = await params;
    if (!id) throw new BadRequestError("Invalid request, ID is required");

    const body = await req.json();
    const parsedObj = pagePatchSchema.safeParse({
      ...body,
      ...(body.from != null && { from: new Date(body.from) }),
      ...(body.to != null && { to: new Date(body.to) }),
    });

    if (!parsedObj.success) throw new BadRequestError(parsedObj.error.message);
    const { data } = parsedObj;

    const project = await prisma.page.update({
      where: {
        id,
        userID: user.id,
      },
      data,
    });

    return NextResponse.json(
      { message: "page updated", project },
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");
    const { id } = await params;
    if (!id) throw new BadRequestError("Invalid request, ID is required");

    await prisma.page.delete({
      where: {
        id,
        userID: user.id,
      },
    });

    return NextResponse.json({ message: "page deleted" }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
