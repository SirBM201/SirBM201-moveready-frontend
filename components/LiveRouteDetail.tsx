"use client";

import { useEffect, useMemo, useState } from "react";

import { apiJson } from "@/lib/api";

type RouteFact = {
  fact_key?: string;
  fact_label?: string;
  fact_value?: string;
  display_order?: number;
};

type DocumentRequirement = {
  document_name?: string;
  requirement_level?: string;
  applies_to?: string;
  details?: string;
  display_order?: number;
};

type BudgetItem = {
  item_name?: string;
  item_category?: string;
  amount_min?: number | string | null;
  amount_max?: number | string | null;
  currency_code?: string;
  is_required?: boolean;
  notes?: string;
};

type InsuranceRequirement = {
  insurance_type?: string;
  is_required?: boolean;
  minimum_coverage_amount?: number | string | null;
  currency_code?: string | null;
  details?: string;
};

type RouteDetail = {
  route_code?: string;
  route_name?: string;
  route_category?: string;
  country_code?: string;
  country_name?: string;
  active_version_id?: string;
  risk_level?: string;
  source_confidence?: string;
  freshness_status?: string;
  verified_at?: string | null;
  review_due_at?: string | null;
  summary?: string;
  facts?: RouteFact[];
  documents?: DocumentRequirement[];
  budget_items?: BudgetItem[];
  insurance_requirements?: InsuranceRequirement[];
};

type Props = {
  countryCode: string;
  routeCode: string;
};

function formatDate(value?: string | null) {
  if (!value) return "Pending";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function formatAmount(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return null;
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return amount.toLocaleString();
}

function BudgetRange({ item }: { item: BudgetItem }) {
  const min = formatAmount(item.amount_min);
  const max = formatAmount(item.amount_max);
  if (!min && !max) return null;
  return <span>{item.currency_code || ""} {min || "0"}{max ? ` - ${max}` : ""}</span>;
}

export default function LiveRouteDetail({ countryCode, routeCode }: Props) {
  const [route, setRoute] = useState<RouteDetail | null>(null);
  const [status, setStatus] = useState("Loading route detail...");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    apiJson<{ route: RouteDetail }>(`relocation/routes/by-code/${countryCode}/${routeCode}`, { timeoutMs: 15000 })
      .then((data) => {
        if (cancelled) return;
        setRoute(data.route || null);
        setStatus(data.route ? "Live route detail loaded" : "Route detail not found");
        setError("");
      })
      .catch(() => {
        if (cancelled) return;
        setError("Unable to load this route. The backend may still be redeploying, or the route seed SQL has not been run yet.");
        setStatus("Route detail unavailable");
      });

    return () => {
      cancelled = true;
    };
  }, [countryCode, routeCode]);

  const estimatedTotal = useMemo(() => {
    const items = route?.budget_items || [];
    const min = items.reduce((sum, item) => sum + Number(item.amount_min || 0), 0);
    const max = items.reduce((sum, item) => sum + Number(item.amount_max || 0), 0);
    return { min, max, currency: items[0]?.currency_code || "EUR" };
  }, [route]);

  if (!route) {
    return (
      <section className="route-detail-shell">
        <p className="form-status">{status}</p>
        {error ? <p className="form-error">{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="route-detail-shell">
      <p className="form-status">{status}</p>
      <div className="route-detail-layout">
        <aside className="route-detail-side">
          <span className="overline">Route status</span>
          <h2>{route.route_name || "Route detail"}</h2>
          <p>{route.summary || "Route summary pending official-source review."}</p>
          <div className="badge-row">
            {route.country_name ? <span className="badge">{route.country_name}</span> : null}
            {route.route_category ? <span className="badge">{route.route_category}</span> : null}
            {route.risk_level ? <span className="badge">Risk: {route.risk_level}</span> : null}
            {route.source_confidence ? <span className="badge">Confidence: {route.source_confidence}</span> : null}
            {route.freshness_status ? <span className="badge">{route.freshness_status}</span> : null}
          </div>
          <div className="route-metrics">
            <div><strong>Verified</strong><span>{formatDate(route.verified_at)}</span></div>
            <div><strong>Review due</strong><span>{formatDate(route.review_due_at)}</span></div>
            <div><strong>Budget range</strong><span>{estimatedTotal.currency} {estimatedTotal.min.toLocaleString()} - {estimatedTotal.max.toLocaleString()}</span></div>
          </div>
          <a className="btn primary full" href="/route-checker">Generate readiness report</a>
        </aside>

        <div className="route-detail-main">
          <article className="detail-section">
            <h3>Key route facts</h3>
            <div className="mini-list">
              {(route.facts || []).map((fact) => (
                <div key={fact.fact_key || fact.fact_label}>
                  <strong>{fact.fact_label || "Route fact"}</strong>
                  <span>{fact.fact_value || "Pending review."}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="detail-section">
            <h3>Document readiness</h3>
            <div className="mini-list two-col-list">
              {(route.documents || []).map((item) => (
                <div key={`${item.document_name}-${item.display_order}`}>
                  <strong>{item.document_name || "Document"}</strong>
                  <span>{item.requirement_level || "review"} · {item.details || "Details pending review."}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="detail-section">
            <h3>Budget and insurance</h3>
            <div className="mini-list two-col-list">
              {(route.budget_items || []).map((item) => (
                <div key={`${item.item_name}-${item.item_category}`}>
                  <strong>{item.item_name || "Budget item"}</strong>
                  <BudgetRange item={item} />
                  <span>{item.notes || "Estimate pending review."}</span>
                </div>
              ))}
              {(route.insurance_requirements || []).map((item) => (
                <div key={`${item.insurance_type}-${item.currency_code}`}>
                  <strong>{item.insurance_type || "Insurance"} insurance</strong>
                  <span>{item.is_required ? "Required" : "Conditional"}</span>
                  <span>{item.details || "Insurance details pending review."}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
