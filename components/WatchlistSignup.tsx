"use client";

import { FormEvent, useEffect, useState } from "react";

import { apiJson } from "@/lib/api";

const alertOptions = [
  ["opens", "Application opens"],
  ["closing_soon", "Closing soon"],
  ["results_open", "Results/check status opens"],
  ["eligibility_change", "Eligibility changes"],
  ["document_change", "Document requirement changes"],
  ["funds_change", "Proof-of-funds changes"],
  ["fee_change", "Fee changes"],
  ["review_due", "Source review due"],
];

const watchTypes = [
  ["opportunity", "Official opportunity"],
  ["route", "Visa or relocation route"],
  ["scholarship", "Scholarship"],
  ["country", "Country"],
  ["service", "Service"],
];

type WatchlistSubscription = {
  id: string;
  watch_type: string;
  watch_code?: string | null;
  watch_title?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  preferred_channel?: string;
  current_country?: string | null;
  target_country?: string | null;
  route_or_goal?: string | null;
  alert_types?: string[];
  consent_to_contact?: boolean;
  status?: string;
  source_page?: string | null;
  created_at?: string;
};

type AccountSummary = {
  ok: boolean;
  session?: { email?: string };
  sections?: {
    watchlist?: {
      rows?: WatchlistSubscription[];
      count?: number;
    };
  };
};

function currentSourcePage() {
  try {
    return typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/watchlist";
  } catch {
    return "/watchlist";
  }
}

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function titleFor(item: WatchlistSubscription) {
  return item.watch_title || item.watch_code || item.route_or_goal || "Watchlist subscription";
}

function alertLabel(code: string) {
  return alertOptions.find(([value]) => value === code)?.[1] || code;
}

