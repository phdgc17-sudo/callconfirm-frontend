import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const communitySchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  premium: z.boolean().optional()
});

export const serverSchema = z.object({
  communityId: z.string(),
  name: z.string().min(2),
  description: z.string().min(10),
  joinMethod: z.string().min(2),
  state: z.string().optional(),
  type: z.enum(["public", "private"]),
  language: z.string().min(2),
  tags: z.string().optional()
});

export const announcementSchema = z.object({
  communityId: z.string(),
  title: z.string().min(2),
  body: z.string().min(5)
});

export const applicationTemplateSchema = z.object({
  communityId: z.string(),
  title: z.string().min(2),
  questions: z.string().min(2)
});

export const applicationSubmitSchema = z.object({
  applicationId: z.string(),
  applicantName: z.string().min(2),
  responses: z.string().min(2)
});

export const memberAssignSchema = z.object({
  communityId: z.string(),
  userId: z.string(),
  role: z.enum(["OWNER", "ADMIN", "MODERATOR", "DISPATCHER", "OFFICER", "MEMBER"])
});

export const civilianSchema = z.object({
  communityId: z.string(),
  name: z.string().min(2),
  dob: z.string().optional(),
  notes: z.string().optional()
});

export const citationSchema = z.object({
  communityId: z.string(),
  civilianId: z.string(),
  officer: z.string().min(2),
  violation: z.string().min(2),
  fine: z.string().optional()
});

export const incidentSchema = z.object({
  communityId: z.string(),
  title: z.string().min(2),
  summary: z.string().min(2)
});

export const vehicleSchema = z.object({
  communityId: z.string(),
  civilianId: z.string(),
  plate: z.string().min(2),
  makeModel: z.string().min(2),
  color: z.string().min(2)
});

export const arrestSchema = z.object({
  communityId: z.string(),
  civilianId: z.string(),
  officer: z.string().min(2),
  charges: z.string().min(2)
});

export const boloSchema = z.object({
  communityId: z.string(),
  subject: z.string().min(2),
  description: z.string().min(2),
  status: z.string().min(2)
});

export const sessionSchema = z.object({
  communityId: z.string(),
  name: z.string().min(2),
  status: z.string().min(2),
  activeUnits: z.string().optional()
});

export const dispatchCallSchema = z.object({
  communityId: z.string(),
  description: z.string().min(2),
  status: z.string().min(2)
});

export const auditSchema = z.object({
  communityId: z.string(),
  action: z.string().min(2)
});

export const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email()
});
