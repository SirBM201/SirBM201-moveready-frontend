"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError, apiJson, clearStoredAuthToken } from "@/lib/api";

type Preferences = {
  email: string;
  preferred_language: string;
  preferred_currency: string;
  timezone: string;
  date_format: string;
  reminder_lead_days: number;
  in_app_notifications_enabled: boolean;
  email_notifications_enabled: boolean;
  whatsapp_notifications_enabled: boolean;
  marketing_messages_enabled: boolean;
  source_change_alerts_enabled: boolean;
  application_deadline_alerts_enabled: boolean;
  document_expiry_alerts_enabled: boolean;
  opportunity_alerts_enabled: boolean;
  reduced_motion: boolean;
  high_contrast: boolean;
  simple_language: boolean;
  larger_text: boolean;
  onboarding_status: string;
  onboarding_step: string;
  delivery_status?: Record<string, string>;
};

type SessionRow = {
  id: string;
  status: string;
  created_at?: string;
  last_seen_at?: string;
  expires_at?: string;
  device: string;
  current: boolean;
};

type PrivacyRequest = {
  request_ref: string;
  request_type: string;
  status: string;
  priority: string;
  request_summary: string;
  requested_scope?: string;
  identity_reverification_required?: boolean;
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
};

const defaultPreferences: Preferences = {
  email: "",
  preferred_language: "en",
  preferred_currency: "USD",
  timezone: "UTC",
  date_format: "day_month_year",
  reminder_lead_days: 7,
  in_app_notifications_enabled: true,
  email_notifications_enabled: false,
  whatsapp_notifications_enabled: false,
  marketing_messages_enabled: false,
  source_change_alerts_enabled: true,
  application_deadline_alerts_enabled: true,
  document_expiry_alerts_enabled: true,
  opportunity_alerts_enabled: false,
  reduced_motion: false,
  high_contrast: false,
  simple_language: false,
  larger_text: false,
  onboarding_status: "not_started",
  onboarding_step: "profile",
};

function formatDate(value?: string) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function applyAccessibility(preferences: Preferences) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("moveready-reduced-motion", preferences.reduced_motion);
  document.documentElement.classList.toggle("moveready-high-contrast", preferences.high_contrast);
  document.documentElement.classList.toggle("moveready-larger-text", preferences.larger_text);
  document.documentElement.classList.toggle("moveready-simple-language", preferences.simple_language);
}

