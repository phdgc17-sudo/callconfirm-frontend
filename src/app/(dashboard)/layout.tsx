import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-slate-100 lg:flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
