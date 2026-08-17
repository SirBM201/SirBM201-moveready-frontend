"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import { readableLabel } from "@/lib/labels";

type LinkAction = { label: string; href: string };
type OfficialSource = {
  title: string;
  url: string;
  source_type?: string | null;
  owner_organization?: string | null;
  reliability_level?: string | null;
  status?: string | null;
  last_checked_at?: string | null;
  review_due_at?: string | null;
  usage_note?: string | null;
};
type EvidenceItem = { name: string; level?: string | null; applies_to?: string | null; details?: string | null };
type CostItem = { name: string; category?: string | null; minimum?: number | null; maximum?: number | null; currency?: string | null; required: boolean; notes?: string | null };
type RouteCandidate = {
  route_id?: string | null;
  route_version_id?: string | null;
  route_code?: string | null;
  route_name: string;
  route_category?: string | null;
  country_code?: string | null;
  country_name?: string | null;
  summary?: string | null;
  risk_level?: string | null;
  qualification: { decision: string; status: string; eligibility_notes?: string | null };
  evidence: { required_count: number; conditional_count: number; items: EvidenceItem[] };
  costs: { planning_only: boolean; currency?: string | null; mixed_currencies: boolean; minimum?: number | null; maximum?: number | null; item_count: number; items: CostItem[] };
  timeline_notes: string[];
  risk_notes: string[];
  provenance: {
    jurisdiction?: string | null;
    source_confidence?: string | null;
    freshness_status: string;
    verified_at?: string | null;
    review_due_at?: string | null;
    official_source_status: string;
  };
  official_sources: OfficialSource[];
  next_actions: LinkAction[];
};
type Recommendation = {
  pathway: string;
  title: string;
  fit_score: number;
  score_kind: string;
  fit_label: string;
  reasons: string[];
  find_href: string;
  qualify_href: string;
  qualification: { decision: string; status: string; known_signals: string[]; gaps: string[] };
  candidate_routes: RouteCandidate[];
  next_actions: LinkAction[];
};
type Opportunity = {
  id?: string;
  code?: string;
  name: string;
  type?: string;
  country_name?: string;
  availability_status?: string;
  summary?: string;
  eligibility_summary?: string;
  application_window_summary?: string;
  safety_notes?: string;
  official_url?: string | null;
  source_confidence?: string;
  last_verified_at?: string | null;
  freshness_status: string;
};
type FinderResponse = {
  ok: boolean;
  contract_version: string;
  retrieved_at: string;
  recommendations: Recommendation[];
  profile_goal: string;
  target_country?: string | null;
  profile_snapshot: Record<string, string | number | boolean | null>;
  profile_gaps: string[];
  route_candidate_count: number;
  live_opportunity_count: number;
  matching_opportunities: Opportunity[];
  safety_note: string;
};

type LoadState = "loading" | "ready" | "signed_out" | "profile_required" | "error";

function dateLabel(value?: string | null) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

function costLabel(route: RouteCandidate) {
  const costs = route.costs;
  if (!costs.item_count) return "No reviewed cost range recorded";
  if (costs.mixed_currencies || !costs.currency || costs.minimum == null || costs.maximum == null) return "Multiple currencies — review each item";
  const formatter = new Intl.NumberFormat("en", { style: "currency", currency: costs.currency, maximumFractionDigits: 0 });
  return `${formatter.format(costs.minimum)}–${formatter.format(costs.maximum)}`;
}

