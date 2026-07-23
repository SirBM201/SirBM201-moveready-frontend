"use client";

import { FormEvent, useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type CatalogItem = {
  slug: string;
  title: string;
  pricing_mode: string;
  summary: string;
};

type BillingStatus = {
  ok: boolean;
  commercial_quotes_enabled?: boolean;
  payment_links_enabled?: boolean;
  checkout_mode?: string;
  safety_controls?: string[];
};

type CommercialQuote = {
  id?: string;
  quote_ref?: string;
  service_slug?: string;
  service_title?: string;
  provider_name?: string | null;
  currency?: string;
  subtotal_amount?: number;
  platform_fee_amount?: number;
  total_amount?: number;
  scope_summary?: string;
  deliverables?: string[];
  exclusions?: string[];
  refund_terms?: string;
  status?: string;
  payment_provider?: string | null;
  checkout_available?: boolean;
  checkout_url?: string | null;
  expires_at?: string;
  sent_at?: string;
  accepted_at?: string;
  paid_at?: string;
  fulfilled_at?: string;
  created_at?: string;
  commercial_notice?: string;
};

type QuotesResponse = {
  ok: boolean;
  account_email?: string;
  quote_count?: number;
  quotes?: CommercialQuote[];
};


function formatDate(value?: string) {
  if (!value) return "Not set";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}


function money(value: number | undefined, currency?: string) {
  const amount = Number(value || 0);
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "USD" }).format(amount);
  } catch {
    return `${currency || "USD"} ${amount.toLocaleString()}`;
  }
}


function readable(value?: string) {
  return String(value || "not available").replace(/_/g, " ");
}


