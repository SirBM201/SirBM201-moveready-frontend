"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type ApplicationAlert = {
  id: string;
  email?: string;
  application_case_id?: string;
  alert_type?: string;
  severity?: string;
  status?: string;
  title?: string;
  summary?: string;
  due_at?: string | null;
  first_detected_at?: string;
  last_detected_at?: string;
  resolved_at?: string | null;
  updated_at?: string;
  metadata?: {
    case_ref?: string;
    hours_until_deadline?: number;
    hours_until_appointment?: number;
    source_status?: string;
    payment_status?: string;
  };
};

const statuses = ["open", "dismissed", "resolved", "expired"];

function readable(value?: string | null) {
  return String(value || "not set").replace(/_/g, " ");
}

function formatDateTime(value?: string | null) {
  if (!value) return "Not recorded";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminApplicationAlerts() {
  const [adminKey, setAdminKey] = useState("");
  const [alerts, setAlerts] = useState<ApplicationAlert[]>([]);
  const [message, setMessage] = useState("Enter the admin key to load application alerts.");
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

  async function load() {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }
    setLoading(true);
    setMessage("Loading private application alerts...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const data = await apiJson<{ application_alerts?: ApplicationAlert[] }>("admin/application-case-alerts", {
        headers: headers(),
        query: { limit: 500 },
        timeoutMs: 30000,
        useAuthToken: false,
      });
      setAlerts(data.application_alerts || []);
      setMessage("Application alerts loaded.");
    } catch (error) {
      const apiError = error as ApiError;
      setAlerts([]);
      setMessage(apiError?.status === 401 ? "Admin key rejected." : apiError?.data?.hint || apiError?.data?.error || "Unable to load application alerts. Migration 029 may be pending.");
    } finally {
      setLoading(false);
    }
  }

  async function runScan() {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }
    setLoading(true);
    setMessage("Scanning active application cases for private alerts...");
    try {
      const result = await apiJson<{ status?: string; case_count?: number; alerts_created?: number; alerts_updated?: number; alerts_resolved?: number; errors?: unknown[] }>("admin/application-cases/alerts/scan", {
        method: "POST",
        headers: headers(),
        body: {},
        timeoutMs: 180000,
        useAuthToken: false,
      });
      setMessage(`Scan ${readable(result.status)}. Cases: ${result.case_count || 0}; created: ${result.alerts_created || 0}; updated: ${result.alerts_updated || 0}; resolved: ${result.alerts_resolved || 0}; errors: ${(result.errors || []).length}.`);
      await load();
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to scan application cases: ${apiError?.data?.error || apiError?.message || "application_case_alert_scan_failed"}`);
    } finally {
      setLoading(false);
    }
  }

  async function updateAlert(item: ApplicationAlert, status: string) {
    setUpdatingId(item.id);
    setMessage(`Updating alert to ${status}...`);
    try {
      const response = await apiJson<{ application_alert: ApplicationAlert }>(`admin/application-case-alerts/${item.id}`, {
        method: "PATCH",
        headers: headers(),
        body: { status },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setAlerts((rows) => rows.map((row) => (row.id === item.id ? response.application_alert : row)));
      setMessage("Application alert status updated.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to update alert: ${apiError?.data?.error || apiError?.message || "admin_application_alert_update_failed"}`);
    } finally {
      setUpdatingId("");
    }
  }

  const openAlerts = alerts.filter((item) => item.status === "open");
  const critical = openAlerts.filter((item) => item.severity === "critical");
  const high = openAlerts.filter((item) => item.severity === "high");

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <p className="overline">Application alert operations</p>
          <h2>Private case alerts and daily scan</h2>
          <p className="section-intro">Review generated in-app alerts, run the protected case scan, and resolve or reopen alerts without activating external delivery.</p>
        </div>
        <span className="status-dot">Admin protected</span>
      </div>

      <div className="admin-toolbar">
        <div className="field"><label htmlFor="application_alert_admin_key">Admin key</label><input id="application_alert_admin_key" type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" /></div>
        <button className="btn primary" type="button" disabled={loading} onClick={load}>{loading ? "Working..." : "Load alerts"}</button>
        <button className="btn" type="button" disabled={loading} onClick={runScan}>Run protected scan</button>
        <a className="btn" href="/admin#application-cases">Application cases</a>
        <a className="btn" href="/application-alerts">User alert inbox</a>
      </div>
      <p className="form-status">{message}</p>

      <article className="result-block featured">
        <div className="panel-heading"><div><p className="overline">Open workload</p><h3>{openAlerts.length} open · {critical.length} critical · {high.length} high</h3></div><span className="status-dot">Daily 07:07 UTC</span></div>
        <p>The scheduled workflow refreshes in-app alerts for deadlines, appointments, additional-document requests, sources, payments, refusals, and decisions. It does not send email, WhatsApp, Telegram, or SMS.</p>
      </article>

      <div className="result-stack" style={{ marginTop: 16 }}>
        {alerts.map((item) => (
          <article className="result-block" key={item.id}>
            <div className="panel-heading"><div><p className="overline">{readable(item.alert_type)}</p><h3>{item.title}</h3></div><span className="status-dot">{readable(item.severity)} · {readable(item.status)}</span></div>
            <p>{item.summary}</p>
            <div className="mini-list">
              <div><strong>Account</strong><span>{item.email || "Not recorded"}</span></div>
              <div><strong>Case</strong><span>{item.metadata?.case_ref || item.application_case_id || "Not recorded"}</span></div>
              <div><strong>Due</strong><span>{formatDateTime(item.due_at)}</span></div>
              <div><strong>Last detected</strong><span>{formatDateTime(item.last_detected_at || item.updated_at)}</span></div>
            </div>
            <div className="actions compact-actions">
              {statuses.map((status) => <button className="status-button" key={status} type="button" disabled={updatingId === item.id || item.status === status} onClick={() => updateAlert(item, status)}>{status}</button>)}
            </div>
          </article>
        ))}
        {!alerts.length ? <article className="result-block soft"><h3>No application alert loaded</h3><p>Apply migration 029, create application cases, and run the protected scan.</p></article> : null}
      </div>
    </section>
  );
}
