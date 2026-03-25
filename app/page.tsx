import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [branches, announcements, links] = await Promise.all([
    prisma.branch.findMany(),
    prisma.announcement.findMany({ where: { visible: true }, take: 4, orderBy: { createdAt: "desc" } }),
    prisma.link.findMany({ where: { visible: true, category: "GAME" }, take: 4, orderBy: { sortOrder: "asc" } })
  ]);

  return (
    <div className="space-y-8">
      <section className="card bg-gradient-to-br from-navy-900 to-navy-800">
        <h1 className="text-4xl font-bold">United States Marines & Navy Enlistment Command</h1>
        <p className="mt-3 text-steel">Professional Roblox military recruitment platform with secure verification and command oversight.</p>
        <Link href="/public/enlistment" className="mt-6 inline-block rounded bg-accent px-5 py-2 font-semibold text-black">Start Enlistment</Link>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {branches.map((branch) => (
          <div key={branch.id} className="card">
            <h2 className="text-2xl font-semibold">{branch.name}</h2>
            <p className="mt-2 text-steel">{branch.description}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="card"><h3 className="text-xl font-semibold">Announcements</h3><ul className="mt-3 space-y-2">{announcements.map((a) => <li key={a.id}><p className="font-semibold">{a.title}</p><p className="text-sm text-steel">{a.body}</p></li>)}</ul></div>
        <div className="card"><h3 className="text-xl font-semibold">Featured Games</h3><ul className="mt-3 space-y-2">{links.map((l) => <li key={l.id}><a href={l.url} className="text-accent underline">{l.title}</a></li>)}</ul></div>
      </section>
    </div>
  );
}
