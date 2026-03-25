import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { statusSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;
  const query = new URL(request.url).searchParams.get("q") || "";
  const applications = await prisma.application.findMany({
    where: { OR: [{ robloxUsername: { contains: query, mode: "insensitive" } }, { status: { equals: query as any } }] },
    include: { branch: true, user: true }, orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ applications });
}

export async function PATCH(req: Request) {
  const { adminId, response } = await requireAdmin();
  if (response || !adminId) return response!;
  const parsed = statusSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const updated = await prisma.application.update({ where: { id: parsed.data.applicationId }, data: { status: parsed.data.status, adminNotes: parsed.data.adminNotes } });
  await prisma.auditLog.create({ data: { adminUserId: adminId, action: "STATUS_CHANGE", entityType: "application", entityId: updated.id, details: `Changed to ${updated.status}` } });
  return NextResponse.json({ updated });
}
