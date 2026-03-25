import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const [settings, logs] = await Promise.all([prisma.setting.findMany(), prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 25 })]);
  return NextResponse.json({ settings, logs });
}

export async function PUT(req: Request) {
  const { adminId, response } = await requireAdmin();
  if (response || !adminId) return response!;
  const body = await req.json() as { key: string; value: string };
  const setting = await prisma.setting.upsert({ where: { key: body.key }, update: { value: body.value }, create: body });
  await prisma.auditLog.create({ data: { adminUserId: adminId, action: "UPSERT", entityType: "setting", entityId: setting.id, details: setting.key } });
  return NextResponse.json({ setting });
}
