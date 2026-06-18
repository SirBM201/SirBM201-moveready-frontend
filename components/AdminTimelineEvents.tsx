"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type TimelineEvent = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  current_country?: string | null;
  target_country?: string | null;
  route_or_goal?: string | null;
  route_category?: string | null;
  event_type: string;
  event_title: string;
  event_notes?: string | null;
  due_date?: string | null;
  reminder_date?: string | null;
  priority: string;
  status: string;
  preferred_channel: string;
  consent_to_contact?: boolean;
  source_page?: string | null;
  created_at?: string;
};

type ApiList = {
  ok: boolean;
  timeline_events: TimelineEvent[];
};

const statusOptions = ["pending", "in_progress", "done", "missed", "cancelled", "archived"];
const typeOptions = ["task", "deadline", "appointment", "document", "payment", "travel", "result", "follow_up"];
const priorityOptions = ["low", "medium", "high", "critical"];

function formatDate(value?: string | null, withTime = false) {
  if (!value) return "Not set";
  try {
    const date = value.includes("T") ? new Date(value) : new Date(`${value}T00:00:00`);
    return new Intl.DateTimeFormat(undefined, withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(date);
  } catch {
    return value;
  }
}

export default function AdminTimelineEvents() {
  const [adminKey, setAdminKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [targetCountryFilter, setTargetCountryFilter] = useState("");
  const [items, setItems] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Enter admin key and load timeline events.");

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
    setMessage("Loading timeline events...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const data = await apiJson<ApiList>("admin/timeline-events", {
        query: {
          status: statusFilter || undefined,
          event_type: typeFilter || undefined,
          target_country: targetCountryFilter || undefined,
          limit: 75,
        },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems(data.timeline_events || []);
      setMessage(data.timeline_events?.length ? "Timeline events loaded." : "No timeline events found for this filter.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401 ? "Admin key rejected." : "Unable to load timeline events. Confirm SQL 010 has been run and backend has redeployed.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }

    setMessage("Updating timeline status...");
    try {
      const data = await apiJson<{ timeline_event: TimelineEvent }>(`admin/timeline-events/${id}`, {
        method: "PATCH",
        body: { status },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems((rows) => rows.map((item) => (item.id === id ? data.timeline_event : item)));
      setMessage("Timeline status updated.");
    } catch {
      setMessage("Unable to update timeline status.");
    }
  }

  async function updatePriority(id: string, priority: string) {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }

    setMessage("Updating timeline priority...");
    try {
      const data = await apiJson<{ timeline_event: TimelineEvent }>(`admin/timeline-events/${id}`, {
        method: "PATCH",
        body: { priority },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems((rows) => rows.map((item) => (item.id === id ? data.timeline_event : item)));
      setMessage("Timeline priority updated.");
    } catch {
      setMessage("Unable to update timeline priority.");
    }
  }

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <h2>Timeline events</h2>
          <p className="section-intro">Review application tasks, document deadlines, appointments, payments, result checks, travel dates, and follow-up steps.</p>
        </div>
        <div className="badge-row admin-counts">
          {statusOptions.map((status) => <span className="badge" key={status}>{status}: {counts[status] || 0}</span>)}
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="field">
          <label htmlFor="timeline_admin_key">Admin key</label>
          <input id="timeline_admin_key" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" type="password" />
        </div>
        <div className="field">
          <label htmlFor="timeline_status">Status</label>
          <select id="timeline_status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="timeline_type">Type</label>
          <select id="timeline_type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="">All event types</option>
            {typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="timeline_target">Target country</label>
          <input id="timeline_target" value={targetCountryFilter} onChange={(event) => setTargetCountryFilter(event.target.value)} placeholder="Example: Estonia" />
        </div>
        <button className="btn primary" type="button" disabled={loading} onClick={loadItems}>{loading ? "Loading..." : "Load timeline"}</button>
      </div>
      <p className="form-status">{message}</p>

      <div className="request-list">
        {items.map((item) => (
          <article className="request-card" key={item.id}>
            <div className="request-card-main">
              <div>
                <span className={`badge module-status ${item.status === "done" ? "available" : "coming_soon"}`}>{item.status}</span>
                <h3>{item.event_title}</h3>
                <p>{item.event_notes || "No notes provided."}</p>
              </div>
              <div className="request-meta">
                <span>Created: {formatDate(item.created_at, true)}</span>
                <span>Due: {formatDate(item.due_date)}</span>
                <span>Reminder: {formatDate(item.reminder_date)}</span>
                <span>{item.preferred_channel}</span>
              </div>
            </div>

            <div className="request-details">
              <span><strong>Type:</strong> {item.event_type}</span>
              <span><strong>Priority:</strong> {item.priority}</span>
              <span><strong>Country:</strong> {item.target_country || "Not provided"}</span>
              <span><strong>Route:</strong> {item.route_or_goal || item.route_category || "Not provided"}</span>
              <span><strong>Name:</strong> {item.full_name || "Not provided"}</span>
              <span><strong>Email:</strong> {item.email || "Not provided"}</span>
              <span><strong>Phone:</strong> {item.phone || "Not provided"}</span>
              <span><strong>Source:</strong> {item.source_page || "Not recorded"}</span>
              <span><strong>Consent:</strong> {item.consent_to_contact ? "yes" : "no"}</span>
            </div>

            <div className="badge-row">
              {statusOptions.map((status) => (
                <button className="status-button" key={status} type="button" disabled={item.status === status} onClick={() => updateStatus(item.id, status)}>{status}</button>
              ))}
            </div>
            <div className="badge-row">
              {priorityOptions.map((priority) => (
                <button className="status-button" key={priority} type="button" disabled={item.priority === priority} onClick={() => updatePriority(item.id, priority)}>priority: {priority}</button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
