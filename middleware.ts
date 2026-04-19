// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Public pages that anyone can access without login
const PUBLIC_PATHS = ["/about", "/crm/login", "/crm/signup"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Always allow public paths
    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
        // Redirect already authenticated users away from login/signup
        if (token && (pathname.startsWith("/crm/login") || pathname.startsWith("/crm/signup"))) {
            const role = (token.role as string || "").toUpperCase();
            if (role === "COACH") return NextResponse.redirect(new URL("/crm/coach-dashboard", req.url));
            if (role === "STUDENT") return NextResponse.redirect(new URL("/crm/student-dashboard", req.url));
            return NextResponse.redirect(new URL("/crm/dashboard", req.url));
        }
        return NextResponse.next();
    }

    // CRM protected pages — require login
    if (!token && pathname.startsWith("/crm")) {
        return NextResponse.redirect(new URL("/crm/login", req.url));
    }

    // Allow authenticated users to access puzzle and MCQ solver pages
    if (token && (pathname.startsWith("/puzzle") || pathname.startsWith("/mcq"))) {
        return NextResponse.next();
    }

    // Redirect root and other non-CRM routes
    if (!pathname.startsWith("/crm") && !pathname.startsWith("/api")) {
        if (token) {
            const role = (token.role as string || "").toUpperCase();
            if (role === "COACH") return NextResponse.redirect(new URL("/crm/coach-dashboard", req.url));
            if (role === "STUDENT") return NextResponse.redirect(new URL("/crm/student-dashboard", req.url));
            return NextResponse.redirect(new URL("/crm/dashboard", req.url));
        }
        return NextResponse.redirect(new URL("/crm/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|aim-logo.jpeg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)" ],
};
