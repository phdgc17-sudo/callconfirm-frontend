import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverSchema } from "@/lib/validation";
import { parseRequest } from "@/lib/request";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const servers = await prisma.server.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ servers });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await parseRequest(request, serverSchema);
  const authorized = await requireRole(body.communityId, user.id, "ADMIN");
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const server = await prisma.server.create({
    data: {
      communityId: body.communityId,
      name: body.name,
      description: body.description,
      joinMethod: body.joinMethod,
      state: body.state,
      type: body.type,
      language: body.language,
      tags: body.tags ? body.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
      rules: ["Respect roleplay guidelines", "Follow dispatch instructions"],
      staffList: [
        { name: user.name, role: "Owner" }
      ]
    }
  });
  await logAudit({ communityId: body.communityId, actorId: user.id, action: "Created server listing" });
  return NextResponse.json({ server }, { status: 201 });
}
