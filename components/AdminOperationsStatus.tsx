"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type SchemaCheck = {
  code: string;
  table: string;
  required_for: string;
  migration: string;
  critical: boolean;
  ok: boolean;
  status: string;
  sample_row_present?: boolean;
  error?: string | null;
};

type OperationsStatus = {
  ok: boolean;
  overall_status?: string;
  generated_at?: string;
  configuration?: Record<string, unknown>;
  schema_checks?: SchemaCheck[];
  launch_blockers?: string[];
  controlled_rollout_items?: string[];
  recommended_sequence?: string[];
};

function readable(value?: string) {
  return String(value || "unknown").replace(/_/g, " ");
}

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function configurationValue(value: unknown) {
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (Array.isArray(value)) return value.length ? value.map((item) => readable(String(item))).join(", ") : "none";
  if (value === null || value === undefined || value === "") return "not set";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "recorded";
    }
  }
  return readable(String(value));
}

function configurationClass(value: unknown) {
  if (value === true) return "available";
  if (value === false || value === null || value === undefined || value === "") return "partner_approval_pending";
  if (Array.isArray(value) && value.length) return "partner_approval_pending";
  return "available";
}

export default function AdminOperationsStatus() {
  const [adminKey, setAdminKey] = useState("");
  const [status, setStatus] = useState<OperationsStatus | null>(null);
  const [message, setMessage] = useState("Enter the admin key to run protected production diagnostics.");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setAdminKey(localStorage.getItem("moveready_admin_key") || "");
    } catch {
      // Ignore storage failure.
    }
  }, []);

  async function loadStatus() {
    const key = adminKey.trim();
    if (!key) {
      setMessage("Admin key is required.");
      return;
    }
    setLoading(true);
    setMessage("Checking account login, configuration, and required database schemas...");
    try {
      localStorage.setItem("moveready_admin_key", key);
      const data = await apiJson<OperationsStatus>("admin/operations/status", {
        headers: { "X-MoveReady-Admin-Key": key },
        timeoutMs: 30000,
        useAuthToken: false,
      });
      setStatus(data);
      setMessage(`Operations diagnostics completed: ${readable(data.overall_status)}.`);
    } catch (error) {
      const apiError = error as ApiError;
      setStatus(null);
      setMessage(apiError?.status === 401 ? "Admin key rejected." : apiError?.data?.error || "Unable to load operations diagnostics.");
    } finally {
      setLoading(false);
    }
  }

  const configuration = Object.entries(status?.configuration || {});
  const checks = status?.schema_checks || [];

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <p className="overline">Production observability</p>
          <h2>Operations and migration status</h2>
          <p className="section-intro">Check account-login delivery, core tables, provider publication, quote storage, payment audit, handoffs, support cases, and controlled external integrations without exposing credentials.</p>
        </div>
        <span className="status-dot">{readable(status?.overall_status)}</span>
      </div>

      <div className="admin-toolbar">
        <div className="field">
          <label htmlFor="operations_admin_key">Admin key</label>
          <input id="operations_admin_key" type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" />
        </div>
        <button className="btn primary" type="button" disabled={loading} onClick={loadStatus}>{loading ? "Checking..." : "Run operations check"}</button>
        <a className="btn" href="/launch-readiness">Open launch readiness</a>
      </div>
      <p className="form-status">{message}</p>

      {status ? (
        <div className="result-stack">
          <article className="result-block featured">
            <div className="panel-heading">
              <div><p className="overline">Overall</p><h3>{readable(status.overall_status)}</h3></div>
              <span className="status-dot">{formatDate(status.generated_at)}</span>
            </div>
            <div className="badge-row">
              {configuration.map(([key, value]) => (
                <span className={`badge module-status ${configurationClass(value)}`} key={key}>{readable(key)}: {configurationValue(value)}</span>
              ))}
            </div>
            <p className="form-status">Configuration output contains readiness flags and provider names only. Secrets and credential values are intentionally excluded.</p>
          </article>

          <article className="result-block">
            <p className="overline">Database schema</p>
            <h3>Required tables and columns</h3>
            <div className="mini-list">
              {checks.map((check) => (
                <div key={check.code}>
                  <strong>{check.ok ? "Ready" : check.critical ? "Blocked" : "Controlled"}: {readable(check.code)}</strong>
                  <span>{check.required_for} · {check.table} · {check.ok ? "schema available" : `run ${check.migration}`}{check.error ? ` · ${check.error}` : ""}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="result-block">
            <p className="overline">Launch blockers</p>
            <h3>{status.launch_blockers?.length ? "Resolve before public launch" : "No critical blocker detected"}</h3>
            <div className="mini-list">
              {(status.launch_blockers || []).map((item, index) => <div key={`${item}-${index}`}><strong>Blocker {index + 1}</strong><span>{item}</span></div>)}
              {!status.launch_blockers?.length ? <div><strong>Core check</strong><span>Critical configuration and schema checks passed at the time shown above.</span></div> : null}
            </div>
          </article>

          <article className="result-block">
            <p className="overline">Controlled rollout</p>
            <h3>Features that must remain limited</h3>
            <div className="mini-list">
              {(status.controlled_rollout_items || []).map((item, index) => <div key={`${item}-${index}`}><strong>Control {index + 1}</strong><span>{item}</span></div>)}
              {!status.controlled_rollout_items?.length ? <div><strong>None</strong><span>No controlled-rollout condition was reported at the time shown above.</span></div> : null}
            </div>
          </article>

          <article className="result-block soft">
            <p className="overline">Recommended sequence</p>
            <div className="mini-list">
              {(status.recommended_sequence || []).map((item, index) => <div key={`${item}-${index}`}><strong>{index + 1}</strong><span>{item}</span></div>)}
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}
