import Link from "next/link";

export default function Topbar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/30 px-4 py-4 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-widest text-slate-400">ERLC Hub</p>
        <h1 className="text-xl font-semibold">Command Dashboard</h1>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/servers"
          className="rounded-full border border-accent px-4 py-2 text-xs font-semibold text-accent hover:bg-accent hover:text-black"
        >
          Browse Servers
        </Link>
        <Link
          href="/admin"
          className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-black hover:bg-accent/80"
        >
          Create Community
        </Link>
      </div>
    </header>
  );
}
