import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { announcementSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const rows = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ announcements: rows });
}

export async function POST(req: Request) {
  const { adminId, response } = await requireAdmin();
  if (response || !adminId) return response!;
  const parsed = announcementSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const created = await prisma.announcement.create({ data: parsed.data });
  await prisma.auditLog.create({ data: { adminUserId: adminId, action: "CREATE", entityType: "announcement", entityId: created.id, details: created.title } });
  return NextResponse.json({ created });
}
