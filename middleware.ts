import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/admin")) {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET ?? "vitaluxe-secret-dev-2026",
        });

        if (!token) {
            const loginUrl = new URL("/auth/login", req.url);
            loginUrl.searchParams.set("callbackUrl", req.url);
            return NextResponse.redirect(loginUrl);
        }

        if (token.role !== "ADMIN") {
            const errorUrl = new URL("/error?code=403", req.url);
            return NextResponse.redirect(errorUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
