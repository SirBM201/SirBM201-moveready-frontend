"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type Profile = {
  id?: string;
  full_name?: string;
  email?: string;
  current_country?: string;
  residence_country?: string;
  target_country?: string;
  target_city?: string;
  main_goal?: string;
  goal?: string;
  route_category?: string;
  available_funds_amount?: number;
  available_funds_currency?: string;
  family_members_count?: number;
  timeline_months?: number;
  readiness_snapshot?: {
    readiness_score?: number;
    readiness_level?: string;
    risk_flags?: string[];
  };
};

type ApplicationCase = {
  case_ref?: string;
  case_title?: string;
  application_stage?: string;
  status?: string;
  risk_level?: string;
  target_country?: string;
  route_name?: string;
  route_category?: string;
  source_status?: string;
  next_deadline_at?: string;
  decision_date?: string;
  result_summary?: string;
  warnings?: string[];
};

type EvidencePack = {
  pack_ref?: string;
  status?: string;
  completeness_score?: number;
  risk_level?: string;
  target_country?: string;
  route_category?: string;
  missing_items?: unknown[];
};

type Report = {
  report_ref?: string;
  report_title?: string;
  status?: string;
  risk_level?: string;
  generated_at?: string;
};

type AccountSection<T> = {
  ok?: boolean;
  count?: number;
  rows?: T[];
  error?: string;
};

type AccountSummary = {
  ok: boolean;
  session?: { email?: string; expires_at?: string };
  counts?: Record<string, number>;
  latest_profile?: Profile | null;
  sections?: {
    profiles?: AccountSection<Profile>;
    saved_routes?: AccountSection<Record<string, unknown>>;
    evidence_documents?: AccountSection<Record<string, unknown>>;
    evidence_packs?: AccountSection<EvidencePack>;
    application_cases?: AccountSection<ApplicationCase>;
    reports?: AccountSection<Report>;
    journey_plans?: AccountSection<Record<string, unknown>>;
    timeline?: AccountSection<Record<string, unknown>>;
    watchlist?: AccountSection<Record<string, unknown>>;
    commercial_quotes?: AccountSection<Record<string, unknown>>;
    service_handoffs?: AccountSection<Record<string, unknown>>;
  };
};

type ActionResponse = {
  ok: boolean;
  action_count?: number;
  counts_by_priority?: Record<string, number>;
  actions?: Array<{
    kind: string;
    title: string;
    summary: string;
    priority: string;
    href: string;
    due_at?: string;
  }>;
};

type JourneyStage = {
  key: string;
  number: number;
  title: string;
  detail: string;
  status: "complete" | "active" | "not_started" | "attention";
  href: string;
  evidence: string;
};

function readable(value?: string) {
  return String(value || "not recorded").replaceAll("_", " ");
}

function formatDate(value?: string) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function first<T>(section?: AccountSection<T>) {
  return section?.rows?.[0];
}

