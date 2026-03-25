import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-navy-800 bg-navy-950/95">
          <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <Link href="/" className="font-semibold tracking-widest text-accent">US ARMED FORCES ROLEPLAY</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/public/enlistment">Enlistment</Link>
              <Link href="/public/marines">Marines</Link>
              <Link href="/public/navy">Navy</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/admin/login">Admin</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto min-h-[calc(100vh-120px)] max-w-6xl p-6">{children}</main>
        <footer className="border-t border-navy-800 px-6 py-5 text-center text-sm text-steel">Command Recruitment Portal • Replace branding in settings.</footer>
      </body>
    </html>
  );
}
