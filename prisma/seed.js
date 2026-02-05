const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_EMAIL;
  const password = process.env.SEED_PASSWORD;
  if (!email || !password) {
    console.log("Skipping seed. Set SEED_EMAIL and SEED_PASSWORD to seed data.");
    return;
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Seed user already exists.");
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name: "Seed Admin",
      email,
      passwordHash
    }
  });
  await prisma.community.create({
    data: {
      name: "Seed Community",
      description: "Starter community for ERLC Hub",
      premium: true,
      members: {
        create: { userId: user.id, role: "OWNER" }
      }
    }
  });
  console.log("Seed data created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
