import { NextResponse } from "next/server";
import { getAdminIdFromSession } from "@/lib/auth";

export async function requireAdmin() {
  const adminId = await getAdminIdFromSession();
  if (!adminId) return { adminId: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return { adminId, response: null };
}
