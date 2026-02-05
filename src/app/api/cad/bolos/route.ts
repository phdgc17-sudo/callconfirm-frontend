import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { boloSchema } from "@/lib/validation";
import { parseRequest } from "@/lib/request";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const bolos = await prisma.bolo.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ bolos });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await parseRequest(request, boloSchema);
  const authorized = await requireRole(body.communityId, user.id, "OFFICER");
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const bolo = await prisma.bolo.create({
    data: {
      communityId: body.communityId,
      subject: body.subject,
      description: body.description,
      status: body.status
    }
  });
  await logAudit({ communityId: body.communityId, actorId: user.id, action: `Created BOLO ${bolo.id}` });
  return NextResponse.json({ bolo }, { status: 201 });
}
