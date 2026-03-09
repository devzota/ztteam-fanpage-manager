import { NextRequest, NextResponse } from "next/server";
import { ztteam_verifyToken } from "@/lib/ztteam_auth";

/** Các path không cần auth */
const ZTTEAM_PUBLIC_PATHS = ["/login", "/api/ztteam-auth/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /** Cho phép truy cập public paths */
  if (ZTTEAM_PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  /** Kiểm tra token trong cookie */
  const token = request.cookies.get("ztteam_session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const session = await ztteam_verifyToken(token);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
