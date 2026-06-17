"use client";

import { FormEvent, useEffect, useState } from "react";

import { apiJson } from "@/lib/api";

type ServiceInterestFormProps = {
  serviceSlug: string;
  serviceTitle: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ServiceInterestForm({ serviceSlug, serviceTitle }: ServiceInterestFormProps) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [routeHint, setRouteHint] = useState("");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setRouteHint(params.get("route") || params.get("service") || "");
    } catch {
      setRouteHint("");
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      service_slug: serviceSlug,
      service_title: serviceTitle,
      full_name: String(data.get("full_name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      preferred_channel: String(data.get("preferred_channel") || "email"),
      current_country: String(data.get("current_country") || "").trim(),
      target_country: String(data.get("target_country") || "").trim(),
      route_or_goal: String(data.get("route_or_goal") || "").trim(),
      message: String(data.get("message") || "").trim(),
      consent_to_contact: data.get("consent_to_contact") === "on",
      source_page: typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "",
    };

    if (!payload.email && !payload.phone) {
      setState("error");
      setMessage("Enter an email or WhatsApp/phone number so we can contact you.");
      return;
    }

    if (!payload.consent_to_contact) {
      setState("error");
      setMessage("Please confirm that we can contact you about this service.");
      return;
    }

    setState("submitting");
    setMessage("");

    try {
      const response = await apiJson<{ ok: boolean; stored?: boolean }>("platform/service-interest", {
        method: "POST",
        body: payload,
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setState("success");
      setMessage(response.stored === false ? "Request received. Storage will activate after setup is completed." : "Request received. We will contact you when this service is ready.");
      form.reset();
      setRouteHint("");
    } catch {
      setState("error");
      setMessage("Unable to send this request right now. Please try again later.");
    }
  }

  return (
    <form className="interest-form" onSubmit={handleSubmit}>
      <div>
        <span className="overline">Service request</span>
        <h3>Get notified or request support</h3>
        <p>Submit your details if you want updates or early access for this service.</p>
      </div>

      <div className="form-grid two-col">
        <div className="field">
          <label htmlFor="full_name">Full name</label>
          <input id="full_name" name="full_name" placeholder="Your name" />
        </div>
        <div className="field">
          <label htmlFor="preferred_channel">Preferred contact</label>
          <select id="preferred_channel" name="preferred_channel" defaultValue="email">
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="phone">Phone</option>
          </select>
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
          <input id="target_country" name="target_country" placeholder="Example: Estonia" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="route_or_goal">Route or goal</label>
        <input id="route_or_goal" name="route_or_goal" value={routeHint} onChange={(event) => setRouteHint(event.target.value)} placeholder="Example: Estonia startup, DV lottery, document courier" />
      </div>

      <div className="field">
        <label htmlFor="message">What do you need?</label>
        <textarea id="message" name="message" rows={4} placeholder="Briefly describe what you want help with." />
      </div>

      <label className="checkbox-field">
        <input type="checkbox" name="consent_to_contact" />
        <span>I agree that MoveReady may contact me about this service request.</span>
      </label>

      <button className="btn primary" type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending..." : "Submit request"}
      </button>
      {message ? <p className={state === "error" ? "form-error" : "form-status"}>{message}</p> : null}
    </form>
  );
}
