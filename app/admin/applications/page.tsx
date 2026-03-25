import { getAdminIdFromSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ApplicationsPage() {
  if (!(await getAdminIdFromSession())) redirect("/admin/login");
  const applications = await prisma.application.findMany({ include: { branch: true }, orderBy: { createdAt: "desc" } });
  return <div className="card"><h1 className="text-2xl font-bold">Applications</h1><table className="mt-3 w-full text-sm"><thead><tr><th>User</th><th>Branch</th><th>Status</th></tr></thead><tbody>{applications.map((a)=><tr key={a.id}><td>{a.robloxUsername} ({a.robloxUserId})</td><td>{a.branch.name}</td><td>{a.status}</td></tr>)}</tbody></table></div>;
}
