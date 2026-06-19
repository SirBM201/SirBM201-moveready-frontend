"use client";

import { useEffect, useMemo, useState } from "react";

import { apiJson } from "@/lib/api";

type RouteItem = {
  id?: string;
  route_code?: string;
  route_name?: string;
  route_category?: string;
  country_code?: string;
  country_name?: string;
  risk_level?: string | null;
  source_confidence?: string | null;
  freshness_status?: string | null;
  verified_at?: string | null;
  review_due_at?: string | null;
  summary?: string | null;
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

export default function SourceReadinessPanel() {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [status, setStatus] = useState("Loading live route source status...");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;
    apiJson<{ routes: RouteItem[] }>("relocation/routes", { timeoutMs: 15000 })
      .then((data) => {
        if (cancelled) return;
        setRoutes(data.routes || []);
        setStatus(data.routes?.length ? "Live route source status loaded" : "No route records found yet");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("Unable to load route source status. Check backend deployment if this continues.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleRoutes = useMemo(() => {
    if (filter === "review_due") return routes.filter((route) => isReviewDue(route.review_due_at));
    if (filter === "high_confidence") return routes.filter((route) => route.source_confidence === "high");
    if (filter === "active") return routes.filter((route) => route.freshness_status === "active");
    return routes;
  }, [filter, routes]);

  const counts = useMemo(() => ({
    all: routes.length,
    active: routes.filter((route) => route.freshness_status === "active").length,
    high_confidence: routes.filter((route) => route.source_confidence === "high").length,
    review_due: routes.filter((route) => isReviewDue(route.review_due_at)).length,
  }), [routes]);

  return (
    <div className="source-readiness-panel">
      <div className="section-heading-row">
        <div>
          <h2>Live route source status</h2>
          <p className="section-intro">Review the route records currently available to users and verify freshness before relying on sensitive guidance.</p>
        </div>
        <div className="badge-row">
          <button className="badge button-badge" type="button" onClick={() => setFilter("all")}>all: {counts.all}</button>
          <button className="badge button-badge" type="button" onClick={() => setFilter("active")}>active: {counts.active}</button>
          <button className="badge button-badge" type="button" onClick={() => setFilter("high_confidence")}>high confidence: {counts.high_confidence}</button>
          <button className="badge button-badge" type="button" onClick={() => setFilter("review_due")}>review due: {counts.review_due}</button>
        </div>
      </div>

      <p className="form-status">{status}</p>

      <div className="source-table" role="table" aria-label="Live route source status">
        <div className="source-row source-head" role="row">
          <span>Route</span>
          <span>Status</span>
          <span>Review</span>
          <span>Action</span>
        </div>
        {visibleRoutes.map((route) => (
          <article className="source-row" key={route.id || `${route.country_code}-${route.route_code}`} role="row">
            <div role="cell">
              <span className="overline">{route.country_name || route.country_code || "Country pending"}</span>
              <h3>{route.route_name || "Route pending"}</h3>
              <p>{route.summary || "Route summary pending source review."}</p>
            </div>
            <div className="badge-row" role="cell">
              <span className="badge">{route.freshness_status || "review required"}</span>
              <span className="badge">Risk: {route.risk_level || "not set"}</span>
              <span className="badge">Confidence: {route.source_confidence || "not set"}</span>
            </div>
            <div className="mini-list compact-source-list" role="cell">
              <div><strong>Verified</strong><span>{formatDate(route.verified_at)}</span></div>
              <div><strong>Review due</strong><span>{formatDate(route.review_due_at)}</span></div>
            </div>
            <div className="actions stacked-source-actions" role="cell">
              <a className="btn primary" href={`/route-checker?country=${route.country_code || ""}&route=${route.route_code || ""}`}>Check route</a>
              <a className="btn" href={`/watchlist?type=route&code=${encodeURIComponent(`${route.country_code || ""}-${route.route_code || ""}`)}&title=${encodeURIComponent(route.route_name || "Route")}`}>Monitor route</a>
            </div>
          </article>
        ))}
      </div>

      {!visibleRoutes.length ? <p className="form-status">No route records match this filter.</p> : null}

      <style>{`
        .source-readiness-panel { display: grid; gap: 18px; }
        .button-badge { cursor: pointer; font: inherit; }
        .source-table { display: grid; gap: 12px; }
        .source-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 0.85fr 0.65fr;
          gap: 18px;
          align-items: start;
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #fff;
        }
        .source-head {
          padding: 10px 18px;
          background: transparent;
          color: var(--muted);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.78rem;
        }
        .source-row h3 { margin: 7px 0 8px; }
        .source-row p { margin: 0; color: var(--muted); }
        .compact-source-list { gap: 8px; }
        .stacked-source-actions { flex-direction: column; align-items: stretch; }
        .stacked-source-actions .btn { width: 100%; justify-content: center; }
        @media (max-width: 1100px) {
          .source-row { grid-template-columns: 1fr 1fr; }
          .source-head { display: none; }
        }
        @media (max-width: 720px) {
          .source-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
