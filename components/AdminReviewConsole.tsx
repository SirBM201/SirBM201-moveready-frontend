"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type QueueItem = {
  kind: string;
  id?: string;
  title?: string;
  status?: string;
  priority?: string;
  risk_level?: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  target_country?: string | null;
  route_category?: string | null;
  created_at?: string;
  age_hours?: number | null;
  score?: number;
  summary?: string | null;
};

type QueueSection = {
  kind: string;
  label: string;
  ok: boolean;
  error?: string | null;
  count: number;
  items: QueueItem[];
};

type ReviewQueueResponse = {
  ok: boolean;
  generated_at?: string;
  total_open_items?: number;
  counts?: Record<string, number>;
  sections?: QueueSection[];
  queue_items?: QueueItem[];
  errors?: Record<string, string>;
  next_actions?: string[];
};

type ActionConfig = {
  endpoint: (id: string) => string;
  options: string[];
};

const ADMIN_KEY_STORAGE = "moveready_admin_key";

const ACTIONS: Record<string, ActionConfig> = {
  review_task: { endpoint: (id) => `admin/review-tasks/${id}`, options: ["in_progress", "approved", "rejected", "dismissed"] },
  service_request: { endpoint: (id) => `admin/service-requests/${id}`, options: ["reviewing", "contacted", "closed", "spam"] },
  generated_report: { endpoint: (id) => `admin/generated-reports/${id}`, options: ["paid", "delivered", "stale", "archived"] },
  partner_application: { endpoint: (id) => `admin/partner-applications/${id}`, options: ["screening", "approved", "rejected", "suspended", "spam"] },
  user_profile: { endpoint: (id) => `admin/user-profiles/${id}`, options: ["reviewing", "contacted", "active", "closed", "spam"] },
  saved_route: { endpoint: (id) => `admin/saved-routes/${id}`, options: ["archived", "closed", "spam"] },
  watchlist: { endpoint: (id) => `admin/watchlist-subscriptions/${id}`, options: ["paused", "closed", "unsubscribed", "spam"] },
  timeline_event: { endpoint: (id) => `admin/timeline-events/${id}`, options: ["in_progress", "done", "cancelled", "archived"] },
};

function adminHeaders(adminKey: string) {
  return { "X-MoveReady-Admin-Key": adminKey.trim() };
}

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatKind(kind: string) {
  return kind.replace(/_/g, " ");
}

function compactContact(item: QueueItem) {
  return item.email || item.phone || item.full_name || "No contact shown";
}

