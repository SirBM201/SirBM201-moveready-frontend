"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type WatchlistSubscription = {
  id: string;
  watch_type: string;
  watch_code?: string | null;
  watch_title?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  preferred_channel: string;
  current_country?: string | null;
  target_country?: string | null;
  route_or_goal?: string | null;
  alert_types?: string[];
  consent_to_contact?: boolean;
  status: string;
  source_page?: string | null;
  created_at?: string;
};

type ApiList = {
  ok: boolean;
  watchlist_subscriptions: WatchlistSubscription[];
};

const statusOptions = ["active", "paused", "unsubscribed", "closed", "spam"];
const channelOptions = ["email", "whatsapp", "telegram", "phone", "in_app"];
const typeOptions = ["route", "opportunity", "scholarship", "country", "service"];

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminWatchlistSubscriptions() {
  const [adminKey, setAdminKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [items, setItems] = useState<WatchlistSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Enter admin key and load watchlist subscriptions.");

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
    setMessage("Loading watchlist subscriptions...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const data = await apiJson<ApiList>("admin/watchlist-subscriptions", {
        query: {
          status: statusFilter || undefined,
          watch_type: typeFilter || undefined,
          preferred_channel: channelFilter || undefined,
          limit: 75,
        },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems(data.watchlist_subscriptions || []);
      setMessage(data.watchlist_subscriptions?.length ? "Watchlist subscriptions loaded." : "No watchlist subscriptions found for this filter.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401 ? "Admin key rejected." : "Unable to load watchlist subscriptions. Confirm SQL 007 has been run.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }

    setMessage("Updating watchlist status...");
    try {
      const data = await apiJson<{ watchlist_subscription: WatchlistSubscription }>(`admin/watchlist-subscriptions/${id}`, {
        method: "PATCH",
        body: { status },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems((rows) => rows.map((item) => (item.id === id ? data.watchlist_subscription : item)));
      setMessage("Watchlist status updated.");
    } catch {
      setMessage("Unable to update watchlist status.");
    }
  }

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <h2>Watchlist subscriptions</h2>
          <p className="section-intro">Review opt-in monitoring requests for routes, official opportunities, scholarships, countries, and services.</p>
        </div>
        <div className="badge-row admin-counts">
          {statusOptions.map((status) => <span className="badge" key={status}>{status}: {counts[status] || 0}</span>)}
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="field">
          <label htmlFor="watchlist_admin_key">Admin key</label>
          <input id="watchlist_admin_key" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" type="password" />
        </div>
        <div className="field">
          <label htmlFor="watchlist_status">Status</label>
          <select id="watchlist_status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="watchlist_type">Type</label>
          <select id="watchlist_type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="">All types</option>
            {typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="watchlist_channel">Channel</label>
          <select id="watchlist_channel" value={channelFilter} onChange={(event) => setChannelFilter(event.target.value)}>
            <option value="">All channels</option>
            {channelOptions.map((channel) => <option key={channel} value={channel}>{channel}</option>)}
          </select>
        </div>
        <button className="btn primary" type="button" disabled={loading} onClick={loadItems}>{loading ? "Loading..." : "Load watchlist"}</button>
      </div>
      <p className="form-status">{message}</p>

      <div className="request-list">
        {items.map((item) => (
          <article className="request-card" key={item.id}>
            <div className="request-card-main">
              <div>
                <span className={`badge module-status ${item.status === "active" ? "available" : "coming_soon"}`}>{item.status}</span>
                <h3>{item.watch_title || item.watch_code || item.route_or_goal || item.watch_type}</h3>
                <p>{item.alert_types?.length ? item.alert_types.join(", ") : "Default alert types"}</p>
              </div>
              <div className="request-meta">
                <span>{formatDate(item.created_at)}</span>
                <span>{item.preferred_channel}</span>
                {item.consent_to_contact ? <span>Consent confirmed</span> : null}
              </div>
            </div>

            <div className="request-details">
              <span><strong>Type:</strong> {item.watch_type}</span>
              <span><strong>Code:</strong> {item.watch_code || "Not provided"}</span>
              <span><strong>Name:</strong> {item.full_name || "Not provided"}</span>
              <span><strong>Email:</strong> {item.email || "Not provided"}</span>
              <span><strong>Phone:</strong> {item.phone || "Not provided"}</span>
              <span><strong>Goal:</strong> {item.route_or_goal || "Not provided"}</span>
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
