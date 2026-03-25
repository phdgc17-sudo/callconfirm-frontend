import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { linkSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const links = await prisma.link.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ links });
}

export async function POST(req: Request) {
  const { adminId, response } = await requireAdmin();
  if (response || !adminId) return response!;
  const parsed = linkSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const created = await prisma.link.create({ data: parsed.data });
  await prisma.auditLog.create({ data: { adminUserId: adminId, action: "CREATE", entityType: "link", entityId: created.id, details: created.title } });
  return NextResponse.json({ created });
}
