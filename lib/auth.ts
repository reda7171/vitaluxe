import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email as string },
                    });

                    if (!user) return null;

                    const valid = await bcrypt.compare(credentials.password as string, user.password);
                    if (!valid) return null;

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Auth authorize error:", error);
                    return null;
                }
            },
        }),
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
            Google({
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            })
        ] : []),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 jours
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role ?? "CUSTOMER";
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "vitaluxe-secret-dev-key-change-in-prod",
    trustHost: true,
});
