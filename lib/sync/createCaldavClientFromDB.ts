import { InternalError } from "../customError";
import { prisma } from "../prisma/client";
import { createCalDAVClient } from "./createDavClient";

const globalClients = globalThis as unknown as {clients: Map<
  string,
  { updatedAt: number; calDavClient: Awaited<ReturnType<typeof createCalDAVClient>> }
> | undefined};

export default async function createCaldavClientFromDB(userId: string) {
  if(!globalClients.clients)
    globalClients.clients = new Map();
  
  const caldendarCredential = await prisma.calDavAccount.findUnique({
    where: { userId },
  });
  if (!caldendarCredential) throw new InternalError("No source to sync to");

  const cached = globalClients.clients.get(userId);
  if (cached && cached.updatedAt === caldendarCredential.updatedAt.getTime()) {
    return { calDavClient: cached.calDavClient, caldendarCredential };
  }

  const calDavClient = await createCalDAVClient(
    caldendarCredential.service,
    {
      username: caldendarCredential.username,
      password: caldendarCredential.password,
      serverUrl: caldendarCredential.serverUrl,
      refreshToken: caldendarCredential.refresh_token,
    },
  );
  globalClients.clients.set(userId, {
    updatedAt: caldendarCredential.updatedAt.getTime(),
    calDavClient,
  });
  return { calDavClient, caldendarCredential };
}