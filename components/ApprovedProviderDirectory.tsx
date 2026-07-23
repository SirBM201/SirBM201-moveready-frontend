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
  affiliate_relationship?: boolean;
  affiliate_disclosure?: string | null;
  public_notes?: string | null;
  public_status?: string;
  approved_at?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

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
        setStatus(approved.length ? "Approved and published provider directory" : "No approved public providers listed yet");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("Provider directory is temporarily unavailable. Migration 023 or backend publication controls may still be pending.");
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
          {providers.map((provider) => {
            const approvedDate = formatDate(provider.approved_at);
            return (
              <article className="module-tile" key={provider.id}>
                <span className="overline">{provider.provider_label || "Approved provider"}</span>
                <h3>{provider.business_name || "Approved provider"}</h3>
                <p>{provider.service_summary || "Service details are available after MoveReady handoff."}</p>
                <div className="badge-row">
                  <span className="badge module-status available">Approved and published</span>
                  {provider.country ? <span className="badge">{provider.country}</span> : null}
                  {provider.city ? <span className="badge">{provider.city}</span> : null}
                  {provider.preferred_contact_channel ? <span className="badge">Contact: {provider.preferred_contact_channel}</span> : null}
                  {approvedDate ? <span className="badge">Published: {approvedDate}</span> : null}
                  {provider.affiliate_relationship ? <span className="badge">Affiliate relationship</span> : null}
                </div>
                {provider.service_countries?.length ? (
                  <p className="small-note">Service countries: {provider.service_countries.join(", ")}</p>
                ) : null}
                {provider.credentials_summary ? <p className="small-note">Trust notes: {provider.credentials_summary}</p> : null}
                {provider.public_notes ? <p className="small-note">Public note: {provider.public_notes}</p> : null}
                {provider.affiliate_relationship ? (
                  <div className="result-block soft" style={{ marginTop: 12 }}>
                    <strong>Affiliate disclosure</strong>
                    <p>{provider.affiliate_disclosure || "MoveReady may receive a disclosed referral commission. Compare price, terms, refunds, and suitability independently before paying."}</p>
                  </div>
                ) : null}
                {provider.website_url ? (
                  <a className="text-link" href={provider.website_url} target="_blank" rel="noopener noreferrer sponsored">
                    Visit provider website
                  </a>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mini-list">
          <div>
            <strong>Providers appear only after separate screening and publication approval.</strong>
            <span>An application marked approved is still hidden until privacy, pricing, refund, sensitive-document handling, disclosure, and public-listing controls pass.</span>
          </div>
          <div>
            <strong>Private contact details stay protected.</strong>
            <span>This page shows only public-safe information from explicitly published records.</span>
          </div>
          <div>
            <strong>Affiliate relationships must be visible.</strong>
            <span>Where MoveReady may earn a referral commission, the disclosure appears before the provider link.</span>
          </div>
        </div>
      )}
    </div>
  );
}
