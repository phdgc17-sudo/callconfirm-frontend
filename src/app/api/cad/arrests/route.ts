import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { arrestSchema } from "@/lib/validation";
import { parseRequest } from "@/lib/request";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const arrests = await prisma.arrest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ arrests });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await parseRequest(request, arrestSchema);
  const authorized = await requireRole(body.communityId, user.id, "OFFICER");
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const arrest = await prisma.arrest.create({
    data: {
      communityId: body.communityId,
      civilianId: body.civilianId,
      officer: body.officer,
      charges: body.charges
    }
  });
  await logAudit({ communityId: body.communityId, actorId: user.id, action: `Logged arrest ${arrest.id}` });
  return NextResponse.json({ arrest }, { status: 201 });
}
