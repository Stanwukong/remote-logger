// /middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware for Authentication.
 * * This middleware protects all routes except for the landing page,
 * sign-in, and sign-up pages. It checks for a user's authentication
 * token (or session) and redirects them accordingly.
 */
export async function middleware(request: NextRequest) {
  const publicPaths = ["/", "/login", "/signup", "/sdk"];
  const authPaths = ["/login", "/signup"];

  // 2. Check if the current path is a public path or auth path.
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);
  const isAuthPath = authPaths.includes(request.nextUrl.pathname);

  // 3. Get the authentication token from cookies.
  const token = request.cookies.get("authToken");

  // 4. If a user is NOT authenticated (no token)...
  if (!token) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // 5. User is authenticated — redirect away from auth pages
  if (isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

/**
 * Middleware Matcher Configuration.
 * * This object defines which paths the middleware should run on. The regex
 * below matches all paths except for:
 * - API routes (`/api/`)
 * - `_next/` static files and internal Next.js paths
 * - `_next/static/` (specific static files)
 * - `_next/image/` (Next.js image optimization)
 * - Files with extensions (e.g., `favicon.ico`)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - /api (API routes)
     * - /_next/static (static files)
     * - /_next/image (image optimization files)
     * - /favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
