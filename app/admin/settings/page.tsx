import { getAdminIdFromSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  if (!(await getAdminIdFromSession())) redirect("/admin/login");
  const [branches, settings, logs] = await Promise.all([prisma.branch.findMany(), prisma.setting.findMany(), prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 })]);
  return <div className="space-y-4"><div className="card"><h1 className="text-2xl font-bold">Branch Settings</h1><pre className="text-xs">{JSON.stringify(branches,null,2)}</pre></div><div className="card"><h2 className="text-xl">Global Settings & Recent Activity</h2><pre className="text-xs">{JSON.stringify({settings, logs},null,2)}</pre></div></div>;
}
