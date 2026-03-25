import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validators";
import { getUserIdFromSession } from "@/lib/auth";
import { verifyMembership } from "@/lib/roblox";

export async function POST(req: Request) {
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = applicationSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const [account, branch] = await Promise.all([
    prisma.robloxAccount.findUnique({ where: { userId } }),
    prisma.branch.findUnique({ where: { id: parsed.data.branchId } })
  ]);
  if (!account || !branch || !branch.enlistmentOpen) return NextResponse.json({ error: "Branch unavailable" }, { status: 400 });
  const stillMember = await verifyMembership(branch.requiredGroupId, account.robloxUserId);
  if (!stillMember) return NextResponse.json({ error: "Join required branch group first." }, { status: 403 });

  await prisma.user.update({ where: { id: userId }, data: { displayName: parsed.data.displayName, timezone: parsed.data.timezone } });
  await prisma.application.create({ data: { userId, branchId: parsed.data.branchId, robloxUsername: account.robloxUsername, robloxUserId: account.robloxUserId, ageConfirmed: parsed.data.ageConfirmed, priorExperience: parsed.data.priorExperience, reasonForJoining: parsed.data.reasonForJoining, activityLevel: parsed.data.activityLevel, additionalNotes: parsed.data.additionalNotes } });
  return NextResponse.json({ message: "Application submitted." });
}
