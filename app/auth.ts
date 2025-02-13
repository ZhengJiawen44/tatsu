import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        //destructure credentials
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        //hash the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        let user = null;
        //does user exist?
        user = await prisma.user.findUnique({
          where: { email: email },
        });
        if (!user) {
          throw new Error("Invalid credentials.");
        }
        return user;
      },
    }),
  ],
});
