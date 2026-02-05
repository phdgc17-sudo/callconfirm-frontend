import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "If an account exists, a reset token was created." });
  }
  const token = crypto.randomUUID();
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30)
    }
  });
  return NextResponse.json({ message: "Reset token generated", token });
}
