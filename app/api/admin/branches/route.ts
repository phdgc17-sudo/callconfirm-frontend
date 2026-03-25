import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ branches });
}

export async function PATCH(req: Request) {
  const { adminId, response } = await requireAdmin();
  if (response || !adminId) return response!;
  const payload = await req.json() as { id: string; requiredGroupId?: number; joinGroupUrl?: string; enlistmentOpen?: boolean; requirementsText?: string };
  const updated = await prisma.branch.update({ where: { id: payload.id }, data: payload });
  await prisma.auditLog.create({ data: { adminUserId: adminId, action: "UPDATE", entityType: "branch", entityId: updated.id, details: "Updated branch settings" } });
  return NextResponse.json({ updated });
}
