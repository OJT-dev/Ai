
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req: NextRequest) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
  }
)

// Protect all routes except public ones
export const config = {
  matcher: [
    "/chat/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/wellness/:path*",
    "/schedule/:path*",
    "/home/:path*",
    "/call/:path*",
    // Add more protected routes here
  ],
}
