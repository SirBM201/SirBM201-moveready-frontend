"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type ApplicationOptions = {
  ok: boolean;
  route_categories?: string[];
  application_stages?: string[];
  case_statuses?: string[];
  source_statuses?: string[];
  payment_statuses?: string[];
  event_types?: string[];
  event_statuses?: string[];
  terminal_stages?: string[];
  storage_boundary?: string;
};

type ApplicationCase = {
  id?: string;
  case_ref: string;
  profile_id?: string | null;
  saved_route_id?: string | null;
  route_version_id?: string | null;
  evidence_pack_id?: string | null;
  case_title?: string;
  target_country?: string | null;
  target_city?: string | null;
  route_category?: string;
  route_name?: string | null;
  responsible_authority?: string | null;
  application_stage?: string;
  status?: string;
  risk_level?: string;
  stored_risk_level?: string;
  source_status?: string;
  authority_reference_hint?: string | null;
  application_date?: string | null;
  appointment_date?: string | null;
  submission_date?: string | null;
  next_deadline_at?: string | null;
  hours_until_deadline?: number | null;
  decision_date?: string | null;
  fee_amount?: number | string | null;
  fee_currency?: string | null;
  payment_status?: string;
  official_source_url?: string | null;
  official_source_note?: string | null;
  result_summary?: string | null;
  notes?: string | null;
  warnings?: string[];
  created_at?: string;
  updated_at?: string;
  privacy_note?: string;
};

type ApplicationEvent = {
  id?: string;
  event_type?: string;
  event_status?: string;
  event_title?: string;
  event_summary?: string | null;
  event_at?: string;
  due_at?: string | null;
  actor_type?: string;
  created_at?: string;
};

const fallbackOptions: ApplicationOptions = {
  ok: true,
  route_categories: ["visit", "study", "work", "startup", "business", "digital_nomad", "family", "scholarship", "permanent_residence", "citizenship", "other"],
  application_stages: ["research", "preparing", "appointment_booked", "submitted", "biometrics_completed", "interview_scheduled", "additional_documents_requested", "decision_pending", "approved", "refused", "withdrawn", "expired", "closed"],
  case_statuses: ["active", "attention_required", "completed", "archived"],
  source_statuses: ["verified", "review_required", "stale", "unavailable"],
  payment_statuses: ["not_recorded", "not_required", "planned", "pending", "paid", "refunded", "disputed"],
  event_types: ["status_changed", "deadline_added", "appointment", "submission", "biometrics", "interview", "additional_documents_request", "payment", "communication", "decision", "note"],
  event_statuses: ["recorded", "pending", "completed", "cancelled", "disputed"],
  terminal_stages: ["approved", "refused", "withdrawn", "expired", "closed"],
  storage_boundary: "Store application metadata, masked reference hints, dates, status, fees, source notes, and short event summaries only. Do not upload raw files or paste full authority correspondence or sensitive reference numbers.",
};

function readable(value?: string | null) {
  return String(value || "not set").replace(/_/g, " ");
}

