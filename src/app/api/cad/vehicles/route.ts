import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { vehicleSchema } from "@/lib/validation";
import { parseRequest } from "@/lib/request";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ vehicles });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await parseRequest(request, vehicleSchema);
  const authorized = await requireRole(body.communityId, user.id, "MEMBER");
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const vehicle = await prisma.vehicle.create({
    data: {
      communityId: body.communityId,
      civilianId: body.civilianId,
      plate: body.plate,
      makeModel: body.makeModel,
      color: body.color
    }
  });
  await logAudit({ communityId: body.communityId, actorId: user.id, action: `Registered vehicle ${vehicle.plate}` });
  return NextResponse.json({ vehicle }, { status: 201 });
}
