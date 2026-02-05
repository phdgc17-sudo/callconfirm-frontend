import { prisma } from "@/lib/prisma";

export async function logAudit({ communityId, actorId, action }: { communityId: string; actorId: string; action: string }) {
  return prisma.auditLog.create({
    data: {
      communityId,
      actorId,
      action
    }
  });
}
