import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { communitySchema } from "@/lib/validation";
import { parseRequest } from "@/lib/request";
import { getUserFromRequest } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const communities = await prisma.community.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ communities });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await parseRequest(request, communitySchema);
  const community = await prisma.community.create({
    data: {
      name: body.name,
      description: body.description,
      premium: Boolean(body.premium),
      members: {
        create: {
          userId: user.id,
          role: "OWNER"
        }
      }
    }
  });
  await logAudit({ communityId: community.id, actorId: user.id, action: "Created community" });
  return NextResponse.json({ community }, { status: 201 });
}
