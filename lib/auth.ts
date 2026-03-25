import { cookies } from "next/headers";
import { randomBytes, createHmac } from "crypto";

const USER_COOKIE = "cc_user";
const ADMIN_COOKIE = "cc_admin";
const secret = process.env.SESSION_SECRET || "dev-secret-change-me";

function sign(value: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export async function setUserSession(userId: string) {
  const payload = `${userId}.${randomBytes(6).toString("hex")}`;
  const token = `${payload}.${sign(payload)}`;
  (await cookies()).set(USER_COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/" });
}

export async function getUserIdFromSession() {
  const raw = (await cookies()).get(USER_COOKIE)?.value;
  if (!raw) return null;
  const parts = raw.split(".");
  const payload = parts.slice(0, -1).join(".");
  const sig = parts[parts.length - 1];
  if (sign(payload) !== sig) return null;
  return payload.split(".")[0] || null;
}

export async function clearUserSession() {
  (await cookies()).delete(USER_COOKIE);
}

export async function setAdminSession(adminId: string) {
  const payload = `${adminId}.${randomBytes(6).toString("hex")}`;
  const token = `${payload}.${sign(payload)}`;
  (await cookies()).set(ADMIN_COOKIE, token, { httpOnly: true, secure: true, sameSite: "strict", path: "/" });
}

export async function getAdminIdFromSession() {
  const raw = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!raw) return null;
  const parts = raw.split(".");
  const payload = parts.slice(0, -1).join(".");
  const sig = parts[parts.length - 1];
  if (sign(payload) !== sig) return null;
  return payload.split(".")[0] || null;
}
