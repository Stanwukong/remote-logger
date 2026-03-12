// /middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Pre-launch middleware — gates all routes behind the waitlist.
 * Only the waitlist page (/) and its API route are accessible.
 * Auth pages (/login, /signup) show the EarlyAccessGate component
 * instead of redirecting, for a better UX.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow: root (waitlist page), auth pages (show gate component), and API routes
  const allowedPaths = ["/", "/login", "/signup"];
  if (allowedPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Everything else → redirect to waitlist page
  return NextResponse.redirect(new URL("/", request.url));
}

/**
 * Middleware Matcher Configuration.
 * Matches all paths except static assets and API routes.
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
