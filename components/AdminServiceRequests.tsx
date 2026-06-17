"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type ServiceRequest = {
  id: string;
  service_slug: string;
  service_title?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  preferred_channel?: string | null;
  current_country?: string | null;
  target_country?: string | null;
  route_or_goal?: string | null;
  message?: string | null;
  consent_to_contact?: boolean;
  status: string;
  created_at?: string;
};

type ApiList = {
  ok: boolean;
  service_requests: ServiceRequest[];
};

const statusOptions = ["new", "reviewing", "contacted", "closed", "spam"];

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminServiceRequests() {
  const [adminKey, setAdminKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Enter admin key and load service requests.");

  useEffect(() => {
    try {
      setAdminKey(localStorage.getItem("moveready_admin_key") || "");
    } catch {
      // ignore storage failure
    }
  }, []);

  const counts = useMemo(() => {
    return requests.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  }, [requests]);

  async function loadRequests(nextStatus = statusFilter) {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }

    setLoading(true);
    setMessage("Loading service requests...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const data = await apiJson<ApiList>("admin/service-requests", {
        query: { status: nextStatus || undefined, limit: 75 },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setRequests(data.service_requests || []);
      setMessage(data.service_requests?.length ? "Service requests loaded." : "No service requests found for this filter.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401 ? "Admin key rejected." : "Unable to load service requests.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }

    setMessage("Updating request status...");
    try {
      const data = await apiJson<{ service_request: ServiceRequest }>(`admin/service-requests/${id}`, {
        method: "PATCH",
        body: { status },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setRequests((items) => items.map((item) => (item.id === id ? data.service_request : item)));
      setMessage("Request status updated.");
    } catch {
      setMessage("Unable to update request status.");
    }
  }

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <h2>Service requests</h2>
          <p className="section-intro">Review launch requests from platform service pages and move each request through the contact workflow.</p>
        </div>
        <div className="badge-row admin-counts">
          {statusOptions.map((status) => (
            <span className="badge" key={status}>{status}: {counts[status] || 0}</span>
          ))}
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="field">
          <label htmlFor="admin_key">Admin key</label>
          <input id="admin_key" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" type="password" />
        </div>
        <div className="field">
          <label htmlFor="status_filter">Status</label>
          <select id="status_filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <button className="btn primary" type="button" disabled={loading} onClick={() => loadRequests()}>
          {loading ? "Loading..." : "Load requests"}
        </button>
      </div>
      <p className="form-status">{message}</p>

      <div className="request-list">
        {requests.map((item) => (
          <article className="request-card" key={item.id}>
            <div className="request-card-main">
              <div>
                <span className={`badge module-status ${item.status === "new" ? "available" : "coming_soon"}`}>{item.status}</span>
                <h3>{item.service_title || item.service_slug}</h3>
                <p>{item.message || "No message provided."}</p>
              </div>
              <div className="request-meta">
                <span>{formatDate(item.created_at)}</span>
                <span>{item.preferred_channel || "email"}</span>
                {item.consent_to_contact ? <span>Consent confirmed</span> : null}
              </div>
            </div>

            <div className="request-details">
              <span><strong>Name:</strong> {item.full_name || "Not provided"}</span>
              <span><strong>Email:</strong> {item.email || "Not provided"}</span>
              <span><strong>Phone:</strong> {item.phone || "Not provided"}</span>
              <span><strong>Current:</strong> {item.current_country || "Not provided"}</span>
              <span><strong>Target:</strong> {item.target_country || "Not provided"}</span>
              <span><strong>Goal:</strong> {item.route_or_goal || "Not provided"}</span>
            </div>

            <div className="badge-row">
              {statusOptions.map((status) => (
                <button className="status-button" key={status} type="button" disabled={item.status === status} onClick={() => updateStatus(item.id, status)}>
                  {status}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