function formatDate(value?: string | null) {
  if (!value) return "Not recorded";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatDateTime(value?: string | null) {
  if (!value) return "Not recorded";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function dateValue(value?: string | null) {
  return value ? String(value).slice(0, 10) : "";
}

function dateTimeLocalValue(value?: string | null) {
  if (!value) return "";
  try {
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  } catch {
    return "";
  }
}

function sourcePage() {
  try {
    return typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/applications";
  } catch {
    return "/applications";
  }
}

function statusTone(item: ApplicationCase) {
  if (item.risk_level === "critical" || item.application_stage === "refused") return "partner_approval_pending";
  if (item.risk_level === "high" || item.status === "attention_required") return "partner_approval_pending";
  return "available";
}

export default function ApplicationCaseWorkspace() {
  const [options, setOptions] = useState<ApplicationOptions>(fallbackOptions);
  const [cases, setCases] = useState<ApplicationCase[]>([]);
  const [selectedRef, setSelectedRef] = useState("");
  const [selected, setSelected] = useState<ApplicationCase | null>(null);
  const [events, setEvents] = useState<ApplicationEvent[]>([]);
  const [accountEmail, setAccountEmail] = useState("");
  const [message, setMessage] = useState("Sign in to load private application cases.");
  const [loading, setLoading] = useState(false);
  const [updatingRef, setUpdatingRef] = useState("");

  const terminalStages = useMemo(() => new Set(options.terminal_stages || []), [options.terminal_stages]);

  async function loadCases(silent = false) {
    if (!silent) {
      setLoading(true);
      setMessage("Loading private application cases...");
    }
    try {
      const optionData = await apiJson<ApplicationOptions>("applications/options", { timeoutMs: 12000, useAuthToken: false });
      setOptions({ ...fallbackOptions, ...optionData });
      const data = await apiJson<{ account_email?: string; application_cases?: ApplicationCase[] }>("applications", { timeoutMs: 25000 });
      const rows = data.application_cases || [];
      setCases(rows);
      setAccountEmail(data.account_email || "");
      setMessage("Application cases loaded.");
      if (selectedRef && rows.some((row) => row.case_ref === selectedRef)) {
        await loadDetail(selectedRef, true);
      }
    } catch (error) {
      const apiError = error as ApiError;
      setCases([]);
      setSelected(null);
      setEvents([]);
      setAccountEmail("");
      setMessage(apiError?.status === 401 ? "Sign in with email to use the private Application Center." : apiError?.data?.hint || apiError?.message || "Unable to load application cases. Migration 028 may be pending.");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  async function loadDetail(caseRef: string, silent = false) {
    if (!silent) {
      setUpdatingRef(caseRef);
      setMessage(`Loading ${caseRef}...`);
    }
    try {
      const data = await apiJson<{ application_case: ApplicationCase; events?: ApplicationEvent[] }>(`applications/${caseRef}`, { timeoutMs: 25000 });
      setSelectedRef(caseRef);
      setSelected(data.application_case);
      setEvents(data.events || []);
      if (!silent) setMessage(`Application case ${caseRef} loaded.`);
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to load application case: ${apiError?.data?.error || apiError?.message || "application_case_detail_unavailable"}`);
    } finally {
      if (!silent) setUpdatingRef("");
    }
  }

  useEffect(() => {
    void loadCases(true);
  }, []);

  async function createCase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      case_title: String(data.get("case_title") || "").trim(),
      target_country: String(data.get("target_country") || "").trim(),
      target_city: String(data.get("target_city") || "").trim(),
      route_category: String(data.get("route_category") || "other"),
      route_name: String(data.get("route_name") || "").trim(),
      responsible_authority: String(data.get("responsible_authority") || "").trim(),
      application_stage: String(data.get("application_stage") || "research"),
      source_status: String(data.get("source_status") || "review_required"),
      authority_reference_hint: String(data.get("authority_reference_hint") || "").trim(),
      reference_is_masked: data.get("reference_is_masked") === "on",
      application_date: String(data.get("application_date") || ""),
      appointment_date: String(data.get("appointment_date") || ""),
      submission_date: String(data.get("submission_date") || ""),
      next_deadline_at: String(data.get("next_deadline_at") || ""),
      fee_amount: String(data.get("fee_amount") || ""),
      fee_currency: String(data.get("fee_currency") || "").trim(),
      payment_status: String(data.get("payment_status") || "not_recorded"),
      official_source_url: String(data.get("official_source_url") || "").trim(),
      official_source_note: String(data.get("official_source_note") || "").trim(),
      evidence_pack_id: String(data.get("evidence_pack_id") || "").trim(),
      notes: String(data.get("notes") || "").trim(),
      consent_to_store: data.get("consent_to_store") === "on",
      source_page: sourcePage(),
    };
    if (!payload.case_title) {
      setMessage("Case title is required.");
      return;
    }
    setLoading(true);
    setMessage("Creating private application case...");
    try {
      const response = await apiJson<{ application_case: ApplicationCase }>("applications", {
        method: "POST",
        body: payload,
        timeoutMs: 30000,
      });
      setCases((rows) => [response.application_case, ...rows]);
      setSelected(response.application_case);
      setSelectedRef(response.application_case.case_ref);
      setEvents([]);
      setMessage(`Application case ${response.application_case.case_ref} created.`);
      form.reset();
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to create application case: ${apiError?.data?.message || apiError?.data?.error || apiError?.message || "application_case_create_failed"}`);
    } finally {
      setLoading(false);
    }
  }

  async function updateCase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const stage = String(data.get("application_stage") || selected.application_stage || "research");
    const payload = {
      case_title: String(data.get("case_title") || selected.case_title || "").trim(),
      target_country: String(data.get("target_country") || "").trim(),
      target_city: String(data.get("target_city") || "").trim(),
      route_category: String(data.get("route_category") || selected.route_category || "other"),
      route_name: String(data.get("route_name") || "").trim(),
      responsible_authority: String(data.get("responsible_authority") || "").trim(),
      application_stage: stage,
      status: String(data.get("status") || selected.status || "active"),
      source_status: String(data.get("source_status") || selected.source_status || "review_required"),
      authority_reference_hint: String(data.get("authority_reference_hint") || "").trim(),
      reference_is_masked: data.get("reference_is_masked") === "on",
      application_date: String(data.get("application_date") || ""),
      appointment_date: String(data.get("appointment_date") || ""),
      submission_date: String(data.get("submission_date") || ""),
      next_deadline_at: String(data.get("next_deadline_at") || ""),
      decision_date: String(data.get("decision_date") || ""),
      fee_amount: String(data.get("fee_amount") || ""),
      fee_currency: String(data.get("fee_currency") || "").trim(),
      payment_status: String(data.get("payment_status") || selected.payment_status || "not_recorded"),
      official_source_url: String(data.get("official_source_url") || "").trim(),
      official_source_note: String(data.get("official_source_note") || "").trim(),
      evidence_pack_id: String(data.get("evidence_pack_id") || "").trim(),
      result_summary: String(data.get("result_summary") || "").trim(),
      notes: String(data.get("notes") || "").trim(),
      event_summary: String(data.get("event_summary") || "").trim(),
    };
    if (terminalStages.has(stage) && (!payload.decision_date || !payload.result_summary)) {
      setMessage("A terminal stage requires a decision or closure date and a factual result summary.");
      return;
    }
    setUpdatingRef(selected.case_ref);
    setMessage(`Updating ${selected.case_ref}...`);
    try {
      const response = await apiJson<{ application_case: ApplicationCase }>(`applications/${selected.case_ref}`, {
        method: "PATCH",
        body: payload,
        timeoutMs: 30000,
      });
      setSelected(response.application_case);
      setCases((rows) => rows.map((row) => (row.case_ref === selected.case_ref ? response.application_case : row)));
      setMessage("Application case updated and lifecycle changes recorded.");
      await loadDetail(selected.case_ref, true);
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to update application case: ${apiError?.data?.message || apiError?.data?.error || apiError?.message || "application_case_update_failed"}`);
    } finally {
      setUpdatingRef("");
    }
  }

  async function addEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("event_title") || "").trim();
    if (!title) {
      setMessage("Event title is required.");
      return;
    }
    setUpdatingRef(selected.case_ref);
    setMessage("Recording application event...");
    try {
      const response = await apiJson<{ event: ApplicationEvent }>(`applications/${selected.case_ref}/events`, {
        method: "POST",
        body: {
          event_type: String(data.get("event_type") || "note"),
          event_status: String(data.get("event_status") || "recorded"),
          event_title: title,
          event_summary: String(data.get("event_summary") || "").trim(),
          due_at: String(data.get("due_at") || ""),
        },
        timeoutMs: 20000,
      });
      setEvents((rows) => [response.event, ...rows]);
      setMessage("Application event recorded.");
      form.reset();
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to record event: ${apiError?.data?.error || apiError?.message || "application_case_event_create_failed"}`);
    } finally {
      setUpdatingRef("");
    }
  }

  async function saveTimelineTasks() {
    if (!selected) return;
    const confirmed = typeof window === "undefined" || window.confirm("Save appointment and next-deadline reminders from this case to your private MoveReady timeline? Existing matching tasks will not be duplicated.");
    if (!confirmed) {
      setMessage("No timeline task was created.");
      return;
    }
    setUpdatingRef(selected.case_ref);
    setMessage("Saving application reminders to timeline...");
    try {
      const response = await apiJson<{ created_count?: number; existing_count?: number; safety_note?: string }>(`applications/${selected.case_ref}/timeline-tasks`, {
        method: "POST",
        body: { confirm_timeline_storage: true },
        timeoutMs: 25000,
      });
      setMessage(`${response.created_count || 0} new timeline task(s) saved; ${response.existing_count || 0} matching task(s) already existed. ${response.safety_note || ""}`);
      await loadDetail(selected.case_ref, true);
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to save timeline tasks: ${apiError?.data?.error || apiError?.message || "application_timeline_tasks_failed"}`);
    } finally {
      setUpdatingRef("");
    }
  }

  const routeCategories = options.route_categories || fallbackOptions.route_categories || [];
  const stages = options.application_stages || fallbackOptions.application_stages || [];
  const caseStatuses = options.case_statuses || fallbackOptions.case_statuses || [];
  const sourceStatuses = options.source_statuses || fallbackOptions.source_statuses || [];
  const paymentStatuses = options.payment_statuses || fallbackOptions.payment_statuses || [];
  const eventTypes = options.event_types || fallbackOptions.event_types || [];
  const eventStatuses = options.event_statuses || fallbackOptions.event_statuses || [];

  return (
    <div className="result-stack">
      <article className="result-block featured">
        <div className="panel-heading">
          <div><p className="overline">Private Application Center</p><h2>{accountEmail ? `Applications for ${accountEmail}` : "Connect a verified account"}</h2></div>
          <span className="status-dot">Metadata only</span>
        </div>
        <p>{options.storage_boundary || fallbackOptions.storage_boundary}</p>
        <div className="actions">
          <button className="btn primary" type="button" disabled={loading} onClick={() => loadCases(false)}>{loading ? "Loading..." : "Refresh cases"}</button>
          <a className="btn" href="/login?next=/applications">Sign in</a>
          <a className="btn" href="/evidence-pack">Evidence Center</a>
          <a className="btn" href="/timeline">Timeline</a>
        </div>
        <p className="form-status">{message}</p>
      </article>

      <section className="live-workspace">
        <form className="workflow-panel live-form" onSubmit={createCase}>
          <div className="panel-heading"><div><p className="overline">New application</p><h2>Create a private case</h2></div><span className="status-dot">Consent required</span></div>
          <div className="form-grid two-col">
            <div className="field"><label htmlFor="case_title">Case title</label><input id="case_title" name="case_title" placeholder="Finland startup permit application" required /></div>
            <div className="field"><label htmlFor="case_route_category">Route category</label><select id="case_route_category" name="route_category" defaultValue="startup">{routeCategories.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
            <div className="field"><label htmlFor="case_target_country">Target country</label><input id="case_target_country" name="target_country" /></div>
            <div className="field"><label htmlFor="case_target_city">Target city</label><input id="case_target_city" name="target_city" /></div>
            <div className="field"><label htmlFor="case_route_name">Route name</label><input id="case_route_name" name="route_name" /></div>
            <div className="field"><label htmlFor="case_authority">Responsible authority</label><input id="case_authority" name="responsible_authority" /></div>
            <div className="field"><label htmlFor="case_stage">Current stage</label><select id="case_stage" name="application_stage" defaultValue="research">{stages.filter((item) => !terminalStages.has(item)).map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
            <div className="field"><label htmlFor="case_source_status">Source status</label><select id="case_source_status" name="source_status" defaultValue="review_required">{sourceStatuses.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
            <div className="field"><label htmlFor="case_reference_hint">Masked authority reference hint</label><input id="case_reference_hint" name="authority_reference_hint" placeholder="Example: ends 7X2K" /></div>
            <label className="checkbox-field"><input type="checkbox" name="reference_is_masked" /><span>The reference is masked or partial and is not a full authority, permit, passport, or payment reference.</span></label>
            <div className="field"><label htmlFor="case_application_date">Application start date</label><input id="case_application_date" name="application_date" type="date" /></div>
            <div className="field"><label htmlFor="case_appointment_date">Appointment date and time</label><input id="case_appointment_date" name="appointment_date" type="datetime-local" /></div>
            <div className="field"><label htmlFor="case_submission_date">Submission date</label><input id="case_submission_date" name="submission_date" type="date" /></div>
            <div className="field"><label htmlFor="case_deadline">Next deadline</label><input id="case_deadline" name="next_deadline_at" type="datetime-local" /></div>
            <div className="field"><label htmlFor="case_fee_amount">Application fee</label><input id="case_fee_amount" name="fee_amount" type="number" min="0" step="0.01" /></div>
            <div className="field"><label htmlFor="case_fee_currency">Currency</label><input id="case_fee_currency" name="fee_currency" placeholder="EUR" /></div>
            <div className="field"><label htmlFor="case_payment_status">Payment status</label><select id="case_payment_status" name="payment_status" defaultValue="not_recorded">{paymentStatuses.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
            <div className="field"><label htmlFor="case_evidence_pack">Evidence pack ID</label><input id="case_evidence_pack" name="evidence_pack_id" placeholder="Optional private pack UUID" /></div>
          </div>
          <div className="field"><label htmlFor="case_source_url">Official source or tracking URL</label><input id="case_source_url" name="official_source_url" type="url" placeholder="https://official-authority.example/..." /></div>
          <div className="field"><label htmlFor="case_source_note">Official source note</label><textarea id="case_source_note" name="official_source_note" rows={3} placeholder="What was checked, when, and which authority controls the next action." /></div>
          <div className="field"><label htmlFor="case_notes">Private planning note</label><textarea id="case_notes" name="notes" rows={3} placeholder="Do not paste raw correspondence or sensitive identifiers." /></div>
          <label className="checkbox-field"><input type="checkbox" name="consent_to_store" /><span>I consent to storing this application metadata under my verified account. I understand that raw files and full sensitive references are not accepted.</span></label>
          <button className="btn primary" type="submit" disabled={loading}>Create application case</button>
        </form>

        <section className="result-panel">
          <div className="result-stack">
            <article className="result-block soft"><div className="panel-heading"><div><p className="overline">My cases</p><h2>{cases.length} active records</h2></div><span className="status-dot">Private</span></div><p>Select a case to update its lifecycle, record an event, or create appointment and deadline reminders.</p></article>
            {cases.map((item) => (
              <article className="result-block" key={item.case_ref}>
                <div className="panel-heading"><div><p className="overline">{item.case_ref}</p><h3>{item.case_title}</h3></div><span className={`badge module-status ${statusTone(item)}`}>{readable(item.application_stage)}</span></div>
                <div className="badge-row"><span className="badge">Risk: {readable(item.risk_level)}</span><span className="badge">Source: {readable(item.source_status)}</span><span className="badge">Payment: {readable(item.payment_status)}</span></div>
                <div className="mini-list">
                  <div><strong>Destination</strong><span>{item.target_country || "Not set"}{item.target_city ? ` · ${item.target_city}` : ""}</span></div>
                  <div><strong>Authority</strong><span>{item.responsible_authority || "Not recorded"}</span></div>
                  <div><strong>Appointment</strong><span>{formatDateTime(item.appointment_date)}</span></div>
                  <div><strong>Next deadline</strong><span>{formatDateTime(item.next_deadline_at)}{item.hours_until_deadline !== null && item.hours_until_deadline !== undefined ? ` · ${item.hours_until_deadline} hours` : ""}</span></div>
                </div>
                {(item.warnings || []).length ? <p className="form-status"><strong>Warnings:</strong> {(item.warnings || []).join(" ")}</p> : null}
                <div className="actions"><button className="btn primary" type="button" disabled={updatingRef === item.case_ref} onClick={() => loadDetail(item.case_ref)}>{updatingRef === item.case_ref ? "Loading..." : selectedRef === item.case_ref ? "Selected" : "Open case"}</button></div>
              </article>
            ))}
            {!cases.length ? <article className="result-block soft"><h3>No application case loaded</h3><p>Sign in and create the first case after migration 028 is applied.</p></article> : null}
          </div>
        </section>
      </section>

      {selected ? (
        <section className="live-workspace">
          <form className="workflow-panel live-form" onSubmit={updateCase} key={`${selected.case_ref}-${selected.updated_at || "loaded"}`}>
            <div className="panel-heading"><div><p className="overline">{selected.case_ref}</p><h2>Update application lifecycle</h2></div><span className="status-dot">{readable(selected.risk_level)}</span></div>
            <div className="form-grid two-col">
              <div className="field"><label htmlFor="edit_case_title">Case title</label><input id="edit_case_title" name="case_title" defaultValue={selected.case_title || ""} required /></div>
              <div className="field"><label htmlFor="edit_route_category">Route category</label><select id="edit_route_category" name="route_category" defaultValue={selected.route_category || "other"}>{routeCategories.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
              <div className="field"><label htmlFor="edit_target_country">Target country</label><input id="edit_target_country" name="target_country" defaultValue={selected.target_country || ""} /></div>
              <div className="field"><label htmlFor="edit_target_city">Target city</label><input id="edit_target_city" name="target_city" defaultValue={selected.target_city || ""} /></div>
              <div className="field"><label htmlFor="edit_route_name">Route name</label><input id="edit_route_name" name="route_name" defaultValue={selected.route_name || ""} /></div>
              <div className="field"><label htmlFor="edit_authority">Authority</label><input id="edit_authority" name="responsible_authority" defaultValue={selected.responsible_authority || ""} /></div>
              <div className="field"><label htmlFor="edit_stage">Application stage</label><select id="edit_stage" name="application_stage" defaultValue={selected.application_stage || "research"}>{stages.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
              <div className="field"><label htmlFor="edit_status">Case status</label><select id="edit_status" name="status" defaultValue={selected.status || "active"}>{caseStatuses.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
              <div className="field"><label htmlFor="edit_source_status">Source status</label><select id="edit_source_status" name="source_status" defaultValue={selected.source_status || "review_required"}>{sourceStatuses.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
              <div className="field"><label htmlFor="edit_payment_status">Payment status</label><select id="edit_payment_status" name="payment_status" defaultValue={selected.payment_status || "not_recorded"}>{paymentStatuses.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
              <div className="field"><label htmlFor="edit_reference_hint">Masked reference hint</label><input id="edit_reference_hint" name="authority_reference_hint" defaultValue={selected.authority_reference_hint || ""} /></div>
              <label className="checkbox-field"><input type="checkbox" name="reference_is_masked" defaultChecked={!selected.authority_reference_hint || Boolean(selected.authority_reference_hint)} /><span>This remains a masked or partial hint only.</span></label>
              <div className="field"><label htmlFor="edit_application_date">Application date</label><input id="edit_application_date" name="application_date" type="date" defaultValue={dateValue(selected.application_date)} /></div>
              <div className="field"><label htmlFor="edit_submission_date">Submission date</label><input id="edit_submission_date" name="submission_date" type="date" defaultValue={dateValue(selected.submission_date)} /></div>
              <div className="field"><label htmlFor="edit_appointment_date">Appointment</label><input id="edit_appointment_date" name="appointment_date" type="datetime-local" defaultValue={dateTimeLocalValue(selected.appointment_date)} /></div>
              <div className="field"><label htmlFor="edit_deadline">Next deadline</label><input id="edit_deadline" name="next_deadline_at" type="datetime-local" defaultValue={dateTimeLocalValue(selected.next_deadline_at)} /></div>
              <div className="field"><label htmlFor="edit_decision_date">Decision or closure date</label><input id="edit_decision_date" name="decision_date" type="date" defaultValue={dateValue(selected.decision_date)} /></div>
              <div className="field"><label htmlFor="edit_fee_amount">Fee</label><input id="edit_fee_amount" name="fee_amount" type="number" min="0" step="0.01" defaultValue={selected.fee_amount === null || selected.fee_amount === undefined ? "" : String(selected.fee_amount)} /></div>
              <div className="field"><label htmlFor="edit_fee_currency">Currency</label><input id="edit_fee_currency" name="fee_currency" defaultValue={selected.fee_currency || ""} /></div>
              <div className="field"><label htmlFor="edit_evidence_pack">Evidence pack ID</label><input id="edit_evidence_pack" name="evidence_pack_id" defaultValue={selected.evidence_pack_id || ""} /></div>
            </div>
            <div className="field"><label htmlFor="edit_source_url">Official source or tracking URL</label><input id="edit_source_url" name="official_source_url" type="url" defaultValue={selected.official_source_url || ""} /></div>
            <div className="field"><label htmlFor="edit_source_note">Official source note</label><textarea id="edit_source_note" name="official_source_note" rows={3} defaultValue={selected.official_source_note || ""} /></div>
            <div className="field"><label htmlFor="edit_result_summary">Decision or closure summary</label><textarea id="edit_result_summary" name="result_summary" rows={3} defaultValue={selected.result_summary || ""} placeholder="Required for approved, refused, withdrawn, expired, or closed stages." /></div>
            <div className="field"><label htmlFor="edit_notes">Private note</label><textarea id="edit_notes" name="notes" rows={3} defaultValue={selected.notes || ""} /></div>
            <div className="field"><label htmlFor="edit_event_summary">Lifecycle change note</label><textarea id="edit_event_summary" name="event_summary" rows={2} placeholder="Explain the stage or status change without pasting raw authority correspondence." /></div>
            <div className="actions">
              <button className="btn primary" type="submit" disabled={updatingRef === selected.case_ref}>{updatingRef === selected.case_ref ? "Saving..." : "Save case update"}</button>
              <button className="btn" type="button" disabled={updatingRef === selected.case_ref} onClick={saveTimelineTasks}>Save appointment/deadline tasks</button>
              <a className="btn" href="/timeline">Open timeline</a>
            </div>
          </form>

          <section className="result-panel">
            <form className="interest-form result-block featured" onSubmit={addEvent}>
              <div className="panel-heading"><div><p className="overline">Case event</p><h2>Record a short lifecycle event</h2></div><span className="status-dot">Auditable history</span></div>
              <div className="form-grid two-col">
                <div className="field"><label htmlFor="case_event_type">Event type</label><select id="case_event_type" name="event_type" defaultValue="note">{eventTypes.filter((item) => item !== "case_created" && item !== "timeline_tasks_created" && item !== "case_archived").map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
                <div className="field"><label htmlFor="case_event_status">Event status</label><select id="case_event_status" name="event_status" defaultValue="recorded">{eventStatuses.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
                <div className="field"><label htmlFor="case_event_title">Event title</label><input id="case_event_title" name="event_title" required /></div>
                <div className="field"><label htmlFor="case_event_due">Due date and time</label><input id="case_event_due" name="due_at" type="datetime-local" /></div>
              </div>
              <div className="field"><label htmlFor="case_event_summary">Event summary</label><textarea id="case_event_summary" name="event_summary" rows={4} placeholder="Short factual summary only. Do not paste raw correspondence or sensitive identifiers." /></div>
              <button className="btn primary" type="submit" disabled={updatingRef === selected.case_ref}>Record event</button>
            </form>

            <div className="result-stack" style={{ marginTop: 16 }}>
              <article className="result-block soft"><div className="panel-heading"><div><p className="overline">Case history</p><h3>{events.length} events</h3></div><span className="status-dot">Newest first</span></div></article>
              {events.map((item, index) => (
                <article className="result-block" key={item.id || `${item.event_type}-${index}`}>
                  <div className="panel-heading"><div><p className="overline">{readable(item.event_type)}</p><h3>{item.event_title}</h3></div><span className="status-dot">{readable(item.event_status)}</span></div>
                  <p>{item.event_summary || "No additional summary recorded."}</p>
                  <div className="badge-row"><span className="badge">Event: {formatDateTime(item.event_at || item.created_at)}</span>{item.due_at ? <span className="badge">Due: {formatDateTime(item.due_at)}</span> : null}<span className="badge">Actor: {readable(item.actor_type)}</span></div>
                </article>
              ))}
              {!events.length ? <article className="result-block soft"><h3>No event history loaded</h3><p>Stage changes, deadlines, decisions, notes, and timeline processing will appear here.</p></article> : null}
            </div>
          </section>
        </section>
      ) : null}
    </div>
  );
}
