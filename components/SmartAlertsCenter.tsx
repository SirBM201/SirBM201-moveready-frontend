"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type Priority = "low" | "medium" | "high" | "critical";

type SmartPreferences = {
  jobs_enabled: boolean;
  application_followups_enabled: boolean;
  language_reminders_enabled: boolean;
  evidence_refresh_enabled: boolean;
  critical_only: boolean;
  document_expiry_lead_days: number;
  language_inactive_days: number;
  evidence_refresh_days: number;
};

type AlertPreferences = {
  in_app_notifications_enabled: boolean;
  source_change_alerts_enabled: boolean;
  application_deadline_alerts_enabled: boolean;
  document_expiry_alerts_enabled: boolean;
  opportunity_alerts_enabled: boolean;
  smart_alert_preferences: SmartPreferences;
};

type SmartAlert = {
  key: string;
  category: string;
  source: string;
  priority: Priority;
  title: string;
  summary: string;
  href: string;
  due_at?: string | null;
  detected_at?: string | null;
  official_url?: string | null;
  metadata?: Record<string, unknown>;
};

type SmartAlertsResponse = {
  ok: boolean;
  contract_version?: string;
  alert_count?: number;
  candidate_count?: number;
  suppressed_count?: number;
  counts_by_priority?: Record<string, number>;
  counts_by_category?: Record<string, number>;
  primary_alert?: SmartAlert | null;
  alerts?: SmartAlert[];
  preferences?: AlertPreferences;
  daily_digest?: {
    mode: "private_in_app";
    schedule_time: string;
    timezone: string;
    generated_at: string;
    refresh_available: boolean;
    external_delivery_enabled: boolean;
    summary: { total: number; critical: number; high: number };
  };
  delivery_status?: Record<string, string>;
  partial_errors?: Record<string, string>;
  empty_state?: string | null;
  safety_note?: string;
};

const defaultSmartPreferences: SmartPreferences = {
  jobs_enabled: true,
  application_followups_enabled: true,
  language_reminders_enabled: false,
  evidence_refresh_enabled: true,
  critical_only: false,
  document_expiry_lead_days: 180,
  language_inactive_days: 7,
  evidence_refresh_days: 30,
};

const defaultPreferences: AlertPreferences = {
  in_app_notifications_enabled: true,
  source_change_alerts_enabled: true,
  application_deadline_alerts_enabled: true,
  document_expiry_alerts_enabled: true,
  opportunity_alerts_enabled: false,
  smart_alert_preferences: defaultSmartPreferences,
};

const categoryLabels: Record<string, string> = {
  jobs: "Jobs",
  applications: "Applications",
  document_expiry: "Documents",
  verified_rule_changes: "Verified changes",
  language: "Language",
  evidence_refresh: "Evidence refresh",
};

function readable(value?: string) {
  return String(value || "not available").replaceAll("_", " ");
}

function formatDate(value?: string | null) {
  if (!value) return "No fixed due date";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(parsed);
}

function safeInternalHref(value?: string) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/alerts";
}