export default function BillingWorkspace() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [billingStatus, setBillingStatus] = useState<BillingStatus | null>(null);
  const [quotes, setQuotes] = useState<CommercialQuote[]>([]);
  const [accountEmail, setAccountEmail] = useState("");
  const [message, setMessage] = useState("Loading pricing and payment controls...");
  const [loading, setLoading] = useState(false);
  const [updatingRef, setUpdatingRef] = useState("");
  const [serviceSlug, setServiceSlug] = useState("readiness_report");

  async function loadPublicBilling() {
    try {
      const [statusResponse, catalogResponse] = await Promise.all([
        apiJson<BillingStatus>("billing/status", { timeoutMs: 15000, useAuthToken: false }),
        apiJson<{ catalog?: CatalogItem[] }>("billing/catalog", { timeoutMs: 15000, useAuthToken: false }),
      ]);
      setBillingStatus(statusResponse);
      setCatalog(catalogResponse.catalog || []);
    } catch {
      setMessage("Pricing controls are temporarily unavailable.");
    }
  }

  async function loadQuotes(silent = false) {
    if (!silent) {
      setLoading(true);
      setMessage("Loading quotes connected to your verified account...");
    }
    try {
      const data = await apiJson<QuotesResponse>("billing/quotes", { timeoutMs: 20000 });
      setQuotes(data.quotes || []);
      setAccountEmail(data.account_email || "");
      setMessage(data.quotes?.length ? "Verified account quotes loaded." : "No commercial quotes have been issued to this account yet.");
    } catch (error) {
      const apiError = error as ApiError;
      setQuotes([]);
      setAccountEmail("");
      setMessage(apiError?.status === 401 ? "Sign in with email to view and accept private quotes." : "Unable to load private quotes right now.");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    void loadPublicBilling();
    void loadQuotes(true);
  }, []);

  async function requestQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const item = catalog.find((row) => row.slug === serviceSlug);
    const payload = {
      service_slug: serviceSlug,
      service_title: item?.title,
      full_name: String(data.get("full_name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      preferred_channel: String(data.get("preferred_channel") || "email"),
      current_country: String(data.get("current_country") || "").trim(),
      target_country: String(data.get("target_country") || "").trim(),
      route_or_goal: String(data.get("route_or_goal") || "").trim(),
      message: String(data.get("message") || "").trim(),
      consent_to_contact: data.get("consent_to_contact") === "on",
      source_page: typeof window !== "undefined" ? window.location.pathname : "/billing",
    };

    if (!payload.email && !payload.phone && !accountEmail) {
      setMessage("Enter an email or phone number, or sign in first.");
      return;
    }
    if (!payload.consent_to_contact) {
      setMessage("Confirm contact consent before requesting a quote.");
      return;
    }

    setLoading(true);
    setMessage("Submitting quote request for scope review...");
    try {
      await apiJson("billing/quote-requests", {
        method: "POST",
        body: payload,
        timeoutMs: 20000,
      });
      setMessage("Quote request saved. MoveReady must review the scope before issuing any amount or payment link.");
      form.reset();
      setServiceSlug("readiness_report");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.data?.error ? `Unable to submit quote request: ${apiError.data.error}` : "Unable to submit quote request.");
    } finally {
      setLoading(false);
    }
  }

  async function quoteAction(quote: CommercialQuote, action: "accept" | "decline" | "checkout") {
    if (!quote.quote_ref) return;
    setUpdatingRef(quote.quote_ref);
    setMessage(`${action === "checkout" ? "Preparing" : action === "accept" ? "Accepting" : "Declining"} quote ${quote.quote_ref}...`);
    try {
      const data = await apiJson<{ quote?: CommercialQuote; checkout_url?: string }>(`billing/quotes/${quote.quote_ref}/${action}`, {
        method: "POST",
        body: action === "decline" ? { reason: "Declined from verified account workspace" } : {},
        timeoutMs: 20000,
      });
      if (data.quote) {
        setQuotes((rows) => rows.map((row) => (row.quote_ref === quote.quote_ref ? data.quote as CommercialQuote : row)));
      }
      if (action === "checkout" && data.checkout_url) {
        window.open(data.checkout_url, "_blank", "noopener,noreferrer");
        setMessage("Approved checkout link opened. Confirm the domain, recipient, amount, currency, and refund terms before paying.");
      } else {
        setMessage(action === "accept" ? "Quote accepted. Payment remains separate and controlled." : "Quote declined.");
      }
    } catch (error) {
      const apiError = error as ApiError;
      const errorCode = apiError?.data?.error || apiError?.message || "quote_action_failed";
      setMessage(`Unable to complete action: ${errorCode}`);
    } finally {
      setUpdatingRef("");
    }
  }

  const selectedItem = catalog.find((row) => row.slug === serviceSlug);

  return (
    <div className="live-workspace reports-workspace">
      <section className="workflow-panel live-form">
        <div className="panel-heading">
          <div>
            <p className="overline">Scope before payment</p>
            <h2>Request a commercial quote</h2>
          </div>
          <span className="status-dot">Quote required</span>
        </div>
        <p>
          MoveReady should show the service scope, deliverables, exclusions, provider, total price, expiry, and refund terms before payment. A quote never guarantees an official or provider outcome.
        </p>
        {accountEmail ? <p className="form-status">Signed in as {accountEmail}. Issued quotes can be recovered below.</p> : null}

        <form className="interest-form" onSubmit={requestQuote}>
          <div className="field">
            <label htmlFor="billing_service">Service</label>
            <select id="billing_service" name="service_slug" value={serviceSlug} onChange={(event) => setServiceSlug(event.target.value)}>
              {(catalog.length ? catalog : [{ slug: "readiness_report", title: "Route readiness report", pricing_mode: "quote_required", summary: "Route-specific readiness review." }]).map((item) => (
                <option key={item.slug} value={item.slug}>{item.title}</option>
              ))}
            </select>
          </div>
          {selectedItem ? <div className="service-context-box"><strong>{selectedItem.title}</strong><span>{selectedItem.summary}</span></div> : null}

          <div className="form-grid two-col">
            <div className="field"><label htmlFor="billing_name">Full name</label><input id="billing_name" name="full_name" placeholder="Your name" /></div>
            <div className="field"><label htmlFor="billing_channel">Preferred contact</label><select id="billing_channel" name="preferred_channel" defaultValue="email"><option value="email">Email</option><option value="whatsapp">WhatsApp</option><option value="phone">Phone</option></select></div>
            <div className="field"><label htmlFor="billing_email">Email</label><input id="billing_email" name="email" type="email" placeholder={accountEmail || "you@example.com"} /></div>
            <div className="field"><label htmlFor="billing_phone">WhatsApp / phone</label><input id="billing_phone" name="phone" placeholder="+965 ..." /></div>
            <div className="field"><label htmlFor="billing_current_country">Current country</label><input id="billing_current_country" name="current_country" placeholder="Example: Kuwait" /></div>
            <div className="field"><label htmlFor="billing_target_country">Target country</label><input id="billing_target_country" name="target_country" placeholder="Example: Finland" /></div>
          </div>
          <div className="field"><label htmlFor="billing_goal">Route or goal</label><input id="billing_goal" name="route_or_goal" placeholder="Example: study route, startup route, family trip" /></div>
          <div className="field"><label htmlFor="billing_message">Requested scope</label><textarea id="billing_message" name="message" rows={5} placeholder="Describe the exact work, deadline, documents, family context, travel need, or review required." /></div>
          <label className="checkbox-field"><input type="checkbox" name="consent_to_contact" /><span>I agree that MoveReady may contact me to clarify scope and issue a quote.</span></label>
          <button className="btn primary" type="submit" disabled={loading}>{loading ? "Working..." : "Request quote"}</button>
        </form>

        <div className="result-block soft" style={{ marginTop: 16 }}>
          <h3>Payment control status</h3>
          <div className="mini-list">
            <div><strong>Commercial quotes</strong><span>{billingStatus?.commercial_quotes_enabled ? "Enabled" : "Unavailable"}</span></div>
            <div><strong>Online payment links</strong><span>{billingStatus?.payment_links_enabled ? "Controlled links enabled" : "Disabled until payment setup"}</span></div>
            <div><strong>Checkout mode</strong><span>{readable(billingStatus?.checkout_mode)}</span></div>
          </div>
        </div>
      </section>

      <section className="result-panel">
        <article className="result-block featured">
          <div className="panel-heading">
            <div><p className="overline">Private account quotes</p><h2>My quotes and payments</h2></div>
            <span className="status-dot">{quotes.length}</span>
          </div>
          <p>Sign in to load quotes issued to your verified email. Acceptance does not collect payment. Checkout appears only after a controlled payment link is enabled.</p>
          <div className="actions">
            <button className="btn primary" type="button" disabled={loading} onClick={() => loadQuotes(false)}>{loading ? "Loading..." : "Load my quotes"}</button>
            <a className="btn" href="/login">Sign in</a>
            <a className="btn" href="/service-requests">My support requests</a>
          </div>
          <p className="form-status">{message}</p>
        </article>

        {quotes.length ? (
          <div className="result-stack">
            {quotes.map((quote) => (
              <article className="result-block" key={quote.quote_ref || quote.id}>
                <div className="panel-heading">
                  <div><p className="overline">{quote.quote_ref || "Commercial quote"}</p><h2>{quote.service_title || readable(quote.service_slug)}</h2></div>
                  <span className="status-dot">{readable(quote.status)}</span>
                </div>
                <p>{quote.scope_summary || "No scope summary recorded."}</p>
                <div className="badge-row">
                  <span className="badge">Total: {money(quote.total_amount, quote.currency)}</span>
                  <span className="badge">Service: {money(quote.subtotal_amount, quote.currency)}</span>
                  <span className="badge">Platform fee: {money(quote.platform_fee_amount, quote.currency)}</span>
                  {quote.provider_name ? <span className="badge">Provider: {quote.provider_name}</span> : null}
                  <span className="badge">Expires: {formatDate(quote.expires_at)}</span>
                </div>
                <div className="mini-list" style={{ marginTop: 14 }}>
                  {(quote.deliverables || []).map((item, index) => <div key={`deliverable-${index}`}><strong>Deliverable {index + 1}</strong><span>{item}</span></div>)}
                  {(quote.exclusions || []).map((item, index) => <div key={`exclusion-${index}`}><strong>Excluded {index + 1}</strong><span>{item}</span></div>)}
                  <div><strong>Refund terms</strong><span>{quote.refund_terms || "Not recorded"}</span></div>
                  <div><strong>Issued</strong><span>{formatDate(quote.sent_at || quote.created_at)}</span></div>
                  <div><strong>Commercial notice</strong><span>{quote.commercial_notice}</span></div>
                </div>
                <div className="actions" style={{ marginTop: 14 }}>
                  {quote.status === "sent" ? <button className="btn primary" type="button" disabled={updatingRef === quote.quote_ref} onClick={() => quoteAction(quote, "accept")}>Accept quote</button> : null}
                  {quote.status === "sent" || quote.status === "accepted" ? <button className="btn" type="button" disabled={updatingRef === quote.quote_ref} onClick={() => quoteAction(quote, "decline")}>Decline</button> : null}
                  {quote.status === "accepted" || quote.status === "payment_pending" ? <button className="btn primary" type="button" disabled={updatingRef === quote.quote_ref || !quote.checkout_available} onClick={() => quoteAction(quote, "checkout")}>{quote.checkout_available ? "Open approved checkout" : "Checkout not enabled"}</button> : null}
                  {quote.status === "paid" ? <span className="badge module-status available">Payment recorded</span> : null}
                  {quote.status === "fulfilled" ? <span className="badge module-status available">Service fulfilled</span> : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
