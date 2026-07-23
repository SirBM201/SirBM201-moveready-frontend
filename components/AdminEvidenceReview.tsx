"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type Pack = {
  id?: string;
  pack_ref: string;
  email?: string;
  route_category?: string;
  target_country?: string;
  application_stage?: string;
  status?: string;
  completeness_score?: number;
  risk_level?: string;
  missing_items?: Array<{ label?: string }>;
  expiring_items?: Array<{ document_label?: string; status?: string; expiry_date?: string }>;
  warnings?: string[];
  official_source_notes?: string | null;
};

type ExpiringDocument = {
  id: string;
  email?: string;
  document_label?: string;
  document_type?: string;
  owner_scope?: string;
  expiry_date?: string | null;
  days_until_expiry?: number | null;
  derived_status?: string;
  expired?: boolean;
};

function readable(value?: string | null) {
  return String(value || "not set").replace(/_/g, " ");
}

function formatDate(value?: string | null) {
  if (!value) return "Not recorded";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminEvidenceReview() {
  const [adminKey, setAdminKey] = useState("");
  const [packs, setPacks] = useState<Pack[]>([]);
  const [documents, setDocuments] = useState<ExpiringDocument[]>([]);
  const [message, setMessage] = useState("Enter the admin key to load evidence packs and expiry risks.");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    try {
      setAdminKey(localStorage.getItem("moveready_admin_key") || "");
    } catch {
      // Ignore storage failures.
    }
  }, []);

  function headers() {
    return { "X-MoveReady-Admin-Key": adminKey.trim() };
  }

  async function load() {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }
    setLoading(true);
    setMessage("Loading evidence packs and expiring document metadata...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const [packData, documentData] = await Promise.all([
        apiJson<{ evidence_packs?: Pack[] }>("admin/evidence-packs", { headers: headers(), query: { limit: 150 }, timeoutMs: 30000, useAuthToken: false }),
        apiJson<{ documents?: ExpiringDocument[] }>("admin/document-inventory/expiring", { headers: headers(), query: { days: 180, limit: 200 }, timeoutMs: 30000, useAuthToken: false }),
      ]);
      setPacks(packData.evidence_packs || []);
      setDocuments(documentData.documents || []);
      setMessage("Evidence review records loaded. No raw files or full document numbers are exposed.");
    } catch (error) {
      const apiError = error as ApiError;
      setPacks([]);
      setDocuments([]);
      setMessage(apiError?.status === 401 ? "Admin key rejected." : apiError?.data?.hint || apiError?.data?.error || "Unable to load evidence review records.");
    } finally {
      setLoading(false);
    }
  }

  async function updatePack(item: Pack, status: string) {
    if (!item.id) return;
    const sourceNote = window.prompt("Official source or review note", item.official_source_notes || "")?.trim();
    if (sourceNote === undefined) return;
    setUpdatingId(item.id);
    setMessage(`Updating ${item.pack_ref} to ${status}...`);
    try {
      const response = await apiJson<{ evidence_pack: Pack }>(`admin/evidence-packs/${item.id}`, {
        method: "PATCH",
        headers: headers(),
        body: { status, official_source_notes: sourceNote },
        timeoutMs: 20000,
        useAuthToken: false,
      });
      setPacks((rows) => rows.map((row) => (row.id === item.id ? response.evidence_pack : row)));
      setMessage("Evidence pack review status updated.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to update evidence pack: ${apiError?.data?.error || "evidence_pack_update_failed"}`);
    } finally {
      setUpdatingId("");
    }
  }

  const priorityPacks = packs.filter((item) => ["high", "critical"].includes(String(item.risk_level)) || item.status === "review_required");

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <p className="overline">Evidence review</p>
          <h2>Evidence packs and expiry risks</h2>
          <p className="section-intro">Review metadata-only evidence packs, missing categories, official-source notes, and documents recorded as expired or expiring within 180 days.</p>
        </div>
        <span className="status-dot">No raw files</span>
      </div>

      <div className="admin-toolbar">
        <div className="field"><label htmlFor="evidence_admin_key">Admin key</label><input id="evidence_admin_key" type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" /></div>
        <button className="btn primary" type="button" disabled={loading} onClick={load}>{loading ? "Loading..." : "Load evidence review"}</button>
        <a className="btn" href="/evidence-pack">Open Evidence Center</a>
      </div>
      <p className="form-status">{message}</p>

      <div className="result-stack">
        <article className="result-block featured">
          <div className="panel-heading"><div><p className="overline">Priority evidence packs</p><h3>{priorityPacks.length} need attention</h3></div><span className="status-dot">Private account data</span></div>
          <p>Mark a pack ready only after the user’s inventory, current official checklist, expiry, translation, legalization, route stage, and unresolved refusal issues have been reviewed.</p>
        </article>

        {priorityPacks.map((item) => (
          <article className="result-block" key={item.pack_ref}>
            <div className="panel-heading"><div><p className="overline">{item.pack_ref}</p><h3>{readable(item.route_category)} · {item.target_country || "country not set"}</h3></div><span className="status-dot">{item.completeness_score || 0}% · {readable(item.risk_level)}</span></div>
            <div className="mini-list">
              <div><strong>Account</strong><span>{item.email || "Not recorded"}</span></div>
              <div><strong>Status</strong><span>{readable(item.status)} · stage {readable(item.application_stage)}</span></div>
              <div><strong>Missing</strong><span>{(item.missing_items || []).map((row) => row.label).filter(Boolean).join(", ") || "None recorded"}</span></div>
              <div><strong>Expiring</strong><span>{(item.expiring_items || []).map((row) => `${row.document_label} (${readable(row.status)})`).join(", ") || "None recorded"}</span></div>
              <div><strong>Warnings</strong><span>{(item.warnings || []).join(" ") || "None recorded"}</span></div>
              <div><strong>Official source note</strong><span>{item.official_source_notes || "Not recorded"}</span></div>
            </div>
            <div className="actions compact-actions">
              <button className="btn primary" type="button" disabled={updatingId === item.id} onClick={() => updatePack(item, "ready")}>Mark ready</button>
              <button className="btn" type="button" disabled={updatingId === item.id} onClick={() => updatePack(item, "review_required")}>Keep review required</button>
              <button className="btn" type="button" disabled={updatingId === item.id} onClick={() => updatePack(item, "stale")}>Mark stale</button>
            </div>
          </article>
        ))}

        <article className="result-block">
          <p className="overline">Expiry queue</p>
          <h3>{documents.length} expired or expiring records</h3>
          <div className="mini-list">
            {documents.map((item) => (
              <div key={item.id}>
                <strong>{item.expired ? "Expired" : "Expiring"}: {item.document_label || readable(item.document_type)}</strong>
                <span>{item.email || "Unknown account"} · owner {readable(item.owner_scope)} · expiry {formatDate(item.expiry_date)} · {item.days_until_expiry ?? "unknown"} days · {readable(item.derived_status)}</span>
              </div>
            ))}
            {!documents.length ? <div><strong>No expiry record loaded</strong><span>No document metadata is recorded as expired or expiring within 180 days.</span></div> : null}
          </div>
        </article>
      </div>
    </section>
  );
}
