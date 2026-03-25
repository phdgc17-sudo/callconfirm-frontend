"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit() {
    const res = await fetch("/api/auth/admin-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (!res.ok) return setError("Invalid credentials");
    router.push("/admin/applications");
  }

  return <div className="card max-w-md"><h1 className="text-2xl font-bold">Admin Login</h1><input className="mt-3 w-full rounded bg-navy-800 p-2" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/><input type="password" className="mt-3 w-full rounded bg-navy-800 p-2" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/><button onClick={submit} className="mt-4 rounded bg-accent px-4 py-2 text-black">Login</button><p className="text-red-400">{error}</p></div>;
}