export default function MyJourneyOverview() {
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [actions, setActions] = useState<ActionResponse | null>(null);
  const [message, setMessage] = useState("Building your private journey overview...");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setMessage("Connecting profile, routes, evidence, reports, applications, alerts, and settlement progress...");
    try {
      const [accountResponse, actionResponse] = await Promise.all([
        apiJson<AccountSummary>("account/summary", { timeoutMs: 30000 }),
        apiJson<ActionResponse>("account/action-center", { query: { limit: 20 }, timeoutMs: 40000 }),
      ]);
      setSummary(accountResponse);
      setActions(actionResponse);
      setMessage("Journey overview loaded from your verified account records.");
    } catch (error) {
      const apiError = error as ApiError;
      setSummary(null);
      setActions(null);
      setMessage(apiError?.status === 401
        ? "Sign in with your verified account to build a private journey overview."
        : "Journey overview is unavailable until the latest backend deployment and required migrations are active.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const counts = summary?.counts || {};
  const profile = summary?.latest_profile || first(summary?.sections?.profiles) || null;
  const application = first(summary?.sections?.application_cases);
  const evidencePack = first(summary?.sections?.evidence_packs);
  const report = first(summary?.sections?.reports);
  const criticalActions = actions?.counts_by_priority?.critical || 0;
  const highActions = actions?.counts_by_priority?.high || 0;

  const stages: JourneyStage[] = useMemo(() => {
    const hasProfile = (counts.profiles || 0) > 0;
    const hasRoute = (counts.saved_routes || 0) > 0 || (counts.readiness_checks || 0) > 0;
    const hasEvidence = (counts.evidence_documents || 0) > 0 || (counts.evidence_packs || 0) > 0;
    const hasReport = (counts.reports || 0) > 0;
    const hasPlan = (counts.journey_plans || 0) > 0 || (counts.timeline || 0) > 0;
    const hasApplication = (counts.application_cases || 0) > 0;
    const terminalStage = ["approved", "refused", "withdrawn", "expired", "closed"].includes(String(application?.application_stage || ""));
    const hasSettlement = hasPlan && terminalStage;
    const applicationAttention = application?.status === "attention_required"
      || ["high", "critical"].includes(String(application?.risk_level || ""));

    return [
      {
        key: "profile",
        number: 1,
        title: "Profile foundation",
        detail: "Current country, target, goal, funds, family, and timeline.",
        status: hasProfile ? "complete" : "active",
        href: "/dashboard#profile-dashboard",
        evidence: hasProfile ? `${profile?.target_country || "Target recorded"} · ${readable(profile?.route_category || profile?.main_goal || profile?.goal)}` : "No saved profile yet",
      },
      {
        key: "route",
        number: 2,
        title: "Route verification",
        detail: "Country and route comparison, official sources, eligibility, funds, documents, and risks.",
        status: hasRoute ? "complete" : hasProfile ? "active" : "not_started",
        href: "/route-checker",
        evidence: hasRoute ? `${counts.saved_routes || 0} saved route(s) · ${counts.readiness_checks || 0} readiness check(s)` : "No route evidence yet",
      },
      {
        key: "evidence",
        number: 3,
        title: "Evidence preparation",
        detail: "Document metadata, expiry, translation, legalization, completeness, and refusal-repair tasks.",
        status: hasEvidence
          ? ["high", "critical"].includes(String(evidencePack?.risk_level || "")) || evidencePack?.status === "stale" ? "attention" : "complete"
          : hasRoute ? "active" : "not_started",
        href: "/evidence-pack",
        evidence: hasEvidence ? `${counts.evidence_documents || 0} document record(s) · pack completeness ${evidencePack?.completeness_score ?? 0}%` : "No evidence inventory yet",
      },
      {
        key: "report",
        number: 4,
        title: "Readiness decision",
        detail: "Source status, risk level, document gaps, funds pressure, and recommended next actions.",
        status: hasReport ? "complete" : hasEvidence ? "active" : "not_started",
        href: "/my-reports",
        evidence: hasReport ? `${report?.report_ref || "Saved report"} · ${readable(report?.risk_level)}` : "No saved readiness report yet",
      },
      {
        key: "planning",
        number: 5,
        title: "Execution planning",
        detail: "Study, documents, legalization, family, appointments, travel, timeline, and settlement preparation.",
        status: hasPlan ? "complete" : hasReport ? "active" : "not_started",
        href: "/journey-plans",
        evidence: hasPlan ? `${counts.journey_plans || 0} plan(s) · ${counts.timeline || 0} timeline task(s)` : "No saved execution plan yet",
      },
      {
        key: "application",
        number: 6,
        title: "Live application",
        detail: "Authority, evidence, appointment, submission, deadlines, fees, communications, and requests.",
        status: hasApplication ? applicationAttention ? "attention" : terminalStage ? "complete" : "active" : hasPlan ? "active" : "not_started",
        href: "/applications",
        evidence: hasApplication ? `${application?.case_ref || application?.case_title || "Application case"} · ${readable(application?.application_stage)}` : "No real application case opened",
      },
      {
        key: "decision",
        number: 7,
        title: "Decision and next route",
        detail: "Record the factual decision and prepare approval, refusal-repair, withdrawal, expiry, or closure actions.",
        status: terminalStage ? application?.application_stage === "refused" ? "attention" : "complete" : hasApplication ? "active" : "not_started",
        href: "/applications",
        evidence: terminalStage ? `${readable(application?.application_stage)} · ${application?.decision_date || "decision date not recorded"}` : "No terminal decision recorded",
      },
      {
        key: "settlement",
        number: 8,
        title: "Travel and settlement",
        detail: "Booking readiness, entry conditions, accommodation, insurance, registration, tax, school, work, and first 90 days.",
        status: hasSettlement ? "active" : terminalStage && application?.application_stage === "approved" ? "active" : "not_started",
        href: "/journey-planner#settlement",
        evidence: hasSettlement ? "Settlement planning records exist" : "Settlement begins only after the route and decision support it",
      },
    ];
  }, [counts, profile, application, evidencePack, report]);

  const completeCount = stages.filter((stage) => stage.status === "complete").length;
  const attentionCount = stages.filter((stage) => stage.status === "attention").length;
  const progress = Math.round((completeCount / stages.length) * 100);
  const nextStage = stages.find((stage) => stage.status === "attention") || stages.find((stage) => stage.status === "active") || stages.find((stage) => stage.status === "not_started") || stages[stages.length - 1];

  return (
    <div className="result-stack">
      <article className="result-block featured">
        <div className="panel-heading">
          <div>
            <p className="overline">Private journey overview</p>
            <h2>{profile?.target_country ? `${profile.target_country} journey` : "Your MoveReady journey"}</h2>
          </div>
          <span className="status-dot">{progress}% recorded</span>
        </div>
        <p>{message}</p>
        <div className="grid">
          <article className="card">
            <p className="overline">Current direction</p>
            <h3>{profile?.target_country || "Not selected"}</h3>
            <p>{readable(profile?.route_category || profile?.main_goal || profile?.goal)} · from {profile?.current_country || profile?.residence_country || "current country not recorded"}</p>
          </article>
          <article className="card">
            <p className="overline">Readiness snapshot</p>
            <h3>{profile?.readiness_snapshot?.readiness_score ?? 0}/100</h3>
            <p>{readable(profile?.readiness_snapshot?.readiness_level)} · {profile?.readiness_snapshot?.risk_flags?.length || 0} recorded risk flag(s)</p>
          </article>
          <a className="card" href="/action-center">
            <p className="overline">Next actions</p>
            <h3>{actions?.action_count || 0}</h3>
            <p>{criticalActions} critical · {highActions} high priority</p>
          </a>
          <article className="card">
            <p className="overline">Journey stages</p>
            <h3>{completeCount}/{stages.length}</h3>
            <p>{attentionCount} stage(s) need attention</p>
          </article>
        </div>
        <div style={{ height: 12, borderRadius: 999, background: "rgba(15, 23, 42, 0.12)", overflow: "hidden", margin: "18px 0" }} aria-label={`Recorded journey progress ${progress}%`}>
          <div style={{ width: `${progress}%`, height: "100%", background: "currentColor", opacity: 0.75 }} />
        </div>
        <div className="actions">
          <a className="btn primary" href={nextStage.href}>{nextStage.status === "attention" ? "Review urgent journey stage" : `Continue with ${nextStage.title}`}</a>
          <a className="btn" href="/action-center">Open Action Center</a>
          <button className="btn" type="button" onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh journey"}</button>
        </div>
      </article>

      <section className="grid">
        {stages.map((stage) => (
          <article className={`card ${stage.status === "complete" ? "soft" : ""}`} key={stage.key}>
            <p className="overline">Stage {stage.number} · {readable(stage.status)}</p>
            <h3>{stage.title}</h3>
            <p>{stage.detail}</p>
            <p><strong>Account evidence:</strong><br />{stage.evidence}</p>
            <a className={stage.status === "attention" || stage.status === "active" ? "btn primary" : "btn"} href={stage.href}>{stage.status === "complete" ? "Review stage" : stage.status === "attention" ? "Resolve attention" : "Open stage"}</a>
          </article>
        ))}
      </section>

      {application && (
        <article className="result-block">
          <p className="overline">Latest application case</p>
          <h2>{application.case_title || application.case_ref || "Application case"}</h2>
          <div className="mini-list">
            <div><strong>Stage</strong><span>{readable(application.application_stage)}</span></div>
            <div><strong>Status and risk</strong><span>{readable(application.status)} · {readable(application.risk_level)}</span></div>
            <div><strong>Official source</strong><span>{readable(application.source_status)}</span></div>
            <div><strong>Next deadline</strong><span>{formatDate(application.next_deadline_at)}</span></div>
            <div><strong>Decision</strong><span>{application.result_summary || "No terminal decision summary recorded"}</span></div>
          </div>
          <div className="actions">
            <a className="btn primary" href="/applications">Open Application Center</a>
            <a className="btn" href="/application-alerts">Review application alerts</a>
          </div>
        </article>
      )}

      <article className="result-block soft">
        <p className="overline">Truthful progress</p>
        <p>Journey progress reflects records saved in MoveReady, not an immigration authority’s assessment. Missing records are not assumed complete, and an approved-looking readiness stage is not a visa, admission, residence, travel-entry, job, booking, or provider guarantee.</p>
      </article>
    </div>
  );
}
