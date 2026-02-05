import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";

export default function DashboardPage() {
  return (
    <div>
      <Topbar />
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 pt-6 lg:px-8">
        <div>
          <h2 className="text-lg font-semibold">Community overview</h2>
          <p className="text-sm text-slate-400">Select a community to manage.</p>
        </div>
        <select className="min-w-[220px]">
          <option>My primary community</option>
        </select>
      </div>
      <section className="grid gap-6 px-4 py-6 lg:px-8 lg:grid-cols-3">
        <StatCard label="Members" value="0" helper="Sync with your community roster" />
        <StatCard label="Active sessions" value="0" helper="Dispatch polling every 10s" />
        <StatCard label="Pending apps" value="0" helper="Review staff applications" />
      </section>
      <section className="grid gap-6 px-4 pb-10 lg:grid-cols-2 lg:px-8">
        <div className="card">
          <h2 className="text-lg font-semibold">Recent announcements</h2>
          <p className="mt-2 text-sm text-slate-400">No announcements yet. Create one from the admin panel.</p>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold">Recent moderation logs</h2>
          <p className="mt-2 text-sm text-slate-400">Audit logs appear as actions are taken.</p>
        </div>
      </section>
    </div>
  );
}
