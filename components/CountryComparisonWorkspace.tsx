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
  route_count: number;
  route_categories: string[];
  risk_label: string;
  source_confidence_label: string;
  freshness_label: string;
  active_route_count?: number;
  review_due_route_count?: number;
  last_verified_at?: string | null;
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

function rowsFromCountryAndRoutes(countries: Country[], routes: RouteItem[]): ComparisonRow[] {
  return countries.map((country) => {
    const countryRoutes = routes.filter((route) => route.country_code === country.country_code);
    const routeCategories = Array.from(new Set(countryRoutes.map((route) => route.route_category).filter(Boolean))) as string[];
    return {
      ...country,
      routes: countryRoutes,
      route_count: countryRoutes.length,
      route_categories: routeCategories,
      risk_label: labelFromRisk(countryRoutes),
      source_confidence_label: confidenceFromRoutes(countryRoutes),
      freshness_label: countryRoutes.some((route) => route.freshness_status === "active") ? "active route available" : "review route before use",
    };
  });
}

export default function CountryComparisonWorkspace() {
  const [comparisonRows, setComparisonRows] = useState<ComparisonRow[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Loading country comparison data...");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const comparisonData = await apiJson<{ countries: ComparisonRow[]; source_status?: string }>("relocation/country-comparison", { timeoutMs: 15000 });
        if (cancelled) return;
        setComparisonRows(comparisonData.countries || []);
        setStatus(comparisonData.source_status === "starter_fallback" ? "Starter comparison loaded" : "Live country comparison loaded");
      } catch {
        try {
          const [countryData, routeData] = await Promise.all([
            apiJson<{ countries: Country[] }>("relocation/countries", { timeoutMs: 15000 }),
            apiJson<{ routes: RouteItem[] }>("relocation/routes", { timeoutMs: 15000 }),
          ]);
          if (cancelled) return;
          setComparisonRows(rowsFromCountryAndRoutes(countryData.countries || [], routeData.routes || []));
          setStatus("Live country and route data loaded");
        } catch {
          if (cancelled) return;
          setStatus("Unable to load live comparison data. Check backend URL or deployment status.");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo<ComparisonRow[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return comparisonRows;
    return comparisonRows.filter((country) => {
      const routeText = country.routes.map((route) => [route.route_name, route.route_code, route.route_category, route.summary].filter(Boolean).join(" ")).join(" ");
      return [country.country_name, country.country_code, country.region, country.summary, routeText]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [comparisonRows, query]);

  return (
    <div className="country-compare-workspace">
      <div className="admin-toolbar">
        <div className="field">
          <label htmlFor="country-search">Search country, route, region, or summary</label>
          <input id="country-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: Estonia, Finland, startup, D visa" />
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
                {country.last_verified_at ? <span className="badge">Verified: {new Date(country.last_verified_at).toLocaleDateString()}</span> : null}
              </div>
            </div>
            <div role="cell">
              <strong>{country.route_count} route record{country.route_count === 1 ? "" : "s"}</strong>
              <div className="badge-row compact-badges">
                {(country.route_categories.length ? country.route_categories : ["route review required"]).map((category) => (
                  <span className="badge" key={category}>{category}</span>
                ))}
              </div>
            </div>
            <div role="cell">
              <div className="mini-list compact-list">
                <div><strong>Risk</strong><span>{country.risk_label}</span></div>
                <div><strong>Source confidence</strong><span>{country.source_confidence_label}</span></div>
                <div><strong>Freshness</strong><span>{country.freshness_label}</span></div>
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

      <style>{`
        .country-compare-workspace { display: grid; gap: 24px; }
        .comparison-table { display: grid; gap: 12px; }
        .comparison-row {
          display: grid;
          grid-template-columns: 1.25fr 0.9fr 1fr 0.75fr;
          gap: 20px;
          align-items: start;
          padding: 22px;
          border: 1px solid var(--line);
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