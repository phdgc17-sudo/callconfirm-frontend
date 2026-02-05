import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { citationSchema } from "@/lib/validation";
import { parseRequest } from "@/lib/request";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const citations = await prisma.citation.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ citations });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await parseRequest(request, citationSchema);
  const authorized = await requireRole(body.communityId, user.id, "OFFICER");
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const citation = await prisma.citation.create({
    data: {
      communityId: body.communityId,
      civilianId: body.civilianId,
      officer: body.officer,
      violation: body.violation,
      fine: body.fine ? Number(body.fine) : null
    }
  });
  await logAudit({ communityId: body.communityId, actorId: user.id, action: `Issued citation ${citation.id}` });
  return NextResponse.json({ citation }, { status: 201 });
}
