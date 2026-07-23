"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type Provider = {
  id: string;
  provider_type: string;
  business_name: string;
  status: string;
  consent_to_contact?: boolean;
  service_summary?: string | null;
  pricing_notes?: string | null;
  website_url?: string | null;
  public_listing_enabled?: boolean;
  privacy_reviewed?: boolean;
  pricing_reviewed?: boolean;
  refund_policy_reviewed?: boolean;
  sensitive_document_handling_reviewed?: boolean;
  affiliate_relationship?: boolean;
  affiliate_disclosure?: string | null;
  handoff_terms?: string | null;
  public_notes?: string | null;
  approved_at?: string | null;
};

type Draft = {
  privacy_reviewed: boolean;
  pricing_reviewed: boolean;
  refund_policy_reviewed: boolean;
  sensitive_document_handling_reviewed: boolean;
  affiliate_relationship: boolean;
  affiliate_disclosure: string;
  handoff_terms: string;
  public_notes: string;
};

function draftFor(provider: Provider): Draft {
  return {
    privacy_reviewed: Boolean(provider.privacy_reviewed),
    pricing_reviewed: Boolean(provider.pricing_reviewed),
    refund_policy_reviewed: Boolean(provider.refund_policy_reviewed),
    sensitive_document_handling_reviewed: Boolean(provider.sensitive_document_handling_reviewed),
    affiliate_relationship: Boolean(provider.affiliate_relationship),
    affiliate_disclosure: provider.affiliate_disclosure || "",
    handoff_terms: provider.handoff_terms || "",
    public_notes: provider.public_notes || "",
  };
}

