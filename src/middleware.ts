// src/middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig); // Gunakan config yang ringan

export default auth((req) => {
  const isLoggedin = !!req.auth;
  const user = req.auth?.user as any;
  const role = user?.role;
  const { nextUrl } = req;

  // Jika belum login dan coba akses admin
  if (!isLoggedin && nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Aturan Role
  if (isLoggedin && role === "ADMIN" && nextUrl.pathname.startsWith("/admin")) {
    if (!nextUrl.pathname.startsWith("/admin/portofolio")) {
      return NextResponse.redirect(new URL("/admin/portofolio", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
