"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/Toast";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/users/me");
      const data = await res.json();
      if (data.user) {
        setName(data.user.name);
        setEmail(data.user.email);
      }
    };
    load();
  }, []);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });
    setStatus(response.ok ? "Profile updated." : "Unable to update profile.");
  };

  return (
    <div className="px-4 py-8 lg:px-8">
      <Toast message={status} onClear={() => setStatus("")} />
      <h1 className="text-2xl font-semibold">Player Profile</h1>
      <p className="text-sm text-slate-400">Update your player identity for roster visibility.</p>
      <form className="mt-6 card space-y-3 max-w-lg" onSubmit={handleSave}>
        <label className="text-xs uppercase tracking-wide text-slate-400">Display name</label>
        <input value={name} onChange={(event) => setName(event.target.value)} required />
        <label className="text-xs uppercase tracking-wide text-slate-400">Email</label>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        <button className="bg-accent text-black" type="submit">Save profile</button>
      </form>
    </div>
  );
}
