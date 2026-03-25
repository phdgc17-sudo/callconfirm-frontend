import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRobloxSchema } from "@/lib/validators";
import { getUserIdFromSession } from "@/lib/auth";
import { verifyMembership, verifyProfileCode } from "@/lib/roblox";

export async function POST(req: Request) {
  const parsed = verifyRobloxSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const userId = await getUserIdFromSession();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [account, branch] = await Promise.all([
    prisma.robloxAccount.findUnique({ where: { userId } }),
    prisma.branch.findUnique({ where: { id: parsed.data.branchId } })
  ]);
  if (!account || !branch) return NextResponse.json({ error: "Missing setup" }, { status: 400 });
  const ownsAccount = account.verificationCode ? await verifyProfileCode(account.robloxUserId, account.verificationCode) : false;
  const groupVerified = await verifyMembership(branch.requiredGroupId, account.robloxUserId);
  const verified = ownsAccount && groupVerified;
  await prisma.robloxAccount.update({ where: { userId }, data: { verificationStatus: verified, verifiedAt: verified ? new Date() : null } });
  return NextResponse.json({ verified, ownsAccount, groupVerified, requiredGroupId: branch.requiredGroupId, joinGroupUrl: branch.joinGroupUrl });
}
