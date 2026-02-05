import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { incidentSchema } from "@/lib/validation";
import { parseRequest } from "@/lib/request";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const reports = await prisma.incidentReport.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ reports });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await parseRequest(request, incidentSchema);
  const authorized = await requireRole(body.communityId, user.id, "OFFICER");
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const report = await prisma.incidentReport.create({
    data: {
      communityId: body.communityId,
      title: body.title,
      summary: body.summary
    }
  });
  await logAudit({ communityId: body.communityId, actorId: user.id, action: `Logged incident ${report.id}` });
  return NextResponse.json({ report }, { status: 201 });
}
