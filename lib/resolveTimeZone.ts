import { prisma } from "@/lib/prisma/client";
import isValidIANATimeZone from "@/lib/isValidIANATimeZone";
import { Session } from "next-auth";
import { NextRequest } from "next/server";

/**
 * asynchronously retrieves user timezone from one of the follwing: user session, header, database
 * @param user the user object from auth session
 * @param req the http request object
 * @returns timezone
 */
export async function resolveTimezone(user: Session["user"], req: NextRequest) {
  // Resolve Timezone, this is critical as wrong timeZone means very inaccurate scheduling.
  // try: User preference -> req Header fallback -> DB fallback -> UTC fallback (worst case)
  let timeZone = user.timeZone;
  if (!timeZone) {
    // Client-provided via header (client detects and sends)
    const clientTimeZone = req.headers.get("x-timezone")?.trim();
    if (clientTimeZone && isValidIANATimeZone(clientTimeZone)) {
      timeZone = clientTimeZone;
    }
  }
  if (!timeZone) {
    // Fallback to DB if not in session obj or header
    const queriedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { timeZone: true },
    });
    timeZone = queriedUser?.timeZone ?? "UTC";
  }
  return timeZone;
}
