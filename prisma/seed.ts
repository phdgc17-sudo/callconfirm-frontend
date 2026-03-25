import { PrismaClient, BranchKey, LinkCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const marines = await prisma.branch.upsert({
    where: { key: BranchKey.MARINES },
    update: {},
    create: {
      key: BranchKey.MARINES,
      name: "US Marines",
      description: "Frontline expeditionary branch for disciplined infantry and assault operations.",
      requiredGroupId: 1234567,
      joinGroupUrl: "https://www.roblox.com/communities/1234567",
      requirementsText: "13+, microphone preferred, follow chain of command, complete recruit training."
    }
  });

  const navy = await prisma.branch.upsert({
    where: { key: BranchKey.NAVY },
    update: {},
    create: {
      key: BranchKey.NAVY,
      name: "US Navy",
      description: "Maritime and carrier operations with tactical coordination and support.",
      requiredGroupId: 7654321,
      joinGroupUrl: "https://www.roblox.com/communities/7654321",
      requirementsText: "13+, naval discipline, complete seamanship and fleet orientation."
    }
  });

  await prisma.link.createMany({
    data: [
      { title: "Marine Training Grounds", url: "https://www.roblox.com/games/111", category: LinkCategory.TRAINING, branchId: marines.id, sortOrder: 1 },
      { title: "Navy Fleet Ops", url: "https://www.roblox.com/games/222", category: LinkCategory.GAME, branchId: navy.id, sortOrder: 1 },
      { title: "Joint Discord", url: "https://discord.gg/replace-me", category: LinkCategory.DISCORD, sortOrder: 1 }
    ],
    skipDuplicates: true
  });

  await prisma.announcement.createMany({
    data: [
      { title: "Weekly Training Window", body: "Training pipeline opens Friday 2000 UTC for all recruits." },
      { title: "Command Bulletin", body: "Ensure your Roblox profile verification phrase remains visible until accepted." }
    ],
    skipDuplicates: true
  });

  const passwordHash = await bcrypt.hash("ChangeMeNow!123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash,
      name: "Command Admin"
    }
  });

  await prisma.setting.upsert({
    where: { key: "contact_email" },
    update: { value: "recruitment@example.com" },
    create: { key: "contact_email", value: "recruitment@example.com" }
  });
}

main().finally(async () => prisma.$disconnect());
