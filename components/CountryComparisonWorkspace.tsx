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

type Opportunity = {
  id?: string;
  opportunity_code: string;
  country_code?: string | null;
  country_name?: string | null;
  opportunity_name: string;
  opportunity_type?: string | null;
  route_category?: string | null;
  availability_status?: string | null;
  source_confidence?: string | null;
  next_review_due_at?: string | null;
};

type ComparisonRow = Country & {
  routes: RouteItem[];
  opportunities: Opportunity[];
  route_count: number;
  opportunity_count: number;
  route_categories: string[];
  opportunity_types: string[];
  risk_label: string;
  source_confidence_label: string;
  freshness_label: string;
  active_route_count?: number;
  review_due_route_count?: number;
  open_opportunity_count?: number;
  monitoring_opportunity_count?: number;
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

const knownRouteFallbacks: RouteItem[] = [
  {
    route_code: "startup-founder",
    route_name: "Estonia startup founder pathway",
    route_category: "startup",
    country_code: "EE",
    country_name: "Estonia",
    risk_level: "medium",
    freshness_status: "available_starter",
    source_confidence: "high",
    summary: "For non-EU founders preparing Startup Committee evidence, D visa readiness, funds, documents, insurance, and startup-route next steps.",
  },
  {
    route_code: "d-visa",
    route_name: "Finland D visa / fast-track pathway",
    route_category: "work",
    country_code: "FI",
    country_name: "Finland",
    risk_level: "medium",
    freshness_status: "available_starter",
    source_confidence: "high",
    summary: "For eligible Finnish residence-permit applicants using D visa or fast-track travel readiness after the correct official process.",
  },
  {
    route_code: "entrepreneur-independent-work",
    route_name: "Portugal entrepreneur and independent work pathway",
    route_category: "business",
    country_code: "PT",
    country_name: "Portugal",
    risk_level: "medium",
    freshness_status: "available_starter",
    source_confidence: "high",
    summary: "For entrepreneurs, independent professionals, and startup founders comparing national visa readiness, documents, funds, insurance, and residence next steps.",
  },
];

function routeKey(route: RouteItem) {
  return `${route.country_code || ""}-${route.route_code || route.route_name || ""}`;
}

function mergeKnownRoutes(routes: RouteItem[]) {
  const existing = new Set(routes.map(routeKey));
  return [
    ...routes,
    ...knownRouteFallbacks.filter((route) => !existing.has(routeKey(route))),
  ];
}

function attachKnownRoutes(rows: Partial<ComparisonRow>[]) {
  const knownCountryCodes = new Set(knownRouteFallbacks.map((route) => route.country_code).filter(Boolean));
  const existingCountryCodes = new Set(rows.map((row) => row.country_code).filter(Boolean));
  const mergedRows = rows.map((row) => {
    const existingRoutes = row.routes || [];
    const knownMatches = knownRouteFallbacks.filter((route) => route.country_code === row.country_code);
    const existingRouteKeys = new Set(existingRoutes.map(routeKey));
    const routes = [
      ...existingRoutes,
      ...knownMatches.filter((route) => !existingRouteKeys.has(routeKey(route))),
    ];

    return {
      ...row,
      routes,
      route_count: Math.max(Number(row.route_count ?? 0), routes.length),
    };
  });

  const missingRows = Array.from(knownCountryCodes)
    .filter((countryCode) => countryCode && !existingCountryCodes.has(countryCode))
    .map((countryCode) => {
      const route = knownRouteFallbacks.find((item) => item.country_code === countryCode);
      const routes = knownRouteFallbacks.filter((item) => item.country_code === countryCode);
      return {
        country_code: countryCode || "",
        country_name: route?.country_name || "Country pending",
        region: "Europe",
        currency_code: "EUR",
        summary: route?.summary,
        routes,
        route_count: routes.length,
        opportunities: [],
      };
    });

  return [...mergedRows, ...missingRows];
}

function labelFromRisk(routes: RouteItem[]) {
  const scored = routes
    .map((route) => String(route.risk_level || "").toLowerCase())
    .filter(Boolean)
    .sort((a, b) => (riskWeight[b] || 0) - (riskWeight[a] || 0));
  return scored[0] || "review required";
}

function confidenceFromRecords(routes: RouteItem[], opportunities: Opportunity[]) {
  const labels = [
    ...routes.map((route) => route.source_confidence),
    ...opportunities.map((opportunity) => opportunity.source_confidence),
  ].filter(Boolean) as string[];
  if (!labels.length) return "source review required";
  const sorted = labels.sort((a, b) => (confidenceWeight[b.toLowerCase()] || 0) - (confidenceWeight[a.toLowerCase()] || 0));
  return sorted[0];
}

function freshnessFromRoutes(routes: RouteItem[]) {
  if (routes.some((route) => route.freshness_status === "active")) return "active route available";
  if (routes.some((route) => route.freshness_status === "review_due")) return "source review due";
  if (routes.some((route) => route.freshness_status === "available_starter")) return "available starter route";
  return routes.length ? "review route before use" : "route data needed";
}

function opportunityTypesFromRows(opportunities: Opportunity[]) {
  return Array.from(new Set(opportunities.map((item) => item.opportunity_type || item.route_category).filter(Boolean))) as string[];
}

function attachOpportunities(rows: Partial<ComparisonRow>[], opportunities: Opportunity[]) {
  return rows.map((row) => {
    const countryCode = row.country_code || "";
    const existing = row.opportunities || [];
    const matched = opportunities.filter((opportunity) => opportunity.country_code === countryCode);
    return {
      ...row,
      opportunities: existing.length ? existing : matched,
    };
  });
}

function normalizeRows(rows: Partial<ComparisonRow>[]) {
  return rows.map((row) => {
    const routes = row.routes || [];
    const opportunities = row.opportunities || [];
    const routeCategories = row.route_categories?.length
      ? row.route_categories
      : (Array.from(new Set(routes.map((route) => route.route_category).filter(Boolean))) as string[]);
    const opportunityTypes = row.opportunity_types?.length
      ? row.opportunity_types
      : opportunityTypesFromRows(opportunities);

    return {
      id: row.id,
      country_code: row.country_code || "",
      country_name: row.country_name || "Country pending",
      region: row.region,
      currency_code: row.currency_code,
      summary: row.summary,
      routes,
      opportunities,
      route_count: Math.max(Number(row.route_count ?? 0), routes.length),
      opportunity_count: Math.max(Number(row.opportunity_count ?? 0), opportunities.length),
      route_categories: routeCategories,
      opportunity_types: opportunityTypes,
      risk_label: row.risk_label || labelFromRisk(routes),
      source_confidence_label: row.source_confidence_label || confidenceFromRecords(routes, opportunities),
      freshness_label: row.freshness_label || freshnessFromRoutes(routes),
      active_route_count: row.active_route_count,
      review_due_route_count: row.review_due_route_count,
      open_opportunity_count: row.open_opportunity_count ?? opportunities.filter((item) => ["open", "results_open"].includes(String(item.availability_status || ""))).length,
      monitoring_opportunity_count: row.monitoring_opportunity_count ?? opportunities.filter((item) => String(item.availability_status || "") === "monitoring").length,
      last_verified_at: row.last_verified_at,
    } satisfies ComparisonRow;
  });
}

function rowsFromCountryAndRoutes(countries: Country[], routes: RouteItem[], opportunities: Opportunity[]): ComparisonRow[] {
  return normalizeRows(attachKnownRoutes(countries.map((country) => {
    const mergedRoutes = mergeKnownRoutes(routes);
    const countryRoutes = mergedRoutes.filter((route) => route.country_code === country.country_code);
    const countryOpportunities = opportunities.filter((opportunity) => opportunity.country_code === country.country_code);
    return {
      ...country,
      routes: countryRoutes,
      opportunities: countryOpportunities,
    };
  })));
}

function getRiskRank(label: string) {
  return riskWeight[label.toLowerCase()] || 99;
}

function getConfidenceRank(label: string) {
  const value = label.toLowerCase();
  if (value.includes("review")) return 0;
  return confidenceWeight[value] || 0;
}

async function loadOpportunities() {
  try {
    const data = await apiJson<{ opportunities: Opportunity[] }>("opportunities", { timeoutMs: 15000 });
    return data.opportunities || [];
  } catch {
    return [];
  }
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
      const opportunities = await loadOpportunities();

      try {
        const comparisonData = await apiJson<{ countries: ComparisonRow[]; source_status?: string }>("relocation/country-comparison", { timeoutMs: 15000 });
        if (cancelled) return;
        const rows = normalizeRows(attachKnownRoutes(attachOpportunities(comparisonData.countries || [], opportunities)));
        setComparisonRows(rows);
        setStatus(comparisonData.source_status === "starter_fallback" ? "Starter comparison loaded with launch routes" : "Live country comparison loaded with launch routes");
      } catch {
        try {
          const [countryData, routeData] = await Promise.all([
            apiJson<{ countries: Country[] }>("relocation/countries", { timeoutMs: 15000 }),
            apiJson<{ routes: RouteItem[] }>("relocation/routes", { timeoutMs: 15000 }),
          ]);
          if (cancelled) return;
          setComparisonRows(rowsFromCountryAndRoutes(countryData.countries || [], routeData.routes || [], opportunities));
          setStatus("Live country, route, and opportunity data loaded with launch routes");
        } catch {
          if (cancelled) return;
          setComparisonRows(normalizeRows(attachKnownRoutes([])));
          setStatus("Starter launch routes loaded. Live comparison data is temporarily unavailable.");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(comparisonRows.flatMap((country) => [...country.route_categories, ...country.opportunity_types]))).filter(Boolean).sort();
  }, [comparisonRows]);

  const metrics = useMemo(() => {
    const countries = comparisonRows.length;
    const routes = comparisonRows.reduce((total, country) => total + country.route_count, 0);
    const opportunities = comparisonRows.reduce((total, country) => total + country.opportunity_count, 0);
    const active = comparisonRows.reduce((total, country) => total + (country.active_route_count || country.routes.filter((route) => ["active", "available_starter"].includes(String(route.freshness_status || ""))).length), 0);
    const highConfidence = comparisonRows.filter((country) => country.source_confidence_label.toLowerCase() === "high").length;
    return { countries, routes, opportunities, active, highConfidence };
  }, [comparisonRows]);

  const rows = useMemo<ComparisonRow[]>(() => {
    const q = query.trim().toLowerCase();
    const filtered = comparisonRows.filter((country) => {
      const routeText = country.routes.map((route) => [route.route_name, route.route_code, route.route_category, route.summary].filter(Boolean).join(" ")).join(" ");
      const opportunityText = country.opportunities.map((item) => [item.opportunity_name, item.opportunity_code, item.opportunity_type, item.availability_status].filter(Boolean).join(" ")).join(" ");
      const matchesQuery = !q || [country.country_name, country.country_code, country.region, country.summary, routeText, opportunityText]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
      const matchesCategory = !categoryFilter || country.route_categories.includes(categoryFilter) || country.opportunity_types.includes(categoryFilter);
      const matchesConfidence = !confidenceFilter || country.source_confidence_label.toLowerCase() === confidenceFilter;
      return matchesQuery && matchesCategory && matchesConfidence;
    });

    return filtered.sort((a, b) => {
      if (sortMode === "country") return a.country_name.localeCompare(b.country_name);
      if (sortMode === "risk") return getRiskRank(a.risk_label) - getRiskRank(b.risk_label);
      if (sortMode === "confidence") return getConfidenceRank(b.source_confidence_label) - getConfidenceRank(a.source_confidence_label);
      if (sortMode === "opportunity_count") return b.opportunity_count - a.opportunity_count;
      return b.route_count - a.route_count;
    });
  }, [categoryFilter, comparisonRows, confidenceFilter, query, sortMode]);

  return (
    <div className="country-compare-workspace">
      <div className="metric-grid compact-metric-grid">
        <div className="metric-item"><strong>{metrics.countries}</strong><span>Countries</span></div>
        <div className="metric-item"><strong>{metrics.routes}</strong><span>Route records</span></div>
        <div className="metric-item"><strong>{metrics.opportunities}</strong><span>Opportunity records</span></div>
        <div className="metric-item"><strong>{metrics.active}</strong><span>Available route versions</span></div>
        <div className="metric-item"><strong>{metrics.highConfidence}</strong><span>High-confidence countries</span></div>
      </div>

      <div className="admin-toolbar">
        <div className="field">
          <label htmlFor="country-search">Search country, route, opportunity, region, or summary</label>
          <input id="country-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: Estonia, Finland, Portugal, startup, D visa, working holiday" />
        </div>
        <div className="field">
          <label htmlFor="country-category-filter">Route or opportunity category</label>
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
            <option value="opportunity_count">Most opportunity records</option>
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
          <span>Routes and opportunities</span>
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
              <strong className="submetric">{country.opportunity_count} opportunity record{country.opportunity_count === 1 ? "" : "s"}</strong>
              <div className="badge-row compact-badges">
                {(country.opportunity_types.length ? country.opportunity_types : ["opportunities pending"]).map((type) => (
                  <span className="badge" key={type}>{type}</span>
                ))}
              </div>
            </div>
            <div role="cell">
              <div className="mini-list compact-list">
                <div><strong>Risk</strong><span>{country.risk_label}</span></div>
                <div><strong>Source confidence</strong><span>{country.source_confidence_label}</span></div>
                <div><strong>Freshness</strong><span>{country.freshness_label}</span></div>
                <div><strong>Opportunity status</strong><span>{country.open_opportunity_count || 0} open/result, {country.monitoring_opportunity_count || 0} monitoring</span></div>
              </div>
            </div>
            <div className="actions stacked-actions" role="cell">
              <a className="btn primary" href={`/route-checker?country=${country.country_code}`}>Check route</a>
              <a className="btn" href={`/opportunities?country=${country.country_code}`}>View opportunities</a>
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
          grid-template-columns: repeat(5, minmax(0, 1fr));
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
          grid-template-columns: 1.15fr 1fr 1fr 0.75fr;
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
        .compact-badges { margin-top: 12px; }
        .submetric { display: block; margin-top: 18px; }
        .compact-list { gap: 8px; }
        .stacked-actions { align-items: stretch; flex-direction: column; }
        .stacked-actions .btn { width: 100%; justify-content: center; }
        @media (max-width: 1180px) {
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
