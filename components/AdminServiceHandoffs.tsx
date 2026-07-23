"use client";

import { FormEvent, useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type Handoff = {
  id: string;
  handoff_ref: string;
  service_title?: string;
  provider_name?: string;
  status?: string;
  payment_required?: boolean;
  shared_fields?: string[];
  handoff_summary?: string;
  user_consent_confirmed?: boolean;
  consent_recorded?: boolean;
  consented_at?: string | null;
  prepared_at?: string | null;
  shared_at?: string | null;
  delivery_channel?: string | null;
};

type SupportCase = {
  id: string;
  case_ref: string;
  email?: string;
  phone?: string | null;
  case_type?: string;
  status?: string;
  priority?: string;
  subject?: string;
  description?: string;
  requested_resolution?: string | null;
  resolution_summary?: string | null;
  assigned_to?: string | null;
  created_at?: string;
};

const handoffStatuses = ["provider_acknowledged", "in_progress", "completed", "cancelled", "blocked", "disputed"];
const caseStatuses = ["open", "reviewing", "waiting_user", "waiting_provider", "escalated", "resolved", "rejected", "closed"];
const casePriorities = ["low", "medium", "high", "critical"];
const sharedFieldOptions = [
  "full_name",
  "email",
  "phone",
  "current_country",
  "target_country",
  "route_or_goal",
  "service_request_summary",
  "quote_scope",
  "preferred_contact_channel",
  "deadline_summary",
  "family_context_summary",
  "document_types_summary",
];

function readable(value?: string) {
  return String(value || "not available").replace(/_/g, " ");
}

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminServiceHandoffs() {
  const [adminKey, setAdminKey] = useState("");
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [message, setMessage] = useState("Enter the admin key to load handoffs and support cases.");
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

  async function loadWorkspace() {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }
    setLoading(true);
    setMessage("Loading provider handoffs and support cases...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const [handoffData, caseData] = await Promise.all([
        apiJson<{ service_handoffs?: Handoff[] }>("admin/service-handoffs", { headers: headers(), query: { limit: 100 }, timeoutMs: 20000, useAuthToken: false }),
        apiJson<{ support_cases?: SupportCase[] }>("admin/support-cases", { headers: headers(), query: { limit: 125 }, timeoutMs: 20000, useAuthToken: false }),
      ]);
      setHandoffs(handoffData.service_handoffs || []);
      setCases(caseData.support_cases || []);
      setMessage("Provider handoffs and support cases loaded.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401 ? "Admin key rejected." : "Unable to load handoffs or cases. Confirm migration 025 is applied.");
    } finally {
      setLoading(false);
    }
  }

  async function createHandoff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    const sharedFields = sharedFieldOptions.filter((field) => data.get(field) === "on");
    const payload = {
      quote_ref: String(data.get("quote_ref") || "").trim(),
      provider_application_id: String(data.get("provider_application_id") || "").trim(),
      handoff_summary: String(data.get("handoff_summary") || "").trim(),
      shared_fields: sharedFields,
      payment_required: data.get("payment_required") === "on",
      admin_owner: String(data.get("admin_owner") || "MoveReady admin").trim(),
    };
    setLoading(true);
    setMessage("Preparing consent-based provider handoff...");
    try {
      const response = await apiJson<{ service_handoff: Handoff }>("admin/service-handoffs", {
        method: "POST",
        body: payload,
        headers: headers(),
        timeoutMs: 20000,
        useAuthToken: false,
      });
      setHandoffs((rows) => [response.service_handoff, ...rows]);
      setMessage(`Handoff ${response.service_handoff.handoff_ref} prepared. It remains blocked until the user confirms the exact fields.`);
      form.reset();
    } catch (error) {
      const apiError = error as ApiError;
      const providerErrors = Array.isArray(apiError?.data?.provider_errors) ? `: ${apiError.data.provider_errors.join(", ")}` : "";
      setMessage(`Unable to prepare handoff: ${apiError?.data?.error || "handoff_create_failed"}${providerErrors}`);
    } finally {
      setLoading(false);
    }
  }

  async function markShared(item: Handoff) {
    const channel = window.prompt("Delivery channel used, for example approved email, secure portal, or recorded manual handoff")?.trim();
    if (!channel) return;
    const reference = window.prompt("Delivery reference, message ID, ticket ID, or secure portal reference")?.trim();
    if (!reference) return;

    setUpdatingId(item.id);
    setMessage(`Recording provider handoff ${item.handoff_ref}...`);
    try {
      const response = await apiJson<{ service_handoff: Handoff }>(`admin/service-handoffs/${item.id}/mark-shared`, {
        method: "POST",
        body: { delivery_channel: channel, delivery_reference: reference, admin_owner: "MoveReady admin console" },
        headers: headers(),
        timeoutMs: 20000,
        useAuthToken: false,
      });
      setHandoffs((rows) => rows.map((row) => (row.id === item.id ? response.service_handoff : row)));
      setMessage("Handoff marked shared with an auditable delivery reference.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to mark shared: ${apiError?.data?.error || "handoff_share_failed"}`);
    } finally {
      setUpdatingId("");
    }
  }

  async function updateHandoff(item: Handoff, status: string) {
    setUpdatingId(item.id);
    setMessage(`Updating ${item.handoff_ref} to ${status}...`);
    try {
      const response = await apiJson<{ service_handoff: Handoff }>(`admin/service-handoffs/${item.id}`, {
        method: "PATCH",
        body: { status, admin_owner: "MoveReady admin console" },
        headers: headers(),
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setHandoffs((rows) => rows.map((row) => (row.id === item.id ? response.service_handoff : row)));
      setMessage("Handoff status updated.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to update handoff: ${apiError?.data?.error || "handoff_update_failed"}`);
    } finally {
      setUpdatingId("");
    }
  }

  async function updateCase(item: SupportCase, status?: string, priority?: string) {
    const resolutionNeeded = status === "resolved" || status === "closed" || status === "rejected";
    const resolution = resolutionNeeded ? window.prompt("Resolution or decision summary", item.resolution_summary || "")?.trim() : undefined;
    if (resolutionNeeded && !resolution) return;
    const assignedTo = window.prompt("Assigned owner", item.assigned_to || "MoveReady admin")?.trim();

    setUpdatingId(item.id);
    setMessage(`Updating support case ${item.case_ref}...`);
    try {
      const response = await apiJson<{ support_case: SupportCase }>(`admin/support-cases/${item.id}`, {
        method: "PATCH",
        body: {
          status,
          priority,
          assigned_to: assignedTo,
          resolution_summary: resolution,
        },
        headers: headers(),
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setCases((rows) => rows.map((row) => (row.id === item.id ? response.support_case : row)));
      setMessage("Support case updated.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to update support case: ${apiError?.data?.error || "support_case_update_failed"}`);
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <p className="overline">Provider execution control</p>
          <h2>Handoffs, complaints, refunds, and disputes</h2>
          <p className="section-intro">Prepare provider handoffs only from an auditable accepted quote and an approved public provider. No field may be shared before user consent, and shared status requires a delivery reference.</p>
        </div>
        <span className="status-dot">Consent first</span>
      </div>

      <div className="admin-toolbar">
        <div className="field"><label htmlFor="handoff_admin_key">Admin key</label><input id="handoff_admin_key" type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" /></div>
        <button className="btn primary" type="button" disabled={loading} onClick={loadWorkspace}>{loading ? "Loading..." : "Load handoffs and cases"}</button>
      </div>
      <p className="form-status">{message}</p>

      <form className="interest-form result-block soft" onSubmit={createHandoff}>
        <div><p className="overline">Prepare handoff</p><h3>Connect an accepted quote to an approved provider</h3></div>
        <div className="form-grid two-col">
          <div className="field"><label htmlFor="handoff_quote_ref">Quote reference</label><input id="handoff_quote_ref" name="quote_ref" placeholder="MRQ-..." /></div>
          <div className="field"><label htmlFor="handoff_provider_id">Approved provider ID</label><input id="handoff_provider_id" name="provider_application_id" placeholder="Provider UUID" /></div>
          <div className="field"><label htmlFor="handoff_admin_owner">Admin owner</label><input id="handoff_admin_owner" name="admin_owner" defaultValue="MoveReady admin" /></div>
          <label className="checkbox-field"><input type="checkbox" name="payment_required" defaultChecked /><span>Require verified paid quote before preparing the handoff.</span></label>
        </div>
        <div className="field"><label>Exact fields proposed for sharing</label><div className="check-grid">{sharedFieldOptions.map((field) => <label className="checkbox-field" key={field}><input type="checkbox" name={field} defaultChecked={["full_name", "email", "phone", "quote_scope"].includes(field)} /><span>{readable(field)}</span></label>)}</div></div>
        <div className="field"><label htmlFor="handoff_summary">Handoff purpose and limits</label><textarea id="handoff_summary" name="handoff_summary" rows={5} placeholder="Explain why this provider needs these fields, what service is expected, what is excluded, and the next action." /></div>
        <button className="btn primary" type="submit" disabled={loading}>Prepare consent request</button>
      </form>

      <div className="result-stack" style={{ marginTop: 18 }}>
        {handoffs.map((item) => (
          <article className="result-block" key={item.id}>
            <div className="panel-heading">
              <div><p className="overline">{item.handoff_ref}</p><h3>{item.service_title}</h3></div>
              <span className="status-dot">{readable(item.status)}</span>
            </div>
            <p>{item.handoff_summary}</p>
            <div className="badge-row">
              <span className="badge">Provider: {item.provider_name}</span>
              <span className="badge">Payment required: {item.payment_required ? "yes" : "no"}</span>
              <span className="badge">Consent: {item.consent_recorded ? "recorded" : "pending"}</span>
              <span className="badge">Prepared: {formatDate(item.prepared_at)}</span>
              {item.shared_at ? <span className="badge">Shared: {formatDate(item.shared_at)}</span> : null}
            </div>
            <div className="mini-list" style={{ marginTop: 12 }}>
              <div><strong>Approved fields</strong><span>{(item.shared_fields || []).map(readable).join(", ") || "None"}</span></div>
              <div><strong>Delivery</strong><span>{item.delivery_channel || "Not shared"}</span></div>
            </div>
            <div className="actions wrap-actions">
              {item.status === "consent_confirmed" || item.status === "ready_to_share" ? <button className="btn primary" type="button" disabled={updatingId === item.id} onClick={() => markShared(item)}>Record actual sharing</button> : null}
              {handoffStatuses.map((status) => <button className="status-button" key={status} type="button" disabled={updatingId === item.id || item.status === status} onClick={() => updateHandoff(item, status)}>{status}</button>)}
            </div>
          </article>
        ))}
      </div>

      <div className="section-heading-row" style={{ marginTop: 28 }}>
        <div><p className="overline">Resolution queue</p><h2>Private support cases</h2></div>
        <span className="status-dot">{cases.length}</span>
      </div>
      <div className="request-list">
        {cases.map((item) => (
          <article className="request-card" key={item.id}>
            <div className="request-card-main">
              <div><span className={`badge module-status ${item.priority === "critical" || item.priority === "high" ? "partner_approval_pending" : "coming_soon"}`}>{readable(item.status)}</span><h3>{item.case_ref}: {item.subject}</h3><p>{item.description}</p></div>
              <div className="request-meta"><span>{readable(item.case_type)}</span><span>Priority: {readable(item.priority)}</span><span>{item.email}</span><span>{formatDate(item.created_at)}</span></div>
            </div>
            <div className="request-details"><span><strong>Requested resolution:</strong> {item.requested_resolution || "Not recorded"}</span><span><strong>Assigned:</strong> {item.assigned_to || "Unassigned"}</span><span><strong>Resolution:</strong> {item.resolution_summary || "Pending"}</span></div>
            <div className="actions wrap-actions">
              {caseStatuses.map((status) => <button className="status-button" key={status} type="button" disabled={updatingId === item.id || item.status === status} onClick={() => updateCase(item, status, undefined)}>{status}</button>)}
              {casePriorities.map((priority) => <button className="status-button" key={priority} type="button" disabled={updatingId === item.id || item.priority === priority} onClick={() => updateCase(item, undefined, priority)}>priority {priority}</button>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
