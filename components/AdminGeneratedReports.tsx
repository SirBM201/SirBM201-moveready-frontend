"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type ReportPayload = {
  report_title?: string;
  profile_summary?: string;
  sections?: { title?: string; body?: string }[];
};

type InputPayload = {
  full_name?: string;
  email?: string;
  phone?: string;
  current_country?: string;
  target_country?: string;
  goal?: string;
  route_category?: string;
  available_funds_amount?: number | string;
  available_funds_currency?: string;
  family_members_count?: number | string;
};

type GeneratedReport = {
  id: string;
  report_ref: string;
  status: string;
  report_title?: string | null;
  risk_level?: string | null;
  route_version_id?: string | null;
  input_payload?: InputPayload | null;
  report_payload?: ReportPayload | null;
  created_at?: string;
  updated_at?: string;
};

type ApiList = {
  ok: boolean;
  generated_reports: GeneratedReport[];
};

const statusOptions = ["generated", "paid", "delivered", "stale", "refreshed", "archived"];
const riskOptions = ["low", "medium", "high"];

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function reportOwner(report: GeneratedReport) {
  const input = report.input_payload || {};
  return input.full_name || input.email || input.phone || "Report owner not captured";
}

export default function AdminGeneratedReports() {
  const [adminKey, setAdminKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [refFilter, setRefFilter] = useState("");
  const [items, setItems] = useState<GeneratedReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Enter admin key and load generated reports.");

  useEffect(() => {
    try {
      setAdminKey(localStorage.getItem("moveready_admin_key") || "");
    } catch {
      // ignore storage failure
    }
  }, []);

  const counts = useMemo(() => {
    return items.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  }, [items]);

  async function loadItems() {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }

    setLoading(true);
    setMessage("Loading generated reports...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const data = await apiJson<ApiList>("admin/generated-reports", {
        query: {
          status: statusFilter || undefined,
          risk_level: riskFilter || undefined,
          report_ref: refFilter || undefined,
          limit: 75,
        },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems(data.generated_reports || []);
      setMessage(data.generated_reports?.length ? "Generated reports loaded." : "No reports found for this filter.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401 ? "Admin key rejected." : "Unable to load generated reports.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }

    setMessage("Updating report status...");
    try {
      const data = await apiJson<{ generated_report: GeneratedReport }>(`admin/generated-reports/${id}`, {
        method: "PATCH",
        body: { status },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems((rows) => rows.map((item) => (item.id === id ? data.generated_report : item)));
      setMessage("Report status updated.");
    } catch {
      setMessage("Unable to update report status.");
    }
  }

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <h2>Generated reports</h2>
          <p className="section-intro">Review saved readiness reports, mark delivery status, and flag stale reports after route or source changes.</p>
        </div>
        <div className="badge-row admin-counts">
          {statusOptions.map((status) => <span className="badge" key={status}>{status}: {counts[status] || 0}</span>)}
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="field"><label htmlFor="report_admin_key">Admin key</label><input id="report_admin_key" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" type="password" /></div>
        <div className="field"><label htmlFor="report_status">Status</label><select id="report_status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All statuses</option>{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></div>
        <div className="field"><label htmlFor="report_risk">Risk</label><select id="report_risk" value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)}><option value="">All risk levels</option>{riskOptions.map((risk) => <option key={risk} value={risk}>{risk}</option>)}</select></div>
        <div className="field"><label htmlFor="report_ref">Report ref</label><input id="report_ref" value={refFilter} onChange={(event) => setRefFilter(event.target.value)} placeholder="MRR-..." /></div>
        <button className="btn primary" type="button" disabled={loading} onClick={loadItems}>{loading ? "Loading..." : "Load reports"}</button>
      </div>
      <p className="form-status">{message}</p>

      <div className="request-list">
        {items.map((item) => {
          const input = item.input_payload || {};
          const payload = item.report_payload || {};
          const sections = payload.sections || [];
          return (
            <article className="request-card" key={item.id}>
              <div className="request-card-main">
                <div>
                  <span className={`badge module-status ${item.status === "delivered" || item.status === "refreshed" ? "available" : "coming_soon"}`}>{item.status}</span>
                  <h3>{item.report_title || payload.report_title || "Readiness report"}</h3>
                  <p>{item.report_ref} · {reportOwner(item)}</p>
                </div>
                <div className="request-meta">
                  <span>{formatDate(item.created_at)}</span>
                  <span>Risk: {item.risk_level || "not set"}</span>
                  <span>{input.target_country || "target not set"}</span>
                </div>
              </div>

              <div className="request-details">
                <span><strong>Email:</strong> {input.email || "Not provided"}</span>
                <span><strong>Phone:</strong> {input.phone || "Not provided"}</span>
                <span><strong>Current:</strong> {input.current_country || "Not provided"}</span>
                <span><strong>Target:</strong> {input.target_country || "Not provided"}</span>
                <span><strong>Goal:</strong> {input.goal || input.route_category || "Not provided"}</span>
                <span><strong>Funds:</strong> {input.available_funds_currency || ""} {input.available_funds_amount || 0}</span>
                <span><strong>Family:</strong> {input.family_members_count || 0}</span>
                <span><strong>Sections:</strong> {sections.length}</span>
              </div>

              {payload.profile_summary ? <p className="request-note">{payload.profile_summary}</p> : null}

              <div className="badge-row">
                {statusOptions.map((status) => (
                  <button className="status-button" key={status} type="button" disabled={item.status === status} onClick={() => updateStatus(item.id, status)}>{status}</button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
