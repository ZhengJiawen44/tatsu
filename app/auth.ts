import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma/client";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import { sha256 } from "@noble/hashes/sha256";
import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { hexToBytes, bytesToHex } from "@noble/hashes/utils";
import type { Adapter } from "next-auth/adapters";
import { cookies } from "next/headers";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  providers: [
    Google,
    Discord,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        let user = null;

        // Find the user
        user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user || !user.password) {
          return null;
        }

        // Check if this is a new format password (has a colon separator)
        if (user.password.includes(":")) {
          // Split the stored password to get the salt and hash
          const [saltHex, storedHashHex] = user.password.split(":");
          const salt = hexToBytes(saltHex);

          // Recreate the hash with the provided password and stored salt
          const calculatedHash = pbkdf2(sha256, password, salt, {
            c: 10000,
            dkLen: 32,
          });
          const calculatedHex = bytesToHex(calculatedHash);

          // Compare calculated hash with stored hash
          if (calculatedHex !== storedHashHex) {
            return null;
          }
        } else {
          // This is an old bcrypt hash - we can't verify it in Edge
          throw new Error("Please reset your password to continue.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // entry for google caldav sync.
      // if provider is google, refresh token exists, and authjs callback url has calendarSync=true, then run this function.
      if (
        account?.provider !== "google" ||
        !account?.refresh_token ||
        !user.id ||
        !user.email
      )
        return true;
      const jar = await cookies();
      const callbackUrlCookieName =
        process.env.NODE_ENV == "production"
          ? "__Secure-authjs.callback-url"
          : "authjs.callback-url";
      const callbackUrl = jar.get(callbackUrlCookieName)?.value;
      if (!callbackUrl) return true;
      const calendarSync =
        new URL(callbackUrl).searchParams.get("calendarSync") === "true";
      if (calendarSync !== true) return true;

      //sync logic: store the refresh token in the database to be used for future syncs.
      await prisma.$transaction(async (tx) => {
        await tx.calDavAccount.deleteMany({
          where: {
            userId: user.id!,
          },
        });
        await tx.calDavAccount.create({
          data: {
            userId: user.id!,
            refresh_token: account.refresh_token,
            username: user.email!,
            service: "google",
            serverUrl: "https://apidata.googleusercontent.com/caldav/v2/",
          },
        });
      });
      await prisma.calDavAccount.deleteMany({
        where: {
          userId: user.id!,
        },
      });
      await prisma.calDavAccount.create({
        data: {
          userId: user.id!,
          refresh_token: account.refresh_token,
          username: user.email!,
          service: "google",
          serverUrl: "https://apidata.googleusercontent.com/caldav/v2/",
        },
      });

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.timeZone = user.timeZone;
        if (account?.provider === "credentials") {
          token.name = user.name;
        }
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.timeZone = token.timeZone;
      return session;
    },
  },
});
