"use client";

import { FormEvent, useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type OptionRow = { key: string; label: string };
type EvidenceOptions = {
  ok: boolean;
  document_types?: string[];
  owner_scopes?: string[];
  document_statuses?: string[];
  process_statuses?: string[];
  route_categories?: string[];
  application_stages?: string[];
  refusal_event_types?: string[];
  visa_statuses?: string[];
  refusal_reason_options?: OptionRow[];
  storage_boundary?: string;
};

type DocumentRow = {
  id: string;
  document_type?: string;
  document_label?: string;
  owner_scope?: string;
  name_on_document?: string | null;
  issuing_country?: string | null;
  document_language?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  status?: string;
  derived_status?: string;
  days_until_expiry?: number | null;
  translation_status?: string;
  legalization_status?: string;
  notes?: string | null;
  storage_boundary?: string;
};

type PackItem = {
  key?: string;
  label?: string;
  level?: string;
  matching_documents?: string[];
};

type ExpiringItem = {
  requirement?: string;
  document_label?: string;
  expiry_date?: string;
  days_until_expiry?: number;
  status?: string;
};

type EvidencePack = {
  id?: string;
  pack_ref: string;
  route_category?: string;
  target_country?: string;
  application_stage?: string;
  status?: string;
  completeness_score?: number;
  risk_level?: string;
  required_items?: PackItem[];
  available_items?: PackItem[];
  missing_items?: PackItem[];
  expiring_items?: ExpiringItem[];
  warnings?: string[];
  official_source_notes?: string | null;
  created_at?: string;
  safety_note?: string;
};

type RefusalFinding = {
  reason?: string;
  severity?: string;
  issue?: string;
  action?: string;
};

type RefusalResult = {
  ok: boolean;
  event_type?: string;
  decision_date?: string | null;
  issuing_country?: string | null;
  issuing_authority?: string | null;
  visa_status_after_event?: string;
  risk_score?: number;
  risk_level?: string;
  readiness_status?: string;
  findings?: RefusalFinding[];
  corrected_evidence?: string[];
  repair_actions?: string[];
  summary?: string;
  safety_note?: string;
  stored?: boolean;
};

function readable(value?: string | null) {
  return String(value || "not set").replace(/_/g, " ");
}

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

function sourcePage() {
  try {
    return typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/evidence-pack";
  } catch {
    return "/evidence-pack";
  }
}

const fallbackOptions: EvidenceOptions = {
  ok: true,
  document_types: ["passport", "bank_statement", "proof_of_funds", "employment_letter", "academic_certificate", "academic_transcript", "admission_letter", "police_certificate", "insurance", "accommodation", "business_plan", "company_document", "purpose_evidence", "relationship_evidence", "refusal_record", "other"],
  owner_scopes: ["main_applicant", "spouse", "child", "dependant", "sponsor", "employer", "school", "other"],
  document_statuses: ["available", "renewal_needed", "translation_pending", "legalization_pending", "correction_pending", "ready", "expired", "archived"],
  process_statuses: ["not_required", "unknown", "pending", "completed", "rejected"],
  route_categories: ["visitor", "study", "work", "startup", "business", "family", "digital_nomad", "scholarship", "permanent_residence", "other"],
  application_stages: ["research", "preparation", "appointment_booked", "submitted", "decision_received", "archived"],
  refusal_event_types: ["visa_refusal", "permit_refusal", "denied_admission", "admission_refusal", "startup_endorsement_refusal", "scholarship_refusal", "other"],
  visa_statuses: ["valid", "cancelled", "revoked", "unknown", "not_applicable"],
  refusal_reason_options: [
    { key: "purpose_not_convincing", label: "Purpose was not convincing" },
    { key: "intention_to_leave_not_proven", label: "Return intention was not accepted" },
    { key: "insufficient_funds", label: "Funds were insufficient or unsuitable" },
    { key: "incomplete_or_inconsistent_documents", label: "Documents were incomplete or inconsistent" },
    { key: "credibility_concern", label: "Credibility concern" },
    { key: "travel_or_immigration_history", label: "Travel or immigration history concern" },
    { key: "weak_home_or_residence_ties", label: "Weak home or residence ties" },
    { key: "employment_or_income_not_proven", label: "Employment or income not proven" },
    { key: "route_eligibility_not_met", label: "Route eligibility not met" },
    { key: "business_viability_or_traction", label: "Business viability or traction concern" },
    { key: "academic_fit_or_progression", label: "Academic fit or progression concern" },
    { key: "misrepresentation_concern", label: "Misrepresentation concern" },
    { key: "other", label: "Other stated reason" },
  ],
};

export default function EvidencePackWorkspace() {
  const [options, setOptions] = useState<EvidenceOptions>(fallbackOptions);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [packs, setPacks] = useState<EvidencePack[]>([]);
  const [refusalResult, setRefusalResult] = useState<RefusalResult | null>(null);
  const [accountEmail, setAccountEmail] = useState("");
  const [message, setMessage] = useState("Sign in to load your private evidence inventory.");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  async function loadWorkspace(silent = false) {
    if (!silent) {
      setLoading(true);
      setMessage("Loading private evidence records...");
    }
    try {
      const optionData = await apiJson<EvidenceOptions>("evidence/options", { timeoutMs: 12000, useAuthToken: false });
      setOptions({ ...fallbackOptions, ...optionData });
      const [documentData, packData] = await Promise.all([
        apiJson<{ account_email?: string; documents?: DocumentRow[] }>("evidence/documents", { timeoutMs: 20000 }),
        apiJson<{ account_email?: string; evidence_packs?: EvidencePack[] }>("evidence/packs", { timeoutMs: 20000 }),
      ]);
      setDocuments(documentData.documents || []);
      setPacks(packData.evidence_packs || []);
      setAccountEmail(documentData.account_email || packData.account_email || "");
      setMessage("Private evidence inventory and packs loaded.");
    } catch (error) {
      const apiError = error as ApiError;
      setDocuments([]);
      setPacks([]);
      setAccountEmail("");
      setMessage(apiError?.status === 401 ? "Sign in with email to use the private Evidence Center." : apiError?.data?.hint || "Unable to load evidence records. Migration 027 may still be pending.");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    void loadWorkspace(true);
  }, []);

  async function addDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      document_type: String(data.get("document_type") || "other"),
      document_label: String(data.get("document_label") || "").trim(),
      owner_scope: String(data.get("owner_scope") || "main_applicant"),
      name_on_document: String(data.get("name_on_document") || "").trim(),
      issuing_country: String(data.get("issuing_country") || "").trim(),
      document_language: String(data.get("document_language") || "").trim(),
      issue_date: String(data.get("issue_date") || ""),
      expiry_date: String(data.get("expiry_date") || ""),
      status: String(data.get("status") || "available"),
      translation_status: String(data.get("translation_status") || "unknown"),
      legalization_status: String(data.get("legalization_status") || "unknown"),
      notes: String(data.get("notes") || "").trim(),
      source_page: sourcePage(),
    };
    if (!payload.document_label) {
      setMessage("Document label is required.");
      return;
    }
    setLoading(true);
    setMessage("Saving document metadata...");
    try {
      const response = await apiJson<{ document: DocumentRow }>("evidence/documents", {
        method: "POST",
        body: payload,
        timeoutMs: 20000,
      });
      setDocuments((rows) => [response.document, ...rows]);
      setMessage("Document metadata saved. No raw file or full document number was uploaded.");
      form.reset();
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to save document metadata: ${apiError?.data?.error || apiError?.message || "document_inventory_create_failed"}`);
    } finally {
      setLoading(false);
    }
  }

  async function archiveDocument(item: DocumentRow) {
    setUpdatingId(item.id);
    setMessage(`Archiving ${item.document_label || "document"}...`);
    try {
      const response = await apiJson<{ document: DocumentRow }>(`evidence/documents/${item.id}`, {
        method: "PATCH",
        body: { status: "archived" },
        timeoutMs: 15000,
      });
      setDocuments((rows) => rows.filter((row) => row.id !== response.document.id));
      setMessage("Document metadata archived. Existing evidence packs remain historical records.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to archive document metadata: ${apiError?.data?.error || "document_inventory_update_failed"}`);
    } finally {
      setUpdatingId("");
    }
  }

  async function generatePack(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    setMessage("Generating evidence pack from your current inventory...");
    try {
      const response = await apiJson<{ evidence_pack: EvidencePack }>("evidence/packs/generate", {
        method: "POST",
        body: {
          route_category: String(data.get("route_category") || "other"),
          target_country: String(data.get("target_country") || "").trim(),
          application_stage: String(data.get("application_stage") || "research"),
          official_source_notes: String(data.get("official_source_notes") || "").trim(),
          source_page: sourcePage(),
        },
        timeoutMs: 25000,
      });
      setPacks((rows) => [response.evidence_pack, ...rows]);
      setMessage(`Evidence pack ${response.evidence_pack.pack_ref} generated and saved.`);
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to generate evidence pack: ${apiError?.data?.error || apiError?.message || "evidence_pack_create_failed"}`);
    } finally {
      setLoading(false);
    }
  }

  async function runRefusalRepair(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const reasons = (options.refusal_reason_options || []).filter((item) => data.get(`reason_${item.key}`) === "on").map((item) => item.key);
    setLoading(true);
    setMessage("Generating structured refusal-repair plan...");
    try {
      const response = await apiJson<RefusalResult>("evidence/refusal-repair", {
        method: "POST",
        body: {
          event_type: String(data.get("event_type") || "other"),
          decision_date: String(data.get("decision_date") || ""),
          issuing_country: String(data.get("issuing_country") || "").trim(),
          issuing_authority: String(data.get("issuing_authority") || "").trim(),
          written_decision_available: data.get("written_decision_available") === "on",
          visa_status_after_event: String(data.get("visa_status_after_event") || "unknown"),
          disclosure_plan_prepared: data.get("disclosure_plan_prepared") === "on",
          reason_categories: reasons,
          corrected_evidence: String(data.get("corrected_evidence") || ""),
          decision_excerpt: String(data.get("decision_excerpt") || "").trim(),
          decision_excerpt_redacted: data.get("decision_excerpt_redacted") === "on",
          source_page: sourcePage(),
        },
        timeoutMs: 25000,
      });
      setRefusalResult(response);
      setMessage("Refusal-repair plan generated. Review every action against the official decision before reapplying.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to generate refusal-repair plan: ${apiError?.data?.message || apiError?.data?.error || apiError?.message || "refusal_repair_failed"}`);
    } finally {
      setLoading(false);
    }
  }

  const documentTypes = options.document_types || fallbackOptions.document_types || [];
  const ownerScopes = options.owner_scopes || fallbackOptions.owner_scopes || [];
  const documentStatuses = options.document_statuses || fallbackOptions.document_statuses || [];
  const processStatuses = options.process_statuses || fallbackOptions.process_statuses || [];

  return (
    <div className="result-stack">
      <article className="result-block featured">
        <div className="panel-heading">
          <div><p className="overline">Private evidence workspace</p><h2>{accountEmail ? `Evidence for ${accountEmail}` : "Connect a verified account"}</h2></div>
          <span className="status-dot">Metadata only</span>
        </div>
        <p>{options.storage_boundary || fallbackOptions.storage_boundary}</p>
        <div className="actions">
          <button className="btn primary" type="button" disabled={loading} onClick={() => loadWorkspace(false)}>{loading ? "Working..." : "Refresh Evidence Center"}</button>
          <a className="btn" href="/login?next=/evidence-pack">Sign in</a>
          <a className="btn" href="/source-health">Source health</a>
        </div>
        <p className="form-status">{message}</p>
      </article>

      <section className="live-workspace">
        <form className="workflow-panel live-form" onSubmit={addDocument}>
          <div className="panel-heading">
            <div><p className="overline">Document inventory</p><h2>Add document metadata</h2></div>
            <span className="status-dot">No uploads</span>
          </div>
          <p>Record what exists, who owns it, whether it is translated or legalized, and when it expires. Do not enter a full document number.</p>
          <div className="form-grid two-col">
            <div className="field"><label htmlFor="evidence_document_type">Document type</label><select id="evidence_document_type" name="document_type" defaultValue="passport">{documentTypes.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
            <div className="field"><label htmlFor="evidence_document_label">Document label</label><input id="evidence_document_label" name="document_label" placeholder="Current Nigerian passport" required /></div>
            <div className="field"><label htmlFor="evidence_owner_scope">Owner</label><select id="evidence_owner_scope" name="owner_scope" defaultValue="main_applicant">{ownerScopes.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
            <div className="field"><label htmlFor="evidence_name">Name shown</label><input id="evidence_name" name="name_on_document" placeholder="Optional name consistency reference" /></div>
            <div className="field"><label htmlFor="evidence_issuing_country">Issuing country</label><input id="evidence_issuing_country" name="issuing_country" /></div>
            <div className="field"><label htmlFor="evidence_language">Document language</label><input id="evidence_language" name="document_language" /></div>
            <div className="field"><label htmlFor="evidence_issue_date">Issue date</label><input id="evidence_issue_date" name="issue_date" type="date" /></div>
            <div className="field"><label htmlFor="evidence_expiry_date">Expiry date</label><input id="evidence_expiry_date" name="expiry_date" type="date" /></div>
            <div className="field"><label htmlFor="evidence_status">Current status</label><select id="evidence_status" name="status" defaultValue="available">{documentStatuses.filter((item) => item !== "archived").map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
            <div className="field"><label htmlFor="evidence_translation_status">Translation</label><select id="evidence_translation_status" name="translation_status" defaultValue="unknown">{processStatuses.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
            <div className="field"><label htmlFor="evidence_legalization_status">Legalization</label><select id="evidence_legalization_status" name="legalization_status" defaultValue="unknown">{processStatuses.map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
          </div>
          <div className="field"><label htmlFor="evidence_notes">Notes</label><textarea id="evidence_notes" name="notes" rows={3} placeholder="Metadata only. Do not paste private numbers or raw document text." /></div>
          <button className="btn primary" type="submit" disabled={loading}>Save document metadata</button>
        </form>

        <section className="result-panel">
          <div className="result-stack">
            <article className="result-block soft">
              <div className="panel-heading"><div><p className="overline">Inventory</p><h2>{documents.length} active records</h2></div><span className="status-dot">Private account</span></div>
              <p>Expiry status is recalculated when the inventory is loaded. “Renewal needed” means the recorded expiry is within 180 days; the actual route validity rule may be stricter.</p>
            </article>
            {documents.map((item) => (
              <article className="result-block" key={item.id}>
                <div className="panel-heading"><div><p className="overline">{readable(item.document_type)}</p><h3>{item.document_label}</h3></div><span className="status-dot">{readable(item.derived_status || item.status)}</span></div>
                <div className="mini-list">
                  <div><strong>Owner</strong><span>{readable(item.owner_scope)}</span></div>
                  <div><strong>Name shown</strong><span>{item.name_on_document || "Not recorded"}</span></div>
                  <div><strong>Issuing country</strong><span>{item.issuing_country || "Not recorded"}</span></div>
                  <div><strong>Expiry</strong><span>{formatDate(item.expiry_date)}{item.days_until_expiry !== null && item.days_until_expiry !== undefined ? ` · ${item.days_until_expiry} days` : ""}</span></div>
                  <div><strong>Translation</strong><span>{readable(item.translation_status)}</span></div>
                  <div><strong>Legalization</strong><span>{readable(item.legalization_status)}</span></div>
                </div>
                {item.notes ? <p className="form-status">{item.notes}</p> : null}
                <div className="actions"><button className="btn" type="button" disabled={updatingId === item.id} onClick={() => archiveDocument(item)}>{updatingId === item.id ? "Archiving..." : "Archive metadata"}</button></div>
              </article>
            ))}
            {!documents.length ? <article className="result-block soft"><h3>No document metadata loaded</h3><p>Sign in and add your first document inventory record. Migration 027 must be applied before records can be stored.</p></article> : null}
          </div>
        </section>
      </section>

      <section className="live-workspace">
        <form className="workflow-panel live-form" onSubmit={generatePack}>
          <div className="panel-heading"><div><p className="overline">Evidence pack</p><h2>Generate a route-based checklist</h2></div><span className="status-dot">Starter categories</span></div>
          <div className="form-grid two-col">
            <div className="field"><label htmlFor="pack_route_category">Route category</label><select id="pack_route_category" name="route_category" defaultValue="startup">{(options.route_categories || []).map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
            <div className="field"><label htmlFor="pack_target_country">Target country</label><input id="pack_target_country" name="target_country" placeholder="Finland" /></div>
            <div className="field"><label htmlFor="pack_application_stage">Application stage</label><select id="pack_application_stage" name="application_stage" defaultValue="preparation">{(options.application_stages || []).map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
          </div>
          <div className="field"><label htmlFor="pack_source_notes">Official checklist or source note</label><textarea id="pack_source_notes" name="official_source_notes" rows={5} placeholder="Record the official authority, checklist date, URL title, or exact current instruction you checked. Do not paste private application data." /></div>
          <button className="btn primary" type="submit" disabled={loading}>Generate and save evidence pack</button>
        </form>

        <section className="result-panel">
          <div className="result-stack">
            {packs.map((pack) => (
              <article className="result-block featured" key={pack.pack_ref}>
                <div className="panel-heading"><div><p className="overline">{pack.pack_ref}</p><h3>{readable(pack.route_category)} · {pack.target_country || "country not set"}</h3></div><span className="status-dot">{Number(pack.completeness_score || 0)}% complete</span></div>
                <div className="badge-row"><span className="badge">Status: {readable(pack.status)}</span><span className="badge">Risk: {readable(pack.risk_level)}</span><span className="badge">Stage: {readable(pack.application_stage)}</span></div>
                <div className="mini-list">
                  <div><strong>Available required items</strong><span>{(pack.available_items || []).map((item) => item.label).filter(Boolean).join(", ") || "None matched yet"}</span></div>
                  <div><strong>Missing required items</strong><span>{(pack.missing_items || []).map((item) => item.label).filter(Boolean).join(", ") || "No missing required starter category"}</span></div>
                  <div><strong>Expiring or expired</strong><span>{(pack.expiring_items || []).map((item) => `${item.document_label} (${readable(item.status)})`).join(", ") || "None recorded"}</span></div>
                  <div><strong>Warnings</strong><span>{(pack.warnings || []).join(" ") || "No additional warning generated"}</span></div>
                  <div><strong>Official source note</strong><span>{pack.official_source_notes || "Not recorded"}</span></div>
                </div>
                <p className="form-status">{pack.safety_note}</p>
              </article>
            ))}
            {!packs.length ? <article className="result-block soft"><h3>No evidence pack generated</h3><p>Add document metadata, record the official checklist you checked, and generate a pack for the intended route.</p></article> : null}
          </div>
        </section>
      </section>

      <section className="live-workspace">
        <form className="workflow-panel live-form" onSubmit={runRefusalRepair}>
          <div className="panel-heading"><div><p className="overline">Refusal and denied admission</p><h2>Build a repair plan</h2></div><span className="status-dot">No approval prediction</span></div>
          <div className="form-grid two-col">
            <div className="field"><label htmlFor="refusal_event_type">Event type</label><select id="refusal_event_type" name="event_type" defaultValue="visa_refusal">{(options.refusal_event_types || []).map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
            <div className="field"><label htmlFor="refusal_decision_date">Decision or event date</label><input id="refusal_decision_date" name="decision_date" type="date" /></div>
            <div className="field"><label htmlFor="refusal_country">Issuing country</label><input id="refusal_country" name="issuing_country" /></div>
            <div className="field"><label htmlFor="refusal_authority">Authority</label><input id="refusal_authority" name="issuing_authority" placeholder="Embassy, immigration authority, border agency, school, endorsement body" /></div>
            <div className="field"><label htmlFor="refusal_visa_status">Visa or permit status after event</label><select id="refusal_visa_status" name="visa_status_after_event" defaultValue="unknown">{(options.visa_statuses || []).map((item) => <option key={item} value={item}>{readable(item)}</option>)}</select></div>
          </div>
          <label className="checkbox-field"><input type="checkbox" name="written_decision_available" /><span>I have the written decision or official record.</span></label>
          <label className="checkbox-field"><input type="checkbox" name="disclosure_plan_prepared" /><span>I have prepared a truthful disclosure plan for future forms and interviews.</span></label>
          <div className="field"><label>Decision reason categories</label><div className="check-grid">{(options.refusal_reason_options || []).map((item) => <label className="checkbox-field" key={item.key}><input type="checkbox" name={`reason_${item.key}`} /><span>{item.label}</span></label>)}</div></div>
          <div className="field"><label htmlFor="refusal_corrected_evidence">Corrected or new evidence</label><textarea id="refusal_corrected_evidence" name="corrected_evidence" rows={5} placeholder="One item per line: official decision obtained; employer letter corrected; six-month savings history; revised market validation..." /></div>
          <div className="field"><label htmlFor="refusal_excerpt">Optional redacted decision excerpt</label><textarea id="refusal_excerpt" name="decision_excerpt" rows={5} placeholder="Remove names, passport numbers, addresses, account details, file numbers, barcodes, signatures, and third-party data." /></div>
          <label className="checkbox-field"><input type="checkbox" name="decision_excerpt_redacted" /><span>I removed direct identifiers and sensitive personal data from any excerpt entered above.</span></label>
          <button className="btn primary" type="submit" disabled={loading}>Generate refusal-repair plan</button>
        </form>

        <section className="result-panel">
          {refusalResult ? (
            <article className="result-block featured">
              <div className="panel-heading"><div><p className="overline">Repair result</p><h2>{readable(refusalResult.event_type)}</h2></div><span className="status-dot">Risk: {readable(refusalResult.risk_level)}</span></div>
              <p>{refusalResult.summary}</p>
              <div className="badge-row"><span className="badge">Score: {refusalResult.risk_score ?? 0}</span><span className="badge">Status: {readable(refusalResult.readiness_status)}</span><span className="badge">Visa status: {readable(refusalResult.visa_status_after_event)}</span><span className="badge">Saved: {refusalResult.stored ? "yes" : "no"}</span></div>
              <div className="mini-list">
                {(refusalResult.findings || []).map((item, index) => <div key={`${item.reason || "finding"}-${index}`}><strong>{readable(item.severity)}: {item.issue}</strong><span>{item.action}</span></div>)}
                {(refusalResult.repair_actions || []).map((item, index) => <div key={`${item}-${index}`}><strong>Action {index + 1}</strong><span>{item}</span></div>)}
              </div>
              <p className="form-status">{refusalResult.safety_note}</p>
            </article>
          ) : (
            <article className="result-block soft"><p className="overline">Repair result</p><h2>No repair plan generated</h2><p>Use the exact written decision where available. A refusal, denied admission, visa cancellation, visa revocation, and entry ban are not interchangeable.</p></article>
          )}
        </section>
      </section>
    </div>
  );
}
