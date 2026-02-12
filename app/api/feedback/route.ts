import { NextRequest, NextResponse } from "next/server";
import {
  UnauthorizedError,
  BadRequestError,
  InternalError,
} from "@/lib/customError";
import { auth } from "@/app/auth";
import { z } from "zod";
import { errorHandler } from "@/lib/errorHandler";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user?.id)
      throw new UnauthorizedError("you must be logged in to do this");

    //validate req body
    const body = await req.json();
    const feedbackRequestSchema = z.object({
      title: z.string().min(4).max(100),
      description: z
        .string()
        .max(500)
        .refine(
          (val) => val === "" || val.length >= 5,
          "Description must be at least 5 characters or empty",
        )
        .optional(),
    });
    const parsedResult = feedbackRequestSchema.safeParse(body);

    if (parsedResult.error)
      throw new BadRequestError("title or description too short or missing");

    const resendClient = new Resend(process.env.RESEND_API_KEY);

    const data = await resendClient.emails.send({
      from: "Feedback <admin@sanity.my>",
      to: "zhengjiawen44@gmail.com",
      replyTo: user.email || "invalid@email",
      subject: `Sanity Feedback — ${parsedResult.data.title}`,
      text: `
        New feedback received from Sanity 

        Title:
        ${parsedResult.data.title}

        Message:
        ${parsedResult.data.description || "User did not send a description."}

        ---
        User Info
        ID: ${user.id}
        Name: ${user.name || "Unknown"}
        Email: ${user.email || "Not provided"}
        Timezone: ${user.timeZone || "Unknown"}

        Source:
        ${process.env.API_URL}
        `.trim(),
    });

    if (data.error)
      throw new InternalError(
        `${data.error.name} ${data.error.statusCode} ${data.error.message}`,
      );

    return NextResponse.json({ message: "feedback created" }, { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
