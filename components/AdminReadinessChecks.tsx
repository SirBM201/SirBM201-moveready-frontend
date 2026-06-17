"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type ReadinessCheck = {
  id: string;
  tool_slug: string;
  status?: string;
  risk_level?: string | null;
  readiness_status?: string | null;
  source_page?: string | null;
  input_payload?: Record<string, any>;
  result_payload?: Record<string, any>;
  created_at?: string;
};

type ApiList = {
  ok: boolean;
  readiness_checks: ReadinessCheck[];
};

const toolOptions = ["name_consistency", "document_readiness", "funds_plan", "refusal_risk"];
const riskOptions = ["low", "medium", "high"];

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminReadinessChecks() {
  const [adminKey, setAdminKey] = useState("");
  const [toolFilter, setToolFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [checks, setChecks] = useState<ReadinessCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Enter admin key and load readiness checks.");

  useEffect(() => {
    try {
      setAdminKey(localStorage.getItem("moveready_admin_key") || "");
    } catch {
      // ignore storage failure
    }
  }, []);

  const counts = useMemo(() => {
    return checks.reduce<Record<string, number>>((acc, item) => {
      const key = item.risk_level || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [checks]);

  async function loadChecks() {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }

    setLoading(true);
    setMessage("Loading readiness checks...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const data = await apiJson<ApiList>("admin/readiness-checks", {
        query: { tool_slug: toolFilter || undefined, risk_level: riskFilter || undefined, limit: 75 },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setChecks(data.readiness_checks || []);
      setMessage(data.readiness_checks?.length ? "Readiness checks loaded." : "No readiness checks found for this filter.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401 ? "Admin key rejected." : "Unable to load readiness checks. Confirm migration 006 has been run.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <h2>Readiness checks</h2>
          <p className="section-intro">Inspect saved name, document, funds, and refusal-risk checks after readiness storage is enabled.</p>
        </div>
        <div className="badge-row admin-counts">
          {riskOptions.map((risk) => (
            <span className="badge" key={risk}>{risk}: {counts[risk] || 0}</span>
          ))}
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="field">
          <label htmlFor="readiness_admin_key">Admin key</label>
          <input id="readiness_admin_key" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" type="password" />
        </div>
        <div className="field">
          <label htmlFor="tool_filter">Tool</label>
          <select id="tool_filter" value={toolFilter} onChange={(event) => setToolFilter(event.target.value)}>
            <option value="">All tools</option>
            {toolOptions.map((tool) => <option key={tool} value={tool}>{tool}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="risk_filter">Risk</label>
          <select id="risk_filter" value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)}>
            <option value="">All risk levels</option>
            {riskOptions.map((risk) => <option key={risk} value={risk}>{risk}</option>)}
          </select>
        </div>
        <button className="btn primary" type="button" disabled={loading} onClick={loadChecks}>
          {loading ? "Loading..." : "Load checks"}
        </button>
      </div>
      <p className="form-status">{message}</p>

      <div className="request-list">
        {checks.map((item) => (
          <article className="request-card" key={item.id}>
            <div className="request-card-main">
              <div>
                <span className={`badge module-status ${item.risk_level === "high" ? "partner_approval_pending" : "available"}`}>{item.risk_level || "unknown"}</span>
                <h3>{item.tool_slug}</h3>
                <p>{String(item.result_payload?.summary || item.result_payload?.note || "No summary provided.")}</p>
              </div>
              <div className="request-meta">
                <span>{formatDate(item.created_at)}</span>
                <span>{item.readiness_status || "No status"}</span>
                <span>{item.source_page || "No source page"}</span>
              </div>
            </div>
            <div className="request-details">
              <span><strong>Status:</strong> {item.status || "completed"}</span>
              <span><strong>Risk:</strong> {item.risk_level || "unknown"}</span>
              <span><strong>Readiness:</strong> {item.readiness_status || "unknown"}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
