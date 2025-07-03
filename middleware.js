import { getCookie } from "cookies-next";
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = getCookie("token", { req });

  const protectedRoutes = ["/me", "/new", "/edit"];

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/auth", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/new/:path*", "/me/:path*", "/edit/:path*"],
};
