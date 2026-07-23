"use client";

import { FormEvent, useState } from "react";

import { apiJson } from "@/lib/api";


type PlannerMode = "all" | "legalization" | "family" | "appointment" | "settlement";
type PlannerResult = Record<string, any> | null;


function sourcePage() {
  try {
    return typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/journey-planner";
  } catch {
    return "/journey-planner";
  }
}


function readable(value: unknown) {
  return String(value || "not available").replace(/_/g, " ");
}


function ResultHeader({ title, result }: { title: string; result: PlannerResult }) {
  if (!result) {
    return (
      <article className="result-block soft">
        <p className="overline">Result</p>
        <h3>{title}</h3>
        <p>Complete the form and run the planner to see the result here.</p>
      </article>
    );
  }

  return (
    <article className="result-block featured">
      <div className="panel-heading">
        <div>
          <p className="overline">Result</p>
          <h3>{title}</h3>
        </div>
        <span className="status-dot">Risk: {readable(result.risk_level)}</span>
      </div>
      {result.summary ? <p>{result.summary}</p> : null}
      <div className="badge-row">
        <span className="badge">Readiness: {readable(result.readiness_status)}</span>
        <span className="badge">Saved: {result.stored ? "yes" : "result only"}</span>
      </div>
    </article>
  );
}


function LegalizationResult({ result }: { result: PlannerResult }) {
  return (
    <div className="result-stack">
      <ResultHeader title="Document handling plan" result={result} />
      {result ? (
        <article className="result-block soft">
          <div className="mini-list">
            {(result.steps || []).map((step: any, index: number) => (
              <div key={`${step.step}-${index}`}>
                <strong>{index + 1}. {step.step}</strong>
                <span>Status: {readable(step.status)}. {step.detail}</span>
              </div>
            ))}
          </div>
          {(result.warnings || []).length ? (
            <p className="form-status"><strong>Warnings:</strong> {result.warnings.join(" ")}</p>
          ) : null}
          <p className="form-status">{result.safety_note}</p>
        </article>
      ) : null}
    </div>
  );
}


function FamilyResult({ result }: { result: PlannerResult }) {
  return (
    <div className="result-stack">
      <ResultHeader title="Household relocation plan" result={result} />
      {result ? (
        <>
          <article className="result-block soft">
            <div className="badge-row">
              <span className="badge">Household: {result.household_size}</span>
              <span className="badge">Children: {result.children_count}</span>
              <span className="badge">School-age: {result.school_age_children_count}</span>
              <span className="badge">Planning multiplier: {result.planning_budget_multiplier}×</span>
              {result.adjusted_planning_budget ? <span className="badge">Planning budget: {result.currency} {Number(result.adjusted_planning_budget).toLocaleString()}</span> : null}
            </div>
            <div className="mini-list" style={{ marginTop: 14 }}>
              {(result.member_checklists || []).map((member: any, index: number) => (
                <div key={`${member.member}-${index}`}>
                  <strong>{member.member}{member.age !== undefined ? ` · age ${member.age}` : ""}</strong>
                  <span>{(member.documents || []).join(", ")}</span>
                </div>
              ))}
            </div>
          </article>
          <article className="result-block soft">
            <p className="overline">Household actions</p>
            <div className="mini-list">
              {(result.tasks || []).map((task: string, index: number) => <div key={index}><strong>Action {index + 1}</strong><span>{task}</span></div>)}
            </div>
            {(result.warnings || []).length ? <p className="form-status"><strong>Warnings:</strong> {result.warnings.join(" ")}</p> : null}
            <p className="form-status">{result.safety_note}</p>
          </article>
        </>
      ) : null}
    </div>
  );
}


