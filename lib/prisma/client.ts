import { PrismaClient } from "@prisma/client";

const globalPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Enable query logging in development
export const prisma =
  globalPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV !== "production"
        ? ["query", "info", "warn", "error"]
        : [],
  });

if (process.env.NODE_ENV !== "production") globalPrisma.prisma = prisma;
