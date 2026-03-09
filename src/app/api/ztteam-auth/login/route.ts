import { NextRequest, NextResponse } from "next/server";
import {
  ztteam_validateCredentials,
  ztteam_createToken,
  ZTTEAM_COOKIE_NAME,
} from "@/lib/ztteam_auth";

/** POST — Đăng nhập admin */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    if (!ztteam_validateCredentials(username, password)) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = await ztteam_createToken(username);

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set(ZTTEAM_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("ZTTeam Login Error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
