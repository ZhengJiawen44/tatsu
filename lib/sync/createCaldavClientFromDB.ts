import { InternalError } from "../customError";
import { prisma } from "../prisma/client";
import { createCalDAVClient } from "./createDavClient";

export default async function createCaldavClientFromDB(userId: string) {
  //create a caldav client
  const caldendarCredential = await prisma.calDavAccount.findUnique({
    where: { userId },
  });
  if (!caldendarCredential) throw new InternalError("No source to sync to");
  const calDavClient = await createCalDAVClient(
    caldendarCredential.service,
    caldendarCredential.username,
    caldendarCredential.password,
    caldendarCredential.serverUrl,
  );
  return { calDavClient, caldendarCredential };
}
