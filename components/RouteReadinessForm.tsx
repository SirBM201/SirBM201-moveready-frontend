"use client";

import { FormEvent, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type ChecklistItem = {
  document_name: string;
  requirement_level: string;
  details: string;
};

type BudgetItem = {
  item_name: string;
  item_category: string;
  amount_min: number;
  amount_max: number;
  currency_code: string;
};

type ReportSection = {
  section_key: string;
  section_title: string;
  section_content: string;
};

type ResultState = {
  checklist?: ChecklistItem[];
  budget?: {
    currency: string;
    items: BudgetItem[];
    estimated_total_min: number;
    estimated_total_max: number;
    note: string;
  };
  report?: {
    report_ref: string;
    report_title: string;
    risk_level: string;
    source_status: string;
    stored?: boolean;
    storage_note?: string;
    readiness_flags?: string[];
    sections: ReportSection[];
  };
};

const defaultForm = {
  full_name: "",
  email: "",
  phone: "",
  preferred_contact_channel: "email",
  consent_to_contact: "false",
  goal: "business",
  route_category: "startup",
  current_country: "Kuwait",
  target_country: "Estonia",
  available_funds_amount: "12000",
  available_funds_currency: "EUR",
  family_members_count: "0",
  timeline_months: "6",
};

export default function RouteReadinessForm() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState<ResultState | null>(null);
  const [status, setStatus] = useState("Ready to generate a starter readiness plan.");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function downloadReport() {
    if (!result?.report) return;
    const payload = {
      exported_at: new Date().toISOString(),
      input: form,
      checklist: result.checklist || [],
      budget: result.budget || null,
      report: result.report,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.report.report_ref || "moveready-report"}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function printReport() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("Generating checklist, budget estimate, and readiness report...");

    const payload = {
      ...form,
      consent_to_contact: form.consent_to_contact === "true",
      available_funds_amount: Number(form.available_funds_amount || 0),
      family_members_count: Number(form.family_members_count || 0),
      timeline_months: Number(form.timeline_months || 0),
    };

    try {
      const [checklistResponse, budgetResponse, reportResponse] = await Promise.all([
        apiJson<{ checklist: ChecklistItem[] }>("relocation/checklist", { method: "POST", body: payload }),
        apiJson<{ currency: string; items: BudgetItem[]; estimated_total_min: number; estimated_total_max: number; note: string }>("relocation/budget-estimate", { method: "POST", body: payload }),
        apiJson<{ report: ResultState["report"] }>("relocation/reports", { method: "POST", body: payload }),
      ]);

      setResult({
        checklist: checklistResponse.checklist,
        budget: budgetResponse,
        report: reportResponse.report,
      });
      setStatus(reportResponse.report?.stored ? "Readiness report generated and saved." : "Readiness report generated. Storage needs backend Supabase env if not saved.");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`${err.message} (${err.status})`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to generate readiness plan.");
      }
      setStatus("Generation failed. Check backend URL and environment settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="live-workspace">
      <form className="workflow-panel live-form" onSubmit={onSubmit}>
        <div className="panel-heading">
          <div>
            <p className="overline">Live MVP flow</p>
            <h2>Route readiness inputs</h2>
          </div>
          <span className="status-dot">{loading ? "Working" : "Ready"}</span>
        </div>

        <div className="form-grid two-col">
          <div className="field">
            <label htmlFor="full_name">Full name</label>
            <input id="full_name" value={form.full_name} onChange={(event) => updateField("full_name", event.target.value)} placeholder="Optional" />
          </div>

          <div className="field">
            <label htmlFor="email">Email for report lookup</label>
            <input id="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="Optional" type="email" />
          </div>

          <div className="field">
            <label htmlFor="phone">WhatsApp / phone</label>
            <input id="phone" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="Optional" />
          </div>

          <div className="field">
            <label htmlFor="preferred_contact_channel">Preferred contact</label>
            <select id="preferred_contact_channel" value={form.preferred_contact_channel} onChange={(event) => updateField("preferred_contact_channel", event.target.value)}>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="telegram">Telegram</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="goal">Main goal</label>
            <select id="goal" value={form.goal} onChange={(event) => updateField("goal", event.target.value)}>
              <option value="study">Study or scholarship</option>
              <option value="business">Startup or business</option>
              <option value="work">Work abroad</option>
              <option value="family">Family relocation</option>
              <option value="visit">Visitor route</option>
              <option value="digital_nomad">Digital nomad</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="route_category">Route category</label>
            <select id="route_category" value={form.route_category} onChange={(event) => updateField("route_category", event.target.value)}>
              <option value="startup">Startup</option>
              <option value="study">Study</option>
              <option value="work">Work</option>
              <option value="family">Family</option>
              <option value="visit">Visit</option>
              <option value="digital_nomad">Digital nomad</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="current_country">Current country</label>
            <input id="current_country" value={form.current_country} onChange={(event) => updateField("current_country", event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="target_country">Target country</label>
            <input id="target_country" value={form.target_country} onChange={(event) => updateField("target_country", event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="available_funds_amount">Available funds</label>
            <input id="available_funds_amount" inputMode="decimal" value={form.available_funds_amount} onChange={(event) => updateField("available_funds_amount", event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="available_funds_currency">Currency</label>
            <select id="available_funds_currency" value={form.available_funds_currency} onChange={(event) => updateField("available_funds_currency", event.target.value)}>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="KWD">KWD</option>
              <option value="NGN">NGN</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="family_members_count">Family members joining</label>
            <input id="family_members_count" inputMode="numeric" value={form.family_members_count} onChange={(event) => updateField("family_members_count", event.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="timeline_months">Target timeline in months</label>
            <input id="timeline_months" inputMode="numeric" value={form.timeline_months} onChange={(event) => updateField("timeline_months", event.target.value)} />
          </div>
        </div>

        <label className="consent-row" htmlFor="report_contact_consent">
          <input id="report_contact_consent" type="checkbox" checked={form.consent_to_contact === "true"} onChange={(event) => updateField("consent_to_contact", event.target.checked ? "true" : "false")} />
          <span>Save my contact details with this report so I can retrieve it later and receive follow-up about this route.</span>
        </label>

        <button className="btn primary full" type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate readiness plan"}
        </button>
        <p className="form-status">{status}</p>
        {error ? <p className="form-error">{error}</p> : null}
      </form>

      <section className="result-panel" aria-live="polite">
        {!result ? (
          <div className="empty-result">
            <p className="overline">Output preview</p>
            <h2>Checklist, budget, and report will appear here.</h2>
            <p>Once generated, the result shows document readiness, estimated budget range, report reference, risk level, and source status.</p>
          </div>
        ) : (
          <div className="result-stack">
            {result.report ? (
              <article className="result-block featured">
                <div className="panel-heading">
                  <div>
                    <p className="overline">Readiness report</p>
                    <h2>{result.report.report_title}</h2>
                  </div>
                  <span className="status-dot">{result.report.report_ref}</span>
                </div>
                <div className="badge-row">
                  <span className="badge">Risk: {result.report.risk_level}</span>
                  <span className="badge">Stored: {result.report.stored ? "yes" : "not yet"}</span>
                  <span className="badge">{result.report.source_status}</span>
                </div>
                <div className="actions report-actions">
                  <button className="btn" type="button" onClick={downloadReport}>Download JSON</button>
                  <button className="btn" type="button" onClick={printReport}>Print report</button>
                </div>
                {result.report.storage_note ? <p className="note">{result.report.storage_note}</p> : null}
                <div className="mini-list">
                  {result.report.sections.map((section) => (
                    <div key={section.section_key}>
                      <strong>{section.section_title}</strong>
                      <span>{section.section_content}</span>
                    </div>
                  ))}
                </div>
              </article>
            ) : null}

            {result.budget ? (
              <article className="result-block">
                <p className="overline">Budget estimate</p>
                <h2>
                  {result.budget.currency} {result.budget.estimated_total_min.toLocaleString()} - {result.budget.estimated_total_max.toLocaleString()}
                </h2>
                <p>{result.budget.note}</p>
              </article>
            ) : null}

            {result.checklist ? (
              <article className="result-block">
                <p className="overline">Document checklist</p>
                <div className="mini-list">
                  {result.checklist.map((item) => (
                    <div key={item.document_name}>
                      <strong>{item.document_name}</strong>
                      <span>{item.requirement_level}: {item.details}</span>
                    </div>
                  ))}
                </div>
              </article>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
