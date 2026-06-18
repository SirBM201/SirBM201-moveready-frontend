"use client";

import { FormEvent, useEffect, useState } from "react";

import { apiJson } from "@/lib/api";

type ServiceOption = {
  slug: string;
  title: string;
  description: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

type Props = {
  defaultService?: string;
};

const serviceOptions: ServiceOption[] = [
  { slug: "courier", title: "Passport and document courier", description: "Trusted handling for passports, certificates, embassy documents, and route evidence." },
  { slug: "legalization", title: "Notarization, apostille, and legalization", description: "Document authentication, embassy legalization, translation, and attestation support." },
  { slug: "insurance", title: "Travel and health insurance", description: "Travel, student, family, Schengen-style, work-route, and arrival insurance requests." },
  { slug: "translation", title: "Document translation", description: "Translation support for certificates, bank evidence, civil documents, and route documents." },
  { slug: "expert_review", title: "Expert or document review", description: "Route evidence, refusal-risk, startup, scholarship, and proof-of-funds review requests." },
  { slug: "admission_support", title: "Admission and scholarship support", description: "Study-abroad, scholarship matching, SOP, and application-support requests." },
  { slug: "accommodation", title: "Accommodation support", description: "Temporary stay, student housing, family accommodation, and arrival housing support." },
  { slug: "airport_pickup", title: "Airport pickup", description: "Arrival pickup and first-day movement support where partners are approved." },
  { slug: "settlement", title: "Post-arrival settlement", description: "SIM, bank account, local registration, school, transport, and relocation setup support." },
  { slug: "other", title: "Other relocation support", description: "Use this for relocation needs that do not fit the listed service categories." },
];

function getService(slug: string) {
  return serviceOptions.find((item) => item.slug === slug) || serviceOptions[0];
}

function validService(slug?: string) {
  return !!slug && serviceOptions.some((item) => item.slug === slug);
}

export default function GeneralServiceRequestForm({ defaultService }: Props) {
  const [serviceSlug, setServiceSlug] = useState(validService(defaultService) ? defaultService! : serviceOptions[0].slug);
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("Ready to submit a service request.");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const service = params.get("service") || params.get("type");
      if (validService(service || undefined)) {
        setServiceSlug(service!);
      } else if (validService(defaultService)) {
        setServiceSlug(defaultService!);
      }
    } catch {
      if (validService(defaultService)) setServiceSlug(defaultService!);
    }
  }, [defaultService]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const selectedService = getService(serviceSlug);

    const payload = {
      service_slug: selectedService.slug,
      service_title: selectedService.title,
      full_name: String(data.get("full_name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      preferred_channel: String(data.get("preferred_channel") || "email"),
      current_country: String(data.get("current_country") || "").trim(),
      target_country: String(data.get("target_country") || "").trim(),
      route_or_goal: String(data.get("route_or_goal") || "").trim(),
      message: String(data.get("message") || "").trim(),
      consent_to_contact: data.get("consent_to_contact") === "on",
      source_page: typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/services",
    };

    if (!payload.email && !payload.phone) {
      setState("error");
      setMessage("Enter an email or WhatsApp/phone number so MoveReady can contact you.");
      return;
    }

    if (!payload.consent_to_contact) {
      setState("error");
      setMessage("Please confirm contact consent before submitting this request.");
      return;
    }

    setState("submitting");
    setMessage("Submitting service request...");

    try {
      const response = await apiJson<{ ok: boolean; stored?: boolean }>("platform/service-interest", {
        method: "POST",
        body: payload,
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setState("success");
      setMessage(response.stored === false ? "Request received. Storage will activate after backend setup is complete." : "Request saved. MoveReady will contact you with next steps.");
      form.reset();
      setServiceSlug(validService(defaultService) ? defaultService! : serviceOptions[0].slug);
    } catch {
      setState("error");
      setMessage("Unable to submit this request right now. If Railway is still blocked, try again after the backend redeploys.");
    }
  }

  const selectedService = getService(serviceSlug);

  return (
    <form className="interest-form" onSubmit={handleSubmit}>
      <div>
        <span className="overline">Service request</span>
        <h3>Request trusted relocation support</h3>
        <p>Select the service you need and submit enough context for admin review and follow-up.</p>
      </div>

      <div className="form-grid two-col">
        <div className="field">
          <label htmlFor="service_slug">Service</label>
          <select id="service_slug" name="service_slug" value={serviceSlug} onChange={(event) => setServiceSlug(event.target.value)}>
            {serviceOptions.map((service) => (
              <option key={service.slug} value={service.slug}>{service.title}</option>
            ))}
          </select>
        </div>
        <div className="service-context-box">
          <strong>{selectedService.title}</strong>
          <span>{selectedService.description}</span>
        </div>
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
          <input id="target_country" name="target_country" placeholder="Example: Estonia, Finland, Canada" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="route_or_goal">Route or goal</label>
        <input id="route_or_goal" name="route_or_goal" placeholder="Example: Estonia startup, DV lottery, Finland D visa, scholarship route" />
      </div>
      <div className="field">
        <label htmlFor="message">What do you need?</label>
        <textarea id="message" name="message" rows={5} placeholder="Add document type, destination country, deadline, service need, family context, or any special handling note." />
      </div>
      <label className="checkbox-field">
        <input type="checkbox" name="consent_to_contact" />
        <span>I agree that MoveReady may contact me about this service request.</span>
      </label>
      <button className="btn primary" type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Submitting..." : "Submit service request"}
      </button>
      <p className={state === "error" ? "form-error" : "form-status"}>{message}</p>
    </form>
  );
}
