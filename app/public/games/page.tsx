import { prisma } from "@/lib/prisma";

export default async function InfoPage() {
  const branches = await prisma.branch.findMany();
  const links = await prisma.link.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } });
  return <div className="card"><h1 className="text-3xl font-bold capitalize">games</h1><p className="mt-3 text-steel">This section is managed from admin content panels.</p><pre className="mt-4 overflow-auto text-xs">{JSON.stringify({ branches, links }, null, 2)}</pre></div>;
}
