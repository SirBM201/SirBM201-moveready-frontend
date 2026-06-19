"use client";

import { useEffect, useMemo, useState } from "react";

import { apiJson } from "@/lib/api";

type Country = {
  id?: string;
  country_code: string;
  country_name: string;
  region?: string;
  currency_code?: string;
  summary?: string;
};

type RouteItem = {
  id?: string;
  route_code?: string;
  route_name?: string;
  route_category?: string;
  country_code?: string;
  country_name?: string;
  risk_level?: string | null;
  freshness_status?: string | null;
  source_confidence?: string | null;
  verified_at?: string | null;
  summary?: string | null;
};

type ComparisonRow = Country & {
  routes: RouteItem[];
  riskLabel: string;
  confidenceLabel: string;
  categories: string[];
};

const riskWeight: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

function labelFromRisk(routes: RouteItem[]) {
  const scored = routes
    .map((route) => String(route.risk_level || "").toLowerCase())
    .filter(Boolean)
    .sort((a, b) => (riskWeight[b] || 0) - (riskWeight[a] || 0));
  return scored[0] || "review required";
}

function confidenceFromRoutes(routes: RouteItem[]) {
  const labels = routes.map((route) => route.source_confidence).filter(Boolean) as string[];
  if (!labels.length) return "source review required";
  if (labels.some((label) => label.toLowerCase() === "high")) return "high";
  return labels[0];
}

export default function CountryComparisonWorkspace() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Loading country comparison data...");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [countryData, routeData] = await Promise.all([
          apiJson<{ countries: Country[] }>("relocation/countries", { timeoutMs: 15000 }),
          apiJson<{ routes: RouteItem[] }>("relocation/routes", { timeoutMs: 15000 }),
        ]);
        if (cancelled) return;
        setCountries(countryData.countries || []);
        setRoutes(routeData.routes || []);
        setStatus("Live country and route data loaded");
      } catch {
        if (cancelled) return;
        setStatus("Unable to load live comparison data. Check backend URL or deployment status.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo<ComparisonRow[]>(() => {
    const q = query.trim().toLowerCase();
    return countries
      .filter((country) => {
        if (!q) return true;
        return [country.country_name, country.country_code, country.region, country.summary]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      })
      .map((country) => {
        const countryRoutes = routes.filter((route) => route.country_code === country.country_code);
        const categories = Array.from(new Set(countryRoutes.map((route) => route.route_category).filter(Boolean))) as string[];
        return {
          ...country,
          routes: countryRoutes,
          riskLabel: labelFromRisk(countryRoutes),
          confidenceLabel: confidenceFromRoutes(countryRoutes),
          categories,
        };
      });
  }, [countries, query, routes]);

  return (
    <div className="country-compare-workspace">
      <div className="admin-toolbar">
        <div className="field">
          <label htmlFor="country-search">Search country, region, or summary</label>
          <input id="country-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: Estonia, Finland, Europe" />
        </div>
        <a className="btn primary" href="/route-checker">Generate readiness report</a>
        <a className="btn" href="/compare">Compare route families</a>
      </div>

      <p className="form-status">{status}</p>

      <div className="comparison-table" role="table" aria-label="Country comparison table">
        <div className="comparison-row comparison-head" role="row">
          <span>Country</span>
          <span>Routes</span>
          <span>Readiness signals</span>
          <span>Next action</span>
        </div>
        {rows.map((country) => (
          <article className="comparison-row" role="row" key={country.id || country.country_code}>
            <div role="cell">
              <span className="overline">{country.country_code} · {country.region || "Region pending"}</span>
              <h3>{country.country_name}</h3>
              <p>{country.summary || "Country summary pending source review."}</p>
              <div className="badge-row">
                {country.currency_code ? <span className="badge">{country.currency_code}</span> : null}
                <span className="badge">{country.country_code}</span>
              </div>
            </div>
            <div role="cell">
              <strong>{country.routes.length} route record{country.routes.length === 1 ? "" : "s"}</strong>
              <div className="badge-row compact-badges">
                {(country.categories.length ? country.categories : ["route review required"]).map((category) => (
                  <span className="badge" key={category}>{category}</span>
                ))}
              </div>
            </div>
            <div role="cell">
              <div className="mini-list compact-list">
                <div><strong>Risk</strong><span>{country.riskLabel}</span></div>
                <div><strong>Source confidence</strong><span>{country.confidenceLabel}</span></div>
                <div><strong>Freshness</strong><span>{country.routes.some((route) => route.freshness_status === "active") ? "active route available" : "review route before use"}</span></div>
              </div>
            </div>
            <div className="actions stacked-actions" role="cell">
              <a className="btn primary" href={`/route-checker?country=${country.country_code}`}>Check route</a>
              <a className="btn" href={`/saved-routes?country=${country.country_code}`}>Save country</a>
              <a className="btn" href={`/watchlist?type=country&code=${country.country_code}&title=${encodeURIComponent(country.country_name)}`}>Create alert</a>
            </div>
          </article>
        ))}
      </div>

      {!rows.length ? <p className="form-status">No countries match that filter.</p> : null}

      <style jsx>{`
        .country-compare-workspace { display: grid; gap: 24px; }
        .comparison-table { display: grid; gap: 12px; }
        .comparison-row {
          display: grid;
          grid-template-columns: 1.25fr 0.9fr 1fr 0.75fr;
          gap: 20px;
          align-items: start;
          padding: 22px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: #fff;
        }
        .comparison-head {
          padding: 12px 22px;
          background: transparent;
          color: var(--muted);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.78rem;
        }
        .comparison-row h3 { margin: 8px 0 8px; }
        .comparison-row p { margin: 0 0 14px; color: var(--muted); }
        .compact-badges { margin-top: 14px; }
        .compact-list { gap: 8px; }
        .stacked-actions { align-items: stretch; flex-direction: column; }
        .stacked-actions .btn { width: 100%; justify-content: center; }
        @media (max-width: 1100px) {
          .comparison-row { grid-template-columns: 1fr 1fr; }
          .comparison-head { display: none; }
        }
        @media (max-width: 720px) {
          .comparison-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
