"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";


type CommercialQuote = {
  id: string;
  quote_ref: string;
  service_request_id?: string | null;
  provider_application_id?: string | null;
  full_name?: string | null;
  email: string;
  phone?: string | null;
  service_slug: string;
  service_title: string;
  provider_name?: string | null;
  currency: string;
  subtotal_amount: number;
  platform_fee_amount: number;
  total_amount: number;
  scope_summary: string;
  deliverables?: string[];
  exclusions?: string[];
  refund_terms: string;
  status: string;
  payment_provider?: string | null;
  payment_reference?: string | null;
  checkout_url?: string | null;
  expires_at?: string;
  created_at?: string;
};

type QuoteList = {
  ok: boolean;
  commercial_quotes?: CommercialQuote[];
};

const statusOptions = ["draft", "sent", "accepted", "declined", "expired", "cancelled", "payment_pending", "paid", "fulfilled", "refunded", "disputed"];

function money(value: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(value || 0));
  } catch {
    return `${currency} ${Number(value || 0).toLocaleString()}`;
  }
}

function formatDate(value?: string) {
  if (!value) return "Not set";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminCommercialQuotes() {
  const [adminKey, setAdminKey] = useState("");
  const [quotes, setQuotes] = useState<CommercialQuote[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState("Enter the admin key to load or issue commercial quotes.");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    try {
      setAdminKey(localStorage.getItem("moveready_admin_key") || "");
    } catch {
      // Ignore storage failure.
    }
  }, []);

  const counts = useMemo(() => quotes.reduce<Record<string, number>>((acc, quote) => {
    acc[quote.status] = (acc[quote.status] || 0) + 1;
    return acc;
  }, {}), [quotes]);

  function headers() {
    return { "X-MoveReady-Admin-Key": adminKey.trim() };
  }

  async function loadQuotes() {
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }
    setLoading(true);
    setMessage("Loading commercial quotes...");
    try {
      localStorage.setItem("moveready_admin_key", adminKey.trim());
      const data = await apiJson<QuoteList>("admin/commercial-quotes", {
        query: { status: statusFilter || undefined, limit: 75 },
        headers: headers(),
        timeoutMs: 20000,
        useAuthToken: false,
      });
      setQuotes(data.commercial_quotes || []);
      setMessage(data.commercial_quotes?.length ? "Commercial quotes loaded." : "No commercial quotes found for this filter.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401 ? "Admin key rejected." : apiError?.data?.error || "Unable to load quotes. Confirm migration 023 is applied.");
    } finally {
      setLoading(false);
    }
  }

  async function createQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!adminKey.trim()) {
      setMessage("Admin key is required.");
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      service_request_id: String(data.get("service_request_id") || "").trim() || undefined,
      provider_application_id: String(data.get("provider_application_id") || "").trim() || undefined,
      full_name: String(data.get("full_name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      service_slug: String(data.get("service_slug") || "").trim(),
      service_title: String(data.get("service_title") || "").trim(),
      provider_name: String(data.get("provider_name") || "").trim(),
      currency: String(data.get("currency") || "USD").trim().toUpperCase(),
      subtotal_amount: Number(data.get("subtotal_amount") || 0),
      platform_fee_amount: Number(data.get("platform_fee_amount") || 0),
      scope_summary: String(data.get("scope_summary") || "").trim(),
      deliverables: String(data.get("deliverables") || "").trim(),
      exclusions: String(data.get("exclusions") || "").trim(),
      refund_terms: String(data.get("refund_terms") || "").trim(),
      payment_provider: String(data.get("payment_provider") || "").trim(),
      checkout_url: String(data.get("checkout_url") || "").trim(),
      expires_days: Number(data.get("expires_days") || 14),
      send_now: data.get("send_now") === "on",
      quote_notice_confirmed: data.get("quote_notice_confirmed") === "on",
      created_by: "MoveReady admin console",
    };

    setLoading(true);
    setMessage("Creating controlled commercial quote...");
    try {
      const response = await apiJson<{ commercial_quote: CommercialQuote }>("admin/commercial-quotes", {
        method: "POST",
        body: payload,
        headers: headers(),
        timeoutMs: 20000,
        useAuthToken: false,
      });
      setQuotes((rows) => [response.commercial_quote, ...rows.filter((row) => row.id !== response.commercial_quote.id)]);
      setMessage(`Quote ${response.commercial_quote.quote_ref} created${response.commercial_quote.status === "sent" ? " and sent to the account workspace" : " as draft"}.`);
      form.reset();
    } catch (error) {
      const apiError = error as ApiError;
      const code = apiError?.data?.error || apiError?.message || "quote_create_failed";
      const providerErrors = Array.isArray(apiError?.data?.provider_errors) ? `: ${apiError.data.provider_errors.join(", ")}` : "";
      setMessage(`Unable to create quote: ${code}${providerErrors}`);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(quote: CommercialQuote, status: string) {
    setUpdatingId(quote.id);
    setMessage(`Updating ${quote.quote_ref} to ${status}...`);
    try {
      const response = await apiJson<{ commercial_quote: CommercialQuote }>(`admin/commercial-quotes/${quote.id}`, {
        method: "PATCH",
        body: { status },
        headers: headers(),
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setQuotes((rows) => rows.map((row) => (row.id === quote.id ? response.commercial_quote : row)));
      setMessage("Quote status updated.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to update quote: ${apiError?.data?.error || "update_failed"}`);
    } finally {
      setUpdatingId("");
    }
  }

  async function markPaid(quote: CommercialQuote) {
    const paymentProvider = window.prompt("Payment provider or method", quote.payment_provider || "manual_verified_payment")?.trim();
    if (!paymentProvider) return;
    const paymentReference = window.prompt("Verified payment reference")?.trim();
    if (!paymentReference) return;

    setUpdatingId(quote.id);
    setMessage(`Recording payment for ${quote.quote_ref}...`);
    try {
      const response = await apiJson<{ commercial_quote: CommercialQuote }>(`admin/commercial-quotes/${quote.id}/mark-paid`, {
        method: "POST",
        body: {
          payment_provider: paymentProvider,
          payment_reference: paymentReference,
          amount: quote.total_amount,
        },
        headers: headers(),
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setQuotes((rows) => rows.map((row) => (row.id === quote.id ? response.commercial_quote : row)));
      setMessage("Payment marked paid after admin verification and audit event creation.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(`Unable to confirm payment: ${apiError?.data?.error || "payment_confirmation_failed"}`);
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <p className="overline">Commercial control</p>
          <h2>Quotes and payment records</h2>
          <p className="section-intro">Issue a quote only after scope review. Provider-linked quotes require an approved provider plus privacy, pricing, refund, and handling checks.</p>
        </div>
        <div className="badge-row admin-counts">
          {statusOptions.slice(0, 8).map((status) => <span className="badge" key={status}>{status}: {counts[status] || 0}</span>)}
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="field"><label htmlFor="quote_admin_key">Admin key</label><input id="quote_admin_key" type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} placeholder="X-MoveReady-Admin-Key" /></div>
        <div className="field"><label htmlFor="quote_status_filter">Status</label><select id="quote_status_filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All statuses</option>{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></div>
        <button className="btn primary" type="button" disabled={loading} onClick={loadQuotes}>{loading ? "Loading..." : "Load quotes"}</button>
      </div>
      <p className="form-status">{message}</p>

      <form className="interest-form result-block soft" onSubmit={createQuote}>
        <div><p className="overline">Issue quote</p><h3>Create scope, price, and refund terms</h3></div>
        <div className="form-grid two-col">
          <div className="field"><label htmlFor="service_request_id">Service request ID</label><input id="service_request_id" name="service_request_id" placeholder="Optional UUID" /></div>
          <div className="field"><label htmlFor="provider_application_id">Approved provider ID</label><input id="provider_application_id" name="provider_application_id" placeholder="Optional UUID" /></div>
          <div className="field"><label htmlFor="quote_full_name">Full name</label><input id="quote_full_name" name="full_name" /></div>
          <div className="field"><label htmlFor="quote_email">Account email</label><input id="quote_email" name="email" type="email" /></div>
          <div className="field"><label htmlFor="quote_phone">Phone</label><input id="quote_phone" name="phone" /></div>
          <div className="field"><label htmlFor="quote_service_slug">Service slug</label><input id="quote_service_slug" name="service_slug" placeholder="expert_review" /></div>
          <div className="field"><label htmlFor="quote_service_title">Service title</label><input id="quote_service_title" name="service_title" /></div>
          <div className="field"><label htmlFor="quote_provider_name">Provider name</label><input id="quote_provider_name" name="provider_name" /></div>
          <div className="field"><label htmlFor="quote_currency">Currency</label><input id="quote_currency" name="currency" defaultValue="USD" maxLength={3} /></div>
          <div className="field"><label htmlFor="quote_subtotal">Service amount</label><input id="quote_subtotal" name="subtotal_amount" type="number" min="0" step="0.01" /></div>
          <div className="field"><label htmlFor="quote_platform_fee">MoveReady platform fee</label><input id="quote_platform_fee" name="platform_fee_amount" type="number" min="0" step="0.01" defaultValue="0" /></div>
          <div className="field"><label htmlFor="quote_expiry">Quote validity in days</label><input id="quote_expiry" name="expires_days" type="number" min="1" max="90" defaultValue="14" /></div>
          <div className="field"><label htmlFor="quote_payment_provider">Payment provider</label><input id="quote_payment_provider" name="payment_provider" placeholder="Optional until checkout setup" /></div>
          <div className="field"><label htmlFor="quote_checkout_url">Approved checkout URL</label><input id="quote_checkout_url" name="checkout_url" type="url" placeholder="Optional; payment links are feature-gated" /></div>
        </div>
        <div className="field"><label htmlFor="quote_scope">Scope summary</label><textarea id="quote_scope" name="scope_summary" rows={4} /></div>
        <div className="field"><label htmlFor="quote_deliverables">Deliverables, one per line</label><textarea id="quote_deliverables" name="deliverables" rows={4} /></div>
        <div className="field"><label htmlFor="quote_exclusions">Exclusions, one per line</label><textarea id="quote_exclusions" name="exclusions" rows={4} /></div>
        <div className="field"><label htmlFor="quote_refund_terms">Refund terms</label><textarea id="quote_refund_terms" name="refund_terms" rows={4} /></div>
        <label className="checkbox-field"><input type="checkbox" name="send_now" /><span>Send this quote to the user account immediately.</span></label>
        <label className="checkbox-field"><input type="checkbox" name="quote_notice_confirmed" /><span>I confirm this quote does not promise visa, admission, scholarship, job, booking, provider performance, refund, entry, selection, or official approval.</span></label>
        <button className="btn primary" type="submit" disabled={loading}>{loading ? "Working..." : "Create quote"}</button>
      </form>

      <div className="request-list" style={{ marginTop: 18 }}>
        {quotes.map((quote) => (
          <article className="request-card" key={quote.id}>
            <div className="request-card-main">
              <div><span className={`badge module-status ${["paid", "fulfilled"].includes(quote.status) ? "available" : quote.status === "sent" || quote.status === "accepted" ? "partner_approval_pending" : "coming_soon"}`}>{quote.status}</span><h3>{quote.quote_ref}: {quote.service_title}</h3><p>{quote.scope_summary}</p></div>
              <div className="request-meta"><span>{money(quote.total_amount, quote.currency)}</span><span>{quote.email}</span><span>{formatDate(quote.expires_at)}</span></div>
            </div>
            <div className="request-details"><span><strong>Provider:</strong> {quote.provider_name || "MoveReady / not assigned"}</span><span><strong>Service amount:</strong> {money(quote.subtotal_amount, quote.currency)}</span><span><strong>Platform fee:</strong> {money(quote.platform_fee_amount, quote.currency)}</span><span><strong>Payment method:</strong> {quote.payment_provider || "Not configured"}</span><span><strong>Reference:</strong> {quote.payment_reference || "Not recorded"}</span><span><strong>Refund:</strong> {quote.refund_terms}</span></div>
            <div className="actions wrap-actions">
              {statusOptions.map((status) => <button className="status-button" key={status} type="button" disabled={quote.status === status || updatingId === quote.id} onClick={() => updateStatus(quote, status)}>{status}</button>)}
              {quote.status === "accepted" || quote.status === "payment_pending" ? <button className="btn primary" type="button" disabled={updatingId === quote.id} onClick={() => markPaid(quote)}>Verify and mark paid</button> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
