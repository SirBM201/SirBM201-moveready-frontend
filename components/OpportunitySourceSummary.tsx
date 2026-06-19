"use client";

import { useEffect, useMemo, useState } from "react";
import { apiJson } from "@/lib/api";

type Opportunity = {
  opportunity_code?: string;
  country_code?: string;
  country_name?: string;
  opportunity_name?: string;
  opportunity_type?: string;
  status?: string;
  source_confidence?: string;
  next_review_due_at?: string;
  eligibility_summary?: string;
};

function displayDate(value?: string) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function OpportunitySourceSummary() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [status, setStatus] = useState("Loading opportunity records...");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await apiJson<{ opportunities?: Opportunity[] }>("opportunities");
        if (!active) return;
        const records = data.opportunities || [];
        setItems(records);
        setStatus(records.length ? "Opportunity records loaded." : "No opportunity records found yet.");
      } catch {
        if (!active) return;
        setStatus("Unable to load opportunity records yet. Check backend deployment.");
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => filter === "all" || item.source_confidence === filter);
  }, [items, filter]);

  const counts = useMemo(() => {
    return {
      total: items.length,
      high: items.filter((item) => item.source_confidence === "high").length,
      medium: items.filter((item) => item.source_confidence === "medium").length,
      low: items.filter((item) => item.source_confidence === "low").length,
    };
  }, [items]);

  return (
    <section className="section" id="opportunity-sources">
      <div className="section-heading-row">
        <div>
          <h2>Opportunity source readiness</h2>
          <p className="section-intro">Review official opportunity records by confidence, status, and next review timing.</p>
        </div>
        <div className="badge-row">
          <span className="badge">Total: {counts.total}</span>
          <span className="badge">High: {counts.high}</span>
          <span className="badge">Medium: {counts.medium}</span>
          <span className="badge">Low: {counts.low}</span>
        </div>
      </div>

      <div className="workflow-panel">
        <div className="field">
          <label htmlFor="confidence-filter">Source confidence</label>
          <select id="confidence-filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All confidence levels</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <p className="form-status">{status}</p>
      </div>

      <div className="grid">
        {filtered.map((item) => (
          <article className="card" key={item.opportunity_code || item.opportunity_name}>
            <span className="overline">{item.country_name || item.country_code || "Global"} · {item.opportunity_code}</span>
            <h3>{item.opportunity_name || "Opportunity route"}</h3>
            <p>{item.eligibility_summary || "Check eligibility from the official source before action."}</p>
            <div className="badge-row">
              <span className="badge">{item.opportunity_type || "opportunity"}</span>
              <span className="badge">{item.status || "monitoring"}</span>
              <span className="badge">Confidence: {item.source_confidence || "medium"}</span>
              <span className="badge">Review: {displayDate(item.next_review_due_at)}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
