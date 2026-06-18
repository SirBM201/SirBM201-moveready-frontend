"use client";

import { useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type ReportRow = {
  id?: string;
  report_ref?: string;
  status?: string;
  report_title?: string;
  risk_level?: string;
  created_at?: string;
  goal?: string;
  route_category?: string;
  current_country?: string;
  target_country?: string;
  available_funds_amount?: number;
  available_funds_currency?: string;
  family_members_count?: number;
  report_payload?: {
    report_ref?: string;
    sections?: { title?: string; body?: string }[];
    next_steps?: string[];
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

export default function ReportsLookup() {
  const [reportRef, setReportRef] = useState("");
  const [contact, setContact] = useState("");
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [message, setMessage] = useState("Enter a report reference, email, or phone to load saved reports.");
  const [loading, setLoading] = useState(false);

  async function loadReports() {
    const ref = reportRef.trim();
    const lookup = contact.trim();
    if (!ref && !lookup) {
      setMessage("Enter a report reference, email, or phone.");
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
          <span className="status-dot">Lookup</span>
        </div>
        <div className="form-grid two-col">
          <div className="field"><label htmlFor="report_ref">Report reference</label><input id="report_ref" value={reportRef} onChange={(event) => setReportRef(event.target.value)} placeholder="MRR-..." /></div>
          <div className="field"><label htmlFor="report_contact">Email or phone</label><input id="report_contact" value={contact} onChange={(event) => setContact(event.target.value)} placeholder="you@example.com or +965..." /></div>
        </div>
        <button className="btn primary full" type="button" disabled={loading} onClick={loadReports}>{loading ? "Loading..." : "Load reports"}</button>
        <p className="form-status">{message}</p>
      </section>

      <section className="result-panel">
        {reports.length ? (
          <div className="result-stack">
            {reports.map((report) => {
              const sections = report.report_payload?.sections || [];
              return (
                <article className="result-block" key={report.id || report.report_ref}>
                  <div className="panel-heading">
                    <div>
                      <p className="overline">{report.report_ref || report.report_payload?.report_ref || "Report"}</p>
                      <h2>{report.report_title || "Relocation readiness report"}</h2>
                    </div>
                    <span className="status-dot">{report.status || "generated"}</span>
                  </div>
                  <div className="badge-row">
                    {report.risk_level ? <span className="badge">Risk: {report.risk_level}</span> : null}
                    {report.target_country ? <span className="badge">Target: {report.target_country}</span> : null}
                    {report.route_category ? <span className="badge">Route: {report.route_category}</span> : null}
                    <span className="badge">{formatDate(report.created_at)}</span>
                  </div>
                  <div className="mini-list">
                    <div><strong>Goal</strong><span>{report.goal || "Not recorded"}</span></div>
                    <div><strong>Current country</strong><span>{report.current_country || "Not recorded"}</span></div>
                    <div><strong>Funds</strong><span>{report.available_funds_currency || ""} {(report.available_funds_amount || 0).toLocaleString()}</span></div>
                    <div><strong>Family members</strong><span>{report.family_members_count || 0}</span></div>
                  </div>
                  {sections.length ? (
                    <div className="result-stack compact-stack">
                      {sections.slice(0, 4).map((section, index) => (
                        <div className="result-block soft" key={`${section.title}-${index}`}>
                          <h3>{section.title || "Report section"}</h3>
                          <p>{section.body || "No detail recorded."}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <div className="actions">
                    <a className="btn primary" href="/route-checker">Generate updated report</a>
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
            <p>Use the report reference shown after generation, or use the same email or phone stored in the report input.</p>
          </article>
        )}
      </section>
    </div>
  );
}
