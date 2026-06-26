// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/admin")) {
        const token = await getToken({
            req,
            // Utilisez UNIQUEMENT le secret du .env
            secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
        });

        // Debug rapide : si vous voyez la redirection, c'est que token est null
        if (!token) {
            const loginUrl = new URL("/auth/login", req.nextUrl.origin);
            loginUrl.searchParams.set("callbackUrl", req.url);
            return NextResponse.redirect(loginUrl);
        }

        if (token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/error?code=403", req.nextUrl.origin));
        }
    }

    return NextResponse.next();
}
