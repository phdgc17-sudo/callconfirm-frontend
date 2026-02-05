import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "ERLC Hub",
  description: "Community platform for ER:LC roleplay servers."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-slate-100">
        {children}
      </body>
    </html>
  );
}
