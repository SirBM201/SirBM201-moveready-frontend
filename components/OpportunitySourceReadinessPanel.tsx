"use client";

import { useEffect, useMemo, useState } from "react";

import { apiJson } from "@/lib/api";

type Opportunity = {
  id?: string;
  opportunity_code: string;
  country_code?: string | null;
  country_name?: string | null;
  opportunity_name: string;
  opportunity_type?: string | null;
  availability_status?: string | null;
  official_url?: string | null;
  result_check_url?: string | null;
  summary?: string | null;
  eligibility_summary?: string | null;
  application_window_summary?: string | null;
  safety_notes?: string | null;
  source_confidence?: string | null;
  last_verified_at?: string | null;
  next_review_due_at?: string | null;
};

const guideLinks: Record<string, string> = {
  "US-DV": "/opportunities/usa-dv",
  "CA-IEC": "/opportunities/canada-iec",
  "AU-462-BALLOT": "/opportunities/australia-462-ballot",
  "UK-IYPS": "/opportunities/uk-india-young-professionals",
  "NZ-PAC": "/opportunities/new-zealand-quota-ballots",
  "NZ-SQ": "/opportunities/new-zealand-quota-ballots",
  "JP-WH": "/opportunities/japan-working-holiday",
  "KR-WH": "/opportunities/korea-working-holiday",
  "HK-WHS": "/opportunities/hong-kong-working-holiday",
  "IE-WHA": "/opportunities/ireland-working-holiday",
};

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function isReviewDue(value?: string | null) {
  if (!value) return true;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return true;
  return date.getTime() < Date.now();
}

function statusLabel(value?: string | null) {
  return String(value || "unknown").replaceAll("_", " ");
}

export default function OpportunitySourceReadinessPanel() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [status, setStatus] = useState("Loading live opportunity source status...");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    apiJson<{ opportunities: Opportunity[]; source_status?: string }>("opportunities", { timeoutMs: 15000 })
      .then((data) => {
        if (cancelled) return;
        setItems(data.opportunities || []);
        setStatus(data.source_status === "database_backed" ? "Live opportunity source status loaded" : "Starter opportunity source status loaded");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("Unable to load opportunity source status. Check backend deployment if this continues.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleItems = useMemo(() => {
    if (filter === "review_due") return items.filter((item) => isReviewDue(item.next_review_due_at));
    if (filter === "high_confidence") return items.filter((item) => item.source_confidence === "high");
    if (filter === "open") return items.filter((item) => item.availability_status === "open" || item.availability_status === "results_open");
    if (filter === "monitoring") return items.filter((item) => item.availability_status === "monitoring");
    return items;
  }, [filter, items]);

  const counts = useMemo(() => ({
    all: items.length,
    open: items.filter((item) => item.availability_status === "open" || item.availability_status === "results_open").length,
    monitoring: items.filter((item) => item.availability_status === "monitoring").length,
    high_confidence: items.filter((item) => item.source_confidence === "high").length,
    review_due: items.filter((item) => isReviewDue(item.next_review_due_at)).length,
  }), [items]);

  return (
    <div className="opportunity-source-panel">
      <div className="section-heading-row">
        <div>
          <h2>Live opportunity source status</h2>
          <p className="section-intro">Review lottery, ballot, quota, invitation-pool, and working-holiday records before users rely on alerts or route guidance.</p>
        </div>
        <div className="badge-row">
          <button className="badge button-badge" type="button" onClick={() => setFilter("all")}>all: {counts.all}</button>
          <button className="badge button-badge" type="button" onClick={() => setFilter("open")}>open/results: {counts.open}</button>
          <button className="badge button-badge" type="button" onClick={() => setFilter("monitoring")}>monitoring: {counts.monitoring}</button>
          <button className="badge button-badge" type="button" onClick={() => setFilter("high_confidence")}>high confidence: {counts.high_confidence}</button>
          <button className="badge button-badge" type="button" onClick={() => setFilter("review_due")}>review due: {counts.review_due}</button>
        </div>
      </div>

      <p className="form-status">{status}</p>

      <div className="opportunity-source-list">
        {visibleItems.map((item) => (
          <article className="opportunity-source-card" key={item.id || item.opportunity_code}>
            <div>
              <span className="overline">{item.country_name || item.country_code || "Country pending"} · {item.opportunity_code}</span>
              <h3>{item.opportunity_name}</h3>
              <p>{item.summary || "Opportunity summary pending source review."}</p>
            </div>
            <div className="badge-row">
              <span className="badge">{statusLabel(item.availability_status)}</span>
              <span className="badge">{statusLabel(item.opportunity_type)}</span>
              <span className="badge">Confidence: {item.source_confidence || "not set"}</span>
            </div>
            <div className="mini-list compact-opportunity-list">
              <div><strong>Eligibility</strong><span>{item.eligibility_summary || "Eligibility notes pending."}</span></div>
              <div><strong>Window</strong><span>{item.application_window_summary || "Window notes pending."}</span></div>
              <div><strong>Safety</strong><span>{item.safety_notes || "Safety notes pending."}</span></div>
              <div><strong>Last verified</strong><span>{formatDate(item.last_verified_at)}</span></div>
              <div><strong>Review due</strong><span>{formatDate(item.next_review_due_at)}</span></div>
            </div>
            <div className="actions">
              {guideLinks[item.opportunity_code] ? <a className="btn primary" href={guideLinks[item.opportunity_code]}>View guide</a> : null}
              {item.official_url ? <a className="btn" href={item.official_url} target="_blank" rel="noreferrer">Official source</a> : null}
              {item.result_check_url ? <a className="btn" href={item.result_check_url} target="_blank" rel="noreferrer">Result check</a> : null}
              <a className="btn" href={`/watchlist?type=opportunity&code=${encodeURIComponent(item.opportunity_code)}&title=${encodeURIComponent(item.opportunity_name)}`}>Monitor</a>
            </div>
          </article>
        ))}
      </div>

      {!visibleItems.length ? <p className="form-status">No opportunity records match this filter.</p> : null}

      <style>{`
        .opportunity-source-panel { display: grid; gap: 18px; }
        .button-badge { cursor: pointer; font: inherit; }
        .opportunity-source-list { display: grid; gap: 14px; }
        .opportunity-source-card {
          display: grid;
          gap: 16px;
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #fff;
          box-shadow: var(--shadow);
        }
        .opportunity-source-card h3 { margin: 7px 0 8px; }
        .opportunity-source-card p { margin: 0; color: var(--muted); line-height: 1.55; }
        .compact-opportunity-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        @media (max-width: 820px) {
          .compact-opportunity-list { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
