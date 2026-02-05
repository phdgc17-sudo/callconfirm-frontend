import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-slate-100">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">ERLC Hub</p>
          <h1 className="mt-3 text-3xl font-semibold">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">Start building your ER:LC community presence.</p>
        </div>
        <form className="card space-y-4" method="post" action="/api/auth/signup">
          <label className="block text-xs uppercase tracking-wide text-slate-400">Name</label>
          <input type="text" name="name" placeholder="Community Lead" required />
          <label className="block text-xs uppercase tracking-wide text-slate-400">Email</label>
          <input type="email" name="email" placeholder="you@community.com" required />
          <label className="block text-xs uppercase tracking-wide text-slate-400">Password</label>
          <input type="password" name="password" placeholder="Create a strong password" required />
          <button className="w-full bg-accent text-black hover:bg-accent/80" type="submit">
            Create account
          </button>
        </form>
        <div className="text-xs text-slate-400">
          Already have an account? <Link href="/auth/login" className="hover:text-accent">Sign in</Link>
        </div>
      </div>
    </main>
  );
}
