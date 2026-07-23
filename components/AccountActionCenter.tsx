"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type ActionItem = {
  kind: string;
  id?: string;
  title: string;
  summary: string;
  priority: "low" | "medium" | "high" | "critical";
  status?: string;
  due_at?: string;
  hours_until_due?: number | null;
  href: string;
  score: number;
  created_at?: string;
  metadata?: Record<string, unknown>;
};

type ActionResponse = {
  ok: boolean;
  generated_at?: string;
  action_count?: number;
  counts_by_priority?: Record<string, number>;
  counts_by_section?: Record<string, number>;
  actions?: ActionItem[];
  partial_errors?: Record<string, string>;
  empty_state?: string | null;
  safety_note?: string;
};

const kindLabels: Record<string, string> = {
  application_alert: "Application alert",
  application_case: "Application case",
  timeline: "Timeline task",
  document: "Document",
  evidence_pack: "Evidence pack",
  quote: "Quote or payment",
  handoff: "Provider handoff",
  support_case: "Support case",
  privacy_request: "Privacy request",
};

function readable(value?: string) {
  return String(value || "unknown").replaceAll("_", " ");
}

function formatDate(value?: string) {
  if (!value) return "No date recorded";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function dueLabel(hours?: number | null) {
  if (hours === null || hours === undefined) return "No deadline detected";
  if (hours < 0) {
    const days = Math.max(1, Math.ceil(Math.abs(hours) / 24));
    return `Overdue by about ${days} day${days === 1 ? "" : "s"}`;
  }
  if (hours < 24) return `${Math.max(1, Math.ceil(hours))} hour${Math.ceil(hours) === 1 ? "" : "s"} remaining`;
  const days = Math.ceil(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} remaining`;
}

export default function AccountActionCenter() {
  const [data, setData] = useState<ActionResponse | null>(null);
  const [message, setMessage] = useState("Loading your private next actions...");
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("all");
  const [kind, setKind] = useState("all");
  const [query, setQuery] = useState("");

  async function load() {
    setLoading(true);
    setMessage("Ranking deadlines, application risks, evidence gaps, documents, quotes, handoffs, support, and privacy actions...");
    try {
      const response = await apiJson<ActionResponse>("account/action-center", {
        query: { limit: 250 },
        timeoutMs: 40000,
      });
      setData(response);
      const partialCount = Object.keys(response.partial_errors || {}).length;
      setMessage(partialCount
        ? `Action Center loaded with ${partialCount} unavailable section(s). Missing schemas remain fail-closed.`
        : response.action_count
          ? `${response.action_count} account action(s) need review.`
          : response.empty_state || "No urgent action was detected.");
    } catch (error) {
      const apiError = error as ApiError;
      setData(null);
      setMessage(apiError?.status === 401
        ? "Sign in with your verified account to review private next actions."
        : "Action Center is unavailable until the latest backend deployment and required migrations are active.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const kinds = useMemo(() => {
    const values = new Set((data?.actions || []).map((item) => item.kind));
    return Array.from(values).sort();
  }, [data]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (data?.actions || []).filter((item) => {
      if (priority !== "all" && item.priority !== priority) return false;
      if (kind !== "all" && item.kind !== kind) return false;
      if (!normalized) return true;
      return [item.title, item.summary, item.status, item.kind, item.due_at]
        .some((value) => String(value || "").toLowerCase().includes(normalized));
    });
  }, [data, priority, kind, query]);

  const priorityCards = ["critical", "high", "medium", "low"].map((value) => ({
    value,
    count: data?.counts_by_priority?.[value] || 0,
  }));

  return (
    <div className="result-stack">
      <article className="result-block featured">
        <div className="panel-heading">
          <div>
            <p className="overline">Private Action Center</p>
            <h2>What needs your attention next</h2>
          </div>
          <span className="status-dot">{filtered.length} shown</span>
        </div>
        <p>{message}</p>
        <div className="grid">
          {priorityCards.map((card) => (
            <button
              className="card"
              type="button"
              key={card.value}
              onClick={() => setPriority(priority === card.value ? "all" : card.value)}
              aria-pressed={priority === card.value}
              style={{ textAlign: "left" }}
            >
              <p className="overline">{readable(card.value)} priority</p>
              <h3>{card.count}</h3>
              <p>{card.value === "critical" ? "Overdue or immediate-risk actions" : card.value === "high" ? "Near deadlines or serious gaps" : card.value === "medium" ? "Review before the next step" : "Lower-pressure follow-up"}</p>
            </button>
          ))}
        </div>
        <div className="form-grid" style={{ marginTop: 18 }}>
          <label>
            Priority
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="all">All priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label>
            Account area
            <select value={kind} onChange={(event) => setKind(event.target.value)}>
              <option value="all">All areas</option>
              {kinds.map((value) => <option value={value} key={value}>{kindLabels[value] || readable(value)}</option>)}
            </select>
          </label>
          <label>
            Search actions
            <input value={query} placeholder="Deadline, country, evidence, payment..." onChange={(event) => setQuery(event.target.value)} />
          </label>
        </div>
        <div className="actions">
          <button className="btn" type="button" onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh Action Center"}</button>
          <a className="btn" href="/activity">Activity history</a>
          <a className="btn" href="/settings">Alert settings</a>
          <a className="btn" href="/dashboard">Account Center</a>
        </div>
      </article>

      <article className="result-block">
        <p className="overline">Ranked actions</p>
        <h2>Review the underlying record before acting</h2>
        <div className="mini-list">
          {filtered.length === 0 && (
            <div>
              <strong>No matching action</strong>
              <span>{data?.empty_state || "Change the filters or refresh after updating your application, evidence, documents, timeline, quotes, handoffs, support, or privacy records."}</span>
            </div>
          )}
          {filtered.map((item, index) => (
            <div key={`${item.kind}-${item.id || index}-${item.created_at || index}`}>
              <strong>{item.priority.toUpperCase()} · {kindLabels[item.kind] || readable(item.kind)} · {item.title}</strong>
              <span>
                {item.summary}<br />
                Status: {readable(item.status)} · {dueLabel(item.hours_until_due)}
                {item.due_at ? ` · Recorded due date: ${formatDate(item.due_at)}` : ""}
              </span>
              <a className="text-link" href={item.href}>Open underlying workspace</a>
            </div>
          ))}
        </div>
      </article>

      <article className="result-block soft">
        <p className="overline">Important boundary</p>
        <p>{data?.safety_note || "The Action Center ranks existing private records. Confirm the competent authority, current official source, exact deadline, time zone, channel, amount, provider, and decision before acting."}</p>
      </article>
    </div>
  );
}
