"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface ServerListing {
  id: string;
  name: string;
  description: string;
  joinMethod: string;
  state: string | null;
  type: string;
  language: string;
  tags: string[];
  logoUrl: string | null;
}

export default function ServersPage() {
  const [servers, setServers] = useState<ServerListing[]>([]);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [styleFilter, setStyleFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/servers");
      const data = await res.json();
      setServers(data.servers ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const filteredServers = servers.filter((server) => {
      const matchesQuery = query
        ? server.name.toLowerCase().includes(query.toLowerCase()) ||
          server.description.toLowerCase().includes(query.toLowerCase())
        : true;
      const matchesState = stateFilter ? server.state === stateFilter : true;
      const matchesType = typeFilter ? server.type === typeFilter : true;
      const matchesLanguage = languageFilter ? server.language === languageFilter : true;
      const matchesStyle = styleFilter
        ? server.tags.map((tag) => tag.toLowerCase()).includes(styleFilter.toLowerCase())
        : true;
      return matchesQuery && matchesState && matchesType && matchesLanguage && matchesStyle;
    });
    return filteredServers.sort((a, b) => {
      if (sortOrder === "az") return a.name.localeCompare(b.name);
      if (sortOrder === "za") return b.name.localeCompare(a.name);
      return 0;
    });
  }, [servers, query, stateFilter, typeFilter, languageFilter, styleFilter, sortOrder]);

  return (
    <div className="px-4 py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Server Directory</h1>
          <p className="text-sm text-slate-400">Find ER:LC communities and verify join methods.</p>
        </div>
        <Link
          href="/admin"
          className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-black"
        >
          Register your server
        </Link>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-6">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search servers"
          className="lg:col-span-2"
        />
        <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}>
          <option value="">All states</option>
          <option value="Liberty County">Liberty County</option>
          <option value="San Andreas">San Andreas</option>
        </select>
        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
          <option value="">All types</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <select value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)}>
          <option value="">All languages</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
        </select>
        <select value={styleFilter} onChange={(event) => setStyleFilter(event.target.value)}>
          <option value="">All styles</option>
          <option value="strict">Strict RP</option>
          <option value="casual">Casual RP</option>
        </select>
        <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
          <option value="newest">Newest</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-slate-400">Loading servers...</p>
      ) : filtered.length === 0 ? (
        <div className="card mt-6">
          <p className="text-sm text-slate-400">No servers found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {filtered.map((server) => (
            <Link key={server.id} href={`/servers/${server.id}`} className="card hover:border-accent">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{server.name}</h2>
                  <p className="mt-2 text-sm text-slate-300">{server.description}</p>
                </div>
                <span className="badge">{server.type}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                <span>{server.state ?? "Unknown state"}</span>
                <span>•</span>
                <span>{server.language}</span>
                <span>•</span>
                <span>{server.joinMethod}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {server.tags.map((tag) => (
                  <span key={tag} className="badge">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
