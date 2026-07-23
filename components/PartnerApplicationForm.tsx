"use client";

import { FormEvent, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

const providerTypes = [
  ["courier", "Courier and document delivery"],
  ["insurance", "Insurance provider"],
  ["legalization", "Notary, apostille, attestation, or legalization"],
  ["translation", "Document translation"],
  ["expert_review", "Expert or consultant review"],
  ["admission_support", "Admission or scholarship support"],
  ["accommodation", "Accommodation support"],
  ["airport_pickup", "Airport pickup"],
  ["settlement", "Post-arrival settlement support"],
  ["travel_booking", "Flight, hotel, or travel booking support"],
  ["transport", "Local or intercity transport"],
  ["telecom", "SIM, connectivity, or telecom support"],
  ["other", "Other trusted service"],
];

const channels = ["email", "whatsapp", "telegram", "phone"];

type SubmitState = "idle" | "submitting" | "success" | "error";

function sourcePage() {
  try {
    return typeof window !== "undefined" ? window.location.pathname : "/partners/apply";
  } catch {
    return "/partners/apply";
  }
}

export default function PartnerApplicationForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("Submit provider details for screening. Application approval and public publication are separate decisions.");

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      provider_type: String(data.get("provider_type") || "other"),
      business_name: String(data.get("business_name") || "").trim(),
      contact_name: String(data.get("contact_name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      website_url: String(data.get("website_url") || "").trim(),
      country: String(data.get("country") || "").trim(),
      city: String(data.get("city") || "").trim(),
      service_countries: String(data.get("service_countries") || "").trim(),
      service_summary: String(data.get("service_summary") || "").trim(),
      credentials_summary: String(data.get("credentials_summary") || "").trim(),
      compliance_notes: String(data.get("compliance_notes") || "").trim(),
      pricing_notes: String(data.get("pricing_notes") || "").trim(),
      preferred_contact_channel: String(data.get("preferred_contact_channel") || "email"),
      consent_to_contact: data.get("consent_to_contact") === "on",
      source_page: sourcePage(),
    };

    if (!payload.business_name) {
      setState("error");
      setMessage("Business or provider name is required.");
      return;
    }
    if (!payload.email && !payload.phone) {
      setState("error");
      setMessage("Enter an email or WhatsApp/phone number.");
      return;
    }
    if (!payload.consent_to_contact) {
      setState("error");
      setMessage("Confirm that MoveReady may contact you about this application.");
      return;
    }

    setState("submitting");
    setMessage("Submitting provider application...");
    try {
      await apiJson("partners/applications", {
        method: "POST",
        body: payload,
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setState("success");
      setMessage("Provider application submitted. Screening, approval, and public publication checks must all pass before any listing or user handoff.");
      form.reset();
    } catch (error) {
      const apiError = error as ApiError;
      setState("error");
      setMessage(apiError?.status === 503 ? "Unable to save application. Confirm partner migration 011 and publication migration 023 are applied, then redeploy the backend." : "Unable to submit provider application.");
    }
  }

  return (
    <form className="interest-form" onSubmit={submitApplication}>
      <div>
        <span className="overline">Provider review</span>
        <h3>Apply as a trusted MoveReady provider</h3>
        <p>Submit enough detail for screening. Approval does not automatically create a public listing.</p>
      </div>

      <div className="form-grid two-col">
        <div className="field">
          <label htmlFor="provider_type">Provider type</label>
          <select id="provider_type" name="provider_type" defaultValue="courier">
            {providerTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="business_name">Business / provider name</label>
          <input id="business_name" name="business_name" placeholder="Registered or trading name" />
        </div>
        <div className="field">
          <label htmlFor="contact_name">Contact person</label>
          <input id="contact_name" name="contact_name" placeholder="Main contact" />
        </div>
        <div className="field">
          <label htmlFor="preferred_contact_channel">Preferred contact</label>
          <select id="preferred_contact_channel" name="preferred_contact_channel" defaultValue="email">
            {channels.map((channel) => <option key={channel} value={channel}>{channel}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="provider@example.com" />
        </div>
        <div className="field">
          <label htmlFor="phone">WhatsApp / phone</label>
          <input id="phone" name="phone" placeholder="+965 ..." />
        </div>
        <div className="field">
          <label htmlFor="website_url">Website or profile URL</label>
          <input id="website_url" name="website_url" placeholder="https://..." />
        </div>
        <div className="field">
          <label htmlFor="country">Base country</label>
          <input id="country" name="country" placeholder="Example: Kuwait" />
        </div>
        <div className="field">
          <label htmlFor="city">City</label>
          <input id="city" name="city" placeholder="Example: Kuwait City" />
        </div>
        <div className="field">
          <label htmlFor="service_countries">Service countries</label>
          <input id="service_countries" name="service_countries" placeholder="Nigeria, Kuwait, Estonia" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="service_summary">Service summary</label>
        <textarea id="service_summary" name="service_summary" rows={4} placeholder="Describe what you provide, who you serve, and how the service works." />
      </div>
      <div className="field">
        <label htmlFor="credentials_summary">Credentials or operating evidence</label>
        <textarea id="credentials_summary" name="credentials_summary" rows={4} placeholder="Licences, accreditation, agency relationship, insurance authorization, notary status, transport permit, experience, or relevant proof." />
      </div>
      <div className="field">
        <label htmlFor="compliance_notes">Compliance and trust notes</label>
        <textarea id="compliance_notes" name="compliance_notes" rows={3} placeholder="Explain privacy, sensitive documents, refunds, cancellation, tracking, complaints, booking changes, and customer support." />
      </div>
      <div className="field">
        <label htmlFor="pricing_notes">Pricing and commission notes</label>
        <textarea id="pricing_notes" name="pricing_notes" rows={3} placeholder="Typical fees, commission or affiliate model, taxes, extra charges, discounts, quote requirements, and refund limitations." />
      </div>

      <div className="result-block soft">
        <strong>Publication notice</strong>
        <p>MoveReady may approve an application but still keep it private. Public listing requires separate privacy, pricing, refund, sensitive-document handling, affiliate-disclosure, and handoff approval.</p>
      </div>

      <label className="checkbox-field">
        <input type="checkbox" name="consent_to_contact" />
        <span>I agree that MoveReady may contact me about this provider application.</span>
      </label>

      <button className="btn primary" type="submit" disabled={state === "submitting"}>{state === "submitting" ? "Submitting..." : "Submit provider application"}</button>
      <p className={state === "error" ? "form-error" : "form-status"}>{message}</p>
    </form>
  );
}
