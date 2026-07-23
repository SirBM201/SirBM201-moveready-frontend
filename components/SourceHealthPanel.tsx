"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type SourceHealth = {
  ok: boolean;
  service?: string;
  status?: string;
  generated_at?: string;
  counts?: Record<string, number>;
  source_types?: Record<string, number>;
  reliability_levels?: Record<string, number>;
  sample_health?: Array<{
    source_type?: string;
    reliability_level?: string;
    status?: string;
    last_checked_age_days?: number | null;
    review_due?: boolean;
  }>;
  public_note?: string;
};

function readable(value?: string) {
  return String(value || "unknown").replace(/_/g, " ");
}

function formatDate(value?: string) {
  if (!value) return "Unknown";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function SourceHealthPanel() {
  const [health, setHealth] = useState<SourceHealth | null>(null);
  const [message, setMessage] = useState("Checking source freshness...");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setMessage("Checking source freshness...");
    try {
      const data = await apiJson<SourceHealth>("source-health/summary", { timeoutMs: 20000, useAuthToken: false });
      setHealth(data);
      setMessage(`Source health loaded: ${readable(data.status)}.`);
    } catch (error) {
      const apiError = error as ApiError;
      setHealth(null);
      setMessage(apiError?.message || "Unable to load source health.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const counts = Object.entries(health?.counts || {});
  const sourceTypes = Object.entries(health?.source_types || {});
  const reliability = Object.entries(health?.reliability_levels || {});

  return (
    <div className="result-stack">
      <article className="result-block featured">
        <div className="panel-heading">
          <div><p className="overline">Public source status</p><h2>{readable(health?.status)}</h2></div>
          <span className="status-dot">{formatDate(health?.generated_at)}</span>
        </div>
        <p>{health?.public_note || "Source-health data has not loaded yet."}</p>
        <div className="actions">
          <button className="btn primary" type="button" disabled={loading} onClick={load}>{loading ? "Checking..." : "Refresh source health"}</button>
          <a className="btn" href="/sources">Open source directory</a>
          <a className="btn" href="/launch-readiness">Launch readiness</a>
        </div>
        <p className="form-status">{message}</p>
      </article>

      <section className="grid">
        {counts.map(([key, value]) => (
          <article className="card" key={key}>
            <h3>{Number(value).toLocaleString()}</h3>
            <p><strong>{readable(key)}</strong></p>
          </article>
        ))}
        {!counts.length ? <article className="card"><h3>Unavailable</h3><p>Source-health counts are not currently available. Guidance should remain controlled where current verification is missing.</p></article> : null}
      </section>

      <section className="live-workspace">
        <article className="workflow-panel live-form">
          <p className="overline">Source types</p>
          <h2>Coverage by source category</h2>
          <div className="mini-list">
            {sourceTypes.map(([key, value]) => <div key={key}><strong>{readable(key)}</strong><span>{value} active or watched source{value === 1 ? "" : "s"}</span></div>)}
            {!sourceTypes.length ? <div><strong>No category data</strong><span>Source category counts are unavailable.</span></div> : null}
          </div>
        </article>

        <article className="result-panel">
          <div className="result-block">
            <p className="overline">Reliability levels</p>
            <h2>Review confidence distribution</h2>
            <div className="mini-list">
              {reliability.map(([key, value]) => <div key={key}><strong>{readable(key)}</strong><span>{value} source{value === 1 ? "" : "s"}</span></div>)}
              {!reliability.length ? <div><strong>No reliability data</strong><span>Reliability counts are unavailable.</span></div> : null}
            </div>
          </div>
        </article>
      </section>

      <article className="result-block">
        <div className="panel-heading"><div><p className="overline">Sample health records</p><h2>Freshness without exposing internal notes</h2></div><span className="status-dot">Sanitized</span></div>
        <div className="mini-list">
          {(health?.sample_health || []).map((item, index) => (
            <div key={`${item.source_type || "source"}-${index}`}>
              <strong>{readable(item.source_type)} · {readable(item.reliability_level)}</strong>
              <span>Status {readable(item.status)} · Last checked {item.last_checked_age_days === null || item.last_checked_age_days === undefined ? "not recorded" : `${item.last_checked_age_days} day${item.last_checked_age_days === 1 ? "" : "s"} ago`} · Review due {item.review_due ? "yes" : "no"}</span>
            </div>
          ))}
          {!health?.sample_health?.length ? <div><strong>No sample data</strong><span>Public source-health samples are unavailable.</span></div> : null}
        </div>
      </article>
    </div>
  );
}
