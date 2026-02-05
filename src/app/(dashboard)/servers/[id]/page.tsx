"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface ServerDetail {
  id: string;
  name: string;
  description: string;
  rules: string[];
  staffList: { name: string; role: string }[];
  joinMethod: string;
  tags: string[];
}

export default function ServerDetailPage() {
  const params = useParams();
  const [server, setServer] = useState<ServerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/servers/${params.id}`);
      const data = await res.json();
      setServer(data.server ?? null);
      setLoading(false);
    };
    load();
  }, [params.id]);

  if (loading) {
    return <p className="px-4 py-6 text-sm text-slate-400">Loading server...</p>;
  }

  if (!server) {
    return <p className="px-4 py-6 text-sm text-slate-400">Server not found.</p>;
  }

  return (
    <div className="px-4 py-8 lg:px-8">
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{server.name}</h1>
            <p className="mt-2 text-sm text-slate-300">{server.description}</p>
          </div>
          <button className="bg-accent text-black">Apply to join</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {server.tags.map((tag) => (
            <span key={tag} className="badge">{tag}</span>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold">Rules</h2>
            <ul className="mt-2 space-y-2 text-sm text-slate-300">
              {server.rules.map((rule) => (
                <li key={rule}>• {rule}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Staff list</h2>
            <ul className="mt-2 space-y-2 text-sm text-slate-300">
              {server.staffList.map((staff) => (
                <li key={staff.name}>
                  {staff.name} — <span className="text-slate-400">{staff.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-border bg-background p-4 text-sm text-slate-300">
          Join method: {server.joinMethod}
        </div>
      </div>
    </div>
  );
}
