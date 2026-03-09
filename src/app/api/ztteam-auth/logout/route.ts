import { NextResponse } from "next/server";
import { ZTTEAM_COOKIE_NAME } from "@/lib/ztteam_auth";

/** POST — Đăng xuất */
export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logout successful",
  });

  response.cookies.set(ZTTEAM_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
