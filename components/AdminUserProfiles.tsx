"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type UserProfile = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  current_country?: string | null;
  nationality?: string | null;
  target_country?: string | null;
  target_city?: string | null;
  main_goal: string;
  route_category?: string | null;
  timeline_months?: number | null;
  family_members_count?: number | null;
  available_funds_amount?: number | null;
  available_funds_currency?: string | null;
  preferred_contact_channel?: string;
  has_previous_refusal?: boolean;
  readiness_snapshot?: { readiness_score?: number; readiness_level?: string; risk_flags?: string[] };
  status: string;
  created_at?: string;
};

type ApiList = {
  ok: boolean;
  user_profiles: UserProfile[];
};

const statusOptions = ["new", "reviewing", "contacted", "active", "closed", "spam"];
const goalOptions = ["study", "scholarship", "work", "startup", "business", "digital_nomad", "family", "visit", "opportunity", "relocation"];

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminUserProfiles() {
  const [adminKey, setAdminKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [goalFilter, setGoalFilter] = useState("");
  const [targetFilter, setTargetFilter] = useState("");
  const [items, setItems] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Enter admin key and load user profiles.");

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
    setMessage("Loading user profiles...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const data = await apiJson<ApiList>("admin/user-profiles", {
        query: {
          status: statusFilter || undefined,
          main_goal: goalFilter || undefined,
          target_country: targetFilter || undefined,
          limit: 75,
        },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems(data.user_profiles || []);
      setMessage(data.user_profiles?.length ? "User profiles loaded." : "No profiles found for this filter.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401 ? "Admin key rejected." : "Unable to load profiles. Confirm SQL 008 has been run.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }

    setMessage("Updating profile status...");
    try {
      const data = await apiJson<{ user_profile: UserProfile }>(`admin/user-profiles/${id}`, {
        method: "PATCH",
        body: { status },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems((rows) => rows.map((item) => (item.id === id ? data.user_profile : item)));
      setMessage("Profile status updated.");
    } catch {
      setMessage("Unable to update profile status.");
    }
  }

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <h2>User relocation profiles</h2>
          <p className="section-intro">Review saved profile leads for reports, watchlists, route planning, and service follow-up.</p>
        </div>
        <div className="badge-row admin-counts">
          {statusOptions.map((status) => <span className="badge" key={status}>{status}: {counts[status] || 0}</span>)}
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="field"><label htmlFor="profile_admin_key">Admin key</label><input id="profile_admin_key" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" type="password" /></div>
        <div className="field"><label htmlFor="profile_status">Status</label><select id="profile_status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All statuses</option>{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></div>
        <div className="field"><label htmlFor="profile_goal">Goal</label><select id="profile_goal" value={goalFilter} onChange={(event) => setGoalFilter(event.target.value)}><option value="">All goals</option>{goalOptions.map((goal) => <option key={goal} value={goal}>{goal}</option>)}</select></div>
        <div className="field"><label htmlFor="profile_target">Target country</label><input id="profile_target" value={targetFilter} onChange={(event) => setTargetFilter(event.target.value)} placeholder="Example: Estonia" /></div>
        <button className="btn primary" type="button" disabled={loading} onClick={loadItems}>{loading ? "Loading..." : "Load profiles"}</button>
      </div>
      <p className="form-status">{message}</p>

      <div className="request-list">
        {items.map((item) => {
          const snapshot = item.readiness_snapshot || {};
          return (
            <article className="request-card" key={item.id}>
              <div className="request-card-main">
                <div>
                  <span className={`badge module-status ${item.status === "active" ? "available" : "coming_soon"}`}>{item.status}</span>
                  <h3>{item.full_name || item.email || item.phone || "Saved profile"}</h3>
                  <p>{item.main_goal} route to {item.target_country || "target country not set"}</p>
                </div>
                <div className="request-meta">
                  <span>{formatDate(item.created_at)}</span>
                  <span>{item.preferred_contact_channel || "email"}</span>
                  <span>Score: {snapshot.readiness_score ?? 0}</span>
                </div>
              </div>

              <div className="request-details">
                <span><strong>Email:</strong> {item.email || "Not provided"}</span>
                <span><strong>Phone:</strong> {item.phone || "Not provided"}</span>
                <span><strong>Current:</strong> {item.current_country || "Not provided"}</span>
                <span><strong>Nationality:</strong> {item.nationality || "Not provided"}</span>
                <span><strong>Target:</strong> {item.target_country || "Not provided"}</span>
                <span><strong>Funds:</strong> {item.available_funds_currency || ""} {(item.available_funds_amount || 0).toLocaleString()}</span>
                <span><strong>Family:</strong> {item.family_members_count || 0}</span>
                <span><strong>Flags:</strong> {snapshot.risk_flags?.length ? snapshot.risk_flags.join(", ") : "None"}</span>
              </div>

              <div className="badge-row">
                {statusOptions.map((status) => (
                  <button className="status-button" key={status} type="button" disabled={item.status === status} onClick={() => updateStatus(item.id, status)}>{status}</button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
