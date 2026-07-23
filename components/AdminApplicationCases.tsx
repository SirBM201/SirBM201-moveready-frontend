"use client";

import { FormEvent, useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type ApplicationCase = {
  id?: string;
  case_ref: string;
  email?: string;
  case_title?: string;
  target_country?: string | null;
  route_category?: string;
  responsible_authority?: string | null;
  application_stage?: string;
  status?: string;
  risk_level?: string;
  source_status?: string;
  authority_reference_hint?: string | null;
  appointment_date?: string | null;
  next_deadline_at?: string | null;
  hours_until_deadline?: number | null;
  decision_date?: string | null;
  payment_status?: string;
  official_source_url?: string | null;
  official_source_note?: string | null;
  result_summary?: string | null;
  warnings?: string[];
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
};

const stages = ["research", "preparing", "appointment_booked", "submitted", "biometrics_completed", "interview_scheduled", "additional_documents_requested", "decision_pending", "approved", "refused", "withdrawn", "expired", "closed"];
const statuses = ["active", "attention_required", "completed", "archived"];
const sourceStatuses = ["verified", "review_required", "stale", "unavailable"];
const paymentStatuses = ["not_recorded", "not_required", "planned", "pending", "paid", "refunded", "disputed"];
const terminalStages = new Set(["approved", "refused", "withdrawn", "expired", "closed"]);
const eventTypes = ["status_changed", "deadline_added", "appointment", "submission", "biometrics", "interview", "additional_documents_request", "payment", "communication", "decision", "note"];
const eventStatuses = ["recorded", "pending", "completed", "cancelled", "disputed"];
const actorTypes = ["admin", "authority", "provider", "system"];

function readable(value?: string | null) {
  return String(value || "not set").replace(/_/g, " ");
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

export default function AdminApplicationCases() {
  const [adminKey, setAdminKey] = useState("");
  const [cases, setCases] = useState<ApplicationCase[]>([]);
  const [dueCases, setDueCases] = useState<ApplicationCase[]>([]);
  const [selected, setSelected] = useState<ApplicationCase | null>(null);
  const [events, setEvents] = useState<ApplicationEvent[]>([]);
  const [message, setMessage] = useState("Enter the admin key to load application cases.");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    try {
      setAdminKey(localStorage.getItem("moveready_admin_key") || "");
    } catch {
      // Ignore storage failure.
    }
  }, []);

  function headers() {
    return { "X-MoveReady-Admin-Key": adminKey.trim() };
  }

  async function load() {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }
    setLoading(true);
    setMessage("Loading application cases and due deadlines...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const [caseData, dueData] = await Promise.all([
        apiJson<{ application_cases?: ApplicationCase[]; attention_count?: number }>("admin/application-cases", { headers: headers(), query: { limit: 250 }, timeoutMs: 30000, useAuthToken: false }),
        apiJson<{ application_cases?: ApplicationCase[] }>("admin/application-cases/deadlines/due", { headers: headers(), query: { hours: 336, limit: 250 }, timeoutMs: 30000, useAuthToken: false }),
      ]);
      setCases(caseData.application_cases || []);
      setDueCases(dueData.application_cases || []);
      setMessage(`${caseData.application_cases?.length || 0} application cases loaded; ${dueData.application_cases?.length || 0} deadlines are due within 14 days or overdue.`);
    } catch (error) {
      const apiError = error as ApiError;
      setCases([]);
      setDueCases([]);
      setMessage(apiError?.status === 401 ? "Admin key rejected." : apiError?.data?.hint || apiError?.data?.error || "Unable to load application cases.");
    } finally {
      setLoading(false);
    }
  }

  async function openCase(item: ApplicationCase) {
    if (!item.id) return;
    setUpdatingId(item.id);
    setMessage(`Loading ${item.case_ref}...`);
    try {
      const data = await apiJson<{ application_case: ApplicationCase; events?: ApplicationEvent[] }>(`admin/application-cases/${item.id}`, { headers: headers(), timeoutMs: 25000, useAuthToken: false });
      setSelected(data.application_case);
      setEvents(data.events || []);
      setMessage(`Application case ${item.case_ref} loaded.`);
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to load case: ${apiError?.data?.error || apiError?.message || "admin_application_case_detail_unavailable"}`);
    } finally {
      setUpdatingId("");
    }
  }

  async function updateCase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected?.id) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const stage = String(data.get("application_stage") || selected.application_stage || "research");
    const decisionDate = String(data.get("decision_date") || "");
    const resultSummary = String(data.get("result_summary") || "").trim();
    if (terminalStages.has(stage) && (!decisionDate || !resultSummary)) {
      setMessage("A terminal stage requires a decision or closure date and a factual result summary.");
      return;
    }
    setUpdatingId(selected.id);
    setMessage(`Updating ${selected.case_ref}...`);
    try {
      const response = await apiJson<{ application_case: ApplicationCase }>(`admin/application-cases/${selected.id}`, {
        method: "PATCH",
        headers: headers(),
        body: {
          application_stage: stage,
          status: String(data.get("status") || selected.status || "active"),
          source_status: String(data.get("source_status") || selected.source_status || "review_required"),
          payment_status: String(data.get("payment_status") || selected.payment_status || "not_recorded"),
          decision_date: decisionDate,
          result_summary: resultSummary,
          official_source_url: String(data.get("official_source_url") || "").trim(),
          official_source_note: String(data.get("official_source_note") || "").trim(),
          authority_reference_hint: String(data.get("authority_reference_hint") || "").trim(),
          reference_is_masked: data.get("reference_is_masked") === "on",
          notes: String(data.get("notes") || "").trim(),
          event_summary: String(data.get("event_summary") || "").trim(),
          admin_owner: String(data.get("admin_owner") || "MoveReady admin").trim(),
        },
        timeoutMs: 30000,
        useAuthToken: false,
      });
      setSelected(response.application_case);
      setCases((rows) => rows.map((row) => (row.id === selected.id ? response.application_case : row)));
      setMessage("Application case reviewed and updated.");
      await openCase(response.application_case);
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to update application case: ${apiError?.data?.message || apiError?.data?.error || apiError?.message || "admin_application_case_update_failed"}`);
    } finally {
      setUpdatingId("");
    }
  }

  async function addEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected?.id) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("event_title") || "").trim();
    if (!title) {
      setMessage("Event title is required.");
      return;
    }
    setUpdatingId(selected.id);
    setMessage("Recording administrator application event...");
    try {
      const response = await apiJson<{ event: ApplicationEvent }>(`admin/application-cases/${selected.id}/events`, {
        method: "POST",
        headers: headers(),
        body: {
          event_type: String(data.get("event_type") || "note"),
          event_status: String(data.get("event_status") || "recorded"),
          event_title: title,
          event_summary: String(data.get("event_summary") || "").trim(),
          due_at: String(data.get("due_at") || ""),
          actor_type: String(data.get("actor_type") || "admin"),
          admin_owner: String(data.get("admin_owner") || "MoveReady admin").trim(),
        },
        timeoutMs: 25000,
        useAuthToken: false,
      });
      setEvents((rows) => [response.event, ...rows]);
      setMessage("Administrator event recorded.");
      form.reset();
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to record administrator event: ${apiError?.data?.error || apiError?.message || "admin_application_case_event_failed"}`);
    } finally {
      setUpdatingId("");
    }
  }

  const attentionCases = cases.filter((item) => item.status === "attention_required" || ["high", "critical"].includes(String(item.risk_level)) || item.application_stage === "additional_documents_requested" || item.application_stage === "refused");

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <p className="overline">Application operations</p>
          <h2>Application cases, deadlines, and decisions</h2>
          <p className="section-intro">Review metadata-only application cases, source status, urgent deadlines, additional-document requests, payment issues, refusals, decisions, and event history.</p>
        </div>
        <span className="status-dot">Private cases</span>
      </div>

      <div className="admin-toolbar">
        <div className="field"><label htmlFor="application_admin_key">Admin key</label><input id="application_admin_key" type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" /></div>
        <button className="btn primary" type="button" disabled={loading} onClick={load}>{loading ? "Loading..." : "Load application cases"}</button>
        <a className="btn" href="/applications">User Application Center</a>
      </div>
      <p className="form-status">{message}</p>

      <div className="result-stack">
        <article className="result-block featured">
          <div className="panel-heading"><div><p className="overline">Priority workload</p><h3>{attentionCases.length} attention cases · {dueCases.length} due within 14 days</h3></div><span className="status-dot">Review required</span></div>
          <p>Prioritize overdue deadlines, additional-document requests, refusals, stale or unavailable official sources, payment disputes, and high or critical risk. Do not request raw documents through this console.</p>
        </article>

        {dueCases.slice(0, 20).map((item) => (
          <article className="result-block soft" key={`due-${item.case_ref}`}>
            <div className="panel-heading"><div><p className="overline">Deadline: {item.case_ref}</p><h3>{item.case_title}</h3></div><span className="status-dot">{item.hours_until_deadline ?? "?"} hours</span></div>
            <p>{item.email} · {item.target_country || "country not set"} · {readable(item.application_stage)} · source {readable(item.source_status)}</p>
            <div className="actions"><button className="btn primary" type="button" disabled={updatingId === item.id} onClick={() => openCase(item)}>Open urgent case</button></div>
          </article>
        ))}

        {attentionCases.map((item) => (
          <article className="result-block" key={item.case_ref}>
            <div className="panel-heading"><div><p className="overline">{item.case_ref}</p><h3>{item.case_title}</h3></div><span className="status-dot">{readable(item.risk_level)}</span></div>
            <div className="badge-row"><span className="badge">Stage: {readable(item.application_stage)}</span><span className="badge">Status: {readable(item.status)}</span><span className="badge">Source: {readable(item.source_status)}</span><span className="badge">Payment: {readable(item.payment_status)}</span></div>
            <div className="mini-list"><div><strong>Account</strong><span>{item.email}</span></div><div><strong>Destination</strong><span>{item.target_country || "Not set"}</span></div><div><strong>Authority</strong><span>{item.responsible_authority || "Not recorded"}</span></div><div><strong>Next deadline</strong><span>{formatDateTime(item.next_deadline_at)}</span></div></div>
            {(item.warnings || []).length ? <p className="form-status"><strong>Warnings:</strong> {(item.warnings || []).join(" ")}</p> : null}
            <div className="actions"><button className="btn primary" type="button" disabled={updatingId === item.id} onClick={() => openCase(item)}>Review case</button>{item.official_source_url ? <a className="btn" href={item.official_source_url} target="_blank" rel="noreferrer">Open official source</a> : null}</div>
          </article>
        ))}

        {!attentionCases.length ? <article className="result-block soft"><h3>No priority application case loaded</h3><p>Use “Load application cases” after migration 028 is applied. Cases without immediate attention remain visible through the API and user workspace.</p></article> : null}
      </div>

      {selected ? (
        <div className="live-workspace" style={{ marginTop: 20 }}>
          <form className="workflow-panel live-form" onSubmit={updateCase} key={`${selected.case_ref}-${selected.status}-${selected.application_stage}`}>
            <div className="panel-heading"><div><p className="overline">{selected.case_ref}</p><h2>Review application case</h2></div><span className="status-dot">{readable(selected.risk_level)}</span></div>
            <p>{selected.email} · {selected.case_title} · {selected.target_country || "country not set"}</p>
            <div className="form-grid two-col">
              <div className="field"><label htmlFor="admin_case_stage">Application stage</label><select id="admin_case_stage" name="application_stage" defaultValue={selected.application_stage || "research"}>{stages.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
              <div className="field"><label htmlFor="admin_case_status">Case status</label><select id="admin_case_status" name="status" defaultValue={selected.status || "active"}>{statuses.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
              <div className="field"><label htmlFor="admin_case_source">Source status</label><select id="admin_case_source" name="source_status" defaultValue={selected.source_status || "review_required"}>{sourceStatuses.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
              <div className="field"><label htmlFor="admin_case_payment">Payment status</label><select id="admin_case_payment" name="payment_status" defaultValue={selected.payment_status || "not_recorded"}>{paymentStatuses.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
              <div className="field"><label htmlFor="admin_case_decision">Decision or closure date</label><input id="admin_case_decision" name="decision_date" type="date" defaultValue={dateValue(selected.decision_date)} /></div>
              <div className="field"><label htmlFor="admin_case_reference">Masked reference hint</label><input id="admin_case_reference" name="authority_reference_hint" defaultValue={selected.authority_reference_hint || ""} /></div>
              <label className="checkbox-field"><input type="checkbox" name="reference_is_masked" defaultChecked /><span>This remains a masked or partial hint only.</span></label>
              <div className="field"><label htmlFor="admin_case_owner">Admin owner</label><input id="admin_case_owner" name="admin_owner" defaultValue="MoveReady admin" /></div>
            </div>
            <div className="field"><label htmlFor="admin_case_source_url">Official source or tracking URL</label><input id="admin_case_source_url" name="official_source_url" type="url" defaultValue={selected.official_source_url || ""} /></div>
            <div className="field"><label htmlFor="admin_case_source_note">Official source review note</label><textarea id="admin_case_source_note" name="official_source_note" rows={4} defaultValue={selected.official_source_note || ""} /></div>
            <div className="field"><label htmlFor="admin_case_result">Decision or closure summary</label><textarea id="admin_case_result" name="result_summary" rows={4} defaultValue={selected.result_summary || ""} placeholder="Required for approved, refused, withdrawn, expired, or closed stages." /></div>
            <div className="field"><label htmlFor="admin_case_notes">Admin-visible planning note</label><textarea id="admin_case_notes" name="notes" rows={3} /></div>
            <div className="field"><label htmlFor="admin_case_event_summary">Review or change note</label><textarea id="admin_case_event_summary" name="event_summary" rows={3} placeholder="Explain the source, stage, status, or decision update without pasting raw authority correspondence." /></div>
            <button className="btn primary" type="submit" disabled={updatingId === selected.id}>{updatingId === selected.id ? "Saving..." : "Save reviewed case"}</button>
          </form>

          <section className="result-panel">
            <form className="interest-form result-block featured" onSubmit={addEvent}>
              <div className="panel-heading"><div><p className="overline">Admin case event</p><h2>Record authority, provider, or admin action</h2></div><span className="status-dot">Auditable</span></div>
              <div className="form-grid two-col">
                <div className="field"><label htmlFor="admin_event_type">Event type</label><select id="admin_event_type" name="event_type" defaultValue="note">{eventTypes.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
                <div className="field"><label htmlFor="admin_event_status">Event status</label><select id="admin_event_status" name="event_status" defaultValue="recorded">{eventStatuses.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
                <div className="field"><label htmlFor="admin_actor_type">Actor type</label><select id="admin_actor_type" name="actor_type" defaultValue="admin">{actorTypes.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
                <div className="field"><label htmlFor="admin_event_owner">Recorded by</label><input id="admin_event_owner" name="admin_owner" defaultValue="MoveReady admin" /></div>
                <div className="field"><label htmlFor="admin_event_title">Event title</label><input id="admin_event_title" name="event_title" required /></div>
                <div className="field"><label htmlFor="admin_event_due">Due date and time</label><input id="admin_event_due" name="due_at" type="datetime-local" /></div>
              </div>
              <div className="field"><label htmlFor="admin_event_summary">Event summary</label><textarea id="admin_event_summary" name="event_summary" rows={4} placeholder="Short factual metadata only. Do not paste raw correspondence or sensitive reference numbers." /></div>
              <button className="btn primary" type="submit" disabled={updatingId === selected.id}>Record administrator event</button>
            </form>

            <div className="result-stack" style={{ marginTop: 16 }}>
              {events.map((item, index) => <article className="result-block" key={item.id || `${item.event_type}-${index}`}><div className="panel-heading"><div><p className="overline">{readable(item.event_type)}</p><h3>{item.event_title}</h3></div><span className="status-dot">{readable(item.event_status)}</span></div><p>{item.event_summary || "No summary recorded."}</p><div className="badge-row"><span className="badge">{formatDateTime(item.event_at)}</span>{item.due_at ? <span className="badge">Due {formatDateTime(item.due_at)}</span> : null}<span className="badge">Actor {readable(item.actor_type)}</span></div></article>)}
              {!events.length ? <article className="result-block soft"><h3>No event history loaded</h3><p>Open a case after migration 028 to review its event history.</p></article> : null}
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
