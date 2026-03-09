import { NextResponse } from "next/server";
import { ztteam_getSession } from "@/lib/ztteam_auth";

/** GET — Kiểm tra session hiện tại */
export async function GET() {
  const session = await ztteam_getSession();

  if (!session) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: session,
  });
}
