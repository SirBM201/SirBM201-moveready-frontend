"use client";

import { FormEvent, useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type ServiceHandoff = {
  id?: string;
  handoff_ref: string;
  quote_id?: string;
  service_request_id?: string | null;
  provider_application_id?: string;
  service_slug?: string;
  service_title?: string;
  provider_name?: string;
  status?: string;
  payment_required?: boolean;
  shared_fields?: string[];
  handoff_summary?: string;
  user_consent_required?: boolean;
  user_consent_confirmed?: boolean;
  consent_version?: string;
  consent_recorded?: boolean;
  consented_at?: string;
  prepared_at?: string;
  shared_at?: string;
  provider_acknowledged_at?: string;
  completed_at?: string;
  delivery_channel?: string | null;
  created_at?: string;
  consent_notice?: string;
};

type SupportCase = {
  id?: string;
  case_ref: string;
  quote_id?: string | null;
  handoff_id?: string | null;
  case_type?: string;
  status?: string;
  priority?: string;
  subject?: string;
  description?: string;
  requested_resolution?: string | null;
  resolution_summary?: string | null;
  resolved_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type HandoffsResponse = {
  ok: boolean;
  account_email?: string;
  handoffs?: ServiceHandoff[];
  consent_version?: string;
};

type CasesResponse = {
  ok: boolean;
  account_email?: string;
  support_cases?: SupportCase[];
};

const caseTypes = [
  ["general_support", "General support"],
  ["complaint", "Complaint"],
  ["refund_request", "Refund request"],
  ["payment_dispute", "Payment dispute"],
  ["provider_issue", "Provider issue"],
  ["privacy_issue", "Privacy issue"],
  ["service_quality", "Service quality"],
  ["technical_issue", "Technical issue"],
  ["other", "Other"],
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

export default function ServiceHandoffWorkspace() {
  const [handoffs, setHandoffs] = useState<ServiceHandoff[]>([]);
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [accountEmail, setAccountEmail] = useState("");
  const [consentVersion, setConsentVersion] = useState("");
  const [consentChecks, setConsentChecks] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState("Sign in to load private provider handoffs and support cases.");
  const [loading, setLoading] = useState(false);
  const [updatingRef, setUpdatingRef] = useState("");

  async function loadWorkspace(silent = false) {
    if (!silent) {
      setLoading(true);
      setMessage("Loading private handoffs and support cases...");
    }
    try {
      const [handoffData, caseData] = await Promise.all([
        apiJson<HandoffsResponse>("handoffs", { timeoutMs: 20000 }),
        apiJson<CasesResponse>("handoffs/support-cases", { timeoutMs: 20000 }),
      ]);
      setHandoffs(handoffData.handoffs || []);
      setCases(caseData.support_cases || []);
      setAccountEmail(handoffData.account_email || caseData.account_email || "");
      setConsentVersion(handoffData.consent_version || "");
      setMessage("Private provider handoffs and support cases loaded.");
    } catch (error) {
      const apiError = error as ApiError;
      setHandoffs([]);
      setCases([]);
      setAccountEmail("");
      setMessage(apiError?.status === 401 ? "Sign in with email to use the private Support Center." : "Unable to load Support Center records. Migration 025 may still be pending.");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    void loadWorkspace(true);
  }, []);

  async function consent(handoff: ServiceHandoff) {
    if (!handoff.handoff_ref || !consentChecks[handoff.handoff_ref]) {
      setMessage("Review the named provider, handoff summary, and exact shared fields, then confirm the consent statement.");
      return;
    }
    setUpdatingRef(handoff.handoff_ref);
    setMessage(`Recording consent for ${handoff.handoff_ref}...`);
    try {
      const data = await apiJson<{ handoff: ServiceHandoff }>(`handoffs/${handoff.handoff_ref}/consent`, {
        method: "POST",
        body: {
          confirm_share: true,
          consent_version: handoff.consent_version || consentVersion,
          acknowledged_fields: handoff.shared_fields || [],
          provider_identity_reviewed: true,
          no_unlisted_documents_understood: true,
        },
        timeoutMs: 20000,
      });
      setHandoffs((rows) => rows.map((row) => (row.handoff_ref === handoff.handoff_ref ? data.handoff : row)));
      setConsentChecks((current) => ({ ...current, [handoff.handoff_ref]: false }));
      setMessage("Consent recorded. MoveReady may now share only the listed fields with the named provider and must retain a delivery reference.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to record consent: ${apiError?.data?.error || "handoff_consent_failed"}`);
    } finally {
      setUpdatingRef("");
    }
  }

  async function decline(handoff: ServiceHandoff) {
    const reason = window.prompt("Optional reason for declining this provider handoff") || "";
    setUpdatingRef(handoff.handoff_ref);
    setMessage(`Declining ${handoff.handoff_ref}...`);
    try {
      const data = await apiJson<{ handoff: ServiceHandoff }>(`handoffs/${handoff.handoff_ref}/decline`, {
        method: "POST",
        body: { reason },
        timeoutMs: 15000,
      });
      setHandoffs((rows) => rows.map((row) => (row.handoff_ref === handoff.handoff_ref ? data.handoff : row)));
      setMessage("Provider handoff declined. No information should be shared through this handoff.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to decline handoff: ${apiError?.data?.error || "handoff_decline_failed"}`);
    } finally {
      setUpdatingRef("");
    }
  }

  async function createCase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      case_type: String(data.get("case_type") || "general_support"),
      full_name: String(data.get("full_name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      quote_ref: String(data.get("quote_ref") || "").trim(),
      handoff_ref: String(data.get("handoff_ref") || "").trim(),
      subject: String(data.get("subject") || "").trim(),
      description: String(data.get("description") || "").trim(),
      requested_resolution: String(data.get("requested_resolution") || "").trim(),
      source_page: typeof window !== "undefined" ? window.location.pathname : "/support-center",
    };
    if (!payload.subject || !payload.description) {
      setMessage("Case subject and description are required.");
      return;
    }

    setLoading(true);
    setMessage("Creating private support case...");
    try {
      const response = await apiJson<{ support_case: SupportCase }>("handoffs/support-cases", {
        method: "POST",
        body: payload,
        timeoutMs: 20000,
      });
      setCases((rows) => [response.support_case, ...rows]);
      setMessage(`Support case ${response.support_case.case_ref} created.`);
      form.reset();
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to create support case: ${apiError?.data?.error || "support_case_create_failed"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="live-workspace reports-workspace">
      <section className="workflow-panel live-form">
        <div className="panel-heading">
          <div><p className="overline">Private account support</p><h2>Provider handoff consent</h2></div>
          <span className="status-dot">{accountEmail ? "Verified" : "Sign in"}</span>
        </div>
        <p>
          MoveReady must show the provider, reason for the handoff, and exact fields before sharing. Consent for one handoff does not authorize unrelated providers, extra fields, or unlisted documents.
        </p>
        {accountEmail ? <p className="form-status">Signed in as {accountEmail}</p> : null}
        <div className="actions">
          <button className="btn primary" type="button" disabled={loading} onClick={() => loadWorkspace(false)}>{loading ? "Loading..." : "Load Support Center"}</button>
          <a className="btn" href="/login">Sign in</a>
          <a className="btn" href="/billing">Quotes and payments</a>
        </div>
        <p className="form-status">{message}</p>

        <div className="result-stack" style={{ marginTop: 16 }}>
          {handoffs.map((handoff) => (
            <article className="result-block" key={handoff.handoff_ref}>
              <div className="panel-heading">
                <div><p className="overline">{handoff.handoff_ref}</p><h3>{handoff.service_title || readable(handoff.service_slug)}</h3></div>
                <span className="status-dot">{readable(handoff.status)}</span>
              </div>
              <p>{handoff.handoff_summary}</p>
              <div className="badge-row">
                <span className="badge">Provider: {handoff.provider_name || "Not recorded"}</span>
                <span className="badge">Payment required: {handoff.payment_required ? "yes" : "no"}</span>
                <span className="badge">Prepared: {formatDate(handoff.prepared_at || handoff.created_at)}</span>
                {handoff.shared_at ? <span className="badge">Shared: {formatDate(handoff.shared_at)}</span> : null}
              </div>
              <div className="mini-list" style={{ marginTop: 14 }}>
                {(handoff.shared_fields || []).map((field, index) => <div key={field}><strong>Shared field {index + 1}</strong><span>{readable(field)}</span></div>)}
                <div><strong>Document boundary</strong><span>{handoff.consent_notice}</span></div>
                {handoff.delivery_channel ? <div><strong>Delivery channel</strong><span>{handoff.delivery_channel}</span></div> : null}
              </div>

              {handoff.status === "pending_user_consent" ? (
                <>
                  <label className="checkbox-field" style={{ marginTop: 14 }}>
                    <input
                      type="checkbox"
                      checked={Boolean(consentChecks[handoff.handoff_ref])}
                      onChange={(event) => setConsentChecks((current) => ({ ...current, [handoff.handoff_ref]: event.target.checked }))}
                    />
                    <span>
                      I reviewed the named provider, handoff summary, and every listed field. I authorize MoveReady to share only those fields for this service. I understand that unlisted documents and data are not authorized.
                    </span>
                  </label>
                  <div className="actions">
                    <button className="btn primary" type="button" disabled={updatingRef === handoff.handoff_ref || !consentChecks[handoff.handoff_ref]} onClick={() => consent(handoff)}>Confirm handoff consent</button>
                    <button className="btn" type="button" disabled={updatingRef === handoff.handoff_ref} onClick={() => decline(handoff)}>Decline handoff</button>
                  </div>
                </>
              ) : null}

              {handoff.user_consent_confirmed ? <p className="form-status">Consent recorded at {formatDate(handoff.consented_at)}. Only the listed fields are authorized.</p> : null}
            </article>
          ))}
          {!handoffs.length ? <article className="result-block soft"><h3>No provider handoffs loaded</h3><p>A handoff will appear only after a reviewed quote and approved provider are connected by MoveReady admin.</p></article> : null}
        </div>
      </section>

      <section className="result-panel">
        <form className="interest-form result-block featured" onSubmit={createCase}>
          <div className="panel-heading">
            <div><p className="overline">Complaint and resolution</p><h2>Open a private support case</h2></div>
            <span className="status-dot">Verified account</span>
          </div>
          <p>Use this for complaints, refunds, payment disputes, provider issues, privacy concerns, service quality, or technical problems. Do not include passwords, OTP codes, full card details, private keys, or unrequested identity documents.</p>
          <div className="form-grid two-col">
            <div className="field"><label htmlFor="case_type">Case type</label><select id="case_type" name="case_type" defaultValue="general_support">{caseTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
            <div className="field"><label htmlFor="case_name">Full name</label><input id="case_name" name="full_name" /></div>
            <div className="field"><label htmlFor="case_phone">Phone</label><input id="case_phone" name="phone" /></div>
            <div className="field"><label htmlFor="case_quote_ref">Quote reference</label><input id="case_quote_ref" name="quote_ref" placeholder="Optional MRQ-..." /></div>
            <div className="field"><label htmlFor="case_handoff_ref">Handoff reference</label><input id="case_handoff_ref" name="handoff_ref" placeholder="Optional MRH-..." /></div>
            <div className="field"><label htmlFor="case_subject">Subject</label><input id="case_subject" name="subject" /></div>
          </div>
          <div className="field"><label htmlFor="case_description">What happened?</label><textarea id="case_description" name="description" rows={6} /></div>
          <div className="field"><label htmlFor="case_resolution">Requested resolution</label><textarea id="case_resolution" name="requested_resolution" rows={4} placeholder="Example: explanation, correction, cancellation, refund review, provider follow-up, privacy investigation" /></div>
          <button className="btn primary" type="submit" disabled={loading}>{loading ? "Submitting..." : "Create support case"}</button>
        </form>

        <div className="result-stack" style={{ marginTop: 16 }}>
          {cases.map((item) => (
            <article className="result-block" key={item.case_ref}>
              <div className="panel-heading">
                <div><p className="overline">{item.case_ref}</p><h2>{item.subject}</h2></div>
                <span className="status-dot">{readable(item.status)}</span>
              </div>
              <p>{item.description}</p>
              <div className="badge-row">
                <span className="badge">{readable(item.case_type)}</span>
                <span className="badge">Priority: {readable(item.priority)}</span>
                <span className="badge">Created: {formatDate(item.created_at)}</span>
              </div>
              <div className="mini-list" style={{ marginTop: 14 }}>
                <div><strong>Requested resolution</strong><span>{item.requested_resolution || "Not recorded"}</span></div>
                <div><strong>MoveReady resolution</strong><span>{item.resolution_summary || "Review pending"}</span></div>
                {item.resolved_at ? <div><strong>Resolved</strong><span>{formatDate(item.resolved_at)}</span></div> : null}
              </div>
            </article>
          ))}
          {!cases.length ? <article className="result-block soft"><h3>No support cases loaded</h3><p>New verified-account cases will appear here after submission.</p></article> : null}
        </div>
      </section>
    </div>
  );
}
