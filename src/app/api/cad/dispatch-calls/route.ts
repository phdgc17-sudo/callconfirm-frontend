import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dispatchCallSchema } from "@/lib/validation";
import { parseRequest } from "@/lib/request";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const calls = await prisma.dispatchCall.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ calls });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await parseRequest(request, dispatchCallSchema);
  const authorized = await requireRole(body.communityId, user.id, "DISPATCHER");
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const call = await prisma.dispatchCall.create({
    data: {
      communityId: body.communityId,
      description: body.description,
      status: body.status
    }
  });
  await logAudit({ communityId: body.communityId, actorId: user.id, action: `Logged dispatch call ${call.id}` });
  return NextResponse.json({ call }, { status: 201 });
}