function AppointmentResult({ result }: { result: PlannerResult }) {
  return (
    <div className="result-stack">
      <ResultHeader title="Appointment preparation plan" result={result} />
      {result ? (
        <>
          <article className="result-block soft">
            <div className="badge-row">
              <span className="badge">Appointment: {result.appointment_date}</span>
              <span className="badge">Days remaining: {result.days_remaining}</span>
              <span className="badge">Timeline events saved: {result.timeline_saved_count || 0}</span>
            </div>
            <p className="form-status">{result.timeline_storage_note}</p>
            <div className="mini-list">
              {(result.tasks || []).map((task: any, index: number) => (
                <div key={`${task.title}-${index}`}>
                  <strong>{task.due_date} · {task.title}</strong>
                  <span>Priority: {task.priority}. {task.notes}</span>
                </div>
              ))}
            </div>
          </article>
          <article className="result-block soft">
            <p className="overline">Appointment pack</p>
            <div className="mini-list">
              {(result.appointment_checklist || []).map((item: string, index: number) => <div key={index}><strong>Check {index + 1}</strong><span>{item}</span></div>)}
            </div>
            {(result.warnings || []).length ? <p className="form-status"><strong>Warnings:</strong> {result.warnings.join(" ")}</p> : null}
          </article>
        </>
      ) : null}
    </div>
  );
}


function SettlementResult({ result }: { result: PlannerResult }) {
  const groups = result?.timeline && typeof result.timeline === "object" ? Object.entries(result.timeline) : [];
  return (
    <div className="result-stack">
      <ResultHeader title="Post-arrival settlement plan" result={result} />
      {result ? (
        <>
          {groups.map(([group, tasks]) => (
            <article className="result-block soft" key={group}>
              <p className="overline">{readable(group)}</p>
              <div className="mini-list">
                {(Array.isArray(tasks) ? tasks : []).map((task: any, index: number) => (
                  <div key={`${task.task}-${index}`}><strong>{task.priority} priority</strong><span>{task.task}</span></div>
                ))}
              </div>
            </article>
          ))}
          <article className="result-block soft">
            {(result.warnings || []).length ? <p className="form-status"><strong>Warnings:</strong> {result.warnings.join(" ")}</p> : null}
            <div className="mini-list">
              {(result.fraud_checks || []).map((item: string, index: number) => <div key={index}><strong>Safety check {index + 1}</strong><span>{item}</span></div>)}
            </div>
            <p className="form-status">{result.safety_note}</p>
          </article>
        </>
      ) : null}
    </div>
  );
}