export default function AccountSettingsWorkspace() {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [privacyRequests, setPrivacyRequests] = useState<PrivacyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("Loading private account controls...");
  const [requestType, setRequestType] = useState("data_export");
  const [requestSummary, setRequestSummary] = useState("");
  const [requestedScope, setRequestedScope] = useState("");
  const [confirmationPhrase, setConfirmationPhrase] = useState("");

  const destructiveRequest = useMemo(
    () => requestType === "account_deletion" || requestType === "consent_withdrawal",
    [requestType],
  );

  async function loadAll() {
    setLoading(true);
    setMessage("Loading preferences, active sessions, and privacy requests...");
    try {
      const [preferenceResponse, sessionResponse, requestResponse] = await Promise.all([
        apiJson<{ ok: boolean; preferences: Preferences }>("account/preferences", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; sessions: SessionRow[] }>("account/sessions", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; requests: PrivacyRequest[] }>("account/privacy-requests", { timeoutMs: 20000 }),
      ]);
      const next = { ...defaultPreferences, ...(preferenceResponse.preferences || {}) };
      setPreferences(next);
      setSessions(sessionResponse.sessions || []);
      setPrivacyRequests(requestResponse.requests || []);
      applyAccessibility(next);
      setMessage("Private account controls loaded.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401
        ? "Sign in with your verified account to manage settings, sessions, exports, and privacy requests."
        : "Account controls are not available yet. Migration 030 and the latest backend deployment may still be required.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  function setField<K extends keyof Preferences>(field: K, value: Preferences[K]) {
    const next = { ...preferences, [field]: value };
    setPreferences(next);
    if (["reduced_motion", "high_contrast", "larger_text", "simple_language"].includes(String(field))) {
      applyAccessibility(next);
    }
  }

  async function savePreferences(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("Saving account preferences...");
    try {
      const response = await apiJson<{ ok: boolean; preferences: Preferences }>("account/preferences", {
        method: "PUT",
        body: preferences,
        timeoutMs: 20000,
      });
      const next = { ...defaultPreferences, ...(response.preferences || {}) };
      setPreferences(next);
      applyAccessibility(next);
      setMessage("Preferences saved. External delivery remains controlled until its provider is activated and tested.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to save preferences: ${apiError?.message || "unknown error"}`);
    } finally {
      setSaving(false);
    }
  }

  async function revokeSession(sessionId: string, current: boolean) {
    const confirmed = window.confirm(current
      ? "Revoke this current session and sign out on this device?"
      : "Revoke this session? The other device will need to sign in again.");
    if (!confirmed) return;
    try {
      const response = await apiJson<{ ok: boolean; revoked: boolean; current_session_revoked: boolean }>("account/sessions/revoke", {
        method: "POST",
        body: { session_id: sessionId },
        timeoutMs: 20000,
      });
      if (response.current_session_revoked) {
        clearStoredAuthToken();
        window.location.href = "/login";
        return;
      }
      setMessage(response.revoked ? "Session revoked." : "The session was already inactive.");
      await loadAll();
    } catch (error) {
      setMessage(`Unable to revoke session: ${(error as ApiError)?.message || "unknown error"}`);
    }
  }

  async function revokeOthers() {
    if (!window.confirm("Revoke every other active MoveReady session and keep this device signed in?")) return;
    try {
      const response = await apiJson<{ ok: boolean; revoked_count: number }>("account/sessions/revoke-others", {
        method: "POST",
        body: {},
        timeoutMs: 20000,
      });
      setMessage(`${response.revoked_count || 0} other session(s) revoked.`);
      await loadAll();
    } catch (error) {
      setMessage(`Unable to revoke other sessions: ${(error as ApiError)?.message || "unknown error"}`);
    }
  }

  async function downloadExport() {
    setMessage("Preparing a safe JSON account export...");
    try {
      const response = await apiJson<Record<string, unknown>>("account/data-export", { timeoutMs: 60000 });
      const blob = new Blob([JSON.stringify(response, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `moveready-account-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setMessage("Account export prepared. Security hashes, OTPs, secrets, raw documents, and payment credentials were excluded.");
    } catch (error) {
      setMessage(`Unable to prepare export: ${(error as ApiError)?.message || "unknown error"}`);
    }
  }

  async function submitPrivacyRequest(event: FormEvent) {
    event.preventDefault();
    if (!requestSummary.trim()) {
      setMessage("Describe the privacy request before submitting it.");
      return;
    }
    try {
      const response = await apiJson<{ ok: boolean; request: PrivacyRequest }>("account/privacy-requests", {
        method: "POST",
        body: {
          request_type: requestType,
          request_summary: requestSummary,
          requested_scope: requestedScope,
          confirmation_phrase: confirmationPhrase,
          source_page: "/settings",
        },
        timeoutMs: 20000,
      });
      setRequestSummary("");
      setRequestedScope("");
      setConfirmationPhrase("");
      setMessage(`Privacy request ${response.request?.request_ref || "created"} received. No destructive action was performed automatically.`);
      await loadAll();
    } catch (error) {
      const apiError = error as ApiError;
      const requiredPhrase = apiError?.data?.required_phrase;
      setMessage(requiredPhrase
        ? `Use the exact confirmation phrase: ${requiredPhrase}`
        : `Unable to create privacy request: ${apiError?.message || "unknown error"}`);
    }
  }

  async function cancelPrivacyRequest(requestRef: string) {
    if (!window.confirm(`Cancel privacy request ${requestRef}?`)) return;
    try {
      await apiJson(`account/privacy-requests/${encodeURIComponent(requestRef)}/cancel`, {
        method: "POST",
        body: {},
        timeoutMs: 20000,
      });
      setMessage(`Privacy request ${requestRef} cancelled.`);
      await loadAll();
    } catch (error) {
      setMessage(`Unable to cancel request: ${(error as ApiError)?.message || "unknown error"}`);
    }
  }

  const toggleFields: Array<[keyof Preferences, string, string]> = [
    ["in_app_notifications_enabled", "In-app notifications", "Show private alerts inside the verified account."],
    ["email_notifications_enabled", "Email notifications", "Record your preference now; delivery remains inactive until the provider is approved."],
    ["whatsapp_notifications_enabled", "WhatsApp notifications", "Record opt-in preference only; templates and delivery remain inactive."],
    ["marketing_messages_enabled", "Product and marketing messages", "Optional and disabled by default."],
    ["source_change_alerts_enabled", "Official-source changes", "Alert when a watched official source needs review."],
    ["application_deadline_alerts_enabled", "Application deadlines", "Alert for case deadlines, appointments, and document requests."],
    ["document_expiry_alerts_enabled", "Document expiry", "Alert when document metadata indicates expiry or renewal risk."],
    ["opportunity_alerts_enabled", "Opportunities", "Alert for watched scholarships, ballots, quotas, or invitation windows."],
  ];

  const accessibilityFields: Array<[keyof Preferences, string, string]> = [
    ["reduced_motion", "Reduce motion", "Minimize non-essential animation and transitions."],
    ["high_contrast", "Higher contrast", "Increase text, border, and focus contrast."],
    ["larger_text", "Larger text", "Increase the base reading size across MoveReady."],
    ["simple_language", "Simpler guidance", "Prefer plain-language summaries where the interface supports them."],
  ];

  return (
    <div className="result-stack">
      <article className="result-block featured">
        <div className="panel-heading">
          <div>
            <p className="overline">Verified account controls</p>
            <h2>Settings, consent, accessibility, security, and privacy</h2>
          </div>
          <span className="status-dot">Private</span>
        </div>
        <p>{message}</p>
        <div className="actions">
          <button className="btn" type="button" onClick={loadAll} disabled={loading}>{loading ? "Loading..." : "Refresh"}</button>
          <a className="btn" href="/activity">Open activity history</a>
          <a className="btn" href="/onboarding">Open guided setup</a>
        </div>
      </article>

      <form className="result-block" onSubmit={savePreferences}>
        <p className="overline">General preferences</p>
        <h2>Localize your account</h2>
        <div className="form-grid">
          <label>
            Preferred language
            <select value={preferences.preferred_language} onChange={(event) => setField("preferred_language", event.target.value)}>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="pt">Portuguese</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="ar">Arabic</option>
              <option value="yo">Yoruba</option>
              <option value="ig">Igbo</option>
              <option value="ha">Hausa</option>
              <option value="pcm">Nigerian Pidgin</option>
            </select>
          </label>
          <label>
            Preferred currency
            <input value={preferences.preferred_currency} maxLength={12} onChange={(event) => setField("preferred_currency", event.target.value.toUpperCase())} />
          </label>
          <label>
            Time zone
            <input value={preferences.timezone} maxLength={120} placeholder="Africa/Lagos or Asia/Kuwait" onChange={(event) => setField("timezone", event.target.value)} />
          </label>
          <label>
            Date format
            <select value={preferences.date_format} onChange={(event) => setField("date_format", event.target.value)}>
              <option value="day_month_year">Day / month / year</option>
              <option value="month_day_year">Month / day / year</option>
              <option value="year_month_day">Year / month / day</option>
            </select>
          </label>
          <label>
            Default reminder lead days
            <input type="number" min={0} max={90} value={preferences.reminder_lead_days} onChange={(event) => setField("reminder_lead_days", Number(event.target.value))} />
          </label>
        </div>
        <div className="actions">
          <button className="btn primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save preferences"}</button>
        </div>
      </form>

      <article className="result-block">
        <p className="overline">Notification consent</p>
        <h2>Choose what MoveReady may alert you about</h2>
        <p>External email and WhatsApp delivery remain unavailable until their credentials, templates, opt-in, unsubscribe, audit, and production tests pass.</p>
        <div className="mini-list">
          {toggleFields.map(([field, title, detail]) => (
            <label key={String(field)} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <input type="checkbox" checked={Boolean(preferences[field])} onChange={(event) => setField(field, event.target.checked as never)} />
              <span><strong>{title}</strong><br />{detail}</span>
            </label>
          ))}
        </div>
      </article>

      <article className="result-block">
        <p className="overline">Accessibility</p>
        <h2>Adjust reading and motion</h2>
        <div className="mini-list">
          {accessibilityFields.map(([field, title, detail]) => (
            <label key={String(field)} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <input type="checkbox" checked={Boolean(preferences[field])} onChange={(event) => setField(field, event.target.checked as never)} />
              <span><strong>{title}</strong><br />{detail}</span>
            </label>
          ))}
        </div>
        <div className="actions">
          <button className="btn primary" type="button" onClick={(event) => void savePreferences(event as unknown as FormEvent)} disabled={saving}>Save accessibility choices</button>
        </div>
      </article>

      <article className="result-block" id="security">
        <div className="panel-heading">
          <div>
            <p className="overline">Security</p>
            <h2>Active account sessions</h2>
          </div>
          <button className="btn" type="button" onClick={revokeOthers}>Revoke other sessions</button>
        </div>
        <div className="mini-list">
          {sessions.length === 0 && <div><strong>No active sessions loaded</strong><span>Sign in or refresh after migration and deployment.</span></div>}
          {sessions.map((session) => (
            <div key={session.id}>
              <strong>{session.current ? "Current device" : "Other active device"}</strong>
              <span>{session.device}<br />Last active: {formatDate(session.last_seen_at)} · Expires: {formatDate(session.expires_at)}</span>
              <button className="btn" type="button" onClick={() => revokeSession(session.id, session.current)}>Revoke</button>
            </div>
          ))}
        </div>
      </article>

      <article className="result-block" id="privacy">
        <p className="overline">Data access</p>
        <h2>Export your account data</h2>
        <p>The immediate JSON export excludes OTPs, session hashes, administrator secrets, payment credentials, raw documents, passwords, and private keys.</p>
        <div className="actions">
          <button className="btn primary" type="button" onClick={downloadExport}>Download JSON export</button>
        </div>
      </article>

      <form className="result-block" onSubmit={submitPrivacyRequest}>
        <p className="overline">Privacy request</p>
        <h2>Request access, correction, restriction, consent withdrawal, or deletion</h2>
        <div className="form-grid">
          <label>
            Request type
            <select value={requestType} onChange={(event) => setRequestType(event.target.value)}>
              <option value="data_export">Reviewed data access/export</option>
              <option value="correction">Correct personal information</option>
              <option value="restriction">Restrict processing</option>
              <option value="consent_withdrawal">Withdraw consent</option>
              <option value="account_deletion">Delete account</option>
              <option value="other">Other privacy request</option>
            </select>
          </label>
          <label>
            Requested scope
            <input value={requestedScope} maxLength={1500} placeholder="Specific records, dates, or account areas" onChange={(event) => setRequestedScope(event.target.value)} />
          </label>
          <label className="full-span">
            Request summary
            <textarea required rows={5} value={requestSummary} maxLength={1500} onChange={(event) => setRequestSummary(event.target.value)} />
          </label>
          {destructiveRequest && (
            <label className="full-span">
              Exact confirmation phrase
              <input value={confirmationPhrase} placeholder="DELETE MY MOVEREADY ACCOUNT" onChange={(event) => setConfirmationPhrase(event.target.value)} />
              <small>This confirms the request only. It does not perform instant deletion.</small>
            </label>
          )}
        </div>
        <div className="actions">
          <button className="btn primary" type="submit">Submit privacy request</button>
        </div>
      </form>

      <article className="result-block">
        <p className="overline">Request history</p>
        <h2>Your privacy requests</h2>
        <div className="mini-list">
          {privacyRequests.length === 0 && <div><strong>No requests yet</strong><span>Your verified privacy-request history will appear here.</span></div>}
          {privacyRequests.map((item) => (
            <div key={item.request_ref}>
              <strong>{item.request_ref} · {item.request_type.replaceAll("_", " ")}</strong>
              <span>Status: {item.status} · Priority: {item.priority}<br />{item.request_summary}<br />Created: {formatDate(item.created_at)}</span>
              {["received", "identity_verification_required", "reviewing"].includes(item.status) && (
                <button className="btn" type="button" onClick={() => cancelPrivacyRequest(item.request_ref)}>Cancel request</button>
              )}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
