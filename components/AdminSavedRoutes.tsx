"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type SavedRoute = {
  id: string;
  save_type: string;
  saved_title: string;
  route_code?: string | null;
  country_code?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  current_country?: string | null;
  target_country?: string | null;
  main_goal?: string | null;
  route_category?: string | null;
  notes?: string | null;
  notify_on_changes?: boolean;
  consent_to_contact?: boolean;
  status: string;
  source_page?: string | null;
  created_at?: string;
};

type ApiList = {
  ok: boolean;
  saved_routes: SavedRoute[];
};

const statusOptions = ["active", "archived", "closed", "spam"];
const typeOptions = ["route", "opportunity", "scholarship", "country", "service"];

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminSavedRoutes() {
  const [adminKey, setAdminKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [targetCountryFilter, setTargetCountryFilter] = useState("");
  const [items, setItems] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Enter admin key and load saved routes.");

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
    setMessage("Loading saved routes...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const data = await apiJson<ApiList>("admin/saved-routes", {
        query: {
          status: statusFilter || undefined,
          save_type: typeFilter || undefined,
          target_country: targetCountryFilter || undefined,
          limit: 75,
        },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems(data.saved_routes || []);
      setMessage(data.saved_routes?.length ? "Saved routes loaded." : "No saved routes found for this filter.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401 ? "Admin key rejected." : "Unable to load saved routes. Confirm SQL 009 has been run.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }

    setMessage("Updating saved route status...");
    try {
      const data = await apiJson<{ saved_route: SavedRoute }>(`admin/saved-routes/${id}`, {
        method: "PATCH",
        body: { status },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems((rows) => rows.map((item) => (item.id === id ? data.saved_route : item)));
      setMessage("Saved route status updated.");
    } catch {
      setMessage("Unable to update saved route status.");
    }
  }

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <h2>Saved routes</h2>
          <p className="section-intro">Review routes, countries, scholarships, official opportunities, and services users saved for later follow-up.</p>
        </div>
        <div className="badge-row admin-counts">
          {statusOptions.map((status) => <span className="badge" key={status}>{status}: {counts[status] || 0}</span>)}
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="field">
          <label htmlFor="saved_routes_admin_key">Admin key</label>
          <input id="saved_routes_admin_key" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" type="password" />
        </div>
        <div className="field">
          <label htmlFor="saved_routes_status">Status</label>
          <select id="saved_routes_status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="saved_routes_type">Type</label>
          <select id="saved_routes_type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="">All types</option>
            {typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="saved_routes_target">Target country</label>
          <input id="saved_routes_target" value={targetCountryFilter} onChange={(event) => setTargetCountryFilter(event.target.value)} placeholder="Example: Estonia" />
        </div>
        <button className="btn primary" type="button" disabled={loading} onClick={loadItems}>{loading ? "Loading..." : "Load saved routes"}</button>
      </div>
      <p className="form-status">{message}</p>

      <div className="request-list">
        {items.map((item) => (
          <article className="request-card" key={item.id}>
            <div className="request-card-main">
              <div>
                <span className={`badge module-status ${item.status === "active" ? "available" : "coming_soon"}`}>{item.status}</span>
                <h3>{item.saved_title}</h3>
                <p>{item.notes || "No notes provided."}</p>
              </div>
              <div className="request-meta">
                <span>{formatDate(item.created_at)}</span>
                <span>{item.save_type}</span>
                {item.notify_on_changes ? <span>Monitoring requested</span> : null}
                {item.consent_to_contact ? <span>Consent confirmed</span> : null}
              </div>
            </div>

            <div className="request-details">
              <span><strong>Country:</strong> {item.target_country || item.country_code || "Not provided"}</span>
              <span><strong>Route:</strong> {item.route_category || item.route_code || "Not provided"}</span>
              <span><strong>Name:</strong> {item.full_name || "Not provided"}</span>
              <span><strong>Email:</strong> {item.email || "Not provided"}</span>
              <span><strong>Phone:</strong> {item.phone || "Not provided"}</span>
              <span><strong>Source:</strong> {item.source_page || "Not recorded"}</span>
            </div>

            <div className="badge-row">
              {statusOptions.map((status) => (
                <button className="status-button" key={status} type="button" disabled={item.status === status} onClick={() => updateStatus(item.id, status)}>{status}</button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
