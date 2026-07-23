"use client";

import { FormEvent, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type SettlementTask = { task?: string; priority?: string };
type SettlementResult = {
  ok?: boolean;
  target_country?: string;
  target_city?: string;
  arrival_date?: string | null;
  household_size?: number;
  risk_level?: string;
  readiness_status?: string;
  summary?: string;
  timeline?: Record<string, SettlementTask[]>;
  warnings?: string[];
  timeline_saved_count?: number;
  timeline_storage_note?: string;
  fraud_checks?: string[];
  safety_note?: string;
  stored?: boolean;
};

function readable(value?: string | null) {
  return String(value || "not set").replace(/_/g, " ");
}

function sourcePage() {
  try {
    return typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/journey-planner";
  } catch {
    return "/journey-planner";
  }
}

export default function SettlementTimelineWorkspace() {
  const [result, setResult] = useState<SettlementResult | null>(null);
  const [message, setMessage] = useState("Generate a dated settlement plan and optionally save its tasks to your private timeline.");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    setMessage("Generating settlement plan and processing timeline consent...");
    try {
      const response = await apiJson<SettlementResult>("journey/settlement-plan", {
        method: "POST",
        body: {
          target_country: String(data.get("target_country") || "").trim(),
          target_city: String(data.get("target_city") || "").trim(),
          current_country: String(data.get("current_country") || "").trim(),
          arrival_date: String(data.get("arrival_date") || ""),
          household_size: Number(data.get("household_size") || 1),
          pets_count: Number(data.get("pets_count") || 0),
          route_category: String(data.get("route_category") || "settlement"),
          temporary_accommodation_confirmed: data.get("temporary_accommodation_confirmed") === "on",
          permanent_housing_confirmed: data.get("permanent_housing_confirmed") === "on",
          insurance_active: data.get("insurance_active") === "on",
          school_needed: data.get("school_needed") === "on",
          employment_or_business_start_planned: data.get("employment_or_business_start_planned") === "on",
          medical_or_accessibility_need: data.get("medical_or_accessibility_need") === "on",
          save_to_timeline: data.get("save_to_timeline") === "on",
          full_name: String(data.get("full_name") || "").trim(),
          email: String(data.get("email") || "").trim(),
          phone: String(data.get("phone") || "").trim(),
          preferred_channel: String(data.get("preferred_channel") || "in_app"),
          consent_to_contact: data.get("consent_to_contact") === "on",
          source_page: sourcePage(),
        },
        timeoutMs: 30000,
        useAuthToken: false,
      });
      setResult(response);
      setMessage(response.timeline_storage_note || "Settlement plan generated.");
    } catch (error) {
      const apiError = error as ApiError;
      setResult(null);
      setMessage(apiError?.data?.error || apiError?.message || "Unable to generate settlement timeline.");
    } finally {
      setLoading(false);
    }
  }

  const timelineGroups = result?.timeline ? Object.entries(result.timeline) : [];

  return (
    <div className="live-workspace">
      <form className="workflow-panel live-form" onSubmit={submit}>
        <div className="panel-heading">
          <div><p className="overline">Settlement execution</p><h2>Save arrival tasks to your timeline</h2></div>
          <span className="status-dot">Consent required</span>
        </div>
        <p>Generate before-travel, first-72-hours, first-two-weeks, and first-90-days tasks. Saving requires an arrival date, contact lookup, and explicit consent.</p>
        <div className="form-grid two-col">
          <div className="field"><label htmlFor="settlement_target_country">Target country</label><input id="settlement_target_country" name="target_country" required /></div>
          <div className="field"><label htmlFor="settlement_target_city">Target city</label><input id="settlement_target_city" name="target_city" /></div>
          <div className="field"><label htmlFor="settlement_current_country">Current country</label><input id="settlement_current_country" name="current_country" /></div>
          <div className="field"><label htmlFor="settlement_arrival_date">Planned arrival date</label><input id="settlement_arrival_date" name="arrival_date" type="date" required /></div>
          <div className="field"><label htmlFor="settlement_household_size">Household size</label><input id="settlement_household_size" name="household_size" type="number" defaultValue="1" min="1" max="30" /></div>
          <div className="field"><label htmlFor="settlement_pets_count">Pets count</label><input id="settlement_pets_count" name="pets_count" type="number" defaultValue="0" min="0" max="10" /></div>
          <div className="field"><label htmlFor="settlement_route_category">Route category</label><input id="settlement_route_category" name="route_category" placeholder="startup, study, work, family" /></div>
        </div>
        <div className="journey-checks">
          <label className="checkbox-field"><input name="temporary_accommodation_confirmed" type="checkbox" />Arrival accommodation is verified and confirmed.</label>
          <label className="checkbox-field"><input name="permanent_housing_confirmed" type="checkbox" />Longer-term housing is confirmed.</label>
          <label className="checkbox-field"><input name="insurance_active" type="checkbox" />Health or route-required insurance will be active at arrival.</label>
          <label className="checkbox-field"><input name="school_needed" type="checkbox" />School or childcare setup is needed.</label>
          <label className="checkbox-field"><input name="employment_or_business_start_planned" type="checkbox" />Employment or business start must be organized.</label>
          <label className="checkbox-field"><input name="medical_or_accessibility_need" type="checkbox" />Medical, medication, accessibility, or continuity-of-care support is needed.</label>
          <label className="checkbox-field"><input name="save_to_timeline" type="checkbox" defaultChecked />Save generated tasks to my private timeline.</label>
        </div>
        <div className="form-grid two-col">
          <div className="field"><label htmlFor="settlement_full_name">Full name</label><input id="settlement_full_name" name="full_name" /></div>
          <div className="field"><label htmlFor="settlement_email">Email for private lookup</label><input id="settlement_email" name="email" type="email" /></div>
          <div className="field"><label htmlFor="settlement_phone">Phone</label><input id="settlement_phone" name="phone" /></div>
          <div className="field"><label htmlFor="settlement_channel">Preferred reminder channel</label><select id="settlement_channel" name="preferred_channel" defaultValue="in_app"><option value="in_app">In app</option><option value="email">Email</option><option value="whatsapp">WhatsApp</option><option value="telegram">Telegram</option></select></div>
        </div>
        <label className="checkbox-field"><input name="consent_to_contact" type="checkbox" /><span>I consent to storing these settlement timeline events and the contact details used for private lookup. External messages remain disabled until their delivery controls are approved.</span></label>
        <button className="btn primary" type="submit" disabled={loading}>{loading ? "Generating..." : "Generate and save settlement tasks"}</button>
        <p className="form-status">{message}</p>
      </form>

      <section className="result-panel">
        {result ? (
          <div className="result-stack">
            <article className="result-block featured">
              <div className="panel-heading"><div><p className="overline">Settlement result</p><h2>{result.target_country || "Target country"}{result.target_city ? ` · ${result.target_city}` : ""}</h2></div><span className="status-dot">Risk: {readable(result.risk_level)}</span></div>
              <p>{result.summary}</p>
              <div className="badge-row"><span className="badge">Readiness: {readable(result.readiness_status)}</span><span className="badge">Household: {result.household_size || 1}</span><span className="badge">Timeline saved: {result.timeline_saved_count || 0}</span><span className="badge">Plan history: {result.stored ? "saved" : "result only"}</span></div>
              <p className="form-status">{result.timeline_storage_note}</p>
            </article>
            {timelineGroups.map(([stage, tasks]) => (
              <article className="result-block soft" key={stage}>
                <p className="overline">{readable(stage)}</p>
                <div className="mini-list">{tasks.map((task, index) => <div key={`${task.task}-${index}`}><strong>{readable(task.priority)} priority</strong><span>{task.task}</span></div>)}</div>
              </article>
            ))}
            <article className="result-block soft">
              {(result.warnings || []).length ? <p className="form-status"><strong>Warnings:</strong> {(result.warnings || []).join(" ")}</p> : null}
              <div className="mini-list">{(result.fraud_checks || []).map((item, index) => <div key={item}><strong>Safety {index + 1}</strong><span>{item}</span></div>)}</div>
              <p className="form-status">{result.safety_note}</p>
              <div className="actions"><a className="btn primary" href="/timeline">Open saved timeline</a><a className="btn" href="/journey-plans">Open planning history</a></div>
            </article>
          </div>
        ) : (
          <article className="result-block soft"><p className="overline">Settlement result</p><h2>No dated settlement plan generated</h2><p>Enter an arrival date and contact lookup, confirm consent, then generate the plan.</p></article>
        )}
      </section>
    </div>
  );
}
