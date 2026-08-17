"use client";

import { FormEvent, useRef, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type Money = number | null;

type CostItem = {
  category: string;
  label: string;
  amount: number;
  currency: string;
  source_type: string;
  source_url?: string | null;
  source_title?: string | null;
  source_checked_at?: string | null;
  amount_basis: string;
  notes?: string | null;
};

type FinancialPlan = {
  ok: boolean;
  contract_version: string;
  currency: string;
  household: {
    family_size: number;
    calculation_rule: string;
  };
  resources: {
    savings: number;
    expected_funding: number;
    total: number;
  };
  proof_of_funds: {
    amount: Money;
    currency: string;
    status: string;
    provenance: {
      source_url?: string | null;
      source_title?: string | null;
      source_checked_at?: string | null;
      representation: string;
    };
  };
  planned_costs: {
    items: CostItem[];
    by_category: Record<string, number>;
    total: number;
    overlap_rule: string;
  };
  target: {
    date?: string | null;
    status: string;
    months_remaining: number | null;
  };
  assessment: {
    status: string;
    combined_target: Money;
    funding_gap: Money;
    surplus: Money;
    monthly_savings_target: Money;
    currency_mismatch: boolean;
    currency_mismatches: Array<{ field: string; currency: string }>;
    planning_only: boolean;
  };
  warnings: string[];
  safety_note: string;
};

type FinancialReadinessResponse = {
  ok: boolean;
  contract_version: string;
  error?: string;
  field?: string;
  route?: {
    country_code?: string;
    country_name?: string;
    route_code?: string;
    route_name?: string;
    freshness_status?: string;
    source_confidence?: string;
    verified_at?: string | null;
  };
  estimated_costs?: {
    minimum: number;
    maximum: number;
    currency: string;
    items: Array<{
      name: string;
      category: string;
      minimum: number;
      maximum: number;
      currency: string;
      required: boolean;
      notes?: string | null;
    }>;
  };
  financial_plan?: FinancialPlan;
  safety_note?: string;
};

type RouteChoice = {
  key: string;
  countryCode: string;
  routeCode: string;
  label: string;
};

const ROUTES: RouteChoice[] = [
  {
    key: "FI:d-visa",
    countryCode: "FI",
    routeCode: "d-visa",
    label: "Finland — D visa / fast-track",
  },
  {
    key: "PT:entrepreneur-independent-work",
    countryCode: "PT",
    routeCode: "entrepreneur-independent-work",
    label: "Portugal — entrepreneur / independent work",
  },
  {
    key: "EE:startup-founder",
    countryCode: "EE",
    routeCode: "startup-founder",
    label: "Estonia — startup founder",
  },
];

const COST_FIELDS = [
  { key: "fees", label: "Fees", hint: "Application, document and related fees" },
  { key: "tuition", label: "Tuition", hint: "Enter only when relevant to this route" },
  { key: "relocation", label: "Other relocation costs", hint: "Insurance, documents and local setup" },
  { key: "flight", label: "Flight", hint: "Your planning amount" },
  { key: "accommodation", label: "Accommodation", hint: "Initial housing or deposit" },
  { key: "settlement_reserve", label: "Settlement reserve", hint: "Arrival and emergency buffer" },
] as const;

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  COST_FIELDS.map((field) => [field.key, field.label]),
);

function readable(value?: string | null) {
  return String(value || "not recorded").replaceAll("_", " ");
}

function optionalNumber(formData: FormData, key: string) {
  const raw = String(formData.get(key) || "").trim();
  return raw === "" ? undefined : Number(raw);
}

