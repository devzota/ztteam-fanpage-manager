import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const ZTTEAM_COOKIE_NAME = "ztteam_session";

/** Lấy secret key dạng Uint8Array cho jose */
function ztteam_getSecretKey(): Uint8Array {
  const secret = process.env.ZTTEAM_AUTH_SECRET || "fallback-secret";
  return new TextEncoder().encode(secret);
}

/** Tạo JWT token */
export async function ztteam_createToken(username: string): Promise<string> {
  const token = await new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(ztteam_getSecretKey());

  return token;
}

/** Verify JWT token */
export async function ztteam_verifyToken(
  token: string
): Promise<{ username: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, ztteam_getSecretKey());
    return payload as { username: string; role: string };
  } catch {
    return null;
  }
}

/** Kiểm tra credentials admin */
export function ztteam_validateCredentials(
  username: string,
  password: string
): boolean {
  const adminUsername = process.env.ZTTEAM_ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ZTTEAM_ADMIN_PASSWORD || "admin";

  return username === adminUsername && password === adminPassword;
}

/** Lấy session từ cookie */
export async function ztteam_getSession(): Promise<{
  username: string;
  role: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ZTTEAM_COOKIE_NAME)?.value;

  if (!token) return null;
  return ztteam_verifyToken(token);
}

/** Tên cookie export cho API route dùng */
export { ZTTEAM_COOKIE_NAME };