function safeOfficialUrl(value?: string | null) {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return ["https:", "http:"].includes(parsed.protocol) ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function withPreferenceDefaults(value?: Partial<AlertPreferences>): AlertPreferences {
  return {
    ...defaultPreferences,
    ...(value || {}),
    smart_alert_preferences: {
      ...defaultSmartPreferences,
      ...(value?.smart_alert_preferences || {}),
    },
  };
}

function AlertCard({ item, primary = false }: { item: SmartAlert; primary?: boolean }) {
  const officialUrl = safeOfficialUrl(item.official_url);
  return (
    <article className={primary ? "result-block featured" : "result-block"}>
      <div className="panel-heading">
        <div>
          <p className="overline">{primary ? "Do this first · " : ""}{categoryLabels[item.category] || readable(item.category)}</p>
          <h2>{item.title}</h2>
        </div>
        <span className="status-dot">{readable(item.priority)}</span>
      </div>
      <p>{item.summary}</p>
      <div className="mini-list">
        <div><strong>Due</strong><span>{formatDate(item.due_at)}</span></div>
        <div><strong>Signal source</strong><span>{readable(item.source)}</span></div>
        <div><strong>Detected</strong><span>{item.detected_at ? formatDate(item.detected_at) : "Derived from current stored metadata"}</span></div>
      </div>
      <div className="actions">
        <a className="btn primary" href={safeInternalHref(item.href)}>Open the controlled workspace</a>
        {officialUrl ? <a className="btn" href={officialUrl} target="_blank" rel="noreferrer">Verify official source</a> : null}
      </div>
    </article>
  );
}

export default function SmartAlertsCenter() {
  const [data, setData] = useState<SmartAlertsResponse | null>(null);
  const [preferences, setPreferences] = useState<AlertPreferences>(defaultPreferences);
  const [state, setState] = useState<"loading" | "ready" | "signed_out" | "older_contract" | "error">("loading");
  const [message, setMessage] = useState("Consolidating your launch-critical alert signals...");
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState("all");
  const [priority, setPriority] = useState("all");

  async function load(showLoading = true) {
    if (showLoading) {
      setState("loading");
      setMessage("Consolidating your launch-critical alert signals...");
    }
    try {
      const response = await apiJson<SmartAlertsResponse>("account/smart-alerts", { timeoutMs: 40000 });
      if (response.contract_version !== "b14-v1") {
        setData(null);
        setState("older_contract");
        setMessage("The alert center is waiting for the B14 backend deployment. An older response will not be treated as current.");
        return;
      }
      setData(response);
      setPreferences(withPreferenceDefaults(response.preferences));
      setState("ready");
      const unavailable = Object.keys(response.partial_errors || {}).length;
      setMessage(unavailable
        ? `${unavailable} private source(s) are temporarily unavailable. Available alerts remain read-only and no deadline was guessed.`
        : response.alert_count
          ? `${response.alert_count} enabled alert${response.alert_count === 1 ? "" : "s"} ranked by urgency and due date.`
          : response.empty_state || "No enabled launch-critical alert currently needs action.");
    } catch (error) {
      const apiError = error as ApiError;
      setData(null);
      if (apiError?.status === 401) {
        setState("signed_out");
        setMessage("Sign in with your verified MoveReady account to load private alerts.");
      } else {
        setState("error");
        setMessage("The private alert center is unavailable. Your underlying records and preferences were not changed.");
      }
    }
  }

  useEffect(() => {
    void load(false);
  }, []);

  const filtered = useMemo(() => (data?.alerts || []).filter((item) => (
    (category === "all" || item.category === category)
    && (priority === "all" || item.priority === priority)
  )), [data, category, priority]);

  function setSmart<K extends keyof SmartPreferences>(field: K, value: SmartPreferences[K]) {
    setPreferences((current) => ({
      ...current,
      smart_alert_preferences: { ...current.smart_alert_preferences, [field]: value },
    }));
  }

  async function savePreferences() {
    setSaving(true);
    setMessage("Saving B14 alert preferences...");
    try {
      await apiJson("account/preferences", {
        method: "PUT",
        body: preferences,
        timeoutMs: 20000,
      });
      await load(false);
      setMessage("Alert preferences saved. External email, WhatsApp, SMS, Telegram and push delivery remain disabled.");
    } catch (error) {
      setMessage(`Unable to save alert preferences: ${(error as ApiError)?.message || "unknown error"}`);
    } finally {
      setSaving(false);
    }
  }

  const primary = data?.primary_alert;
  const remaining = filtered.filter((item) => item.key !== primary?.key);
  const categories = Object.keys(data?.counts_by_category || {});

  return (
    <div className="result-stack" aria-busy={state === "loading" || saving}>
      <article className="result-block featured">
        <div className="panel-heading">
          <div>
            <p className="overline">B14 · Private alert center</p>
            <h2>One inbox for the changes that need action</h2>
          </div>
          <span className="status-dot">{state === "ready" ? "B14 connected" : readable(state)}</span>
        </div>
        <p aria-live="polite" role={state === "error" ? "alert" : undefined}>{message}</p>
        <div className="badge-row">
          {(["critical", "high", "medium", "low"] as Priority[]).map((item) => (
            <span className="badge" key={item}>{readable(item)}: {data?.counts_by_priority?.[item] || 0}</span>
          ))}
          <span className="badge">Suppressed by preferences: {data?.suppressed_count || 0}</span>
        </div>
        <div className="mini-list" aria-label="Daily alert delivery status">
          <div><strong>Private in-app digest</strong><span>{data?.daily_digest ? `${data.daily_digest.schedule_time} ${data.daily_digest.timezone}` : "07:07 UTC"}</span></div>
          <div><strong>Last consolidated</strong><span>{data?.daily_digest?.generated_at ? formatDate(data.daily_digest.generated_at) : "Refresh to consolidate now"}</span></div>
          <div><strong>External delivery</strong><span>External delivery remains disabled until consent and audited delivery controls are active.</span></div>
        </div>
        <div className="actions">
          <button className="btn primary" type="button" onClick={() => void load()} disabled={state === "loading"}>Refresh alerts</button>
          {state === "signed_out" ? <a className="btn" href="/login?next=/alerts">Sign in</a> : null}
          <a className="btn" href="/settings">Account settings</a>
          <a className="btn" href="/watchlist">Manage watches</a>
          <a className="btn" href="/application-alerts">Application alert history</a>
        </div>
      </article>

      {state === "ready" && primary ? <AlertCard item={primary} primary /> : null}

      {state === "ready" ? (
        <article className="result-block">
          <div className="panel-heading">
            <div><p className="overline">Filter without changing preferences</p><h2>All other enabled alerts</h2></div>
            <span className="status-dot">{remaining.length}</span>
          </div>
          <div className="form-grid">
            <label>
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">All categories</option>
                {categories.map((item) => <option value={item} key={item}>{categoryLabels[item] || readable(item)}</option>)}
              </select>
            </label>
            <label>
              Priority
              <select value={priority} onChange={(event) => setPriority(event.target.value)}>
                <option value="all">All priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>
        </article>
      ) : null}

      {state === "ready" ? remaining.map((item) => <AlertCard item={item} key={item.key} />) : null}

      {state === "ready" && !primary ? (
        <article className="result-block soft">
          <h2>No enabled alert needs action</h2>
          <p>{data?.empty_state || "MoveReady found no current alert under your enabled categories and thresholds."}</p>
        </article>
      ) : null}

      {state !== "ready" && state !== "loading" ? (
        <article className="result-block soft">
          <h2>Private alert center not ready</h2>
          <p>{message}</p>
          <div className="actions">
            {state === "signed_out" ? <a className="btn primary" href="/login?next=/alerts">Sign in</a> : null}
            <button className="btn" type="button" onClick={() => void load()}>Try again</button>
          </div>
        </article>
      ) : null}

      {state === "ready" ? (
        <details className="result-block" id="alert-preferences">
          <summary><strong>Choose alert categories and timing</strong></summary>
          <p>These controls affect the private in-app inbox only. Language reminders are off by default to prevent noise.</p>
          <div className="mini-list">
            {([
              ["jobs_enabled", "Jobs", "Official-source job changes and private job follow-ups."],
              ["application_followups_enabled", "Application follow-ups", "Stored case deadlines, appointments and follow-ups."],
              ["evidence_refresh_enabled", "Evidence refresh", "Metadata-only packs that are stale or need rechecking."],
              ["language_reminders_enabled", "Language reminders", "Optional practice and review reminders."],
              ["critical_only", "Critical only", "Suppress high, medium and low alerts from this inbox."],
            ] as Array<[keyof SmartPreferences, string, string]>).map(([field, title, detail]) => (
              <label key={field} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <input
                  type="checkbox"
                  checked={Boolean(preferences.smart_alert_preferences[field])}
                  onChange={(event) => setSmart(field, event.target.checked as never)}
                />
                <span><strong>{title}</strong><br />{detail}</span>
              </label>
            ))}
          </div>
          <div className="form-grid" style={{ marginTop: 16 }}>
            <label>Document expiry lead days<input type="number" min={30} max={365} value={preferences.smart_alert_preferences.document_expiry_lead_days} onChange={(event) => setSmart("document_expiry_lead_days", Number(event.target.value))} /></label>
            <label>Language inactive days<input type="number" min={1} max={30} value={preferences.smart_alert_preferences.language_inactive_days} onChange={(event) => setSmart("language_inactive_days", Number(event.target.value))} /></label>
            <label>Evidence refresh days<input type="number" min={7} max={180} value={preferences.smart_alert_preferences.evidence_refresh_days} onChange={(event) => setSmart("evidence_refresh_days", Number(event.target.value))} /></label>
          </div>
          <div className="actions">
            <button className="btn primary" type="button" disabled={saving} onClick={() => void savePreferences()}>{saving ? "Saving..." : "Save alert preferences"}</button>
            <a className="btn" href="/settings">Manage source, opportunity and document consent</a>
          </div>
        </details>
      ) : null}

      {state === "ready" ? (
        <details className="result-block soft">
          <summary><strong>Read delivery and decision boundaries</strong></summary>
          <div className="mini-list">
            {Object.entries(data?.delivery_status || {}).map(([channel, status]) => <div key={channel}><strong>{readable(channel)}</strong><span>{readable(status)}</span></div>)}
          </div>
          <p>{data?.safety_note}</p>
        </details>
      ) : null}
    </div>
  );
}