export default function AdminReviewConsole() {
  const [adminKey, setAdminKey] = useState("");
  const [queue, setQueue] = useState<ReviewQueueResponse | null>(null);
  const [message, setMessage] = useState("Enter the admin key to load the protected review queue.");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [activeSection, setActiveSection] = useState("all");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ADMIN_KEY_STORAGE) || "";
      if (stored) {
        setAdminKey(stored);
        void loadQueue(stored, true);
      }
    } catch {
      // ignore storage failures
    }
  }, []);

  async function loadQueue(keyOverride?: string, silent = false) {
    const key = (keyOverride || adminKey).trim();
    if (!key) {
      setMessage("Admin key is required.");
      return;
    }

    if (!silent) {
      setLoading(true);
      setMessage("Loading admin review queue...");
    }

    try {
      const data = await apiJson<ReviewQueueResponse>("admin/review-queue", {
        headers: adminHeaders(key),
        query: { limit: 25 },
        timeoutMs: 20000,
        useAuthToken: false,
      });
      setQueue(data);
      setMessage(`Review queue loaded. Open items: ${data.total_open_items || 0}.`);
      try {
        localStorage.setItem(ADMIN_KEY_STORAGE, key);
      } catch {
        // ignore storage failures
      }
    } catch (error) {
      const apiError = error as ApiError;
      setQueue(null);
      setMessage(apiError?.status === 401 ? "Admin key rejected by backend." : apiError?.data?.error || "Unable to load admin queue.");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  async function updateStatus(item: QueueItem, status: string) {
    const key = adminKey.trim();
    if (!key || !item.id) {
      setMessage("Admin key and record id are required.");
      return;
    }
    const action = ACTIONS[item.kind];
    if (!action) {
      setMessage(`No status action configured for ${item.kind}.`);
      return;
    }

    setUpdatingId(item.id);
    setMessage(`Updating ${formatKind(item.kind)} to ${status}...`);
    try {
      await apiJson(action.endpoint(item.id), {
        method: "PATCH",
        headers: adminHeaders(key),
        body: { status },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setMessage("Status updated. Reloading queue...");
      await loadQueue(key, true);
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.data?.error ? `Update failed: ${apiError.data.error}` : "Update failed.");
    } finally {
      setUpdatingId("");
    }
  }

  function clearKey() {
    setAdminKey("");
    setQueue(null);
    setMessage("Admin key cleared from this browser.");
    try {
      localStorage.removeItem(ADMIN_KEY_STORAGE);
    } catch {
      // ignore storage failures
    }
  }

  const sections = queue?.sections || [];
  const visibleItems = useMemo(() => {
    if (!queue) return [];
    if (activeSection === "all") return queue.queue_items || [];
    return sections.find((section) => section.kind === activeSection)?.items || [];
  }, [activeSection, queue, sections]);

  return (
    <div className="live-workspace reports-workspace">
      <section className="workflow-panel live-form">
        <div className="panel-heading">
          <div>
            <p className="overline">Admin console</p>
            <h2>Review queue</h2>
          </div>
          <span className="status-dot">Protected</span>
        </div>
        <p>
          This console reads protected admin endpoints. Keep service requests, reports, profiles, alerts, and provider applications under review before any handoff or delivery action.
        </p>
        <div className="field">
          <label htmlFor="admin_queue_key">Admin key</label>
          <input id="admin_queue_key" type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="Paste X-MoveReady-Admin-Key" />
        </div>
        <div className="actions">
          <button className="btn primary" type="button" onClick={() => loadQueue()} disabled={loading}>{loading ? "Loading..." : "Load queue"}</button>
          <button className="btn" type="button" onClick={clearKey}>Clear key</button>
        </div>
        <p className="form-status">{message}</p>

        {queue ? (
          <div className="mini-list">
            <div><strong>Total open</strong><span>{queue.total_open_items || 0}</span></div>
            <div><strong>Generated</strong><span>{formatDate(queue.generated_at)}</span></div>
            <div><strong>Errors</strong><span>{Object.keys(queue.errors || {}).length ? Object.keys(queue.errors || {}).join(", ") : "None"}</span></div>
          </div>
        ) : null}
      </section>

      <section className="result-panel">
        {queue ? (
          <>
            <article className="result-block featured">
              <div className="panel-heading">
                <div>
                  <p className="overline">Queue filters</p>
                  <h2>Open review workload</h2>
                </div>
                <span className="status-dot">{visibleItems.length}</span>
              </div>
              <div className="actions wrap-actions">
                <button className={activeSection === "all" ? "btn primary" : "btn"} type="button" onClick={() => setActiveSection("all")}>All</button>
                {sections.map((section) => (
                  <button className={activeSection === section.kind ? "btn primary" : "btn"} type="button" onClick={() => setActiveSection(section.kind)} key={section.kind}>
                    {section.label} ({section.count})
                  </button>
                ))}
              </div>
              {queue.next_actions?.length ? (
                <div className="mini-list">
                  {queue.next_actions.map((action, index) => <div key={action}><strong>{index + 1}</strong><span>{action}</span></div>)}
                </div>
              ) : null}
            </article>

            {visibleItems.length ? (
              <div className="result-stack compact-stack">
                {visibleItems.map((item) => {
                  const action = ACTIONS[item.kind];
                  return (
                    <article className="result-block" key={`${item.kind}-${item.id || item.title}`}>
                      <div className="panel-heading">
                        <div>
                          <p className="overline">{formatKind(item.kind)}</p>
                          <h2>{item.title || formatKind(item.kind)}</h2>
                        </div>
                        <span className="status-dot">{item.status || "unknown"}</span>
                      </div>
                      <div className="badge-row">
                        <span className="badge">Score: {item.score || 0}</span>
                        {item.priority ? <span className="badge">Priority: {item.priority}</span> : null}
                        {item.risk_level ? <span className="badge">Risk: {item.risk_level}</span> : null}
                        {item.target_country ? <span className="badge">Target: {item.target_country}</span> : null}
                        {item.route_category ? <span className="badge">Route: {item.route_category}</span> : null}
                        <span className="badge">{formatDate(item.created_at)}</span>
                      </div>
                      <div className="mini-list">
                        <div><strong>Contact</strong><span>{compactContact(item)}</span></div>
                        <div><strong>Age</strong><span>{item.age_hours ?? "?"} hours</span></div>
                        <div><strong>Summary</strong><span>{item.summary || "No summary recorded."}</span></div>
                      </div>
                      {action ? (
                        <div className="actions wrap-actions">
                          {action.options.map((status) => (
                            <button className="btn" type="button" onClick={() => updateStatus(item, status)} disabled={updatingId === item.id} key={status}>
                              {updatingId === item.id ? "Updating..." : status}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            ) : (
              <article className="result-block">
                <p className="overline">Queue clear</p>
                <h2>No records in this filter.</h2>
                <p>Use another filter or refresh the protected queue.</p>
              </article>
            )}
          </>
        ) : (
          <article className="result-block featured">
            <p className="overline">Protected output</p>
            <h2>Admin records will appear after key verification.</h2>
            <p>Use the same backend admin key configured in Railway for protected admin endpoints.</p>
          </article>
        )}
      </section>
    </div>
  );
}
