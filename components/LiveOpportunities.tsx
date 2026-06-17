"use client";

import { useEffect, useMemo, useState } from "react";

import { apiJson } from "@/lib/api";

type Opportunity = {
  id?: string;
  opportunity_code: string;
  country_code: string;
  country_name: string;
  opportunity_name: string;
  opportunity_type: string;
  availability_status: string;
  official_url: string;
  result_check_url?: string | null;
  summary: string;
  eligibility_summary?: string | null;
  application_window_summary?: string | null;
  safety_notes?: string | null;
  source_confidence?: string;
  last_verified_at?: string | null;
  next_review_due_at?: string | null;
  tags?: string[];
};

type ApiResponse = {
  ok: boolean;
  opportunities: Opportunity[];
  source_status?: string;
};

const typeLabels: Record<string, string> = {
  lottery: "Lottery",
  ballot: "Ballot",
  invitation_pool: "Invitation pool",
  annual_quota: "Annual quota",
  country_cap: "Country cap",
  first_come_quota: "First-come quota",
  seasonal_intake: "Seasonal intake",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  closed: "Closed",
  monitoring: "Monitoring",
  results_open: "Results open",
  paused: "Paused",
  unknown: "Check official source",
};

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function LiveOpportunities() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [status, setStatus] = useState("Loading official opportunity records...");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await apiJson<ApiResponse>("opportunities", { timeoutMs: 15000 });
        if (cancelled) return;
        setItems(data.opportunities || []);
        setStatus(data.source_status === "database_backed" ? "Live database-backed opportunities" : "Starter opportunity records");
      } catch {
        if (cancelled) return;
        setStatus("Unable to load opportunities. Check backend deployment if this continues.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const text = `${item.opportunity_code} ${item.country_name} ${item.opportunity_name} ${item.summary} ${item.eligibility_summary || ""}`.toLowerCase();
      const queryMatches = !query || text.includes(query.toLowerCase());
      const typeMatches = !typeFilter || item.opportunity_type === typeFilter;
      const statusMatches = !statusFilter || item.availability_status === statusFilter;
      return queryMatches && typeMatches && statusMatches;
    });
  }, [items, query, statusFilter, typeFilter]);

  return (
    <div className="opportunity-workspace">
      <style>{`
        .opportunity-workspace { display: grid; gap: 16px; }
        .opportunity-filter { grid-template-columns: minmax(220px, 1fr) minmax(180px, 0.34fr) minmax(180px, 0.34fr); }
        .opportunity-list { display: grid; gap: 16px; }
        .opportunity-card { display: grid; gap: 18px; padding: 20px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); box-shadow: var(--shadow); }
        .opportunity-card-head { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 20px; align-items: start; }
        .opportunity-card h3 { margin: 10px 0 0; font-size: clamp(24px, 3vw, 34px); line-height: 1.05; }
        .opportunity-card p { margin: 0; max-width: 900px; color: var(--muted); line-height: 1.6; }
        .compact-badges { justify-content: flex-end; margin-top: 0; }
        .opportunity-detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .opportunity-detail-grid div { display: grid; gap: 6px; padding: 14px; border: 1px solid var(--line); border-radius: 8px; background: #fbfdff; }
        .opportunity-detail-grid strong { font-size: 13px; }
        .opportunity-detail-grid span { color: var(--muted); line-height: 1.5; }
        .small-actions { margin-top: 0; }
        .opportunity-status.open, .opportunity-status.results_open { color: var(--brand-strong); background: #e7f4f2; border-color: #b9d7d3; }
        .opportunity-status.closed, .opportunity-status.paused { color: var(--warning); background: #fff7ed; border-color: #fed7aa; }
        @media (max-width: 980px) { .opportunity-filter, .opportunity-card-head, .opportunity-detail-grid { grid-template-columns: 1fr; } .compact-badges { justify-content: flex-start; } }
      `}</style>

      <div className="admin-toolbar opportunity-filter">
        <div className="field">
          <label htmlFor="opportunity_query">Search</label>
          <input id="opportunity_query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search country, route, DV, IEC..." />
        </div>
        <div className="field">
          <label htmlFor="opportunity_type">Type</label>
          <select id="opportunity_type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="">All types</option>
            {Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="opportunity_status">Status</label>
          <select id="opportunity_status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </div>

      <p className="form-status">{status}. Showing {filtered.length} of {items.length}.</p>

      <div className="opportunity-list">
        {filtered.map((item) => (
          <article className="opportunity-card" key={item.id || item.opportunity_code}>
            <div className="opportunity-card-head">
              <div>
                <span className="overline">{item.country_name} · {item.opportunity_code}</span>
                <h3>{item.opportunity_name}</h3>
              </div>
              <div className="badge-row compact-badges">
                <span className={`badge opportunity-status ${item.availability_status}`}>{statusLabels[item.availability_status] || item.availability_status}</span>
                <span className="badge">{typeLabels[item.opportunity_type] || item.opportunity_type}</span>
                <span className="badge">Confidence: {item.source_confidence || "high"}</span>
              </div>
            </div>

            <p>{item.summary}</p>

            <div className="opportunity-detail-grid">
              <div>
                <strong>Eligibility</strong>
                <span>{item.eligibility_summary || "Check official source for eligibility."}</span>
              </div>
              <div>
                <strong>Window</strong>
                <span>{item.application_window_summary || "Dates must be verified from the official source."}</span>
              </div>
              <div>
                <strong>Safety note</strong>
                <span>{item.safety_notes || "Use official sources and avoid approval guarantees."}</span>
              </div>
              <div>
                <strong>Next review</strong>
                <span>{formatDate(item.next_review_due_at)}</span>
              </div>
            </div>

            <div className="actions small-actions">
              <a className="btn primary" href={item.official_url} target="_blank" rel="noreferrer">Official source</a>
              {item.result_check_url ? <a className="btn" href={item.result_check_url} target="_blank" rel="noreferrer">Result check</a> : null}
              <a className="btn" href={`/platform/opportunities?route=${encodeURIComponent(item.opportunity_code)}`}>Request alert</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
