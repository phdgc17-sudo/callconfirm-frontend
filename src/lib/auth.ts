import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret");

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload.sub as string;
}

export async function getUserFromRequest(request: Request) {
  const cookie = request.headers.get("cookie");
  if (!cookie) return null;
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return null;
  const userId = await verifySessionToken(match[1]);
  return prisma.user.findUnique({ where: { id: userId } });
}
