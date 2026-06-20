"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type ServiceRequest = {
  id?: string;
  service_slug?: string;
  service_title?: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  preferred_channel?: string;
  current_country?: string | null;
  target_country?: string | null;
  route_or_goal?: string | null;
  message?: string | null;
  consent_to_contact?: boolean;
  source_page?: string | null;
  status?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
};

type AccountSummary = {
  ok: boolean;
  session?: { email?: string };
  sections?: {
    service_requests?: {
      rows?: ServiceRequest[];
      count?: number;
    };
  };
};

const statusLabels: Record<string, string> = {
  new: "New",
  reviewing: "Under review",
  contacted: "Contacted",
  closed: "Closed",
  spam: "Spam / rejected",
};

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function safeTitle(row: ServiceRequest) {
  return row.service_title || row.service_slug?.replaceAll("_", " ") || "Service request";
}

function safeStatus(row: ServiceRequest) {
  return statusLabels[row.status || ""] || row.status || "New";
}

function metadataValue(row: ServiceRequest, key: string) {
  const value = row.metadata?.[key];
  if (value === undefined || value === null || value === "") return "Not recorded";
  return String(value);
}

export default function ServiceRequestsLookup() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [accountEmail, setAccountEmail] = useState("");
  const [message, setMessage] = useState("Loading verified account service requests if you are signed in...");
  const [loading, setLoading] = useState(false);

  async function loadVerifiedRequests(silent = false) {
    if (!silent) {
      setLoading(true);
      setMessage("Loading service requests from your verified account...");
    }

    try {
      const data = await apiJson<AccountSummary>("account/summary", {
        timeoutMs: 15000,
      });
      const rows = data.sections?.service_requests?.rows || [];
      setRequests(rows);
      setAccountEmail(data.session?.email || "");
      setMessage(rows.length ? "Verified account service requests loaded." : "No service requests are connected to this verified account yet.");
    } catch (error) {
      const apiError = error as ApiError;
      setRequests([]);
      setAccountEmail("");
      setMessage(apiError?.status === 401 ? "Sign in to view service requests connected to your verified account." : "Unable to load service requests right now.");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    loadVerifiedRequests(true);
  }, []);

  return (
    <div className="live-workspace reports-workspace">
      <section className="workflow-panel live-form">
        <div className="panel-heading">
          <div>
            <p className="overline">Trusted support</p>
            <h2>My service requests</h2>
          </div>
          <span className="status-dot">{accountEmail ? "Verified" : "Sign in"}</span>
        </div>
        <p className="section-intro">
          Service requests are private account records. MoveReady should review each request before any provider receives user details or route context.
        </p>
        {accountEmail ? <p className="form-status">Signed in as {accountEmail}. Requests below are loaded from the verified account when available.</p> : null}
        <div className="actions">
          <button className="btn primary" type="button" disabled={loading} onClick={() => loadVerifiedRequests(false)}>
            {loading ? "Loading..." : "Load my service requests"}
          </button>
          <a className="btn" href="/services#request-service">Create new request</a>
          <a className="btn" href="/dashboard">Back to Account Center</a>
        </div>
        <p className="form-status">{message}</p>
      </section>

      <section className="result-panel">
        {requests.length ? (
          <div className="result-stack">
            {requests.map((request) => (
              <article className="result-block" key={request.id || `${request.service_slug}-${request.created_at}`}>
                <div className="panel-heading">
                  <div>
                    <p className="overline">Service request</p>
                    <h2>{safeTitle(request)}</h2>
                  </div>
                  <span className="status-dot">{safeStatus(request)}</span>
                </div>
                <div className="badge-row">
                  {request.target_country ? <span className="badge">Target: {request.target_country}</span> : null}
                  {request.route_or_goal ? <span className="badge">Route: {request.route_or_goal}</span> : null}
                  {request.preferred_channel ? <span className="badge">Channel: {request.preferred_channel}</span> : null}
                  <span className="badge">{formatDate(request.created_at)}</span>
                </div>
                <div className="mini-list">
                  <div><strong>Requester</strong><span>{request.full_name || request.email || request.phone || "Not recorded"}</span></div>
                  <div><strong>Current country</strong><span>{request.current_country || "Not recorded"}</span></div>
                  <div><strong>Message</strong><span>{request.message || "No message recorded."}</span></div>
                  <div><strong>Consent</strong><span>{request.consent_to_contact ? "Contact consent captured" : "Consent not confirmed"}</span></div>
                  <div><strong>Source page</strong><span>{request.source_page || "Not recorded"}</span></div>
                  <div><strong>Trust rule</strong><span>{metadataValue(request, "trust_rule")}</span></div>
                </div>
                <div className="result-block soft">
                  <h3>Handoff control</h3>
                  <p>
                    Keep this request in admin review until the request context, relevant source checks, user consent, and provider screening are complete. Do not imply visa, admission, job, lottery, ballot, or provider approval.
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <article className="result-block featured">
            <p className="overline">No requests loaded</p>
            <h2>Service requests will appear here after account verification.</h2>
            <p>Use the Account Center profile summary or the Services page to create a consent-based request for admin review.</p>
          </article>
        )}
      </section>
    </div>
  );
}
