export default function ResetPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-slate-100">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">ERLC Hub</p>
          <h1 className="mt-3 text-3xl font-semibold">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email to receive a reset link.
          </p>
        </div>
        <form className="card space-y-4" method="post" action="/api/auth/reset-request">
          <label className="block text-xs uppercase tracking-wide text-slate-400">Email</label>
          <input type="email" name="email" placeholder="you@community.com" required />
          <button className="w-full bg-accent text-black hover:bg-accent/80" type="submit">
            Send reset email
          </button>
        </form>
        <form className="card space-y-4" method="post" action="/api/auth/reset">
          <label className="block text-xs uppercase tracking-wide text-slate-400">Reset Token</label>
          <input type="text" name="token" placeholder="Paste token" required />
          <label className="block text-xs uppercase tracking-wide text-slate-400">New Password</label>
          <input type="password" name="password" placeholder="New password" required />
          <button className="w-full border border-accent text-accent hover:bg-accent hover:text-black" type="submit">
            Update password
          </button>
        </form>
      </div>
    </main>
  );
}
