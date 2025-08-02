// /middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Authentication.
 * * This middleware protects all routes except for the landing page,
 * sign-in, and sign-up pages. It checks for a user's authentication
 * token (or session) and redirects them accordingly.
 */
export async function middleware(request: NextRequest) {
  // 1. Define the public paths that do not require authentication.
  const publicPaths = ['/', '/login', '/signup', '/sdk'];

  // 2. Check if the current path is a public path.
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  // 3. Get the authentication token from cookies.
  //    The middleware runs on the server, so `window.localStorage` is not available.
  //    We must get the token from the request's cookies.
  const token = request.cookies.get('authToken');

  // 4. Handle redirection logic.
  //    If a user is authenticated (has a token)...
  if (token) {
    // ...and they try to access a public path, redirect them to a protected page
    // like the dashboard. This prevents authenticated users from seeing sign-in
    // or sign-up pages unnecessarily.
    if (isPublicPath) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // ...otherwise, they are authenticated and accessing a protected page,
    // so let the request proceed.
    return NextResponse.next();
  }

  //    If a user is NOT authenticated (no token)...
  if (!token) {
    // ...and they are trying to access a protected page, redirect them to the
    // sign-in page.
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // ...otherwise, they are not authenticated but are trying to access a
    // public page, so let the request proceed.
    return NextResponse.next();
  }
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