export default function JourneyPlanner({ mode = "all" }: { mode?: PlannerMode }) {
  const [legalizationResult, setLegalizationResult] = useState<PlannerResult>(null);
  const [familyResult, setFamilyResult] = useState<PlannerResult>(null);
  const [appointmentResult, setAppointmentResult] = useState<PlannerResult>(null);
  const [settlementResult, setSettlementResult] = useState<PlannerResult>(null);
  const [status, setStatus] = useState("Choose a planner and complete the fields that apply to your situation.");

  const show = (name: PlannerMode) => mode === "all" || mode === name;

  async function run(
    event: FormEvent<HTMLFormElement>,
    endpoint: string,
    buildBody: (data: FormData) => Record<string, any>,
    setResult: (value: PlannerResult) => void,
  ) {
    event.preventDefault();
    setStatus("Generating your plan...");
    try {
      const formData = new FormData(event.currentTarget);
      const result = await apiJson(`journey/${endpoint}`, {
        method: "POST",
        body: { ...buildBody(formData), source_page: sourcePage() },
        useAuthToken: false,
        timeoutMs: 30000,
      });
      setResult(result as PlannerResult);
      setStatus("Plan generated. Review the warnings and official-source checks before taking action.");
    } catch (error: any) {
      setStatus(error?.message || "The planner could not run. Confirm the latest backend deployment and try again.");
    }
  }

  return (
    <div className="journey-planner-grid">
      <style>{`
        .journey-planner-grid { display: grid; gap: 18px; }
        .journey-tool { display: grid; gap: 16px; padding: 20px; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); box-shadow: var(--shadow); }
        .journey-tool-layout { display: grid; grid-template-columns: minmax(0, .92fr) minmax(0, 1.08fr); gap: 18px; align-items: start; }
        .journey-tool h2, .journey-tool h3 { margin-top: 0; }
        .journey-checks { display: grid; gap: 9px; }
        @media (max-width: 980px) { .journey-tool-layout { grid-template-columns: 1fr; } }
      `}</style>

      <article className="result-block soft">
        <div className="panel-heading">
          <div>
            <p className="overline">Journey planner</p>
            <h2>Move from application preparation to family arrival.</h2>
          </div>
          <span className="status-dot">Source confirmation required</span>
        </div>
        <p>{status}</p>
        <div className="badge-row">
          <span className="badge">Legalization</span>
          <span className="badge">Family</span>
          <span className="badge">Appointments</span>
          <span className="badge">Settlement</span>
        </div>
      </article>

      {show("legalization") ? (
        <article className="journey-tool" id="legalization-planner">
          <div><p className="overline">Document execution</p><h2>Legalization and translation path</h2><p className="section-intro">Organize the confirmed steps without guessing whether apostille or embassy legalization applies.</p></div>
          <div className="journey-tool-layout">
            <form className="form-grid" onSubmit={(event) => run(event, "legalization-check", (data) => ({
              issuing_country: String(data.get("issuing_country") || ""), receiving_country: String(data.get("receiving_country") || ""), document_type: String(data.get("document_type") || "other"), purpose: String(data.get("purpose") || ""), days_until_submission: Number(data.get("days_until_submission") || 30), has_original_document: data.get("has_original_document") === "on", translation_needed: data.get("translation_needed") === "on", translation_completed: data.get("translation_completed") === "on", notarization_confirmed: data.get("notarization_confirmed") === "on", ministry_authentication_confirmed: data.get("ministry_authentication_confirmed") === "on", apostille_confirmed: data.get("apostille_confirmed") === "on", embassy_legalization_confirmed: data.get("embassy_legalization_confirmed") === "on", receiving_authority_checked: data.get("receiving_authority_checked") === "on",
            }), setLegalizationResult)}>
              <div className="field"><label>Issuing country</label><input name="issuing_country" placeholder="Country that issued the document" required /></div>
              <div className="field"><label>Receiving country</label><input name="receiving_country" placeholder="Country where it will be used" required /></div>
              <div className="field"><label>Document type</label><select name="document_type" defaultValue="academic_certificate"><option value="birth_certificate">Birth certificate</option><option value="marriage_certificate">Marriage certificate</option><option value="academic_certificate">Academic certificate</option><option value="police_certificate">Police certificate</option><option value="bank_document">Bank document</option><option value="employment_document">Employment document</option><option value="business_document">Business document</option><option value="court_or_custody_document">Court or custody document</option><option value="medical_document">Medical document</option><option value="other">Other</option></select></div>
              <div className="field"><label>Purpose</label><input name="purpose" placeholder="Visa, school, work, licensing, family" /></div>
              <div className="field"><label>Days until submission</label><input name="days_until_submission" type="number" defaultValue="30" min="0" /></div>
              <div className="journey-checks">
                <label className="checkbox-field"><input name="receiving_authority_checked" type="checkbox" />I checked the written instruction from the authority receiving the document.</label>
                <label className="checkbox-field"><input name="has_original_document" type="checkbox" />I have the accepted original or certified copy.</label>
                <label className="checkbox-field"><input name="translation_needed" type="checkbox" />Translation is required.</label>
                <label className="checkbox-field"><input name="translation_completed" type="checkbox" />The required translation is completed.</label>
                <label className="checkbox-field"><input name="notarization_confirmed" type="checkbox" />The authority confirmed notarization.</label>
                <label className="checkbox-field"><input name="ministry_authentication_confirmed" type="checkbox" />The authority confirmed ministry or issuing-authority authentication.</label>
                <label className="checkbox-field"><input name="apostille_confirmed" type="checkbox" />The authority confirmed an apostille.</label>
                <label className="checkbox-field"><input name="embassy_legalization_confirmed" type="checkbox" />The authority confirmed embassy or consular legalization.</label>
              </div>
              <button className="btn primary" type="submit">Build document path</button>
            </form>
            <LegalizationResult result={legalizationResult} />
          </div>
        </article>
      ) : null}

      {show("family") ? (
        <article className="journey-tool" id="family-planner-tool">
          <div><p className="overline">Household readiness</p><h2>Family relocation planner</h2><p className="section-intro">Create member-level document and arrival tasks for the full household.</p></div>
          <div className="journey-tool-layout">
            <form className="form-grid" onSubmit={(event) => run(event, "family-plan", (data) => ({
              target_country: String(data.get("target_country") || ""), route_category: String(data.get("route_category") || "family"), spouse_count: Number(data.get("spouse_count") || 0), children_count: Number(data.get("children_count") || 0), child_ages: String(data.get("child_ages") || ""), other_dependants: Number(data.get("other_dependants") || 0), base_budget_amount: Number(data.get("base_budget_amount") || 0), currency: String(data.get("currency") || "EUR"), travelling_together: data.get("travelling_together") === "on", custody_or_consent_issue: data.get("custody_or_consent_issue") === "on", special_medical_or_support_need: data.get("special_medical_or_support_need") === "on", accommodation_confirmed: data.get("accommodation_confirmed") === "on", family_insurance_confirmed: data.get("family_insurance_confirmed") === "on",
            }), setFamilyResult)}>
              <div className="field"><label>Target country</label><input name="target_country" required /></div>
              <div className="field"><label>Route category</label><select name="route_category" defaultValue="family"><option value="startup">Startup</option><option value="work">Work</option><option value="study">Study</option><option value="family">Family reunification</option><option value="permanent_residence">Permanent residence</option></select></div>
              <div className="field"><label>Spouse count</label><input name="spouse_count" type="number" defaultValue="1" min="0" max="2" /></div>
              <div className="field"><label>Children count</label><input name="children_count" type="number" defaultValue="2" min="0" max="15" /></div>
              <div className="field"><label>Child ages, separated by commas</label><input name="child_ages" placeholder="11, 8" /></div>
              <div className="field"><label>Other dependants</label><input name="other_dependants" type="number" defaultValue="0" min="0" /></div>
              <div className="field"><label>Base planning budget</label><input name="base_budget_amount" type="number" defaultValue="12000" min="0" /></div>
              <div className="field"><label>Currency</label><input name="currency" defaultValue="EUR" /></div>
              <div className="journey-checks">
                <label className="checkbox-field"><input name="travelling_together" type="checkbox" defaultChecked />Everyone plans to travel together.</label>
                <label className="checkbox-field"><input name="accommodation_confirmed" type="checkbox" />Family-appropriate accommodation is confirmed.</label>
                <label className="checkbox-field"><input name="family_insurance_confirmed" type="checkbox" />Family insurance requirements are confirmed.</label>
                <label className="checkbox-field"><input name="custody_or_consent_issue" type="checkbox" />Custody, parental consent, or one-parent travel needs review.</label>
                <label className="checkbox-field"><input name="special_medical_or_support_need" type="checkbox" />A family member has medical, accessibility, or support needs.</label>
              </div>
              <button className="btn primary" type="submit">Build family plan</button>
            </form>
            <FamilyResult result={familyResult} />
          </div>
        </article>
      ) : null}

      {show("appointment") ? (
        <article className="journey-tool" id="appointment-planner-tool">
          <div><p className="overline">Dated execution</p><h2>Embassy and application appointment planner</h2><p className="section-intro">Generate preparation dates and optionally save them into the existing MoveReady timeline.</p></div>
          <div className="journey-tool-layout">
            <form className="form-grid" onSubmit={(event) => run(event, "appointment-plan", (data) => ({
              appointment_date: String(data.get("appointment_date") || ""), application_type: String(data.get("application_type") || ""), target_country: String(data.get("target_country") || ""), route_category: String(data.get("route_category") || ""), family_members_count: Number(data.get("family_members_count") || 0), travel_time_hours: Number(data.get("travel_time_hours") || 1), biometrics_required: data.get("biometrics_required") === "on", original_documents_required: data.get("original_documents_required") === "on", translation_pending: data.get("translation_pending") === "on", payment_pending: data.get("payment_pending") === "on", save_to_timeline: data.get("save_to_timeline") === "on", full_name: String(data.get("full_name") || ""), email: String(data.get("email") || ""), phone: String(data.get("phone") || ""), preferred_channel: String(data.get("preferred_channel") || "email"), current_country: String(data.get("current_country") || ""), consent_to_contact: data.get("consent_to_contact") === "on",
            }), setAppointmentResult)}>
              <div className="field"><label>Appointment date</label><input name="appointment_date" type="date" required /></div>
              <div className="field"><label>Application or appointment type</label><input name="application_type" placeholder="Biometrics, visa submission, interview" required /></div>
              <div className="field"><label>Target country</label><input name="target_country" required /></div>
              <div className="field"><label>Current country</label><input name="current_country" /></div>
              <div className="field"><label>Route category</label><input name="route_category" placeholder="Startup, study, work, family" /></div>
              <div className="field"><label>Accompanying family members</label><input name="family_members_count" type="number" defaultValue="0" min="0" /></div>
              <div className="field"><label>Travel time to centre, hours</label><input name="travel_time_hours" type="number" defaultValue="1" min="0" step="0.5" /></div>
              <div className="journey-checks">
                <label className="checkbox-field"><input name="biometrics_required" type="checkbox" />Biometrics are required.</label>
                <label className="checkbox-field"><input name="original_documents_required" type="checkbox" />Original documents are required.</label>
                <label className="checkbox-field"><input name="translation_pending" type="checkbox" />Required translation is pending.</label>
                <label className="checkbox-field"><input name="payment_pending" type="checkbox" />Payment or fee confirmation is pending.</label>
                <label className="checkbox-field"><input name="save_to_timeline" type="checkbox" />Save generated tasks to my timeline.</label>
              </div>
              <div className="field"><label>Full name</label><input name="full_name" /></div>
              <div className="field"><label>Email for timeline lookup</label><input name="email" type="email" /></div>
              <div className="field"><label>Phone</label><input name="phone" /></div>
              <div className="field"><label>Preferred reminder channel</label><select name="preferred_channel" defaultValue="email"><option value="email">Email</option><option value="whatsapp">WhatsApp</option><option value="telegram">Telegram</option><option value="in_app">In app</option></select></div>
              <label className="checkbox-field"><input name="consent_to_contact" type="checkbox" />I consent to storing these timeline events and reminder contact details.</label>
              <button className="btn primary" type="submit">Build appointment plan</button>
            </form>
            <AppointmentResult result={appointmentResult} />
          </div>
        </article>
      ) : null}

      {show("settlement") ? (
        <article className="journey-tool" id="settlement-planner-tool">
          <div><p className="overline">After approval</p><h2>Post-arrival settlement checklist</h2><p className="section-intro">Organize the first 72 hours, first two weeks, and first 90 days without relying on unverified local providers.</p></div>
          <div className="journey-tool-layout">
            <form className="form-grid" onSubmit={(event) => run(event, "settlement-plan", (data) => ({
              target_country: String(data.get("target_country") || ""), target_city: String(data.get("target_city") || ""), arrival_date: String(data.get("arrival_date") || ""), household_size: Number(data.get("household_size") || 1), pets_count: Number(data.get("pets_count") || 0), temporary_accommodation_confirmed: data.get("temporary_accommodation_confirmed") === "on", permanent_housing_confirmed: data.get("permanent_housing_confirmed") === "on", insurance_active: data.get("insurance_active") === "on", school_needed: data.get("school_needed") === "on", employment_or_business_start_planned: data.get("employment_or_business_start_planned") === "on", medical_or_accessibility_need: data.get("medical_or_accessibility_need") === "on",
            }), setSettlementResult)}>
              <div className="field"><label>Target country</label><input name="target_country" required /></div>
              <div className="field"><label>Target city</label><input name="target_city" /></div>
              <div className="field"><label>Planned arrival date</label><input name="arrival_date" type="date" /></div>
              <div className="field"><label>Household size</label><input name="household_size" type="number" defaultValue="1" min="1" /></div>
              <div className="field"><label>Pets count</label><input name="pets_count" type="number" defaultValue="0" min="0" /></div>
              <div className="journey-checks">
                <label className="checkbox-field"><input name="temporary_accommodation_confirmed" type="checkbox" />Arrival accommodation is verified and confirmed.</label>
                <label className="checkbox-field"><input name="permanent_housing_confirmed" type="checkbox" />Longer-term housing is confirmed.</label>
                <label className="checkbox-field"><input name="insurance_active" type="checkbox" />Health or route-required insurance will be active at arrival.</label>
                <label className="checkbox-field"><input name="school_needed" type="checkbox" />School or childcare setup is needed.</label>
                <label className="checkbox-field"><input name="employment_or_business_start_planned" type="checkbox" />Employment or business start must be organized.</label>
                <label className="checkbox-field"><input name="medical_or_accessibility_need" type="checkbox" />Medical, medication, accessibility, or continuity-of-care support is needed.</label>
              </div>
              <button className="btn primary" type="submit">Build settlement plan</button>
            </form>
            <SettlementResult result={settlementResult} />
          </div>
        </article>
      ) : null}
    </div>
  );
}
