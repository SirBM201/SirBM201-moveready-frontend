"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type ApplicationAlert = {
  id: string;
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

function severityTone(severity?: string) {
  return severity === "critical" || severity === "high" ? "partner_approval_pending" : "available";
}

export default function ApplicationAlertInbox() {
  const [alerts, setAlerts] = useState<ApplicationAlert[]>([]);
  const [accountEmail, setAccountEmail] = useState("");
  const [includeDismissed, setIncludeDismissed] = useState(false);
  const [message, setMessage] = useState("Sign in to load private application alerts.");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  async function load(silent = false) {
    if (!silent) {
      setLoading(true);
      setMessage("Loading application deadline and case alerts...");
    }
    try {
      const data = await apiJson<{ account_email?: string; application_alerts?: ApplicationAlert[] }>("applications/alerts", {
        query: includeDismissed ? { include_dismissed: true } : undefined,
        timeoutMs: 20000,
      });
      setAlerts(data.application_alerts || []);
      setAccountEmail(data.account_email || "");
      setMessage("Private application alerts loaded.");
    } catch (error) {
      const apiError = error as ApiError;
      setAlerts([]);
      setAccountEmail("");
      setMessage(apiError?.status === 401 ? "Sign in with email to review private application alerts." : apiError?.data?.hint || apiError?.message || "Unable to load application alerts. Migration 029 may be pending.");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    void load(true);
  }, [includeDismissed]);

  async function updateAlert(item: ApplicationAlert, status: "open" | "dismissed") {
    setUpdatingId(item.id);
    setMessage(`${status === "dismissed" ? "Dismissing" : "Reopening"} alert...`);
    try {
      const response = await apiJson<{ application_alert: ApplicationAlert }>(`applications/alerts/${item.id}`, {
        method: "PATCH",
        body: { status },
        timeoutMs: 15000,
      });
      if (!includeDismissed && status === "dismissed") {
        setAlerts((rows) => rows.filter((row) => row.id !== item.id));
      } else {
        setAlerts((rows) => rows.map((row) => (row.id === item.id ? response.application_alert : row)));
      }
      setMessage(status === "dismissed" ? "Alert dismissed. A later higher-severity detection may reopen it." : "Alert reopened.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to update alert: ${apiError?.data?.error || apiError?.message || "application_alert_update_failed"}`);
    } finally {
      setUpdatingId("");
    }
  }

  const criticalCount = alerts.filter((item) => item.status === "open" && item.severity === "critical").length;
  const highCount = alerts.filter((item) => item.status === "open" && item.severity === "high").length;

  return (
    <section className="result-block featured">
      <div className="panel-heading">
        <div><p className="overline">Private application alerts</p><h2>{alerts.length} alert{alerts.length === 1 ? "" : "s"}</h2></div>
        <span className="status-dot">{accountEmail ? "Verified" : "Sign in"}</span>
      </div>
      <p>
        Daily in-app alerts cover overdue or approaching deadlines, near appointments, additional-document requests, stale sources, payment issues, refusals, and approval follow-up. External email, WhatsApp, and Telegram delivery are not activated by this inbox.
      </p>
      <div className="badge-row">
        <span className="badge">Critical open: {criticalCount}</span>
        <span className="badge">High open: {highCount}</span>
        <span className="badge">Account: {accountEmail || "not signed in"}</span>
      </div>
      <div className="actions">
        <button className="btn primary" type="button" disabled={loading} onClick={() => load(false)}>{loading ? "Loading..." : "Refresh alerts"}</button>
        <label className="checkbox-field"><input type="checkbox" checked={includeDismissed} onChange={(event) => setIncludeDismissed(event.target.checked)} /><span>Include dismissed alerts</span></label>
        <a className="btn" href="/applications">Open Application Center</a>
        <a className="btn" href="/timeline">Open timeline</a>
        <a className="btn" href="/login?next=/application-alerts">Sign in</a>
      </div>
      <p className="form-status">{message}</p>

      <div className="result-stack" style={{ marginTop: 16 }}>
        {alerts.map((item) => (
          <article className="result-block" key={item.id}>
            <div className="panel-heading">
              <div><p className="overline">{readable(item.alert_type)}</p><h3>{item.title}</h3></div>
              <span className={`badge module-status ${severityTone(item.severity)}`}>{readable(item.severity)} · {readable(item.status)}</span>
            </div>
            <p>{item.summary}</p>
            <div className="mini-list">
              <div><strong>Application case</strong><span>{item.metadata?.case_ref || item.application_case_id || "Not recorded"}</span></div>
              <div><strong>Due</strong><span>{formatDateTime(item.due_at)}</span></div>
              <div><strong>Last detected</strong><span>{formatDateTime(item.last_detected_at || item.updated_at)}</span></div>
              {item.metadata?.hours_until_deadline !== undefined ? <div><strong>Deadline distance</strong><span>{item.metadata.hours_until_deadline} hours</span></div> : null}
              {item.metadata?.hours_until_appointment !== undefined ? <div><strong>Appointment distance</strong><span>{item.metadata.hours_until_appointment} hours</span></div> : null}
              {item.metadata?.source_status ? <div><strong>Source status</strong><span>{readable(item.metadata.source_status)}</span></div> : null}
              {item.metadata?.payment_status ? <div><strong>Payment status</strong><span>{readable(item.metadata.payment_status)}</span></div> : null}
            </div>
            <div className="actions compact-actions">
              <a className="btn primary" href="/applications">Review application case</a>
              {item.status === "dismissed" ? <button className="btn" type="button" disabled={updatingId === item.id} onClick={() => updateAlert(item, "open")}>Reopen alert</button> : <button className="btn" type="button" disabled={updatingId === item.id} onClick={() => updateAlert(item, "dismissed")}>Dismiss alert</button>}
            </div>
          </article>
        ))}
        {!alerts.length ? <article className="result-block soft"><h3>No application alert loaded</h3><p>The inbox will remain empty until a verified account has application cases and the daily scan has run after migration 029.</p></article> : null}
      </div>
    </section>
  );
}
