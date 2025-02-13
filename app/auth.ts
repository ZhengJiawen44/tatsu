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
      //this is called for when signIn method is invoked. params passed are the form data from frontend
      authorize: async (credentials) => {
        //destructure credentials
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        //either return a user or null
        let user = null;
        //does user exist?
        user = await prisma.user.findUnique({
          where: { email: email },
        });

        const passwordMatch = bcrypt.compareSync(
          password,
          user?.password || ""
        );
        if (!user || !passwordMatch) {
          throw new Error("Invalid credentials.");
        }
        return user;
      },
    }),
  ],
});
