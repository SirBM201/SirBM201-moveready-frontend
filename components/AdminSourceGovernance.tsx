"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type SourceRow = {
  id: string;
  source_name?: string;
  source_url?: string;
  source_type?: string;
  owner_organization?: string | null;
  reliability_level?: string;
  status?: string;
  review_frequency_days?: number;
  last_checked_at?: string | null;
  last_checked_age_days?: number | null;
  next_review_due_at?: string | null;
  review_due?: boolean;
  notes?: string | null;
};

type RouteVersionRow = {
  id: string;
  route_id?: string;
  version_label?: string;
  status?: string;
  risk_level?: string;
  source_confidence?: string;
  verified_at?: string | null;
  verified_age_days?: number | null;
  review_due_at?: string | null;
  review_due?: boolean;
};

type GovernanceResponse = {
  ok: boolean;
  generated_at?: string;
  due_source_count?: number;
  due_route_count?: number;
  priority_sources?: SourceRow[];
  priority_route_versions?: RouteVersionRow[];
  sources?: SourceRow[];
  route_versions?: RouteVersionRow[];
  next_actions?: string[];
};

function readable(value?: string | null) {
  return String(value || "not set").replace(/_/g, " ");
}

function formatDate(value?: string | null) {
  if (!value) return "Not recorded";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminSourceGovernance() {
  const [adminKey, setAdminKey] = useState("");
  const [data, setData] = useState<GovernanceResponse | null>(null);
  const [message, setMessage] = useState("Enter the admin key to load the source review queue.");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    try {
      setAdminKey(localStorage.getItem("moveready_admin_key") || "");
    } catch {
      // Ignore storage failures.
    }
  }, []);

  function headers() {
    return { "X-MoveReady-Admin-Key": adminKey.trim() };
  }

  async function loadQueue() {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }
    setLoading(true);
    setMessage("Loading due sources and route versions...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const response = await apiJson<GovernanceResponse>("admin/source-governance/queue", {
        headers: headers(),
        query: { limit: 250 },
        timeoutMs: 30000,
        useAuthToken: false,
      });
      setData(response);
      setMessage(`Source queue loaded: ${response.due_source_count || 0} sources and ${response.due_route_count || 0} route versions need attention.`);
    } catch (error) {
      const apiError = error as ApiError;
      setData(null);
      setMessage(apiError?.status === 401 ? "Admin key rejected." : apiError?.data?.error || "Unable to load source governance queue.");
    } finally {
      setLoading(false);
    }
  }

  async function scanDue() {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }
    setLoading(true);
    setMessage("Scanning for sources due for review...");
    try {
      const response = await apiJson<{ due_source_count?: number; alerts_created?: number; existing_alerts_skipped?: number; errors?: unknown[] }>("admin/source-governance/scan-due", {
        method: "POST",
        body: {},
        headers: headers(),
        timeoutMs: 60000,
        useAuthToken: false,
      });
      setMessage(`Due scan completed: ${response.due_source_count || 0} due, ${response.alerts_created || 0} alerts created, ${response.existing_alerts_skipped || 0} existing alerts retained.`);
      await loadQueue();
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to scan due sources: ${apiError?.data?.error || apiError?.message || "source_scan_failed"}`);
    } finally {
      setLoading(false);
    }
  }

  async function markChecked(item: SourceRow) {
    const notes = window.prompt("Review note. Record what was checked and whether any route, fee, deadline, or process changed.", item.notes || "")?.trim();
    if (notes === undefined) return;
    const contentHash = window.prompt("Optional content hash or version marker. Leave blank if not available.", "")?.trim() || "";
    const status = window.prompt("Source status: active, watching, needs_review, or retired", item.status || "active")?.trim() || "active";
    const frequencyRaw = window.prompt("Review frequency in days", String(item.review_frequency_days || 30))?.trim() || String(item.review_frequency_days || 30);
    const reviewFrequency = Number(frequencyRaw);
    if (!Number.isFinite(reviewFrequency) || reviewFrequency < 1) {
      setMessage("Review frequency must be at least one day.");
      return;
    }

    setUpdatingId(item.id);
    setMessage(`Recording review for ${item.source_name || item.source_url}...`);
    try {
      await apiJson(`admin/source-governance/sources/${item.id}/mark-checked`, {
        method: "POST",
        headers: headers(),
        body: {
          status,
          review_frequency_days: reviewFrequency,
          notes,
          snapshot_title: `Manual review ${new Date().toISOString().slice(0, 10)}`,
          content_hash: contentHash || undefined,
          reviewed_by: "MoveReady admin console",
          snapshot_notes: notes,
        },
        timeoutMs: 30000,
        useAuthToken: false,
      });
      setMessage("Source review recorded. A content change still requires separate route and report review.");
      await loadQueue();
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to record source review: ${apiError?.data?.error || apiError?.message || "source_mark_checked_failed"}`);
    } finally {
      setUpdatingId("");
    }
  }

  const prioritySources = data?.priority_sources || [];
  const priorityRoutes = data?.priority_route_versions || [];

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <p className="overline">Official-source governance</p>
          <h2>Source and route review queue</h2>
          <p className="section-intro">Review overdue official sources, record snapshots, create due alerts, and keep route versions fail closed until their current rules are approved.</p>
        </div>
        <span className="status-dot">Source first</span>
      </div>

      <div className="admin-toolbar">
        <div className="field"><label htmlFor="source_admin_key">Admin key</label><input id="source_admin_key" type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" /></div>
        <button className="btn primary" type="button" disabled={loading} onClick={loadQueue}>{loading ? "Loading..." : "Load source queue"}</button>
        <button className="btn" type="button" disabled={loading} onClick={scanDue}>Create due alerts</button>
        <a className="btn" href="/source-health">Public source health</a>
      </div>
      <p className="form-status">{message}</p>

      {data ? (
        <div className="result-stack">
          <article className="result-block featured">
            <div className="panel-heading"><div><p className="overline">Priority workload</p><h3>{prioritySources.length} sources · {priorityRoutes.length} route versions</h3></div><span className="status-dot">Review required</span></div>
            <div className="mini-list">
              {(data.next_actions || []).map((item, index) => <div key={item}><strong>Action {index + 1}</strong><span>{item}</span></div>)}
            </div>
          </article>

          <article className="result-block">
            <p className="overline">Sources needing attention</p>
            <h3>Official pages, authorities, and providers</h3>
            <div className="mini-list">
              {prioritySources.map((item) => (
                <div key={item.id}>
                  <strong>{item.source_name || item.source_url || "Unnamed source"}</strong>
                  <span>{readable(item.source_type)} · reliability {readable(item.reliability_level)} · status {readable(item.status)} · last checked {formatDate(item.last_checked_at)} · next due {formatDate(item.next_review_due_at)}</span>
                  <div className="actions compact-actions">
                    {item.source_url ? <a className="btn" href={item.source_url} target="_blank" rel="noreferrer">Open official source</a> : null}
                    <button className="btn primary" type="button" disabled={updatingId === item.id} onClick={() => markChecked(item)}>{updatingId === item.id ? "Saving..." : "Record review"}</button>
                  </div>
                </div>
              ))}
              {!prioritySources.length ? <div><strong>No priority source shown</strong><span>No source is currently due, marked needs review, or missing an initial check.</span></div> : null}
            </div>
          </article>

          <article className="result-block">
            <p className="overline">Route versions needing attention</p>
            <h3>Review dates and source confidence</h3>
            <div className="mini-list">
              {priorityRoutes.map((item) => (
                <div key={item.id}>
                  <strong>{item.version_label || item.id}</strong>
                  <span>Status {readable(item.status)} · risk {readable(item.risk_level)} · confidence {readable(item.source_confidence)} · verified {formatDate(item.verified_at)} · review due {formatDate(item.review_due_at)}</span>
                </div>
              ))}
              {!priorityRoutes.length ? <div><strong>No priority route version shown</strong><span>No active route version is currently overdue or marked low confidence.</span></div> : null}
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}
