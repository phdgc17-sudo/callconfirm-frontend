import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { connectRobloxSchema } from "@/lib/validators";
import { getRobloxAvatar, lookupRobloxUser } from "@/lib/roblox";
import { getUserIdFromSession, setUserSession } from "@/lib/auth";

export async function POST(req: Request) {
  const parsed = connectRobloxSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const roblox = await lookupRobloxUser(parsed.data.username);
  if (!roblox) return NextResponse.json({ error: "Roblox user not found" }, { status: 404 });
  const avatar = await getRobloxAvatar(roblox.id);
  const code = `CC-VERIFY-${randomUUID().slice(0, 8)}`;

  let userId = await getUserIdFromSession();
  if (!userId) {
    const user = await prisma.user.create({ data: { displayName: roblox.displayName, timezone: "UTC" } });
    userId = user.id;
    await setUserSession(userId);
  }

  await prisma.robloxAccount.upsert({
    where: { userId },
    update: { robloxUserId: roblox.id, robloxUsername: roblox.name, avatarUrl: avatar, verificationCode: code, verificationStatus: false },
    create: { userId, robloxUserId: roblox.id, robloxUsername: roblox.name, avatarUrl: avatar, verificationCode: code }
  });

  return NextResponse.json({ message: "Add verification code to Roblox profile description, then refresh verification.", verificationCode: code, robloxUserId: roblox.id, username: roblox.name });
}