function RouteCard({ route }: { route: RouteCandidate }) {
  const sourceReady = route.provenance.official_source_status === "official_sources_current";
  return (
    <article className="finder-route-card">
      <div className="finder-card-heading">
        <div>
          <p className="overline">{route.country_name || route.country_code || "Jurisdiction review needed"}</p>
          <h4>{route.route_name}</h4>
        </div>
        <span className={`finder-source-state ${sourceReady ? "is-current" : "is-review"}`}>
          {sourceReady ? "Sources current" : "Source review needed"}
        </span>
      </div>
      <p>{route.summary || "Open the exact Route Checker to review the current record."}</p>
      <div className="finder-truth-strip">
        <strong>Eligibility not determined</strong>
        <span>{route.qualification.eligibility_notes || "Profile alignment does not confirm that you qualify for this route."}</span>
      </div>

      <div className="finder-detail-grid">
        <section>
          <p className="overline">Evidence</p>
          <strong>{route.evidence.required_count} required · {route.evidence.conditional_count} conditional</strong>
          {route.evidence.items.length ? (
            <ul>
              {route.evidence.items.slice(0, 4).map((item, index) => (
                <li key={`${item.name}-${index}`}><b>{item.name}</b> — {readableLabel(item.level, "review")}</li>
              ))}
            </ul>
          ) : <p>No route-specific evidence list is recorded yet.</p>}
        </section>
        <section>
          <p className="overline">Planning cost</p>
          <strong>{costLabel(route)}</strong>
          <p>{route.costs.item_count ? `${route.costs.item_count} recorded item(s). No exchange rate or unrecorded family multiplier is applied.` : "Confirm fees and living-cost requirements from official instructions."}</p>
        </section>
        <section>
          <p className="overline">Timeline & risk</p>
          <strong>Risk: {readableLabel(route.risk_level, "review required")}</strong>
          <p>{route.timeline_notes[0] || route.risk_notes[0] || "Timing is not verified in the current route record."}</p>
        </section>
      </div>

      <section className="finder-source-box">
        <div className="finder-card-heading">
          <div>
            <p className="overline">Official-source trail</p>
            <strong>{readableLabel(route.provenance.freshness_status)}</strong>
          </div>
          <span>Verified {dateLabel(route.provenance.verified_at)}</span>
        </div>
        {route.official_sources.length ? (
          <ul>
            {route.official_sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
                <span>{readableLabel(source.source_type, "official source")} · checked {dateLabel(source.last_checked_at)}</span>
              </li>
            ))}
          </ul>
        ) : <p>No linked HTTPS official source is available in this record. Treat every detail as pending source review.</p>}
      </section>

      <div className="actions compact-actions">
        {route.next_actions.map((action, index) => <a className={`btn ${index === 0 ? "primary" : ""}`} href={action.href} key={action.href}>{action.label}</a>)}
      </div>
    </article>
  );
}

