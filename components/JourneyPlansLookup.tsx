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
  study_admission_plan: "Study admission and visa plan",
  trip_readiness_plan: "Trip readiness and booking plan",
  legalization_check: "Document legalization plan",
  family_plan: "Family relocation plan",
  appointment_plan: "Appointment preparation plan",
  settlement_plan: "Post-arrival settlement plan",
};


const rerunLinks: Record<string, string> = {
  study_admission_plan: "/study-planner#study-admission-planner",
  trip_readiness_plan: "/trip-planner#trip-planner-tool",
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
  const target = result.target_country || input.target_country || result.destination_country || input.destination_country || result.receiving_country || input.receiving_country;
  const city = result.target_city || input.target_city || result.destination_city || input.destination_city;
  return [target, city].filter(Boolean).join(" · ") || "No destination recorded";
}


function resultHighlights(plan: JourneyPlan) {
  const result = plan.result_payload || {};
  const highlights: string[] = [];
  if (result.desired_level) highlights.push(`Study level: ${readable(result.desired_level)}`);
  if (result.desired_field) highlights.push(`Field: ${result.desired_field}`);
  if (result.planning_funding_gap !== undefined && result.planning_funding_gap !== null) highlights.push(`Funding gap: ${result.currency || ""} ${Number(result.planning_funding_gap).toLocaleString()}`.trim());
  if (result.trip_purpose) highlights.push(`Trip: ${readable(result.trip_purpose)}`);
  if (result.traveller_count) highlights.push(`Travellers ${result.traveller_count}`);
  if (result.departure_date) highlights.push(`Departure ${result.departure_date}`);
  if (result.approved_provider_count !== undefined) highlights.push(`Approved providers ${result.approved_provider_count || 0}`);
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
  const [message, setMessage] = useState("Checking for saved planning runs connected to your verified account...");
  const [loading, setLoading] = useState(false);

  async function loadPlans(silent = false) {
    if (!silent) {
      setLoading(true);
      setMessage("Loading saved plans...");
    }
    try {
      const data = await apiJson<AccountSummary>("account/summary", { timeoutMs: 20000 });
      const section = data.sections?.journey_plans;
      const rows = section?.rows || [];
      setPlans(rows);
      setAccountEmail(data.session?.email || "");
      if (section?.ok === false) {
        setMessage("Planning history is not available yet. The readiness storage table may need the latest SQL setup.");
      } else {
        setMessage(rows.length ? "Verified account planning history loaded." : "No saved plans are connected to this account yet. Run a planner while signed in.");
      }
    } catch (error) {
      const apiError = error as ApiError;
      setPlans([]);
      setAccountEmail("");
      setMessage(apiError?.status === 401 ? "Sign in before loading private planning history." : apiError?.message || "Unable to load saved plans right now.");
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
            <h2>My Study, Trip, and Journey Plans</h2>
          </div>
          <span className="status-dot">{accountEmail ? "Verified" : "Sign in"}</span>
        </div>
        <p className="section-intro">
          Study, trip, document, family, appointment, and settlement plans appear here only when the run is connected to a verified signed-in email. Anonymous runs cannot be recovered by guessing an email later.
        </p>
        {accountEmail ? <p className="form-status">Signed in as {accountEmail}</p> : null}
        <div className="actions">
          <button className="btn primary" type="button" disabled={loading} onClick={() => loadPlans(false)}>
            {loading ? "Loading..." : "Load my plans"}
          </button>
          <a className="btn" href="/study-planner">Create study plan</a>
          <a className="btn" href="/trip-planner">Create trip plan</a>
          <a className="btn" href="/journey-planner">Create journey plan</a>
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
              const title = planLabels[plan.tool_slug || ""] || readable(plan.tool_slug || "Planning result");
              return (
                <article className="result-block" key={plan.id || `${plan.tool_slug}-${plan.created_at}`}>
                  <div className="panel-heading">
                    <div><p className="overline">Saved planning run</p><h2>{title}</h2></div>
                    <span className="status-dot">{readable(plan.readiness_status || result.readiness_status)}</span>
                  </div>
                  <p>{result.summary || "Saved MoveReady planning result."}</p>
                  <div className="badge-row">
                    <span className="badge">Risk: {readable(plan.risk_level || result.risk_level)}</span>
                    <span className="badge">{targetLine(plan)}</span>
                    <span className="badge">{formatDate(plan.created_at)}</span>
                    {highlights.map((item) => <span className="badge" key={item}>{item}</span>)}
                  </div>
                  {warnings.length ? <div className="mini-list" style={{ marginTop: 14 }}>{warnings.map((warning, index) => <div key={index}><strong>Warning {index + 1}</strong><span>{warning}</span></div>)}</div> : null}
                  <div className="actions" style={{ marginTop: 14 }}>
                    <a className="btn primary" href={rerunLinks[plan.tool_slug || ""] || "/journey-planner"}>Review or run again</a>
                    {plan.tool_slug === "study_admission_plan" ? <a className="btn" href="/route-checker">Check study route</a> : null}
                    {plan.tool_slug === "trip_readiness_plan" ? <a className="btn" href="/services?service=travel_booking">Request booking support</a> : null}
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
            <h2>Run a planner while signed in.</h2>
            <p>The verified account email will be attached server-side and the stored plan can then appear here.</p>
            <div className="actions"><a className="btn primary" href="/study-planner">Study Planner</a><a className="btn" href="/trip-planner">Trip Planner</a><a className="btn" href="/journey-planner">Journey Planner</a><a className="btn" href="/login">Sign in</a></div>
          </article>
        )}
      </section>
    </div>
  );
}
