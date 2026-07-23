"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type JourneyPlan = {
  id?: string;
  tool_slug?: string;
  risk_level?: string;
  readiness_status?: string;
  input_payload?: Record<string, any>;
  result_payload?: Record<string, any>;
  source_page?: string;
  created_at?: string;
};


type AccountSummary = {
  ok: boolean;
  session?: { email?: string };
  sections?: {
    journey_plans?: {
      rows?: JourneyPlan[];
      count?: number;
      ok?: boolean;
      error?: string;
    };
  };
};


const planLabels: Record<string, string> = {
  legalization_check: "Document legalization plan",
  family_plan: "Family relocation plan",
  appointment_plan: "Appointment preparation plan",
  settlement_plan: "Post-arrival settlement plan",
};


const rerunLinks: Record<string, string> = {
  legalization_check: "/legalization#legalization-planner",
  family_plan: "/family-planner#family-planner-tool",
  appointment_plan: "/timeline#appointment-planner-tool",
  settlement_plan: "/settlement#settlement-planner-tool",
};


function readable(value: unknown) {
  return String(value || "not available").replace(/_/g, " ");
}


function formatDate(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}


function targetLine(plan: JourneyPlan) {
  const input = plan.input_payload || {};
  const result = plan.result_payload || {};
  const target = result.target_country || input.target_country || result.receiving_country || input.receiving_country;
  const city = result.target_city || input.target_city;
  return [target, city].filter(Boolean).join(" · ") || "No destination recorded";
}


function resultHighlights(plan: JourneyPlan) {
  const result = plan.result_payload || {};
  const highlights: string[] = [];
  if (result.household_size) highlights.push(`Household ${result.household_size}`);
  if (result.planning_budget_multiplier) highlights.push(`Budget pressure ${result.planning_budget_multiplier}×`);
  if (result.appointment_date) highlights.push(`Appointment ${result.appointment_date}`);
  if (result.timeline_saved_count !== undefined) highlights.push(`${result.timeline_saved_count || 0} timeline events saved`);
  if (result.document_type) highlights.push(readable(result.document_type));
  if (result.arrival_date) highlights.push(`Arrival ${result.arrival_date}`);
  return highlights;
}


export default function JourneyPlansLookup() {
  const [plans, setPlans] = useState<JourneyPlan[]>([]);
  const [accountEmail, setAccountEmail] = useState("");
  const [message, setMessage] = useState("Checking for journey plans connected to your verified account...");
  const [loading, setLoading] = useState(false);

  async function loadPlans(silent = false) {
    if (!silent) {
      setLoading(true);
      setMessage("Loading journey plans...");
    }
    try {
      const data = await apiJson<AccountSummary>("account/summary", { timeoutMs: 20000 });
      const section = data.sections?.journey_plans;
      const rows = section?.rows || [];
      setPlans(rows);
      setAccountEmail(data.session?.email || "");
      if (section?.ok === false) {
        setMessage("Journey plan history is not available yet. The readiness storage table may need the latest SQL setup.");
      } else {
        setMessage(rows.length ? "Verified account journey plans loaded." : "No journey plans are connected to this account yet. Run a planner while signed in.");
      }
    } catch (error) {
      const apiError = error as ApiError;
      setPlans([]);
      setAccountEmail("");
      setMessage(apiError?.status === 401 ? "Sign in before loading private journey plans." : apiError?.message || "Unable to load journey plans right now.");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans(true);
  }, []);

  return (
    <div className="live-workspace reports-workspace">
      <section className="workflow-panel live-form">
        <div className="panel-heading">
          <div>
            <p className="overline">Account history</p>
            <h2>My Journey Plans</h2>
          </div>
          <span className="status-dot">{accountEmail ? "Verified" : "Sign in"}</span>
        </div>
        <p className="section-intro">
          Plans appear here only when the planner run is connected to a verified signed-in email. Older anonymous plans remain private but cannot be recovered by account lookup.
        </p>
        {accountEmail ? <p className="form-status">Signed in as {accountEmail}</p> : null}
        <div className="actions">
          <button className="btn primary" type="button" disabled={loading} onClick={() => loadPlans(false)}>
            {loading ? "Loading..." : "Load my journey plans"}
          </button>
          <a className="btn" href="/journey-planner">Create a new plan</a>
          <a className="btn" href="/dashboard">Back to Account Center</a>
        </div>
        <p className="form-status">{message}</p>
      </section>

      <section className="result-panel">
        {plans.length ? (
          <div className="result-stack">
            {plans.map((plan) => {
              const result = plan.result_payload || {};
              const warnings: string[] = Array.isArray(result.warnings) ? result.warnings : [];
              const highlights = resultHighlights(plan);
              const title = planLabels[plan.tool_slug || ""] || readable(plan.tool_slug || "Journey plan");
              return (
                <article className="result-block" key={plan.id || `${plan.tool_slug}-${plan.created_at}`}>
                  <div className="panel-heading">
                    <div>
                      <p className="overline">Saved journey plan</p>
                      <h2>{title}</h2>
                    </div>
                    <span className="status-dot">{readable(plan.readiness_status || result.readiness_status)}</span>
                  </div>
                  <p>{result.summary || "Saved MoveReady planning result."}</p>
                  <div className="badge-row">
                    <span className="badge">Risk: {readable(plan.risk_level || result.risk_level)}</span>
                    <span className="badge">{targetLine(plan)}</span>
                    <span className="badge">{formatDate(plan.created_at)}</span>
                    {highlights.map((item) => <span className="badge" key={item}>{item}</span>)}
                  </div>
                  {warnings.length ? (
                    <div className="mini-list" style={{ marginTop: 14 }}>
                      {warnings.map((warning, index) => <div key={index}><strong>Warning {index + 1}</strong><span>{warning}</span></div>)}
                    </div>
                  ) : null}
                  <div className="actions" style={{ marginTop: 14 }}>
                    <a className="btn primary" href={rerunLinks[plan.tool_slug || ""] || "/journey-planner"}>Review or run again</a>
                    {plan.tool_slug === "appointment_plan" ? <a className="btn" href="/timeline">Open timeline</a> : null}
                    {plan.tool_slug === "family_plan" ? <a className="btn" href="/route-checker">Check family route</a> : null}
                    {plan.tool_slug === "settlement_plan" ? <a className="btn" href="/services?service=settlement">Request settlement support</a> : null}
                    {plan.tool_slug === "legalization_check" ? <a className="btn" href="/services?service=legalization">Request document support</a> : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <article className="result-block featured">
            <p className="overline">No plans loaded</p>
            <h2>Run Journey Planner while signed in.</h2>
            <p>The verified account email will be attached server-side and the stored plan can then appear here.</p>
            <div className="actions"><a className="btn primary" href="/journey-planner">Open Journey Planner</a><a className="btn" href="/login">Sign in</a></div>
          </article>
        )}
      </section>
    </div>
  );
}
