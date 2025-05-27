import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/login" || path === "/register" || path === "/docs"

  // Get the token from the cookies (commented out for mock mode)
  // const token = request.cookies.get("token")?.value || ""

  // Redirect to login if accessing a protected route without a token (commented out for mock mode)
  // if (!isPublicPath && !token) {
  //   return NextResponse.redirect(new URL("/login", request.url))
  // }

  // Redirect to dashboard if accessing login/register with a valid token (commented out for mock mode)
  // if ((path === "/login" || path === "/register") && token) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url))
  // }

  return NextResponse.next()
}

// Configure the paths that middleware should run on
export const config = {
  matcher: ["/", "/login", "/register", "/dashboard", "/docs"],
}