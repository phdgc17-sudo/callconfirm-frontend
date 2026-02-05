import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { parseRequest } from "@/lib/request";
import { auditSchema } from "@/lib/validation";
import { requireRole } from "@/lib/rbac";

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  });
  return NextResponse.json({ logs });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await parseRequest(request, auditSchema);
  const authorized = await requireRole(body.communityId, user.id, "MODERATOR");
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const log = await prisma.auditLog.create({
    data: {
      communityId: body.communityId,
      actorId: user.id,
      action: body.action
    }
  });
  return NextResponse.json({ log }, { status: 201 });
}