export default function OpportunityFinder() {
  const [data, setData] = useState<FinderResponse | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [message, setMessage] = useState("Loading your saved profile and reviewed routes…");
  const [selectedPathway, setSelectedPathway] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    setMessage("Loading your saved profile and reviewed routes…");
    try {
      const response = await apiJson<FinderResponse>("opportunity-finder/recommendations", { timeoutMs: 15000 });
      if (response.contract_version !== "b11-v1") throw new Error("The B11 Finder update is still deploying. Please retry shortly.");
      setData(response);
      setSelectedPathway(response.recommendations[0]?.pathway || "");
      setState("ready");
      setMessage("");
    } catch (error) {
      setData(null);
      if (error instanceof ApiError && error.status === 401) {
        setState("signed_out");
        setMessage("Sign in to use the relocation profile you already saved.");
      } else if (error instanceof ApiError && error.status === 404) {
        setState("profile_required");
        setMessage("Complete one relocation profile so MoveReady can rank realistic pathway leads.");
      } else {
        setState("error");
        setMessage(error instanceof Error ? error.message : "Finder is temporarily unavailable.");
      }
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const selected = useMemo(
    () => data?.recommendations.find((item) => item.pathway === selectedPathway) || data?.recommendations[0],
    [data, selectedPathway],
  );

  if (state !== "ready" || !data) {
    return (
      <section className="section finder-shell" aria-live="polite">
        <div className="section-heading-row"><div><p className="overline">FIND</p><h2>Your route leads</h2></div><span className="status-dot">{state === "loading" ? "Checking" : "Action needed"}</span></div>
        <article className="result-block soft" role={state === "error" ? "alert" : undefined}>
          <h3>{state === "loading" ? "Checking your current profile…" : message}</h3>
          <p>{state === "loading" ? "MoveReady is matching recorded profile signals to reviewed route records. This is not an eligibility check." : "No new profile or private document is created by this screen."}</p>
          {state !== "loading" ? <div className="actions">
            {state === "signed_out" ? <a className="btn primary" href="/dashboard">Sign in</a> : null}
            {state === "profile_required" ? <a className="btn primary" href="/onboarding">Complete profile</a> : null}
            <button className="btn" type="button" onClick={load}>Retry</button>
          </div> : null}
        </article>
      </section>
    );
  }

  return (
    <section className="section finder-shell" aria-live="polite">
      <div className="section-heading-row">
        <div>
          <p className="overline">FIND → QUALIFY</p>
          <h2>Your source-aware route leads</h2>
          <p className="section-intro">These scores rank profile alignment only. Open a candidate to see evidence, costs, timing, risks, source freshness and the exact next action.</p>
        </div>
        <span className="status-dot">B11 · Profile-driven</span>
      </div>

      <div className="finder-context-bar">
        <div><span>Goal</span><strong>{readableLabel(data.profile_goal)}</strong></div>
        <div><span>Target</span><strong>{data.target_country || "Choose a country"}</strong></div>
        <div><span>Reviewed route records</span><strong>{data.route_candidate_count}</strong></div>
        <div><span>Public opportunities</span><strong>{data.live_opportunity_count}</strong></div>
      </div>

      <div className="finder-layout">
        <nav className="finder-recommendations" aria-label="Pathway recommendations">
          {data.recommendations.map((recommendation) => {
            const active = selected?.pathway === recommendation.pathway;
            return (
              <button type="button" className={`finder-pathway-button ${active ? "is-active" : ""}`} aria-pressed={active} onClick={() => setSelectedPathway(recommendation.pathway)} key={recommendation.pathway}>
                <span><b>{recommendation.title}</b><small>{readableLabel(recommendation.fit_label)}</small></span>
                <strong>{recommendation.fit_score}<small>/100</small></strong>
                <span className="finder-score-track" aria-label={`${recommendation.fit_score} out of 100 profile alignment`}><i style={{ width: `${recommendation.fit_score}%` }} /></span>
              </button>
            );
          })}
        </nav>

        {selected ? (
          <div className="finder-selected" tabIndex={-1}>
            <div className="finder-card-heading">
              <div><p className="overline">{readableLabel(selected.fit_label)} · profile alignment</p><h3>{selected.title}</h3></div>
              <span className="finder-score-pill">{selected.fit_score}/100</span>
            </div>
            <div className="finder-truth-strip"><strong>Qualification: not determined</strong><span>Route-specific rules and evidence must still be checked against official sources.</span></div>
            <div className="finder-signal-grid">
              <section><p className="overline">Known signals</p><ul>{selected.qualification.known_signals.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section><p className="overline">Gaps to close</p>{selected.qualification.gaps.length ? <ul>{selected.qualification.gaps.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No general profile gaps detected. Exact route review is still required.</p>}</section>
            </div>
            <div className="actions compact-actions">
              {selected.next_actions.map((action, index) => <a className={`btn ${index === 0 ? "primary" : ""}`} href={action.href} key={action.href}>{action.label}</a>)}
            </div>
            <div className="finder-route-list">
              <div><p className="overline">Candidate routes</p><h3>{selected.candidate_routes.length ? "Review the exact route records" : "No reviewed exact route is linked yet"}</h3></div>
              {selected.candidate_routes.length ? selected.candidate_routes.map((route) => <RouteCard route={route} key={route.route_id || `${route.country_code}-${route.route_code}`} />) : <article className="result-block soft"><p>Use Compare to explore public route records. A profile score alone will not create or imply a route match.</p><a className="btn" href="/compare">Compare routes</a></article>}
            </div>
          </div>
        ) : null}
      </div>

      {data.matching_opportunities.length ? (
        <section className="finder-opportunities">
          <div><p className="overline">Official opportunities</p><h3>Reviewed openings for your target</h3></div>
          <div className="finder-opportunity-grid">
            {data.matching_opportunities.map((item) => (
              <article key={item.id || item.code || item.name}>
                <span className="badge">{readableLabel(item.availability_status, "monitoring")}</span>
                <h4>{item.name}</h4><p>{item.summary || item.eligibility_summary}</p>
                <small>{readableLabel(item.freshness_status)} · checked {dateLabel(item.last_verified_at)}</small>
                {item.official_url ? <a className="btn" href={item.official_url} target="_blank" rel="noreferrer">Open official source</a> : <span className="finder-source-state is-review">Official link review needed</span>}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {data.profile_gaps.length ? <article className="result-block soft finder-gap-block"><p className="overline">Profile gaps</p><div className="mini-list">{data.profile_gaps.map((gap, index) => <div key={gap}><strong>Improve signal {index + 1}</strong><span>{gap}</span></div>)}</div><a className="btn" href="/onboarding">Update profile</a></article> : null}
      <p className="form-status finder-safety-note">{data.safety_note} Retrieved {dateLabel(data.retrieved_at)}.</p>
    </section>
  );
}
