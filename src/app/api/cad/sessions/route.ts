import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionSchema } from "@/lib/validation";
import { parseRequest } from "@/lib/request";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const sessions = await prisma.session.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ sessions });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await parseRequest(request, sessionSchema);
  const authorized = await requireRole(body.communityId, user.id, "DISPATCHER");
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const session = await prisma.session.create({
    data: {
      communityId: body.communityId,
      name: body.name,
      status: body.status,
      activeUnits: body.activeUnits ? Number(body.activeUnits) : 0
    }
  });
  await logAudit({ communityId: body.communityId, actorId: user.id, action: `Created session ${session.id}` });
  return NextResponse.json({ session }, { status: 201 });
}
