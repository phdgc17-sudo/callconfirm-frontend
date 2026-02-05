import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { memberAssignSchema } from "@/lib/validation";
import { parseRequest } from "@/lib/request";
import { requireRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET(request: Request, context: { params: { id: string } }) {
  const members = await prisma.communityMember.findMany({
    where: { communityId: context.params.id },
    include: { user: true }
  });
  return NextResponse.json({ members });
}

export async function POST(request: Request, context: { params: { id: string } }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const authorized = await requireRole(context.params.id, user.id, "ADMIN");
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await parseRequest(request, memberAssignSchema);
  if (body.communityId !== context.params.id) {
    return NextResponse.json({ error: "Community mismatch" }, { status: 400 });
  }
  const member = await prisma.communityMember.upsert({
    where: { communityId_userId: { communityId: body.communityId, userId: body.userId } },
    update: { role: body.role },
    create: {
      communityId: body.communityId,
      userId: body.userId,
      role: body.role
    }
  });
  await logAudit({ communityId: body.communityId, actorId: user.id, action: `Assigned role ${body.role} to user ${body.userId}` });
  return NextResponse.json({ member }, { status: 201 });
}
