import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { civilianSchema } from "@/lib/validation";
import { parseRequest } from "@/lib/request";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const civilians = await prisma.civilian.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ civilians });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await parseRequest(request, civilianSchema);
  const authorized = await requireRole(body.communityId, user.id, "MEMBER");
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const civilian = await prisma.civilian.create({
    data: {
      communityId: body.communityId,
      name: body.name,
      dob: body.dob,
      notes: body.notes
    }
  });
  await logAudit({ communityId: body.communityId, actorId: user.id, action: `Created civilian ${civilian.name}` });
  return NextResponse.json({ civilian }, { status: 201 });
}
