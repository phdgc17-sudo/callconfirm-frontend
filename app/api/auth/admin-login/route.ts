import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/validators";
import { setAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  const parsed = adminLoginSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const admin = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (!admin || !(await bcrypt.compare(parsed.data.password, admin.passwordHash))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await setAdminSession(admin.id);
  return NextResponse.json({ ok: true });
}