function money(currency: string, value: Money) {
  if (value === null || value === undefined) return "Not calculated";
  return `${currency} ${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function dateLabel(value?: string | null) {
  if (!value) return "Not recorded";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function statusCopy(status: string) {
  const messages: Record<string, { title: string; detail: string; tone: string }> = {
    requirements_needed: {
      title: "Official requirement needed",
      detail: "The complete target and gap remain unresolved until you enter the current route- and household-specific requirement.",
      tone: "warning",
    },
    source_review_required: {
      title: "Source review required",
      detail: "The entered amount was calculated as a scenario, but it needs a current HTTPS authority source before you rely on it.",
      tone: "warning",
    },
    currency_mismatch: {
      title: "Currencies do not match",
      detail: "MoveReady did not combine the figures or guess an exchange rate. Align the scenario currency with every entered amount.",
      tone: "danger",
    },
    ready_on_entered_figures: {
      title: "Covered on entered figures",
      detail: "Your entered resources cover this planning target. This is not financial eligibility or an approval prediction.",
      tone: "complete",
    },
    funding_gap: {
      title: "Funding gap remains",
      detail: "Use the gap and monthly target as a planning guide, then verify every amount and evidence rule before acting.",
      tone: "warning",
    },
  };
  return messages[status] || { title: readable(status), detail: "Review the figures and warnings before taking action.", tone: "" };
}

function sourceStatusCopy(status: string) {
  if (status === "user_supplied_source") return "User-supplied source added";
  if (status === "source_required") return "HTTPS authority source needed";
  if (status === "requirement_not_provided") return "Requirement not entered";
  return readable(status);
}

export default function FinancialReadinessWorkspace() {
  const [result, setResult] = useState<FinancialReadinessResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const route = ROUTES.find((item) => item.key === String(formData.get("route_key"))) || ROUTES[0];
    const sourceUrl = String(formData.get("proof_source_url") || "").trim();

    setError("");
    setResult(null);

    if (sourceUrl && !sourceUrl.toLowerCase().startsWith("https://")) {
      setError("Use a complete HTTPS authority URL for the proof-of-funds source, or leave it blank and treat the requirement as unresolved.");
      requestAnimationFrame(() => resultRef.current?.focus());
      return;
    }

    const costs: Record<string, number> = {};
    for (const field of COST_FIELDS) {
      const value = optionalNumber(formData, field.key);
      if (value !== undefined) costs[field.key] = value;
    }

    const proofAmount = optionalNumber(formData, "proof_amount");
    const targetDate = String(formData.get("target_date") || "").trim();
    const sourceTitle = String(formData.get("proof_source_title") || "").trim();
    const sourceCheckedAt = String(formData.get("proof_source_checked_at") || "").trim();

    setLoading(true);
    try {
      const response = await apiJson<FinancialReadinessResponse>("financial-readiness/check", {
        method: "POST",
        useAuthToken: false,
        body: {
          country_code: route.countryCode,
          route_code: route.routeCode,
          currency: String(formData.get("currency") || "EUR"),
          savings: Number(formData.get("savings") || 0),
          expected_funding: Number(formData.get("expected_funding") || 0),
          family_size: Number(formData.get("family_size") || 1),
          proof_of_funds: {
            amount: proofAmount,
            currency: String(formData.get("currency") || "EUR"),
            source_url: sourceUrl || undefined,
            source_title: sourceTitle || undefined,
            source_checked_at: sourceCheckedAt || undefined,
          },
          costs,
          target_date: targetDate || undefined,
        },
      });

      if (response.contract_version !== "b09-v1" || response.financial_plan?.contract_version !== "b09-v1") {
        throw new Error("The deployed backend does not yet expose the B09 Financial Readiness contract.");
      }
      setResult(response);
    } catch (caught) {
      if (caught instanceof ApiError) {
        const field = typeof caught.data?.field === "string" ? ` (${readable(caught.data.field)})` : "";
        setError(`${caught.message}${field}`);
      } else {
        setError(caught instanceof Error ? caught.message : "Financial readiness is temporarily unavailable. Try again after confirming the backend deployment.");
      }
    } finally {
      setLoading(false);
      requestAnimationFrame(() => resultRef.current?.focus());
    }
  }

  function reset() {
    formRef.current?.reset();
    setResult(null);
    setError("");
  }

  const plan = result?.financial_plan;
  const assessment = plan ? statusCopy(plan.assessment.status) : null;
  const proofSource = plan?.proof_of_funds.provenance;
  const hasProofLink = Boolean(proofSource?.source_url?.toLowerCase().startsWith("https://"));

  return (
    <section className="financial-shell" aria-labelledby="financial-heading">
      <header className="financial-hero">
        <div>
          <span className="eyebrow">QUALIFY · FINANCIAL READINESS</span>
          <h1 id="financial-heading">Build a truthful funding plan before you commit.</h1>
          <p>
            Combine current savings, expected funding and route costs with a requirement you sourced for the exact route and household. MoveReady does not invent family multipliers, exchange rates or approval chances.
          </p>
          <div className="financial-trust-row" aria-label="Financial readiness boundaries">
            <span>Route-backed estimates</span>
            <span>User-entered source</span>
            <span>No currency guessing</span>
          </div>
        </div>
        <aside className="financial-hero-note">
          <strong>Planning—not eligibility</strong>
          <p>A positive result means only that your entered resources cover your entered scenario. The authority decides acceptable amounts and evidence.</p>
          <a href="/proof-of-funds">Review proof-of-funds evidence</a>
        </aside>
      </header>

      <div className="financial-workspace">
        <form className="financial-form" onSubmit={submit} ref={formRef}>
          <div className="financial-form-heading">
            <div>
              <p className="overline">Your scenario</p>
              <h2>Enter only figures you can explain</h2>
            </div>
            <span className="badge">B09 contract</span>
          </div>

          <fieldset className="financial-fieldset">
            <legend>1. Route and household</legend>
            <div className="financial-form-grid">
              <div className="field financial-wide">
                <label htmlFor="financial-route">Route</label>
                <select id="financial-route" name="route_key" defaultValue={ROUTES[0].key}>
                  {ROUTES.map((route) => <option value={route.key} key={route.key}>{route.label}</option>)}
                </select>
                <small>Choose the exact country and route represented by your figures.</small>
              </div>
              <div className="field">
                <label htmlFor="financial-currency">Scenario currency</label>
                <select id="financial-currency" name="currency" defaultValue="EUR">
                  {['EUR', 'USD', 'GBP', 'CAD', 'NGN', 'KWD'].map((currency) => <option key={currency}>{currency}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="financial-family-size">Family size including you</label>
                <input id="financial-family-size" name="family_size" type="number" min="1" step="1" defaultValue="1" required />
                <small>MoveReady records family size as context and applies no multiplier.</small>
              </div>
            </div>
          </fieldset>

          <fieldset className="financial-fieldset">
            <legend>2. Resources and target date</legend>
            <div className="financial-form-grid">
              <div className="field">
                <label htmlFor="financial-savings">Current savings</label>
                <input id="financial-savings" name="savings" type="number" min="0" step="0.01" defaultValue="0" required />
              </div>
              <div className="field">
                <label htmlFor="financial-expected">Expected funding</label>
                <input id="financial-expected" name="expected_funding" type="number" min="0" step="0.01" defaultValue="0" />
                <small>Scholarship, confirmed support or funding not yet in savings.</small>
              </div>
              <div className="field financial-wide">
                <label htmlFor="financial-target-date">Target date</label>
                <input id="financial-target-date" name="target_date" type="date" />
                <small>Needed to calculate a monthly savings target.</small>
              </div>
            </div>
          </fieldset>

          <fieldset className="financial-fieldset">
            <legend>3. Proof-of-funds requirement</legend>
            <p className="financial-fieldset-intro">Enter the current amount for the exact route and family size. Leave it blank if you have not confirmed it.</p>
            <div className="financial-form-grid">
              <div className="field">
                <label htmlFor="financial-proof-amount">Requirement amount</label>
                <input id="financial-proof-amount" name="proof_amount" type="number" min="0" step="0.01" placeholder="Not yet confirmed" />
              </div>
              <div className="field">
                <label htmlFor="financial-source-date">Source checked on</label>
                <input id="financial-source-date" name="proof_source_checked_at" type="date" />
              </div>
              <div className="field financial-wide">
                <label htmlFor="financial-source-title">Authority/source title</label>
                <input id="financial-source-title" name="proof_source_title" placeholder="Example: official financial means instructions" />
              </div>
              <div className="field financial-wide">
                <label htmlFor="financial-source-url">HTTPS authority URL</label>
                <input id="financial-source-url" name="proof_source_url" type="url" inputMode="url" placeholder="https://..." />
                <small>A link records your reference; it does not mean MoveReady verified the amount.</small>
              </div>
            </div>
          </fieldset>

          <fieldset className="financial-fieldset">
            <legend>4. Cost scenario</legend>
            <p className="financial-fieldset-intro">Leave a category blank to use the route estimate where available. Entering a value replaces that category—not every route cost.</p>
            <div className="financial-cost-grid">
              {COST_FIELDS.map((field) => (
                <div className="field" key={field.key}>
                  <label htmlFor={`financial-${field.key}`}>{field.label}</label>
                  <input id={`financial-${field.key}`} name={field.key} type="number" min="0" step="0.01" placeholder="Use route estimate" />
                  <small>{field.hint}</small>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="financial-form-actions">
            <button className="btn primary" type="submit" disabled={loading}>{loading ? "Calculating…" : "Build financial plan"}</button>
            <button className="btn" type="button" onClick={reset} disabled={loading}>Reset</button>
          </div>
          <p className="financial-private-note">Enter planning totals only. Do not paste bank statements, account numbers or transaction histories.</p>
        </form>

        <section className="financial-result" ref={resultRef} tabIndex={-1} aria-live="polite" aria-busy={loading}>
          {loading ? (
            <div className="financial-empty-state">
              <span className="status-dot">Calculating</span>
              <h2>Building your scenario…</h2>
              <p>MoveReady is separating resources, route estimates, your sourced requirement and cost overrides.</p>
            </div>
          ) : error ? (
            <div className="financial-error-state" role="alert">
              <span className="status-dot danger">Unable to calculate</span>
              <h2>Review the scenario</h2>
              <p>{error}</p>
              <button className="btn" type="button" onClick={() => formRef.current?.querySelector<HTMLSelectElement>("#financial-route")?.focus()}>Return to form</button>
            </div>
          ) : !plan ? (
            <div className="financial-empty-state">
              <span className="status-dot">Ready for your figures</span>
              <h2>Your funding plan will appear here.</h2>
              <p>Start with the route and current savings. If the official requirement is unresolved, leave it blank—the result will fail closed instead of treating it as zero.</p>
            </div>
          ) : (
            <div className="financial-result-stack">
              <article className={`financial-assessment-card ${assessment?.tone || ""}`}>
                <div>
                  <p className="overline">Assessment</p>
                  <h2>{assessment?.title}</h2>
                  <p>{assessment?.detail}</p>
                </div>
                <span className={`status-dot ${assessment?.tone || ""}`}>{readable(plan.assessment.status)}</span>
              </article>

              <div className="financial-metric-grid">
                <article><span>Total resources</span><strong>{money(plan.currency, plan.resources.total)}</strong><small>Savings + expected funding</small></article>
                <article><span>Combined target</span><strong>{money(plan.currency, plan.assessment.combined_target)}</strong><small>Sourced requirement + planned costs</small></article>
                <article className={plan.assessment.funding_gap && plan.assessment.funding_gap > 0 ? "warning" : ""}><span>Funding gap</span><strong>{money(plan.currency, plan.assessment.funding_gap)}</strong><small>Planning gap—not an approval score</small></article>
                <article><span>Monthly target</span><strong>{money(plan.currency, plan.assessment.monthly_savings_target)}</strong><small>{plan.target.months_remaining === null ? "Add a future target date" : `${plan.target.months_remaining} month(s) remaining`}</small></article>
              </div>

              <article className="financial-result-card">
                <div className="financial-card-heading">
                  <div><p className="overline">Route context</p><h2>{result?.route?.route_name || "Selected route"}</h2></div>
                  <span className="badge">{result?.route?.country_name || result?.route?.country_code}</span>
                </div>
                <div className="financial-fact-grid">
                  <div><strong>Source confidence</strong><span>{readable(result?.route?.source_confidence)}</span></div>
                  <div><strong>Freshness</strong><span>{readable(result?.route?.freshness_status)}</span></div>
                  <div><strong>Route verified</strong><span>{dateLabel(result?.route?.verified_at)}</span></div>
                  <div><strong>Route cost range</strong><span>{result?.estimated_costs ? `${result.estimated_costs.currency} ${result.estimated_costs.minimum.toLocaleString()}–${result.estimated_costs.maximum.toLocaleString()}` : "Not available"}</span></div>
                </div>
              </article>

              <article className="financial-result-card financial-source-card">
                <div className="financial-card-heading">
                  <div><p className="overline">Proof-of-funds provenance</p><h2>{sourceStatusCopy(plan.proof_of_funds.status)}</h2></div>
                  <span className={`status-dot ${plan.proof_of_funds.status === "user_supplied_source" ? "complete" : "warning"}`}>{readable(plan.proof_of_funds.status)}</span>
                </div>
                <div className="financial-fact-grid">
                  <div><strong>Entered requirement</strong><span>{money(plan.proof_of_funds.currency, plan.proof_of_funds.amount)}</span></div>
                  <div><strong>Family size</strong><span>{plan.household.family_size} · no MoveReady multiplier</span></div>
                  <div><strong>Source checked</strong><span>{dateLabel(proofSource?.source_checked_at)}</span></div>
                  <div><strong>Representation</strong><span>User-supplied reference, not MoveReady verification</span></div>
                </div>
                <div className="financial-source-link">
                  <strong>{proofSource?.source_title || "No authority/source title recorded"}</strong>
                  {hasProofLink ? <a href={proofSource?.source_url || "#"} target="_blank" rel="noreferrer">Open the entered source ↗</a> : <span>Add a current HTTPS authority source before relying on this requirement.</span>}
                </div>
              </article>

              <article className="financial-result-card">
                <div className="financial-card-heading">
                  <div><p className="overline">Resources</p><h2>What funds the scenario</h2></div>
                  <span className="badge">{plan.currency}</span>
                </div>
                <div className="financial-fact-grid three">
                  <div><strong>Current savings</strong><span>{money(plan.currency, plan.resources.savings)}</span></div>
                  <div><strong>Expected funding</strong><span>{money(plan.currency, plan.resources.expected_funding)}</span></div>
                  <div><strong>Surplus after target</strong><span>{money(plan.currency, plan.assessment.surplus)}</span></div>
                </div>
              </article>

              <article className="financial-result-card">
                <div className="financial-card-heading">
                  <div><p className="overline">Cost scenario</p><h2>{money(plan.currency, plan.planned_costs.total)}</h2></div>
                  <span className="badge">Six categories</span>
                </div>
                <div className="financial-category-grid">
                  {COST_FIELDS.map((field) => <div key={field.key}><span>{field.label}</span><strong>{money(plan.currency, plan.planned_costs.by_category[field.key] ?? 0)}</strong></div>)}
                </div>
                <div className="financial-cost-items">
                  {plan.planned_costs.items.length ? plan.planned_costs.items.map((item, index) => (
                    <div key={`${item.category}-${item.label}-${index}`}>
                      <div><strong>{item.label}</strong><span>{CATEGORY_LABELS[item.category] || readable(item.category)}</span></div>
                      <div><strong>{money(item.currency, item.amount)}</strong><span>{item.source_type === "route_estimate" ? "Route estimate" : "Your override"} · {readable(item.amount_basis)}</span></div>
                    </div>
                  )) : <p>No route or user-entered cost items were available for this scenario.</p>}
                </div>
                <p className="financial-overlap-note">{plan.planned_costs.overlap_rule}</p>
              </article>

              {plan.assessment.currency_mismatches.length ? (
                <article className="financial-warning-card danger">
                  <strong>Currency mismatches</strong>
                  <ul>{plan.assessment.currency_mismatches.map((item, index) => <li key={`${item.field}-${index}`}>{readable(item.field)} uses {item.currency}</li>)}</ul>
                </article>
              ) : null}

              {plan.warnings.length ? (
                <article className="financial-warning-card">
                  <strong>Review before relying on this plan</strong>
                  <ul>{plan.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
                </article>
              ) : null}

              <article className="financial-safety-card">
                <strong>Safety boundary</strong>
                <p>{plan.safety_note || result?.safety_note}</p>
                <div><a className="btn" href="/proof-of-funds">Evidence checklist</a><a className="btn" href="/evidence-pack">Organize evidence metadata</a></div>
              </article>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
