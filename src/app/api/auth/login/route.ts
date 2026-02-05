import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, verifyPassword } from "@/lib/auth";
import { parseRequest } from "@/lib/request";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await parseRequest(request, loginSchema);
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const valid = await verifyPassword(body.password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = await createSessionToken(user.id);
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.headers.set("Set-Cookie", `session=${token}; Path=/; HttpOnly; SameSite=Lax`);
  return response;
}
