"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type Opportunity = {
  id: string;
  opportunity_code: string;
  opportunity_name: string;
  country_code?: string | null;
  country_name?: string | null;
  opportunity_type?: string | null;
  availability_status?: string | null;
  source_confidence?: string | null;
  official_url?: string | null;
  result_check_url?: string | null;
  summary?: string | null;
  eligibility_summary?: string | null;
  application_window_summary?: string | null;
  safety_notes?: string | null;
  last_verified_at?: string | null;
  next_review_due_at?: string | null;
  is_public?: boolean;
};

type ApiList = {
  ok: boolean;
  opportunities: Opportunity[];
};

const statusOptions = ["open", "monitoring", "results_open", "closed", "paused", "unknown"];
const typeOptions = ["lottery", "ballot", "invitation_pool", "annual_quota", "country_cap", "first_come_quota", "seasonal_intake"];
const confidenceOptions = ["high", "medium", "low"];

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function statusClass(status?: string | null) {
  if (status === "open" || status === "results_open" || status === "monitoring") return "available";
  if (status === "closed" || status === "paused") return "partner_approval_pending";
  return "coming_soon";
}

export default function AdminOpportunities() {
  const [adminKey, setAdminKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [reviewDueOnly, setReviewDueOnly] = useState(false);
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Enter admin key and load official opportunity records.");

  useEffect(() => {
    try {
      setAdminKey(localStorage.getItem("moveready_admin_key") || "");
    } catch {
      // ignore storage failure
    }
  }, []);

  const counts = useMemo(() => {
    return items.reduce<Record<string, number>>((acc, item) => {
      const status = item.availability_status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }, [items]);

  async function loadItems() {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }

    setLoading(true);
    setMessage("Loading official opportunities...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const data = await apiJson<ApiList>("admin/opportunities", {
        query: {
          status: statusFilter || undefined,
          opportunity_type: typeFilter || undefined,
          country_code: countryFilter.trim().toUpperCase() || undefined,
          q: search.trim() || undefined,
          review_due: reviewDueOnly || undefined,
          limit: 100,
        },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems(data.opportunities || []);
      setMessage(data.opportunities?.length ? "Official opportunities loaded." : "No opportunity records found for this filter.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401 ? "Admin key rejected." : "Unable to load official opportunities. Confirm backend redeploy includes the admin opportunity endpoint.");
    } finally {
      setLoading(false);
    }
  }

  async function patchOpportunity(id: string, body: Record<string, unknown>, successMessage: string) {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }

    setMessage("Updating opportunity...");
    try {
      const data = await apiJson<{ opportunity: Opportunity }>(`admin/opportunities/${id}`, {
        method: "PATCH",
        body,
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems((rows) => rows.map((item) => (item.id === id ? data.opportunity : item)));
      setMessage(successMessage);
    } catch {
      setMessage("Unable to update opportunity. Confirm backend redeploy is complete.");
    }
  }

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <h2>Official opportunity routes</h2>
          <p className="section-intro">Review lottery, ballot, invitation-pool, quota, and country-cap records before public monitoring and alerts rely on them.</p>
        </div>
        <div className="badge-row admin-counts">
          {statusOptions.map((status) => <span className="badge" key={status}>{status}: {counts[status] || 0}</span>)}
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="field">
          <label htmlFor="opportunities_admin_key">Admin key</label>
          <input id="opportunities_admin_key" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" type="password" />
        </div>
        <div className="field">
          <label htmlFor="opportunities_status">Status</label>
          <select id="opportunities_status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="opportunities_type">Type</label>
          <select id="opportunities_type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="">All types</option>
            {typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="opportunities_country">Country code</label>
          <input id="opportunities_country" value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)} placeholder="US, CA, AU, UK, NZ" />
        </div>
        <div className="field">
          <label htmlFor="opportunities_search">Search</label>
          <input id="opportunities_search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="DV, IEC, ballot, quota" />
        </div>
        <label className="check-row compact-check-row">
          <input type="checkbox" checked={reviewDueOnly} onChange={(event) => setReviewDueOnly(event.target.checked)} />
          Review due only
        </label>
        <button className="btn primary" type="button" disabled={loading} onClick={loadItems}>{loading ? "Loading..." : "Load opportunities"}</button>
      </div>
      <p className="form-status">{message}</p>

      <div className="request-list">
        {items.map((item) => (
          <article className="request-card" key={item.id}>
            <div className="request-card-main">
              <div>
                <span className={`badge module-status ${statusClass(item.availability_status)}`}>{item.availability_status || "unknown"}</span>
                <h3>{item.opportunity_name}</h3>
                <p>{item.summary || "Summary not set."}</p>
              </div>
              <div className="request-meta">
                <span>{item.country_name || item.country_code || "Country not set"}</span>
                <span>{item.opportunity_type || "type not set"}</span>
                <span>Confidence: {item.source_confidence || "not set"}</span>
                <span>{item.is_public ? "Public" : "Hidden"}</span>
              </div>
            </div>

            <div className="request-details">
              <span><strong>Code:</strong> {item.opportunity_code}</span>
              <span><strong>Eligibility:</strong> {item.eligibility_summary || "Not set"}</span>
              <span><strong>Window:</strong> {item.application_window_summary || "Not set"}</span>
              <span><strong>Safety:</strong> {item.safety_notes || "Not set"}</span>
              <span><strong>Last verified:</strong> {formatDate(item.last_verified_at)}</span>
              <span><strong>Next review:</strong> {formatDate(item.next_review_due_at)}</span>
            </div>

            <div className="actions compact-actions">
              {item.official_url ? <a className="btn primary" href={item.official_url} target="_blank" rel="noreferrer">Official source</a> : null}
              {item.result_check_url ? <a className="btn" href={item.result_check_url} target="_blank" rel="noreferrer">Result check</a> : null}
              <button className="btn" type="button" onClick={() => patchOpportunity(item.id, { mark_checked: true, review_frequency_days: 30, source_confidence: item.source_confidence || "high" }, "Opportunity marked checked.")}>Mark checked</button>
              <button className="btn" type="button" onClick={() => patchOpportunity(item.id, { is_public: !item.is_public }, item.is_public ? "Opportunity hidden from public lists." : "Opportunity made public.")}>{item.is_public ? "Hide" : "Publish"}</button>
            </div>

            <div className="badge-row">
              {statusOptions.map((status) => (
                <button className="status-button" key={status} type="button" disabled={item.availability_status === status} onClick={() => patchOpportunity(item.id, { availability_status: status }, `Opportunity status set to ${status}.`)}>{status}</button>
              ))}
            </div>
            <div className="badge-row">
              {confidenceOptions.map((confidence) => (
                <button className="status-button" key={confidence} type="button" disabled={item.source_confidence === confidence} onClick={() => patchOpportunity(item.id, { source_confidence: confidence }, `Source confidence set to ${confidence}.`)}>{confidence} confidence</button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
