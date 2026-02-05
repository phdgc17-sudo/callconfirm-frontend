import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { announcementSchema } from "@/lib/validation";
import { parseRequest } from "@/lib/request";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ announcements });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await parseRequest(request, announcementSchema);
  const authorized = await requireRole(body.communityId, user.id, "MODERATOR");
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const announcement = await prisma.announcement.create({
    data: {
      communityId: body.communityId,
      title: body.title,
      body: body.body
    }
  });
  await logAudit({ communityId: body.communityId, actorId: user.id, action: "Created announcement" });
  return NextResponse.json({ announcement }, { status: 201 });
}
