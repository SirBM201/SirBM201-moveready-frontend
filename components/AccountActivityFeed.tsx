"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type ActivityItem = {
  kind: string;
  id?: string;
  title: string;
  summary: string;
  status?: string;
  occurred_at?: string;
  href: string;
};

type ActivityResponse = {
  ok: boolean;
  generated_at?: string;
  activity?: ActivityItem[];
  count?: number;
  partial_errors?: Record<string, string>;
  privacy_note?: string;
};

const kindLabels: Record<string, string> = {
  profile: "Profile",
  saved_route: "Saved route",
  watchlist: "Watchlist",
  timeline: "Timeline",
  evidence_document: "Document metadata",
  evidence_pack: "Evidence pack",
  application_case: "Application",
  application_alert: "Application alert",
  report: "Report",
  quote: "Quote",
  handoff: "Provider handoff",
  support_case: "Support case",
  privacy_request: "Privacy request",
};

function formatDate(value?: string) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function AccountActivityFeed() {
  const [data, setData] = useState<ActivityResponse | null>(null);
  const [message, setMessage] = useState("Loading private activity history...");
  const [loading, setLoading] = useState(false);
  const [kind, setKind] = useState("all");
  const [query, setQuery] = useState("");

  async function load() {
    setLoading(true);
    setMessage("Loading account-owned activity...");
    try {
      const response = await apiJson<ActivityResponse>("account/activity", {
        query: { limit: 200 },
        timeoutMs: 30000,
      });
      setData(response);
      const errorCount = Object.keys(response.partial_errors || {}).length;
      setMessage(errorCount
        ? `Activity loaded with ${errorCount} unavailable section(s). Missing migrations remain fail-closed.`
        : "Activity history loaded.");
    } catch (error) {
      const apiError = error as ApiError;
      setData(null);
      setMessage(apiError?.status === 401
        ? "Sign in with your verified account to view private activity history."
        : "Activity history is unavailable until migration 030 and the latest backend deployment are active.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const kinds = useMemo(() => {
    const values = new Set((data?.activity || []).map((item) => item.kind));
    return Array.from(values).sort();
  }, [data]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (data?.activity || []).filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (!normalized) return true;
      return [item.title, item.summary, item.status, item.kind]
        .some((value) => String(value || "").toLowerCase().includes(normalized));
    });
  }, [data, kind, query]);

  return (
    <div className="result-stack">
      <article className="result-block featured">
        <div className="panel-heading">
          <div>
            <p className="overline">Private account history</p>
            <h2>Everything you changed or generated, in one timeline</h2>
          </div>
          <span className="status-dot">{filtered.length} shown</span>
        </div>
        <p>{message}</p>
        <div className="form-grid">
          <label>
            Filter by area
            <select value={kind} onChange={(event) => setKind(event.target.value)}>
              <option value="all">All activity</option>
              {kinds.map((value) => <option value={value} key={value}>{kindLabels[value] || value.replaceAll("_", " ")}</option>)}
            </select>
          </label>
          <label>
            Search activity
            <input value={query} placeholder="Country, route, case, report, status..." onChange={(event) => setQuery(event.target.value)} />
          </label>
        </div>
        <div className="actions">
          <button className="btn" type="button" onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh activity"}</button>
          <a className="btn" href="/settings">Settings and privacy</a>
          <a className="btn" href="/dashboard">Account Center</a>
        </div>
      </article>

      <article className="result-block">
        <p className="overline">Chronological feed</p>
        <h2>Recent account activity</h2>
        <div className="mini-list">
          {filtered.length === 0 && (
            <div>
              <strong>No matching activity</strong>
              <span>Change the filters, create a profile, save a route, build evidence, or start an application case.</span>
            </div>
          )}
          {filtered.map((item, index) => (
            <div key={`${item.kind}-${item.id || index}-${item.occurred_at || index}`}>
              <strong>{kindLabels[item.kind] || item.kind.replaceAll("_", " ")} · {item.title}</strong>
              <span>{item.summary}{item.status ? ` · Status: ${String(item.status).replaceAll("_", " ")}` : ""}<br />{formatDate(item.occurred_at)}</span>
              <a className="text-link" href={item.href}>Open related workspace</a>
            </div>
          ))}
        </div>
      </article>

      <article className="result-block soft">
        <p className="overline">Privacy boundary</p>
        <p>{data?.privacy_note || "The activity feed does not expose raw documents, complete authority references, OTPs, passwords, payment credentials, private keys, or session-token hashes."}</p>
      </article>
    </div>
  );
}
