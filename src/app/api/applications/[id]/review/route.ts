import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request, context: { params: { id: string } }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const formData = await request.formData();
  const status = formData.get("status")?.toString();
  const notes = formData.get("notes")?.toString();
  const response = await prisma.applicationResponse.findUnique({
    where: { id: context.params.id },
    include: { application: true }
  });
  if (!response) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const authorized = await requireRole(response.application.communityId, user.id, "MODERATOR");
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const updated = await prisma.applicationResponse.update({
    where: { id: context.params.id },
    data: {
      status: status ?? response.status,
      notes
    }
  });
  await logAudit({
    communityId: response.application.communityId,
    actorId: user.id,
    action: `Reviewed application ${response.id} - ${status}`
  });
  return NextResponse.json({ response: updated });
}
