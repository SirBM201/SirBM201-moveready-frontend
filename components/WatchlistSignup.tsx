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

function currentSourcePage() {
  try {
    return typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/watchlist";
  } catch {
    return "/watchlist";
  }
}

export default function WatchlistSignup() {
  const [status, setStatus] = useState("Choose what to monitor and submit your opt-in details.");
  const [submitting, setSubmitting] = useState(false);
  const [routeHint, setRouteHint] = useState("");
  const [watchType, setWatchType] = useState("opportunity");

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
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const alertTypes = alertOptions.map(([code]) => code).filter((code) => data.get(code) === "on");

    const payload = {
      watch_type: String(data.get("watch_type") || "opportunity"),
      watch_code: String(data.get("watch_code") || "").trim(),
      watch_title: String(data.get("watch_title") || "").trim(),
      full_name: String(data.get("full_name") || "").trim(),
      email: String(data.get("email") || "").trim(),
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
      setStatus("Enter an email or WhatsApp/phone number.");
      return;
    }
    if (!payload.consent_to_contact) {
      setStatus("Confirm opt-in consent before submitting.");
      return;
    }

    setSubmitting(true);
    setStatus("Saving watchlist subscription...");
    try {
      const response = await apiJson<{ ok: boolean; stored?: boolean }>("watchlist/subscriptions", {
        method: "POST",
        body: payload,
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setStatus(response.stored === false ? "Subscription received, but storage is not active yet." : "Watchlist subscription saved.");
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
    <form className="interest-form" onSubmit={handleSubmit}>
      <div>
        <span className="overline">Opt-in alerts</span>
        <h3>Follow a route, opportunity, or service</h3>
        <p>MoveReady stores your alert preference now. Actual WhatsApp, email, or Telegram sending should only be activated after provider setup and template approval.</p>
      </div>

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
          <input id="email" name="email" type="email" placeholder="you@example.com" />
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

      <button className="btn primary" type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save watchlist"}</button>
      <p className="form-status">{status}</p>

      <style>{`
        .check-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        @media (max-width: 700px) { .check-grid { grid-template-columns: 1fr; } }
      `}</style>
    </form>
  );
}
