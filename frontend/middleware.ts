import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getApiBase } from "@/config/api";

export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;

    if (pathname === "/admin/login") return NextResponse.next();

    try {
        const apiBase = getApiBase(origin);
        const meUrl = `${apiBase}/api/auth/me`;
        const res = await fetch(meUrl, {
            headers: {
                // Forward incoming cookies (should include cookies with Domain=.domain.com)
                cookie: req.headers.get("cookie") || "",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            const loginUrl = new URL("/admin/login", origin);
            loginUrl.searchParams.set("from", pathname);
            return NextResponse.redirect(loginUrl);
        }
        const data = await res.json().catch(() => null);
        if (data?.user?.role !== "admin") {
            return NextResponse.redirect(new URL("/", origin));
        }
        return NextResponse.next();
    } catch {
        const loginUrl = new URL("/admin/login", origin);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: ["/admin/:path*"],
};