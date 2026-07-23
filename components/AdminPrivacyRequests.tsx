"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type PrivacyRequest = {
  id: string;
  request_ref: string;
  email: string;
  request_type: string;
  status: string;
  priority: string;
  request_summary: string;
  requested_scope?: string;
  user_confirmation?: boolean;
  identity_reverification_required?: boolean;
  administrator_note?: string;
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
};

type QueueResponse = {
  ok: boolean;
  requests?: PrivacyRequest[];
  count?: number;
  counts_by_status?: Record<string, number>;
  safety_note?: string;
};

const statuses = [
  "received",
  "identity_verification_required",
  "reviewing",
  "in_progress",
  "completed",
  "rejected",
  "cancelled",
];

const priorities = ["low", "normal", "high", "urgent"];

function readable(value?: string) {
  return String(value || "unknown").replaceAll("_", " ");
}

function formatDate(value?: string) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function AdminPrivacyRequests() {
  const [adminKey, setAdminKey] = useState("");
  const [requests, setRequests] = useState<PrivacyRequest[]>([]);
  const [message, setMessage] = useState("Enter the admin key to review privacy requests.");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("open");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [identityVerified, setIdentityVerified] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      setAdminKey(localStorage.getItem("moveready_admin_key") || "");
    } catch {
      // Ignore storage failures.
    }
  }, []);

  const visibleRequests = useMemo(() => {
    if (filter === "all") return requests;
    if (filter === "open") {
      return requests.filter((item) => ["received", "identity_verification_required", "reviewing", "in_progress"].includes(item.status));
    }
    return requests.filter((item) => item.status === filter);
  }, [requests, filter]);

  async function load() {
    const key = adminKey.trim();
    if (!key) {
      setMessage("Admin key is required.");
      return;
    }
    setLoading(true);
    setMessage("Loading protected privacy-request queue...");
    try {
      localStorage.setItem("moveready_admin_key", key);
      const response = await apiJson<QueueResponse>("admin/privacy-requests", {
        headers: { "X-MoveReady-Admin-Key": key },
        query: { limit: 300 },
        timeoutMs: 30000,
        useAuthToken: false,
      });
      setRequests(response.requests || []);
      setMessage(`${response.count || 0} privacy request(s) loaded. No automatic deletion or consent withdrawal is performed by this console.`);
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401 ? "Admin key rejected." : apiError?.data?.error || "Unable to load privacy requests.");
    } finally {
      setLoading(false);
    }
  }

  async function update(item: PrivacyRequest, status: string, priority = item.priority) {
    const key = adminKey.trim();
    const note = (notes[item.id] ?? item.administrator_note ?? "").trim();
    if (status === "completed" && !note) {
      setMessage("A factual completion note is required before a privacy request can be closed.");
      return;
    }
    if (["account_deletion", "consent_withdrawal"].includes(item.request_type)
      && ["in_progress", "completed"].includes(status)
      && !identityVerified[item.id]) {
      setMessage("Confirm identity reverification before advancing a destructive or consent-withdrawal request.");
      return;
    }
    setMessage(`Updating ${item.request_ref}...`);
    try {
      await apiJson(`admin/privacy-requests/${item.id}`, {
        method: "PATCH",
        headers: { "X-MoveReady-Admin-Key": key },
        body: {
          status,
          priority,
          administrator_note: note,
          identity_reverified: Boolean(identityVerified[item.id]),
        },
        timeoutMs: 30000,
        useAuthToken: false,
      });
      setMessage(`${item.request_ref} updated. No account data was destroyed automatically.`);
      await load();
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.data?.error || apiError?.message || "Unable to update privacy request.");
    }
  }

  return (
    <div className="result-stack">
      <article className="result-block featured">
        <div className="panel-heading">
          <div>
            <p className="overline">Protected privacy operations</p>
            <h2>Access, correction, restriction, consent, and deletion requests</h2>
          </div>
          <span className="status-dot">Manual review only</span>
        </div>
        <p>{message}</p>
        <div className="form-grid">
          <label>
            MoveReady admin key
            <input type="password" value={adminKey} autoComplete="off" onChange={(event) => setAdminKey(event.target.value)} />
          </label>
          <label>
            Queue filter
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="open">Open requests</option>
              <option value="all">All requests</option>
              {statuses.map((status) => <option value={status} key={status}>{readable(status)}</option>)}
            </select>
          </label>
        </div>
        <div className="actions">
          <button className="btn primary" type="button" onClick={load} disabled={loading}>{loading ? "Loading..." : "Load privacy queue"}</button>
          <a className="btn" href="/admin">Admin workspace</a>
          <a className="btn" href="/settings">User privacy center</a>
        </div>
      </article>

      <article className="result-block">
        <p className="overline">Review queue</p>
        <h2>{visibleRequests.length} request(s) shown</h2>
        <div className="mini-list">
          {visibleRequests.length === 0 && (
            <div>
              <strong>No matching privacy requests</strong>
              <span>Load the queue or change the filter.</span>
            </div>
          )}
          {visibleRequests.map((item) => {
            const destructive = ["account_deletion", "consent_withdrawal"].includes(item.request_type);
            return (
              <div key={item.id}>
                <strong>{item.request_ref} · {readable(item.request_type)}</strong>
                <span>
                  {item.email}<br />
                  Status: {readable(item.status)} · Priority: {item.priority}<br />
                  Created: {formatDate(item.created_at)}<br />
                  Scope: {item.requested_scope || "Not specified"}<br />
                  Summary: {item.request_summary}
                </span>
                <label>
                  Administrator note
                  <textarea rows={4} value={notes[item.id] ?? item.administrator_note ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [item.id]: event.target.value }))} />
                </label>
                {destructive && (
                  <label style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <input type="checkbox" checked={Boolean(identityVerified[item.id])} onChange={(event) => setIdentityVerified((current) => ({ ...current, [item.id]: event.target.checked }))} />
                    <span><strong>Identity reverification completed</strong><br />Confirm only after the approved procedure and audit evidence are complete.</span>
                  </label>
                )}
                <div className="form-grid">
                  <label>
                    Priority
                    <select value={item.priority} onChange={(event) => update(item, item.status, event.target.value)}>
                      {priorities.map((priority) => <option value={priority} key={priority}>{priority}</option>)}
                    </select>
                  </label>
                  <label>
                    Status
                    <select value={item.status} onChange={(event) => update(item, event.target.value)}>
                      {statuses.map((status) => <option value={status} key={status}>{readable(status)}</option>)}
                    </select>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </article>

      <article className="result-block soft">
        <p className="overline">Completion control</p>
        <p>Before completing a request, verify identity, requested scope, retention duties, billing and dispute records, provider-held copies, backups, legal holds, deletion or correction evidence, and the communication sent to the user.</p>
      </article>
    </div>
  );
}
