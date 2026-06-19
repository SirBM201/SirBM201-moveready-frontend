"use client";

import { useEffect, useState } from "react";

import { apiJson } from "@/lib/api";

type Provider = {
  id: string;
  provider_type?: string;
  provider_label?: string;
  business_name?: string;
  website_url?: string;
  country?: string;
  city?: string;
  service_countries?: string[];
  service_summary?: string;
  credentials_summary?: string;
  preferred_contact_channel?: string;
  public_status?: string;
};

export default function ApprovedProviderDirectory() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [status, setStatus] = useState("Loading approved providers...");

  useEffect(() => {
    let cancelled = false;

    apiJson<{ approved_providers: Provider[] }>("partners/approved", { timeoutMs: 15000 })
      .then((data) => {
        if (cancelled) return;
        const approved = data.approved_providers || [];
        setProviders(approved);
        setStatus(approved.length ? "Approved provider directory" : "No approved providers listed yet");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("Provider directory is temporarily unavailable.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <p className="form-status">{status}</p>
      {providers.length ? (
        <div className="module-preview-grid">
          {providers.map((provider) => (
            <article className="module-tile" key={provider.id}>
              <span className="overline">{provider.provider_label || "Approved provider"}</span>
              <h3>{provider.business_name || "Approved provider"}</h3>
              <p>{provider.service_summary || "Service details are available after MoveReady handoff."}</p>
              <div className="badge-row">
                <span className="badge module-status available">Approved</span>
                {provider.country ? <span className="badge">{provider.country}</span> : null}
                {provider.city ? <span className="badge">{provider.city}</span> : null}
                {provider.preferred_contact_channel ? <span className="badge">Contact: {provider.preferred_contact_channel}</span> : null}
              </div>
              {provider.service_countries?.length ? (
                <p className="small-note">Service countries: {provider.service_countries.join(", ")}</p>
              ) : null}
              {provider.credentials_summary ? <p className="small-note">Trust notes: {provider.credentials_summary}</p> : null}
              {provider.website_url ? (
                <a className="text-link" href={provider.website_url} target="_blank" rel="noreferrer">
                  Visit provider website
                </a>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="mini-list">
          <div>
            <strong>Approved providers will appear after screening.</strong>
            <span>MoveReady can collect service requests now, but public listings require admin approval before user handoff.</span>
          </div>
          <div>
            <strong>Private contact details stay protected.</strong>
            <span>This page only shows public-safe provider information from approved records.</span>
          </div>
        </div>
      )}
    </div>
  );
}
