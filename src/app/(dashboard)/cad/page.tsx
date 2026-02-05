"use client";

import { useEffect, useState } from "react";

interface Session {
  id: string;
  name: string;
  status: string;
  activeUnits: number;
}

interface CallLog {
  id: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function CadPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [calls, setCalls] = useState<CallLog[]>([]);

  const loadDispatch = async () => {
    const [sessionRes, callRes] = await Promise.all([
      fetch("/api/cad/sessions"),
      fetch("/api/cad/dispatch-calls")
    ]);
    const sessionData = await sessionRes.json();
    const callData = await callRes.json();
    setSessions(sessionData.sessions ?? []);
    setCalls(callData.calls ?? []);
  };

  useEffect(() => {
    loadDispatch();
    const interval = setInterval(loadDispatch, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-semibold">CAD / Roleplay Tools</h1>
      <p className="text-sm text-slate-400">Civilian, law enforcement, and dispatch workflows.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <form className="card space-y-3" method="post" action="/api/cad/civilians">
          <h2 className="text-lg font-semibold">Civilian identity</h2>
          <input name="communityId" placeholder="Community ID" required />
          <input name="name" placeholder="Civilian name" required />
          <input name="dob" placeholder="DOB" />
          <textarea name="notes" rows={2} placeholder="Notes" />
          <button className="bg-accent text-black" type="submit">Create civilian</button>
        </form>
        <form className="card space-y-3" method="post" action="/api/cad/citations">
          <h2 className="text-lg font-semibold">Create citation</h2>
          <input name="communityId" placeholder="Community ID" required />
          <input name="civilianId" placeholder="Civilian ID" required />
          <input name="officer" placeholder="Officer" required />
          <input name="violation" placeholder="Violation" required />
          <input name="fine" placeholder="Fine" type="number" />
          <button className="bg-accent text-black" type="submit">Issue citation</button>
        </form>
        <form className="card space-y-3" method="post" action="/api/cad/incident-reports">
          <h2 className="text-lg font-semibold">Incident report</h2>
          <input name="communityId" placeholder="Community ID" required />
          <input name="title" placeholder="Report title" required />
          <textarea name="summary" rows={3} placeholder="Summary" required />
          <button className="bg-accent text-black" type="submit">Log report</button>
        </form>
        <form className="card space-y-3" method="post" action="/api/cad/dispatch-calls">
          <h2 className="text-lg font-semibold">Dispatch call</h2>
          <input name="communityId" placeholder="Community ID" required />
          <input name="description" placeholder="Call description" required />
          <select name="status">
            <option value="open">Open</option>
            <option value="in-progress">In progress</option>
            <option value="closed">Closed</option>
          </select>
          <button className="bg-accent text-black" type="submit">Log call</button>
        </form>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active sessions</h2>
            <span className="text-xs text-slate-400">Auto-refresh 10s</span>
          </div>
          {sessions.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No active sessions.</p>
          ) : (
            <table className="table mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Units</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td>{session.name}</td>
                    <td>{session.status}</td>
                    <td>{session.activeUnits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Dispatch call log</h2>
            <span className="text-xs text-slate-400">Polling refresh</span>
          </div>
          {calls.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">No calls logged.</p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm">
              {calls.map((call) => (
                <li key={call.id} className="rounded-lg border border-border bg-background p-3">
                  <p className="font-semibold">{call.description}</p>
                  <p className="text-xs text-slate-400">{call.status} • {new Date(call.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
