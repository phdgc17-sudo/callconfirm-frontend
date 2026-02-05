"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/Toast";

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  createdAt: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/audit");
      const data = await res.json();
      setLogs(data.logs ?? []);
    };
    load();
  }, []);

  const handleLog = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/audit", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData.entries())),
      headers: { "Content-Type": "application/json" }
    });
    setStatus(response.ok ? "Log submitted." : "Unable to submit log.");
    event.currentTarget.reset();
  };

  return (
    <div className="px-4 py-8 lg:px-8">
      <Toast message={status} onClear={() => setStatus("")} />
      <h1 className="text-2xl font-semibold">Audit & Moderation Logs</h1>
      <p className="text-sm text-slate-400">Track key actions across your community.</p>

      <form className="mt-6 card space-y-3" onSubmit={handleLog}>
        <h2 className="text-lg font-semibold">Manual log entry</h2>
        <input name="communityId" placeholder="Community ID" required />
        <textarea name="action" placeholder="Action details" rows={2} required />
        <button className="bg-accent text-black" type="submit">Log action</button>
        {status ? <p className="text-xs text-slate-400">{status}</p> : null}
      </form>

      <div className="mt-6 card">
        {logs.length === 0 ? (
          <p className="text-sm text-slate-400">No logs yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Actor</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.action}</td>
                  <td>{log.actor}</td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
