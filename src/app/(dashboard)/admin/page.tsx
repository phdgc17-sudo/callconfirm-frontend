"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/Toast";

interface Community {
  id: string;
  name: string;
  description: string;
  premium: boolean;
}

export default function AdminPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [memberStatus, setMemberStatus] = useState("");
  const [rosterId, setRosterId] = useState("");
  const [roster, setRoster] = useState<{ id: string; role: string; user: { name: string; email: string } }[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/communities");
      const data = await res.json();
      setCommunities(data.communities ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const handleAssignMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const communityId = formData.get("communityId")?.toString();
    if (!communityId) return;
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(`/api/communities/${communityId}/members`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });
    setMemberStatus(response.ok ? "Member assigned." : "Unable to assign member.");
    event.currentTarget.reset();
  };

  const loadRoster = async () => {
    if (!rosterId) return;
    const response = await fetch(`/api/communities/${rosterId}/members`);
    const data = await response.json();
    setRoster(data.members ?? []);
  };

  return (
    <div className="px-4 py-8 lg:px-8">
      <Toast message={memberStatus} onClear={() => setMemberStatus("")} />
      <h1 className="text-2xl font-semibold">Community Admin Panel</h1>
      <p className="text-sm text-slate-400">Manage your profile, staff permissions, and announcements.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form className="card space-y-3" method="post" action="/api/communities">
          <h2 className="text-lg font-semibold">Create community</h2>
          <input name="name" placeholder="Community name" required />
          <textarea name="description" placeholder="Community description" rows={3} required />
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" name="premium" />
            Enable premium tier features
          </label>
          <button className="bg-accent text-black" type="submit">Save community</button>
        </form>

        <form className="card space-y-3" method="post" action="/api/announcements">
          <h2 className="text-lg font-semibold">Create announcement</h2>
          <input name="communityId" placeholder="Community ID" required />
          <input name="title" placeholder="Announcement title" required />
          <textarea name="body" placeholder="Message" rows={3} required />
          <button className="bg-accent text-black" type="submit">Publish announcement</button>
        </form>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form className="card space-y-3" onSubmit={handleAssignMember}>
          <h2 className="text-lg font-semibold">Add community member</h2>
          <input name="communityId" placeholder="Community ID" required />
          <input name="userId" placeholder="User ID" required />
          <select name="role">
            <option value="OWNER">Owner</option>
            <option value="ADMIN">Admin</option>
            <option value="MODERATOR">Moderator</option>
            <option value="DISPATCHER">Dispatcher</option>
            <option value="OFFICER">Officer</option>
            <option value="MEMBER">Member</option>
          </select>
          <button className="bg-accent text-black" type="submit">Assign role</button>
        </form>

        <form className="card space-y-3" method="post" action="/api/servers">
          <h2 className="text-lg font-semibold">Register server</h2>
          <input name="communityId" placeholder="Community ID" required />
          <input name="name" placeholder="Server name" required />
          <textarea name="description" placeholder="Server description" rows={3} required />
          <input name="joinMethod" placeholder="Join method (code/link)" required />
          <input name="state" placeholder="State" />
          <select name="type">
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <input name="language" placeholder="Language" required />
          <input name="tags" placeholder="Tags (comma separated)" />
          <button className="bg-accent text-black" type="submit">Publish listing</button>
        </form>
      </div>

      <div className="mt-8 card">
        <h2 className="text-lg font-semibold">Your communities</h2>
        {loading ? (
          <p className="mt-2 text-sm text-slate-400">Loading communities...</p>
        ) : communities.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">No communities yet.</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {communities.map((community) => (
              <li key={community.id}>
                {community.name} {community.premium ? "• Premium" : ""}
                <span className="ml-2 text-xs text-slate-500">{community.id}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 card">
        <h2 className="text-lg font-semibold">Community roster</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <input
            value={rosterId}
            onChange={(event) => setRosterId(event.target.value)}
            placeholder="Community ID"
          />
          <button className="bg-accent text-black" type="button" onClick={loadRoster}>
            Load roster
          </button>
        </div>
        {roster.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No members loaded yet.</p>
        ) : (
          <table className="table mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((member) => (
                <tr key={member.id}>
                  <td>{member.user.name}</td>
                  <td>{member.user.email}</td>
                  <td>{member.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
