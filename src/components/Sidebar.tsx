import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Player Profile" },
  { href: "/servers", label: "Server Directory" },
  { href: "/cad", label: "CAD Tools" },
  { href: "/applications", label: "Applications" },
  { href: "/audit", label: "Audit Logs" },
  { href: "/admin", label: "Community Admin" }
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:gap-6 lg:border-r lg:border-border lg:bg-surface/40 lg:p-6">
      <div>
        <p className="text-lg font-semibold">ERLC Hub</p>
        <p className="text-xs text-slate-400">Operations Center</p>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-accentMuted hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto text-xs text-slate-500">
        Premium tier ready • Feature flags enabled
      </div>
    </aside>
  );
}
