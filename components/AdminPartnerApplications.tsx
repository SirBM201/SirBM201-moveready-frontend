"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type PartnerApplication = {
  id: string;
  provider_type: string;
  business_name: string;
  contact_name?: string | null;
  email?: string | null;
  phone?: string | null;
  website_url?: string | null;
  country?: string | null;
  city?: string | null;
  service_countries?: string[];
  service_summary?: string | null;
  credentials_summary?: string | null;
  compliance_notes?: string | null;
  pricing_notes?: string | null;
  preferred_contact_channel: string;
  consent_to_contact?: boolean;
  status: string;
  internal_notes?: string | null;
  source_page?: string | null;
  created_at?: string;
};

type ApiList = {
  ok: boolean;
  partner_applications: PartnerApplication[];
};

const statusOptions = ["new", "screening", "approved", "rejected", "waitlist", "suspended", "spam"];
const providerTypes = ["courier", "insurance", "legalization", "translation", "expert_review", "admission_support", "accommodation", "airport_pickup", "settlement", "other"];

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminPartnerApplications() {
  const [adminKey, setAdminKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [items, setItems] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Enter admin key and load partner applications.");

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
    setMessage("Loading partner applications...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const data = await apiJson<ApiList>("admin/partner-applications", {
        query: {
          status: statusFilter || undefined,
          provider_type: typeFilter || undefined,
          country: countryFilter || undefined,
          limit: 75,
        },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems(data.partner_applications || []);
      setMessage(data.partner_applications?.length ? "Partner applications loaded." : "No partner applications found for this filter.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401 ? "Admin key rejected." : "Unable to load partner applications. Confirm SQL 011 has been run and backend has redeployed.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }

    setMessage("Updating partner application status...");
    try {
      const data = await apiJson<{ partner_application: PartnerApplication }>(`admin/partner-applications/${id}`, {
        method: "PATCH",
        body: { status },
        headers: { "X-MoveReady-Admin-Key": adminKey.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setItems((rows) => rows.map((item) => (item.id === id ? data.partner_application : item)));
      setMessage("Partner application status updated.");
    } catch {
      setMessage("Unable to update partner application status.");
    }
  }

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <h2>Partner applications</h2>
          <p className="section-intro">Review providers applying for courier, insurance, legalization, translation, expert review, admission, accommodation, airport pickup, and settlement workflows.</p>
        </div>
        <div className="badge-row admin-counts">
          {statusOptions.map((status) => <span className="badge" key={status}>{status}: {counts[status] || 0}</span>)}
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="field">
          <label htmlFor="partner_admin_key">Admin key</label>
          <input id="partner_admin_key" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" type="password" />
        </div>
        <div className="field">
          <label htmlFor="partner_status">Status</label>
          <select id="partner_status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="partner_type">Provider type</label>
          <select id="partner_type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="">All provider types</option>
            {providerTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="partner_country">Base country</label>
          <input id="partner_country" value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)} placeholder="Example: Kuwait" />
        </div>
        <button className="btn primary" type="button" disabled={loading} onClick={loadItems}>{loading ? "Loading..." : "Load partners"}</button>
      </div>
      <p className="form-status">{message}</p>

      <div className="request-list">
        {items.map((item) => (
          <article className="request-card" key={item.id}>
            <div className="request-card-main">
              <div>
                <span className={`badge module-status ${item.status === "approved" ? "available" : item.status === "new" || item.status === "screening" ? "partner_approval_pending" : "coming_soon"}`}>{item.status}</span>
                <h3>{item.business_name}</h3>
                <p>{item.service_summary || "No service summary provided."}</p>
              </div>
              <div className="request-meta">
                <span>{formatDate(item.created_at)}</span>
                <span>{item.provider_type}</span>
                <span>{item.preferred_contact_channel}</span>
                {item.consent_to_contact ? <span>Consent confirmed</span> : null}
              </div>
            </div>

            <div className="request-details">
              <span><strong>Contact:</strong> {item.contact_name || "Not provided"}</span>
              <span><strong>Email:</strong> {item.email || "Not provided"}</span>
              <span><strong>Phone:</strong> {item.phone || "Not provided"}</span>
              <span><strong>Location:</strong> {[item.city, item.country].filter(Boolean).join(", ") || "Not provided"}</span>
              <span><strong>Service countries:</strong> {item.service_countries?.length ? item.service_countries.join(", ") : "Not provided"}</span>
              <span><strong>Website:</strong> {item.website_url || "Not provided"}</span>
              <span><strong>Credentials:</strong> {item.credentials_summary || "Not provided"}</span>
              <span><strong>Compliance:</strong> {item.compliance_notes || "Not provided"}</span>
              <span><strong>Pricing:</strong> {item.pricing_notes || "Not provided"}</span>
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
