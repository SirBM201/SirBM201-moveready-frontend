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
  return items.slice(0, 8).join(", ");
}

function scoreLabel(report: ReportRow) {
  const payload = report.report_payload || {};
  const score = payload.readiness_score;
  const level = payload.readiness_level;
  if (typeof score === "number" && level) return `${score}/100 · ${level}`;
  if (typeof score === "number") return `${score}/100`;
  return level || "Not scored";
}

export default function ReportDetail({ reportRef }: { reportRef: string }) {
  const [report, setReport] = useState<ReportRow | null>(null);
  const [message, setMessage] = useState("Loading report...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      setMessage("Loading report...");
      try {
        const data = await apiJson<{ report: ReportRow }>(`reports/${encodeURIComponent(reportRef)}`, {
          timeoutMs: 15000,
          useAuthToken: false,
        });
        setReport(data.report || null);
        setMessage(data.report ? "Report loaded." : "Report not found.");
      } catch (error) {
        const apiError = error as ApiError;
        setMessage(apiError?.status === 404 ? "Report not found." : "Unable to load this report right now.");
        setReport(null);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [reportRef]);

  if (!report) {
    return (
      <section className="section">
        <article className="result-block featured">
          <p className="overline">Report lookup</p>
          <h2>{loading ? "Loading readiness report" : "Report not available"}</h2>
          <p>{message}</p>
          <div className="actions">
            <a className="btn primary" href="/my-reports">Back to My Reports</a>
            <a className="btn" href="/dashboard">Account Center</a>
          </div>
        </article>
      </section>
    );
  }

  const payload = report.report_payload || {};
  const sections = payload.sections || [];

  return (
    <section className="section">
      <div className="live-workspace reports-workspace">
        <article className="workflow-panel">
          <div className="panel-heading">
            <div>
              <p className="overline">Readiness report</p>
              <h2>{report.report_ref || reportRef}</h2>
            </div>
            <span className="status-dot">{scoreLabel(report)}</span>
          </div>
          <p className="section-intro">
            This report is advisory. It should remain tied to official sources, source confidence, risk labels, and the generated date. It must not be treated as a visa, admission, lottery, ballot, job, or provider approval.
          </p>
          <div className="mini-list">
            <div><strong>Title</strong><span>{report.report_title || "Relocation readiness report"}</span></div>
            <div><strong>Risk</strong><span>{report.risk_level || "Not labelled"}</span></div>
            <div><strong>Generated</strong><span>{formatDate(report.created_at || report.generated_at)}</span></div>
            <div><strong>Source status</strong><span>{payload.source_status || "starter_rules_pending_official_review"}</span></div>
            <div><strong>Source confidence</strong><span>{payload.source_confidence || "starter"}</span></div>
            <div><strong>Missing documents</strong><span>{compactList(payload.missing_documents, "No document gaps shown")}</span></div>
          </div>
          <div className="actions">
            <button className="btn primary" type="button" onClick={() => window.print()}>Print report</button>
            <a className="btn" href="/my-reports">Back to My Reports</a>
            <a className="btn" href="/saved-routes">Saved routes</a>
          </div>
          <p className="form-status">{message}</p>
        </article>

        <section className="result-panel">
          <article className="result-block featured">
            <p className="overline">Profile snapshot</p>
            <h2>{report.target_country || "Target country"} · {report.route_category || report.goal || "route"}</h2>
            <div className="mini-list">
              <div><strong>Goal</strong><span>{report.goal || "Not recorded"}</span></div>
              <div><strong>Current country</strong><span>{report.current_country || "Not recorded"}</span></div>
              <div><strong>Funds</strong><span>{report.available_funds_currency || ""} {(report.available_funds_amount || 0).toLocaleString()}</span></div>
              <div><strong>Family members</strong><span>{report.family_members_count || 0}</span></div>
            </div>
          </article>

          {sections.length ? (
            <div className="result-stack compact-stack">
              {sections.map((section, index) => {
                const title = sectionTitle(section);
                return (
                  <article className="result-block" key={`${section.section_key || title}-${index}`}>
                    <h2>{title}</h2>
                    <p>{sectionBody(section)}</p>
                  </article>
                );
              })}
            </div>
          ) : null}

          {payload.action_items?.length ? (
            <article className="result-block">
              <p className="overline">Next actions</p>
              <h2>Action plan</h2>
              <div className="mini-list">
                {payload.action_items.slice(0, 6).map((item, index) => (
                  <div key={`${item.title || "action"}-${index}`}><strong>{item.priority || "medium"}</strong><span>{item.title}: {item.detail}</span></div>
                ))}
              </div>
            </article>
          ) : null}
        </section>
      </div>
    </section>
  );
}
