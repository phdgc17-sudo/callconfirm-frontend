import { getAdminIdFromSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ContentPage() {
  if (!(await getAdminIdFromSession())) redirect("/admin/login");
  const [links, announcements] = await Promise.all([prisma.link.findMany({ orderBy: { sortOrder: "asc" } }), prisma.announcement.findMany({ orderBy: { createdAt: "desc" } })]);
  return <div className="space-y-4"><div className="card"><h2 className="text-xl">Links</h2><pre className="text-xs">{JSON.stringify(links,null,2)}</pre></div><div className="card"><h2 className="text-xl">Announcements</h2><pre className="text-xs">{JSON.stringify(announcements,null,2)}</pre></div></div>;
}