export default function AdminProviderPublication() {
  const [adminKey, setAdminKey] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [message, setMessage] = useState("Load partner applications before publishing any provider.");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    try {
      setAdminKey(localStorage.getItem("moveready_admin_key") || "");
    } catch {
      // Ignore storage failure.
    }
  }, []);

  function headers() {
    return { "X-MoveReady-Admin-Key": adminKey.trim() };
  }

  async function loadProviders() {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }
    setLoading(true);
    setMessage("Loading providers and publication controls...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const data = await apiJson<{ partner_applications?: Provider[] }>("admin/partner-applications", {
        query: { limit: 75 },
        headers: headers(),
        timeoutMs: 20000,
        useAuthToken: false,
      });
      const rows = data.partner_applications || [];
      setProviders(rows);
      setDrafts(Object.fromEntries(rows.map((provider) => [provider.id, draftFor(provider)])));
      setMessage(rows.length ? "Provider publication records loaded." : "No provider applications found.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401 ? "Admin key rejected." : "Unable to load providers. Confirm migration 023 is applied.");
    } finally {
      setLoading(false);
    }
  }

  function updateDraft(id: string, patch: Partial<Draft>) {
    setDrafts((current) => ({ ...current, [id]: { ...(current[id] || draftFor(providers.find((row) => row.id === id) as Provider)), ...patch } }));
  }

  async function savePublication(provider: Provider, enable: boolean) {
    const draft = drafts[provider.id] || draftFor(provider);
    if (enable && provider.status !== "approved") {
      setMessage("Set the provider application status to approved before public publication.");
      return;
    }
    if (enable && draft.affiliate_relationship && !draft.affiliate_disclosure.trim()) {
      setMessage("Affiliate disclosure is required when an affiliate relationship exists.");
      return;
    }

    setUpdatingId(provider.id);
    setMessage(`${enable ? "Publishing" : "Removing"} ${provider.business_name}...`);
    try {
      const data = await apiJson<{ partner_application: Provider }>(`admin/provider-publication/${provider.id}`, {
        method: "PATCH",
        body: {
          ...draft,
          public_listing_enabled: enable,
          approved_by: "MoveReady admin console",
        },
        headers: headers(),
        timeoutMs: 20000,
        useAuthToken: false,
      });
      setProviders((rows) => rows.map((row) => (row.id === provider.id ? data.partner_application : row)));
      setDrafts((current) => ({ ...current, [provider.id]: draftFor(data.partner_application) }));
      setMessage(enable ? "Provider published after all required controls passed." : "Provider removed from the public directory.");
    } catch (error) {
      const apiError = error as ApiError;
      const code = apiError?.data?.error || apiError?.message || "provider_publication_failed";
      const errors = Array.isArray(apiError?.data?.provider_errors) ? `: ${apiError.data.provider_errors.join(", ")}` : "";
      setMessage(`Unable to update provider publication: ${code}${errors}`);
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <p className="overline">Public handoff gate</p>
          <h2>Provider publication controls</h2>
          <p className="section-intro">An approved application is not automatically a public listing. Privacy, pricing, refund, sensitive-document handling, disclosure, and handoff checks must be recorded separately.</p>
        </div>
        <span className="status-dot">Fail closed</span>
      </div>

      <div className="admin-toolbar">
        <div className="field"><label htmlFor="publication_admin_key">Admin key</label><input id="publication_admin_key" type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" /></div>
        <button className="btn primary" type="button" disabled={loading} onClick={loadProviders}>{loading ? "Loading..." : "Load publication controls"}</button>
      </div>
      <p className="form-status">{message}</p>

      <div className="request-list">
        {providers.map((provider) => {
          const draft = drafts[provider.id] || draftFor(provider);
          return (
            <article className="request-card" key={provider.id}>
              <div className="request-card-main">
                <div><span className={`badge module-status ${provider.public_listing_enabled ? "available" : provider.status === "approved" ? "partner_approval_pending" : "coming_soon"}`}>{provider.public_listing_enabled ? "public" : provider.status}</span><h3>{provider.business_name}</h3><p>{provider.service_summary || "No service summary provided."}</p></div>
                <div className="request-meta"><span>{provider.provider_type}</span><span>{provider.website_url || "No website"}</span><span>{provider.approved_at || "Not published"}</span></div>
              </div>

              <div className="check-grid">
                <label className="checkbox-field"><input type="checkbox" checked={draft.privacy_reviewed} onChange={(event) => updateDraft(provider.id, { privacy_reviewed: event.target.checked })} /><span>Privacy process reviewed</span></label>
                <label className="checkbox-field"><input type="checkbox" checked={draft.pricing_reviewed} onChange={(event) => updateDraft(provider.id, { pricing_reviewed: event.target.checked })} /><span>Pricing reviewed</span></label>
                <label className="checkbox-field"><input type="checkbox" checked={draft.refund_policy_reviewed} onChange={(event) => updateDraft(provider.id, { refund_policy_reviewed: event.target.checked })} /><span>Refund policy reviewed</span></label>
                <label className="checkbox-field"><input type="checkbox" checked={draft.sensitive_document_handling_reviewed} onChange={(event) => updateDraft(provider.id, { sensitive_document_handling_reviewed: event.target.checked })} /><span>Sensitive-document handling reviewed</span></label>
                <label className="checkbox-field"><input type="checkbox" checked={draft.affiliate_relationship} onChange={(event) => updateDraft(provider.id, { affiliate_relationship: event.target.checked })} /><span>Affiliate or commission relationship exists</span></label>
              </div>

              <div className="form-grid two-col">
                <div className="field"><label>Affiliate disclosure</label><textarea rows={3} value={draft.affiliate_disclosure} onChange={(event) => updateDraft(provider.id, { affiliate_disclosure: event.target.value })} placeholder="Required when MoveReady may earn commission." /></div>
                <div className="field"><label>Handoff terms</label><textarea rows={3} value={draft.handoff_terms} onChange={(event) => updateDraft(provider.id, { handoff_terms: event.target.value })} placeholder="What information can be shared, when, and with whose consent?" /></div>
                <div className="field"><label>Public notes</label><textarea rows={3} value={draft.public_notes} onChange={(event) => updateDraft(provider.id, { public_notes: event.target.value })} placeholder="Non-sensitive note visible to users." /></div>
                <div className="service-context-box"><strong>Publication rule</strong><span>Status must be approved, provider contact consent must exist, service and pricing summaries must be present, and every review checkbox must be complete.</span></div>
              </div>

              <div className="actions">
                <button className="btn primary" type="button" disabled={updatingId === provider.id || provider.public_listing_enabled} onClick={() => savePublication(provider, true)}>{updatingId === provider.id ? "Saving..." : "Publish provider"}</button>
                <button className="btn" type="button" disabled={updatingId === provider.id || !provider.public_listing_enabled} onClick={() => savePublication(provider, false)}>Remove public listing</button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
