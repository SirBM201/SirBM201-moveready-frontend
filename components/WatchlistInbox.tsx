"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type ReviewState = {
  last_verified_at?: string | null;
  next_review_due_at?: string | null;
  review_due?: boolean;
  verification_age_days?: number | null;
  source_stale?: boolean;
};


type InboxAlert = {
  id: string;
  subscription_id?: string;
  alert_types?: string[];
  severity?: string;
  title?: string;
  message?: string;
  watch_title?: string;
  opportunity_code?: string;
  opportunity_name?: string;
  country_name?: string;
  availability_status?: string;
  official_url?: string;
  result_check_url?: string;
  source_confidence?: string;
  review_state?: ReviewState;
  preferred_channel?: string;
  delivery_channel?: string;
  delivery_status?: string;
  safety_note?: string;
};


type MonitoredItem = {
  subscription?: {
    id?: string;
    watch_type?: string;
    watch_code?: string;
    watch_title?: string;
    preferred_channel?: string;
    target_country?: string;
    route_or_goal?: string;
    alert_types?: string[];
    status?: string;
    created_at?: string;
  };
  match_status?: string;
  match_score?: number;
  opportunity?: {
    opportunity_code?: string;
    opportunity_name?: string;
    country_name?: string;
    availability_status?: string;
    official_url?: string;
    source_confidence?: string;
  } | null;
};


type InboxResponse = {
  ok: boolean;
  account_email?: string;
  subscription_count?: number;
  alert_count?: number;
  alerts?: InboxAlert[];
  monitored_items?: MonitoredItem[];
  delivery_status?: Record<string, string>;
  generated_at?: string;
  safety_note?: string;
};


function readable(value: unknown) {
  return String(value || "not available").replace(/_/g, " ");
}


function formatDate(value?: string | null) {
  if (!value) return "Not recorded";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}


function requestedAlerts(item: MonitoredItem) {
  const values = item.subscription?.alert_types || [];
  return values.length ? values.map(readable).join(", ") : "Default alerts";
}


