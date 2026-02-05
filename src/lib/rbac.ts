import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

const roleHierarchy: Role[] = [
  "OWNER",
  "ADMIN",
  "MODERATOR",
  "DISPATCHER",
  "OFFICER",
  "MEMBER"
];

export async function getUserRole(communityId: string, userId: string) {
  const membership = await prisma.communityMember.findUnique({
    where: { communityId_userId: { communityId, userId } }
  });
  return membership?.role ?? "MEMBER";
}

export function hasRole(required: Role, actual: Role) {
  return roleHierarchy.indexOf(actual) <= roleHierarchy.indexOf(required);
}

export async function requireRole(communityId: string, userId: string, required: Role) {
  const actual = await getUserRole(communityId, userId);
  return hasRole(required, actual);
}
