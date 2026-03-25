import { z } from "zod";

export const connectRobloxSchema = z.object({ username: z.string().min(3).max(20) });
export const verifyRobloxSchema = z.object({ branchId: z.string().cuid() });

export const applicationSchema = z.object({
  branchId: z.string().cuid(),
  displayName: z.string().min(2),
  timezone: z.string().min(2),
  ageConfirmed: z.boolean(),
  priorExperience: z.string().min(10),
  reasonForJoining: z.string().min(20),
  activityLevel: z.string().min(3),
  additionalNotes: z.string().max(2000).optional()
});

export const adminLoginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
export const statusSchema = z.object({ applicationId: z.string().cuid(), status: z.enum(["PENDING", "VERIFIED", "INTERVIEWING", "ACCEPTED", "DENIED"]), adminNotes: z.string().optional() });
export const linkSchema = z.object({ title: z.string().min(2), url: z.string().url(), category: z.enum(["GAME", "GROUP", "TRAINING", "DISCORD", "COMMUNITY", "CUSTOM"]), branchId: z.string().cuid().optional(), visible: z.boolean(), sortOrder: z.number().int() });
export const announcementSchema = z.object({ title: z.string().min(3), body: z.string().min(3), visible: z.boolean() });
