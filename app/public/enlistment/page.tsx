"use client";
import { useState } from "react";

type Branch = { id: string; name: string; joinGroupUrl: string; requiredGroupId: number; enlistmentOpen: boolean };

export default function EnlistmentPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<any>(null);
  const [form, setForm] = useState({ displayName: "", timezone: "", priorExperience: "", reasonForJoining: "", activityLevel: "", additionalNotes: "", ageConfirmed: false });

  useState(() => { fetch("/api/admin/branches").then((r) => r.json()).then((d) => setBranches(d.branches)); });

  const current = branches.find((b) => b.id === selected);

  async function connect() {
    const res = await fetch("/api/auth/connect-roblox", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username }) });
    setStatus(await res.json());
  }

  async function verify() {
    const res = await fetch("/api/auth/verify-roblox", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ branchId: selected }) });
    setStatus(await res.json());
  }

  async function submit() {
    const res = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, branchId: selected }) });
    alert((await res.json()).message || "Submitted");
  }

  return <div className="space-y-4">
    <div className="card"><h1 className="text-3xl font-bold">Enlistment Workflow</h1><p className="text-steel">Select branch, connect Roblox, verify group membership, and submit.</p></div>
    <div className="card space-y-3">
      <select className="w-full rounded bg-navy-800 p-2" value={selected} onChange={(e) => setSelected(e.target.value)}><option value="">Select branch</option>{branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
      <input className="w-full rounded bg-navy-800 p-2" placeholder="Roblox username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={connect} className="rounded bg-accent px-4 py-2 text-black">Connect Roblox</button>
      {status?.verificationCode && <p>Verification code placed in profile bio: <b>{status.verificationCode}</b></p>}
      <button onClick={verify} className="rounded border px-4 py-2">Refresh Verification</button>
      {status?.groupVerified === false && current && <a href={current.joinGroupUrl} className="inline-block rounded bg-red-700 px-4 py-2">Join Group</a>}
    </div>
    <div className="card grid gap-3">
      <input className="rounded bg-navy-800 p-2" placeholder="Display name" onChange={(e)=>setForm({...form, displayName: e.target.value})} />
      <input className="rounded bg-navy-800 p-2" placeholder="Timezone" onChange={(e)=>setForm({...form, timezone: e.target.value})} />
      <textarea className="rounded bg-navy-800 p-2" placeholder="Prior experience" onChange={(e)=>setForm({...form, priorExperience: e.target.value})} />
      <textarea className="rounded bg-navy-800 p-2" placeholder="Reason for joining" onChange={(e)=>setForm({...form, reasonForJoining: e.target.value})} />
      <input className="rounded bg-navy-800 p-2" placeholder="Activity level" onChange={(e)=>setForm({...form, activityLevel: e.target.value})} />
      <textarea className="rounded bg-navy-800 p-2" placeholder="Additional notes" onChange={(e)=>setForm({...form, additionalNotes: e.target.value})} />
      <label><input type="checkbox" onChange={(e)=>setForm({...form, ageConfirmed: e.target.checked})} /> I confirm eligibility and age requirement.</label>
      <button onClick={submit} disabled={!status?.groupVerified} className="rounded bg-green-700 px-4 py-2 disabled:opacity-40">Submit Application</button>
    </div>
  </div>;
}
