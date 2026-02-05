import Link from "next/link";

const features = [
  {
    title: "Server Directory",
    description: "List your ER:LC community, verify staff, and share join methods." 
  },
  {
    title: "CAD + Roleplay Tools",
    description: "Civilian identities, LEO records, dispatch call logs, and live session rosters." 
  },
  {
    title: "Applications + Moderation",
    description: "Custom application forms with approval workflows and audit logging." 
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-slate-100">
      <header className="border-b border-border bg-surface/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">ERLC Hub</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight lg:text-5xl">
              Modern operations center for ER:LC communities.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-300">
              Run your server directory, CAD tools, roleplay sessions, and moderation workflows
              with a single platform. Designed for builders, admins, and dispatch teams.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/servers"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black hover:bg-accent/80"
            >
              Browse Servers
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-full border border-accent px-6 py-3 text-sm font-semibold text-accent hover:bg-accent hover:text-black"
            >
              Create Community
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-12 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="card">
            <h2 className="text-lg font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="card grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div>
            <h3 className="text-xl font-semibold">Build your community with confidence.</h3>
            <p className="mt-3 text-sm text-slate-300">
              ERLC Hub includes RBAC, audit logs, announcements, and a plugin-based verification
              flow for servers without an official API. Everything runs on serverless routes with
              PostgreSQL + Prisma.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-400">
              <span className="badge">Role-based access</span>
              <span className="badge">Manual verification</span>
              <span className="badge">REST endpoints</span>
              <span className="badge">Premium-ready</span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Deploy ready</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li>• One-click deploy</li>
              <li>• Auth + password reset</li>
              <li>• Mobile-first UI</li>
              <li>• Manual server verification</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
