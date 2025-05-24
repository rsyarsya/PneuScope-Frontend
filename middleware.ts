import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/auth" || path === "/auth/register"

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value || ""

  // Redirect to auth if accessing a protected route without a token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  // Redirect to appropriate dashboard if accessing auth pages with a valid token
  if ((path === "/auth" || path === "/auth/register") && token) {
    // We can't decode the token here easily, so we'll redirect to a generic dashboard
    // The actual role-based routing will be handled in the auth page
    return NextResponse.redirect(new URL("/dashboard/doctor", request.url))
  }

  return NextResponse.next()
}

// Configure the paths that middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
