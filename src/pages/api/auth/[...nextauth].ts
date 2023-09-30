// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions, type Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      const stringifySession = JSON.stringify(session);

      const parsedSession = JSON.parse(stringifySession) as Session;

      if (parsedSession.user) {
        parsedSession.user.id = user.id;
      }

      return parsedSession;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

export default NextAuth(authOptions);