export default function WatchlistInbox() {
  const [inbox, setInbox] = useState<InboxResponse | null>(null);
  const [message, setMessage] = useState("Checking your verified account for in-app alerts...");
  const [loading, setLoading] = useState(false);

  async function loadInbox(silent = false) {
    if (!silent) {
      setLoading(true);
      setMessage("Refreshing in-app alerts from stored source records...");
    }

    try {
      const data = await apiJson<InboxResponse>("watchlist/inbox", { timeoutMs: 20000 });
      setInbox(data);
      setMessage(
        data.alert_count
          ? `${data.alert_count} current in-app alert${data.alert_count === 1 ? "" : "s"} loaded.`
          : data.subscription_count
            ? "Your watches are active. No matching alert event is currently stored."
            : "No active watchlist subscriptions are connected to this account yet.",
      );
    } catch (error) {
      const apiError = error as ApiError;
      setInbox(null);
      setMessage(
        apiError?.status === 401
          ? "Sign in to load private in-app alerts connected to your verified account."
          : apiError?.message || "The in-app alert inbox could not be loaded.",
      );
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    loadInbox(true);
  }, []);

  const alerts = inbox?.alerts || [];
  const monitoredItems = inbox?.monitored_items || [];

  return (
    <div className="live-workspace reports-workspace" id="alert-inbox">
      <section className="workflow-panel live-form">
        <div className="panel-heading">
          <div>
            <p className="overline">Verified account inbox</p>
            <h2>Current watchlist alerts</h2>
          </div>
          <span className="status-dot">{inbox?.account_email ? "Verified" : "Sign in"}</span>
        </div>
        <p className="section-intro">
          MoveReady compares active account watches with stored public opportunity records. The inbox does not scrape or claim a live government result; every alert points users back to the official source.
        </p>
        {inbox?.account_email ? <p className="form-status">Signed in as {inbox.account_email}</p> : null}
        <div className="badge-row">
          <span className="badge">Subscriptions: {inbox?.subscription_count || 0}</span>
          <span className="badge">Current alerts: {inbox?.alert_count || 0}</span>
          <span className="badge">In-app: {readable(inbox?.delivery_status?.in_app || "available")}</span>
          <span className="badge">Email: {readable(inbox?.delivery_status?.email || "not enabled")}</span>
          <span className="badge">WhatsApp: {readable(inbox?.delivery_status?.whatsapp || "not enabled")}</span>
        </div>
        <div className="actions">
          <button className="btn primary" type="button" onClick={() => loadInbox(false)} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh alert inbox"}
          </button>
          <a className="btn" href="#create-alert">Create another alert</a>
          <a className="btn" href="/opportunities">Browse opportunities</a>
          <a className="btn" href="/dashboard">Back to Account</a>
        </div>
        <p className="form-status">{message}</p>
      </section>

      <section className="result-panel">
        {alerts.length ? (
          <div className="result-stack">
            {alerts.map((alert) => (
              <article className={alert.severity === "high" ? "result-block featured" : "result-block"} key={alert.id}>
                <div className="panel-heading">
                  <div>
                    <p className="overline">{alert.country_name || "Opportunity alert"}</p>
                    <h2>{alert.title || "Watchlist update"}</h2>
                  </div>
                  <span className="status-dot">{readable(alert.severity)}</span>
                </div>
                <p><strong>{alert.opportunity_name || alert.watch_title || "Watched item"}</strong></p>
                <p>{alert.message}</p>
                <div className="badge-row">
                  {alert.opportunity_code ? <span className="badge">Code: {alert.opportunity_code}</span> : null}
                  <span className="badge">Status: {readable(alert.availability_status)}</span>
                  <span className="badge">Source confidence: {readable(alert.source_confidence)}</span>
                  <span className="badge">Requested channel: {readable(alert.preferred_channel)}</span>
                  <span className="badge">Delivered: in app</span>
                </div>
                <div className="mini-list" style={{ marginTop: 14 }}>
                  <div><strong>Last verified</strong><span>{formatDate(alert.review_state?.last_verified_at)}</span></div>
                  <div><strong>Next source review</strong><span>{formatDate(alert.review_state?.next_review_due_at)}</span></div>
                  <div><strong>Source review status</strong><span>{alert.review_state?.source_stale ? "Stored source is stale or missing a recent verification date" : alert.review_state?.review_due ? "Source review is due" : "Stored source review is not currently overdue"}</span></div>
                  <div><strong>Alert types</strong><span>{(alert.alert_types || []).map(readable).join(", ")}</span></div>
                </div>
                <p className="form-status">{alert.safety_note}</p>
                <div className="actions">
                  {alert.official_url ? <a className="btn primary" href={alert.official_url} target="_blank" rel="noreferrer">Open official source</a> : null}
                  {alert.result_check_url ? <a className="btn" href={alert.result_check_url} target="_blank" rel="noreferrer">Open official result check</a> : null}
                  <a className="btn" href={`/opportunities${alert.opportunity_code ? `?q=${encodeURIComponent(alert.opportunity_code)}` : ""}`}>Open MoveReady opportunity</a>
                </div>
              </article>
            ))}
          </div>
        ) : monitoredItems.length ? (
          <article className="result-block featured">
            <p className="overline">Monitoring active</p>
            <h2>No matching alert event is currently stored.</h2>
            <p>Your active watches are listed below. A missing database match does not mean the route is closed; it means MoveReady has not linked that watch to a reviewed public opportunity record yet.</p>
          </article>
        ) : (
          <article className="result-block featured">
            <p className="overline">No active watches</p>
            <h2>Create an alert for a route, country, scholarship, opportunity, or service.</h2>
            <p>After saving it under a verified account, return here to see current in-app source reminders.</p>
          </article>
        )}

        {monitoredItems.length ? (
          <article className="result-block soft" style={{ marginTop: 16 }}>
            <div className="panel-heading">
              <div>
                <p className="overline">Active watchlist</p>
                <h2>What MoveReady is monitoring</h2>
              </div>
              <span className="status-dot">{monitoredItems.length}</span>
            </div>
            <div className="mini-list">
              {monitoredItems.map((item, index) => (
                <div key={item.subscription?.id || index}>
                  <strong>{item.subscription?.watch_title || item.subscription?.watch_code || `Watch ${index + 1}`}</strong>
                  <span>
                    Type: {readable(item.subscription?.watch_type)} · Match: {readable(item.match_status)} · Requested alerts: {requestedAlerts(item)} · Preferred channel: {readable(item.subscription?.preferred_channel)}
                    {item.opportunity?.opportunity_name ? ` · Matched to ${item.opportunity.opportunity_name}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ) : null}

        {inbox?.safety_note ? <p className="form-status">{inbox.safety_note}</p> : null}
      </section>
    </div>
  );
}
