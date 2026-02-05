import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applicationTemplateSchema } from "@/lib/validation";
import { parseRequest } from "@/lib/request";
import { getUserFromRequest } from "@/lib/auth";
import { requireRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const applications = await prisma.applicationResponse.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ applications });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await parseRequest(request, applicationTemplateSchema);
  let questions;
  try {
    questions = JSON.parse(body.questions);
  } catch {
    return NextResponse.json({ error: "Invalid questions JSON" }, { status: 400 });
  }
  const authorized = await requireRole(body.communityId, user.id, "ADMIN");
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const form = await prisma.applicationForm.create({
    data: {
      communityId: body.communityId,
      title: body.title,
      questions
    }
  });
  await logAudit({ communityId: body.communityId, actorId: user.id, action: "Created application form" });
  return NextResponse.json({ form }, { status: 201 });
}
