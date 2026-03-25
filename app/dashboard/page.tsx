import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/auth";

export default async function Dashboard() {
  const userId = await getUserIdFromSession();
  if (!userId) return <div className="card">Connect Roblox through enlistment first.</div>;
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { robloxAccount: true, applications: { include: { branch: true }, orderBy: { createdAt: "desc" } } } });
  const announcements = await prisma.announcement.findMany({ where: { visible: true }, take: 4, orderBy: { createdAt: "desc" } });
  const links = await prisma.link.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } });
  if (!user) return <div className="card">User missing.</div>;

  return <div className="space-y-4">
    <div className="card"><h1 className="text-3xl font-bold">Recruit Dashboard</h1><p>{user.displayName} • {user.robloxAccount?.robloxUsername}</p>{user.robloxAccount?.avatarUrl && <img src={user.robloxAccount.avatarUrl} className="mt-2 h-24 w-24 rounded" />}</div>
    <div className="card"><h2 className="text-xl">Application Status</h2>{user.applications.map((a)=><p key={a.id}>{a.branch.name}: {a.status}</p>)}</div>
    <div className="card"><h2 className="text-xl">Announcements</h2>{announcements.map((a)=><p key={a.id}>{a.title}</p>)}</div>
    <div className="card"><h2 className="text-xl">Approved Resources</h2>{links.map((l)=><a className="mr-3 underline text-accent" key={l.id} href={l.url}>{l.title}</a>)}</div>
  </div>;
}
