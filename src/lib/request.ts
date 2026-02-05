import { z } from "zod";

export async function parseRequest<T>(request: Request, schema: z.ZodSchema<T>) {
  let data: Record<string, unknown> = {};
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    data = await request.json();
  } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    data = Object.fromEntries(formData.entries());
  }
  return schema.parse(data);
}
