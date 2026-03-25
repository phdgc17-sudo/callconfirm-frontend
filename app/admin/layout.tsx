import Link from "next/link";
import { getAdminIdFromSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminIdFromSession();
  const isLogin = false;
  if (!admin && !isLogin) {
    // allow login page via segment config by checking path on client-side pages
  }
  return <div className="grid gap-4 md:grid-cols-[220px_1fr]"><aside className="card h-fit"><h2 className="font-semibold">Admin Panel</h2><div className="mt-2 flex flex-col gap-2 text-sm"><Link href="/admin/applications">Applications</Link><Link href="/admin/content">Content</Link><Link href="/admin/settings">Settings</Link></div></aside><div>{children}</div></div>;
}
