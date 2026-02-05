import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken } from "@/lib/auth";
import { parseRequest } from "@/lib/request";
import { signupSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await parseRequest(request, signupSchema);
  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }
  const passwordHash = await hashPassword(body.password);
  const user = await prisma.user.create({
    data: { name: body.name, email: body.email, passwordHash }
  });
  const token = await createSessionToken(user.id);
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.headers.set("Set-Cookie", `session=${token}; Path=/; HttpOnly; SameSite=Lax`);
  return response;
}
