"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type ReportSection = {
  title?: string;
  body?: string;
  section_key?: string;
  section_title?: string;
  section_content?: string;
  section_payload?: Record<string, any>;
};

type ActionItem = {
  priority?: string;
  title?: string;
  detail?: string;
};

type ReportPayload = {
  report_ref?: string;
  sections?: ReportSection[];
  next_steps?: string[];
  readiness_score?: number;
  readiness_level?: string;
  readiness_flags?: string[];
  strengths?: string[];
  missing_documents?: string[];
  required_documents?: string[];
  recommended_documents?: string[];
  action_items?: ActionItem[];
  source_status?: string;
  source_confidence?: string;
};

type ReportRow = {
  id?: string;
  report_ref?: string;
  status?: string;
  report_title?: string;
  risk_level?: string;
  created_at?: string;
  generated_at?: string;
  goal?: string;
  route_category?: string;
  current_country?: string;
  target_country?: string;
  available_funds_amount?: number;
  available_funds_currency?: string;
  family_members_count?: number;
  report_payload?: ReportPayload;
};

type AccountSummary = {
  ok: boolean;
  session?: { email?: string };
  sections?: {
    reports?: {
      rows?: ReportRow[];
      count?: number;
    };
  };
};

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function sectionTitle(section: ReportSection) {
  return section.section_title || section.title || "Report section";
}

function sectionBody(section: ReportSection) {
  return section.section_content || section.body || "No detail recorded.";
}

function compactList(items?: string[], fallback = "Not recorded") {
  if (!items?.length) return fallback;
  return items.slice(0, 6).join(", ");
}

function scoreLabel(report: ReportRow) {
  const payload = report.report_payload || {};
  const score = payload.readiness_score;
  const level = payload.readiness_level;
  if (typeof score === "number" && level) return `${score}/100 · ${level}`;
  if (typeof score === "number") return `${score}/100`;
  return level || "Not scored";
}

export default function ReportsLookup() {
  const [reportRef, setReportRef] = useState("");
  const [contact, setContact] = useState("");
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [message, setMessage] = useState("Loading verified account reports if you are signed in...");
  const [loading, setLoading] = useState(false);
  const [accountEmail, setAccountEmail] = useState("");

  async function loadVerifiedReports(silent = false) {
    if (!silent) {
      setLoading(true);
      setMessage("Loading reports from your verified account...");
    }
    try {
      const data = await apiJson<AccountSummary>("account/summary", {
        timeoutMs: 15000,
      });
      const rows = data.sections?.reports?.rows || [];
      setReports(rows);
      setAccountEmail(data.session?.email || "");
      setMessage(rows.length ? "Verified account reports loaded." : "No reports are connected to this verified account yet.");
    } catch {
      if (!silent) setMessage("Sign in first, or use report reference/email/phone lookup below.");
      if (silent) setMessage("Enter a report reference, email, or phone to load saved reports.");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    loadVerifiedReports(true);
  }, []);

  async function loadReports() {
    const ref = reportRef.trim();
    const lookup = contact.trim();
    if (!ref && !lookup) {
      await loadVerifiedReports(false);
      return;
    }

    setLoading(true);
    setMessage("Loading reports...");
    try {
      const isEmail = lookup.includes("@");
      const data = await apiJson<{ reports: ReportRow[] }>("reports", {
        query: {
          report_ref: ref || undefined,
          email: lookup && isEmail ? lookup : undefined,
          phone: lookup && !isEmail ? lookup : undefined,
          limit: 25,
        },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setReports(data.reports || []);
      setMessage(data.reports?.length ? "Reports loaded." : "No reports found for this lookup.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 400 ? "Enter a valid lookup value." : "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="live-workspace reports-workspace">
      <section className="workflow-panel live-form">
        <div className="panel-heading">
          <div>
            <p className="overline">Saved reports</p>
            <h2>Find a readiness report</h2>
          </div>
          <span className="status-dot">{accountEmail ? "Verified" : "Lookup"}</span>
        </div>
        {accountEmail ? <p className="form-status">Signed in as {accountEmail}. Reports below are loaded from the verified account when available.</p> : null}
        <div className="form-grid two-col">
          <div className="field"><label htmlFor="report_ref">Report reference</label><input id="report_ref" value={reportRef} onChange={(event) => setReportRef(event.target.value)} placeholder="MRR-..." /></div>
          <div className="field"><label htmlFor="report_contact">Email or phone</label><input id="report_contact" value={contact} onChange={(event) => setContact(event.target.value)} placeholder="you@example.com or +965..." /></div>
        </div>
        <div className="actions">
          <button className="btn primary" type="button" disabled={loading} onClick={loadReports}>{loading ? "Loading..." : "Load reports"}</button>
          <button className="btn" type="button" disabled={loading} onClick={() => loadVerifiedReports(false)}>Load my verified reports</button>
        </div>
        <p className="form-status">{message}</p>
      </section>

      <section className="result-panel">
        {reports.length ? (
          <div className="result-stack">
            {reports.map((report) => {
              const payload = report.report_payload || {};
              const sections = payload.sections || [];
              return (
                <article className="result-block" key={report.id || report.report_ref}>
                  <div className="panel-heading">
                    <div>
                      <p className="overline">{report.report_ref || payload.report_ref || "Report"}</p>
                      <h2>{report.report_title || "Relocation readiness report"}</h2>
                    </div>
                    <span className="status-dot">{scoreLabel(report)}</span>
                  </div>
                  <div className="badge-row">
                    {report.risk_level ? <span className="badge">Risk: {report.risk_level}</span> : null}
                    {report.target_country ? <span className="badge">Target: {report.target_country}</span> : null}
                    {report.route_category ? <span className="badge">Route: {report.route_category}</span> : null}
                    <span className="badge">{formatDate(report.created_at || report.generated_at)}</span>
                  </div>
                  <div className="mini-list">
                    <div><strong>Goal</strong><span>{report.goal || "Not recorded"}</span></div>
                    <div><strong>Current country</strong><span>{report.current_country || "Not recorded"}</span></div>
                    <div><strong>Funds</strong><span>{report.available_funds_currency || ""} {(report.available_funds_amount || 0).toLocaleString()}</span></div>
                    <div><strong>Family members</strong><span>{report.family_members_count || 0}</span></div>
                    <div><strong>Missing documents</strong><span>{compactList(payload.missing_documents, "No document gaps shown")}</span></div>
                    <div><strong>Source status</strong><span>{payload.source_status || "starter_rules_pending_official_review"}</span></div>
                  </div>
                  {sections.length ? (
                    <div className="result-stack compact-stack">
                      {sections.map((section, index) => {
                        const title = sectionTitle(section);
                        return (
                          <div className="result-block soft" key={`${section.section_key || title}-${index}`}>
                            <h3>{title}</h3>
                            <p>{sectionBody(section)}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                  {payload.action_items?.length ? (
                    <div className="result-block soft">
                      <h3>Action items</h3>
                      <div className="mini-list">
                        {payload.action_items.slice(0, 4).map((item, index) => (
                          <div key={`${item.title || "action"}-${index}`}><strong>{item.priority || "medium"}</strong><span>{item.title}: {item.detail}</span></div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div className="actions">
                    <a className="btn primary" href="/dashboard">Generate updated report</a>
                    <button className="btn" type="button" onClick={() => window.print()}>Print</button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <article className="result-block featured">
            <p className="overline">Output preview</p>
            <h2>Saved reports will appear here.</h2>
            <p>Use the report reference shown after generation, sign in, or use the same email or phone stored in the report input.</p>
          </article>
        )}
      </section>
    </div>
  );
}
