import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError, BadRequestError } from "@/lib/customError";
import { prisma } from "@/lib/prisma/client";
import { projectPatchSchema } from "@/schema";
import { auth } from "@/app/auth";
import { errorHandler } from "@/lib/errorHandler";
import { Prisma } from "@prisma/client";

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
    const parsedObj = projectPatchSchema.safeParse(body);

    if (!parsedObj.success) throw new BadRequestError();

    const { name, color } = parsedObj.data;

    const data: Prisma.ProjectUpdateInput = {};

    if (name !== undefined) data.name = name;
    if (color !== undefined) data.color = color;

    if (Object.keys(data).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const project = await prisma.project.update({
      where: {
        id,
        userID: user.id,
      },
      data,
    });

    return NextResponse.json(
      { message: "project updated", project },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
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

    await prisma.project.delete({
      where: {
        id,
        userID: user.id,
      },
    });

    return NextResponse.json({ message: "project deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return errorHandler(error);
  }
}
