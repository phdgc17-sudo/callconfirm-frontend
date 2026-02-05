import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-slate-100">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">ERLC Hub</p>
          <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage your community operations.</p>
        </div>
        <form className="card space-y-4" method="post" action="/api/auth/login">
          <label className="block text-xs uppercase tracking-wide text-slate-400">Email</label>
          <input type="email" name="email" placeholder="you@community.com" required />
          <label className="block text-xs uppercase tracking-wide text-slate-400">Password</label>
          <input type="password" name="password" placeholder="••••••••" required />
          <button className="w-full bg-accent text-black hover:bg-accent/80" type="submit">
            Sign in
          </button>
        </form>
        <div className="flex justify-between text-xs text-slate-400">
          <Link href="/auth/reset" className="hover:text-accent">Password reset</Link>
          <Link href="/auth/signup" className="hover:text-accent">Create account</Link>
        </div>
      </div>
    </main>
  );
}
