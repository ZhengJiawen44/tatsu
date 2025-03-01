import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma/client";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import { sha256 } from "@noble/hashes/sha256";
import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { hexToBytes, bytesToHex } from "@noble/hashes/utils";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  basePath: process.env.NEXTAUTH_URL,
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
          throw new Error("Invalid credentials.");
        }

        try {
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
              throw new Error("Invalid credentials.");
            }
          } else {
            // This is an old bcrypt hash - we can't verify it in Edge
            throw new Error("Please reset your password to continue.");
          }

          return user;
        } catch (error) {
          console.log(error);
          throw new Error("Authentication failed.");
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        if (account?.provider === "credentials") {
          token.name = user.name;
        }
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});