export default function WatchlistSignup() {
  const [status, setStatus] = useState("Loading verified watchlist subscriptions if you are signed in...");
  const [submitting, setSubmitting] = useState(false);
  const [routeHint, setRouteHint] = useState("");
  const [watchType, setWatchType] = useState("opportunity");
  const [accountEmail, setAccountEmail] = useState("");
  const [subscriptions, setSubscriptions] = useState<WatchlistSubscription[]>([]);

  async function loadVerifiedWatchlist(silent = false) {
    if (!silent) {
      setSubmitting(true);
      setStatus("Loading watchlist from your verified account...");
    }
    try {
      const data = await apiJson<AccountSummary>("account/summary", { timeoutMs: 15000 });
      const rows = data.sections?.watchlist?.rows || [];
      setSubscriptions(rows);
      setAccountEmail(data.session?.email || "");
      setStatus(rows.length ? "Verified account watchlist loaded." : "No active watchlist subscriptions are connected to this verified account yet.");
    } catch {
      setStatus(silent ? "Choose what to monitor and submit your opt-in details." : "Sign in first, or save a watchlist subscription with email or phone.");
    } finally {
      if (!silent) setSubmitting(false);
    }
  }

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const route = params.get("route") || params.get("watch") || "";
      const type = params.get("type") || "";
      if (route) setRouteHint(route);
      if (["route", "opportunity", "scholarship", "country", "service"].includes(type)) setWatchType(type);
    } catch {
      // ignore URL parsing issues
    }
    loadVerifiedWatchlist(true);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const alertTypes = alertOptions.map(([code]) => code).filter((code) => data.get(code) === "on");
    const email = String(data.get("email") || "").trim() || accountEmail;

    const payload = {
      watch_type: String(data.get("watch_type") || "opportunity"),
      watch_code: String(data.get("watch_code") || "").trim(),
      watch_title: String(data.get("watch_title") || "").trim(),
      full_name: String(data.get("full_name") || "").trim(),
      email,
      phone: String(data.get("phone") || "").trim(),
      preferred_channel: String(data.get("preferred_channel") || "email"),
      current_country: String(data.get("current_country") || "").trim(),
      target_country: String(data.get("target_country") || "").trim(),
      route_or_goal: String(data.get("route_or_goal") || "").trim(),
      alert_types: alertTypes,
      consent_to_contact: data.get("consent_to_contact") === "on",
      source_page: currentSourcePage(),
    };

    if (!payload.email && !payload.phone) {
      setStatus("Enter an email or WhatsApp/phone number, or sign in with email OTP first.");
      return;
    }
    if (!payload.consent_to_contact) {
      setStatus("Confirm opt-in consent before submitting.");
      return;
    }

    setSubmitting(true);
    setStatus("Saving watchlist subscription...");
    try {
      const response = await apiJson<{ ok: boolean; stored?: boolean; subscription?: WatchlistSubscription }>("watchlist/subscriptions", {
        method: "POST",
        body: payload,
        timeoutMs: 15000,
        useAuthToken: false,
      });
      if (response.subscription) {
        setSubscriptions((current) => [response.subscription as WatchlistSubscription, ...current.filter((item) => item.id !== response.subscription?.id)]);
      } else {
        await loadVerifiedWatchlist(true);
      }
      setStatus(response.stored === false ? "Subscription received, but storage is not active yet." : accountEmail ? "Watchlist subscription saved to your verified account." : "Watchlist subscription saved.");
      form.reset();
      setRouteHint("");
      setWatchType("opportunity");
    } catch {
      setStatus("Unable to save subscription. Confirm SQL 007 has been run and backend redeployed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="live-workspace">
      <form className="workflow-panel live-form" onSubmit={handleSubmit}>
        <div className="panel-heading">
          <div>
            <span className="overline">Opt-in alerts</span>
            <h2>Follow a route, opportunity, or service</h2>
          </div>
          <span className="status-dot">{accountEmail ? "Verified" : "Available"}</span>
        </div>
        <p>MoveReady stores your alert preference now. Actual WhatsApp, email, or Telegram sending should only be activated after provider setup and template approval.</p>
        {accountEmail ? <p className="form-status">Signed in as {accountEmail}. New watchlist subscriptions will be connected to this verified account.</p> : null}

        <div className="form-grid two-col">
          <div className="field">
            <label htmlFor="watch_type">Watch type</label>
            <select id="watch_type" name="watch_type" value={watchType} onChange={(event) => setWatchType(event.target.value)}>
              {watchTypes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="watch_code">Code</label>
            <input id="watch_code" name="watch_code" value={routeHint} onChange={(event) => setRouteHint(event.target.value)} placeholder="Example: US-DV, EE/startup-founder" />
          </div>
          <div className="field">
            <label htmlFor="watch_title">Title</label>
            <input id="watch_title" name="watch_title" placeholder="Example: USA Diversity Visa, Estonia startup route" />
          </div>
          <div className="field">
            <label htmlFor="preferred_channel">Preferred channel</label>
            <select id="preferred_channel" name="preferred_channel" defaultValue="email">
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="telegram">Telegram</option>
              <option value="phone">Phone</option>
              <option value="in_app">In-app</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="full_name">Full name</label>
            <input id="full_name" name="full_name" placeholder="Your name" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder={accountEmail || "you@example.com"} />
          </div>
          <div className="field">
            <label htmlFor="phone">WhatsApp / phone</label>
            <input id="phone" name="phone" placeholder="+965 ..." />
          </div>
          <div className="field">
            <label htmlFor="current_country">Current country</label>
            <input id="current_country" name="current_country" placeholder="Example: Kuwait" />
          </div>
          <div className="field">
            <label htmlFor="target_country">Target country</label>
            <input id="target_country" name="target_country" placeholder="Example: United States, Canada, Estonia" />
          </div>
          <div className="field">
            <label htmlFor="route_or_goal">Route or goal</label>
            <input id="route_or_goal" name="route_or_goal" placeholder="Example: DV lottery, IEC pool, startup route" />
          </div>
        </div>

        <div className="field">
          <label>Alert types</label>
          <div className="check-grid">
            {alertOptions.map(([code, label]) => (
              <label className="checkbox-field" key={code}>
                <input type="checkbox" name={code} defaultChecked={["opens", "closing_soon", "eligibility_change"].includes(code)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="checkbox-field">
          <input type="checkbox" name="consent_to_contact" />
          <span>I agree that MoveReady may contact me about this watchlist subscription.</span>
        </label>

        <button className="btn primary full" type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save watchlist"}</button>
        <p className="form-status">{status}</p>
      </form>

      <section className="result-panel">
        <article className="result-block featured">
          <p className="overline">Verified watchlist</p>
          <h2>My active alerts</h2>
          <p>Load the subscriptions tied to your verified account. Alerts remain advisory until approved delivery providers and templates are enabled.</p>
          <div className="actions">
            <button className="btn primary" type="button" onClick={() => loadVerifiedWatchlist(false)} disabled={submitting}>{submitting ? "Loading..." : "Load my watchlist"}</button>
            <a className="btn" href="/dashboard">Back to Account Center</a>
          </div>
        </article>

        {subscriptions.length ? (
          <div className="result-stack compact-stack">
            {subscriptions.map((item) => (
              <article className="result-block" key={item.id}>
                <div className="panel-heading">
                  <div>
                    <p className="overline">{item.watch_type}</p>
                    <h2>{titleFor(item)}</h2>
                  </div>
                  <span className="status-dot">{item.status || "active"}</span>
                </div>
                <div className="badge-row">
                  {item.target_country ? <span className="badge">Target: {item.target_country}</span> : null}
                  {item.route_or_goal ? <span className="badge">Route: {item.route_or_goal}</span> : null}
                  {item.preferred_channel ? <span className="badge">Channel: {item.preferred_channel}</span> : null}
                  <span className="badge">{formatDate(item.created_at)}</span>
                </div>
                <div className="mini-list">
                  <div><strong>Alert types</strong><span>{item.alert_types?.length ? item.alert_types.map(alertLabel).join(", ") : "No alert types recorded"}</span></div>
                  <div><strong>Consent</strong><span>{item.consent_to_contact ? "Opt-in captured" : "Consent not confirmed"}</span></div>
                  <div><strong>Source page</strong><span>{item.source_page || "Not recorded"}</span></div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <style>{`
        .check-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        @media (max-width: 700px) { .check-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
