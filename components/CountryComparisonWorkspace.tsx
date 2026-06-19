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

const confidenceWeight: Record<string, number> = {
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
  const sorted = labels.sort((a, b) => (confidenceWeight[b.toLowerCase()] || 0) - (confidenceWeight[a.toLowerCase()] || 0));
  return sorted[0];
}

function freshnessFromRoutes(routes: RouteItem[]) {
  if (routes.some((route) => route.freshness_status === "active")) return "active route available";
  if (routes.some((route) => route.freshness_status === "review_due")) return "source review due";
  return routes.length ? "review route before use" : "route data needed";
}

function normalizeRows(rows: Partial<ComparisonRow>[]) {
  return rows.map((row) => {
    const routes = row.routes || [];
    const routeCategories = row.route_categories?.length
      ? row.route_categories
      : (Array.from(new Set(routes.map((route) => route.route_category).filter(Boolean))) as string[]);

    return {
      id: row.id,
      country_code: row.country_code || "",
      country_name: row.country_name || "Country pending",
      region: row.region,
      currency_code: row.currency_code,
      summary: row.summary,
      routes,
      route_count: Number(row.route_count ?? routes.length ?? 0),
      route_categories: routeCategories,
      risk_label: row.risk_label || labelFromRisk(routes),
      source_confidence_label: row.source_confidence_label || confidenceFromRoutes(routes),
      freshness_label: row.freshness_label || freshnessFromRoutes(routes),
      active_route_count: row.active_route_count,
      review_due_route_count: row.review_due_route_count,
      last_verified_at: row.last_verified_at,
    } satisfies ComparisonRow;
  });
}

function rowsFromCountryAndRoutes(countries: Country[], routes: RouteItem[]): ComparisonRow[] {
  return normalizeRows(countries.map((country) => {
    const countryRoutes = routes.filter((route) => route.country_code === country.country_code);
    return {
      ...country,
      routes: countryRoutes,
    };
  }));
}

function getRiskRank(label: string) {
  return riskWeight[label.toLowerCase()] || 99;
}

function getConfidenceRank(label: string) {
  const value = label.toLowerCase();
  if (value.includes("review")) return 0;
  return confidenceWeight[value] || 0;
}

export default function CountryComparisonWorkspace() {
  const [comparisonRows, setComparisonRows] = useState<ComparisonRow[]>([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [confidenceFilter, setConfidenceFilter] = useState("");
  const [sortMode, setSortMode] = useState("route_count");
  const [status, setStatus] = useState("Loading country comparison data...");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const comparisonData = await apiJson<{ countries: ComparisonRow[]; source_status?: string }>("relocation/country-comparison", { timeoutMs: 15000 });
        if (cancelled) return;
        setComparisonRows(normalizeRows(comparisonData.countries || []));
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

  const categories = useMemo(() => {
    return Array.from(new Set(comparisonRows.flatMap((country) => country.route_categories))).filter(Boolean).sort();
  }, [comparisonRows]);

  const metrics = useMemo(() => {
    const countries = comparisonRows.length;
    const routes = comparisonRows.reduce((total, country) => total + country.route_count, 0);
    const active = comparisonRows.reduce((total, country) => total + (country.active_route_count || country.routes.filter((route) => route.freshness_status === "active").length), 0);
    const highConfidence = comparisonRows.filter((country) => country.source_confidence_label.toLowerCase() === "high").length;
    return { countries, routes, active, highConfidence };
  }, [comparisonRows]);

  const rows = useMemo<ComparisonRow[]>(() => {
    const q = query.trim().toLowerCase();
    const filtered = comparisonRows.filter((country) => {
      const routeText = country.routes.map((route) => [route.route_name, route.route_code, route.route_category, route.summary].filter(Boolean).join(" ")).join(" ");
      const matchesQuery = !q || [country.country_name, country.country_code, country.region, country.summary, routeText]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
      const matchesCategory = !categoryFilter || country.route_categories.includes(categoryFilter);
      const matchesConfidence = !confidenceFilter || country.source_confidence_label.toLowerCase() === confidenceFilter;
      return matchesQuery && matchesCategory && matchesConfidence;
    });

    return filtered.sort((a, b) => {
      if (sortMode === "country") return a.country_name.localeCompare(b.country_name);
      if (sortMode === "risk") return getRiskRank(a.risk_label) - getRiskRank(b.risk_label);
      if (sortMode === "confidence") return getConfidenceRank(b.source_confidence_label) - getConfidenceRank(a.source_confidence_label);
      return b.route_count - a.route_count;
    });
  }, [categoryFilter, comparisonRows, confidenceFilter, query, sortMode]);

  return (
    <div className="country-compare-workspace">
      <div className="metric-grid compact-metric-grid">
        <div className="metric-item"><strong>{metrics.countries}</strong><span>Countries</span></div>
        <div className="metric-item"><strong>{metrics.routes}</strong><span>Route records</span></div>
        <div className="metric-item"><strong>{metrics.active}</strong><span>Active route versions</span></div>
        <div className="metric-item"><strong>{metrics.highConfidence}</strong><span>High-confidence countries</span></div>
      </div>

      <div className="admin-toolbar">
        <div className="field">
          <label htmlFor="country-search">Search country, route, region, or summary</label>
          <input id="country-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: Estonia, Finland, startup, D visa" />
        </div>
        <div className="field">
          <label htmlFor="country-category-filter">Route category</label>
          <select id="country-category-filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="country-confidence-filter">Source confidence</label>
          <select id="country-confidence-filter" value={confidenceFilter} onChange={(event) => setConfidenceFilter(event.target.value)}>
            <option value="">All confidence levels</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="country-sort">Sort by</label>
          <select id="country-sort" value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
            <option value="route_count">Most route records</option>
            <option value="confidence">Source confidence</option>
            <option value="risk">Lowest risk signal</option>
            <option value="country">Country name</option>
          </select>
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
        .compact-metric-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        .metric-item {
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 16px 18px;
          background: #fff;
          display: grid;
          gap: 4px;
        }
        .metric-item strong { font-size: 1.6rem; color: var(--ink); }
        .metric-item span { color: var(--muted); font-weight: 700; }
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
          .compact-metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .comparison-row { grid-template-columns: 1fr 1fr; }
          .comparison-head { display: none; }
        }
        @media (max-width: 720px) {
          .compact-metric-grid { grid-template-columns: 1fr; }
          .comparison-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
