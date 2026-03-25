export async function lookupRobloxUser(username: string) {
  const res = await fetch("https://users.roblox.com/v1/usernames/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernames: [username], excludeBannedUsers: true }),
    cache: "no-store"
  });
  if (!res.ok) throw new Error("Failed Roblox lookup");
  const json = await res.json() as { data: Array<{ id: number; name: string; displayName: string }> };
  return json.data[0] || null;
}

export async function getRobloxAvatar(userId: number) {
  const res = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=352x352&format=Png&isCircular=false`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json() as { data: Array<{ imageUrl: string }> };
  return data.data[0]?.imageUrl || null;
}

export async function verifyMembership(groupId: number, userId: number) {
  const res = await fetch(`https://groups.roblox.com/v2/users/${userId}/groups/roles`, { cache: "no-store" });
  if (!res.ok) return false;
  const data = await res.json() as { data: Array<{ group: { id: number } }> };
  return data.data.some((g) => g.group.id === groupId);
}

export async function verifyProfileCode(userId: number, code: string) {
  const res = await fetch(`https://users.roblox.com/v1/users/${userId}`, { cache: "no-store" });
  if (!res.ok) return false;
  const data = await res.json() as { description?: string };
  return (data.description || "").includes(code);
}
