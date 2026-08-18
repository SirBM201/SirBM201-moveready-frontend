"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type Route = {
  country_code: string;
  country_name: string;
  route_code: string;
  route_name: string;
  route_category: string;
  risk_level?: string;
  source_confidence?: string;
  freshness_status?: string;
  verified_at?: string | null;
  summary?: string;
  costs: { minimum: number; maximum: number; currency?: string | null; mixed_currency: boolean };
  required_document_count: number;
  conditional_document_count: number;
  required_documents: string[];
  provenance: { source_kind?: string | null; active_version_id?: string | null };
};

type Result = {
  ok: boolean;
  error?: string;
  routes?: Route[];
  missing?: Array<{ country_code: string; route_code: string }>;
  comparison_rules?: Record<string, string>;
  safety_note?: string;
};

const options = [
  { key: "EE|startup-founder", label: "Estonia · Startup founder" },
  { key: "FI|d-visa", label: "Finland · D visa / fast-track" },
  { key: "PT|entrepreneur-independent-work", label: "Portugal · Entrepreneur / independent work" },
];

export default function RouteComparisonWorkspace() {
  const [selected, setSelected] = useState([options[0].key, options[1].key]);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && !loading) resultRef.current?.focus();
  }, [loading, result]);

  function toggle(key: string) {
    setSelected((current) => current.includes(key)
      ? (current.length > 2 ? current.filter((item) => item !== key) : current)
      : (current.length < 4 ? [...current, key] : current));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await apiJson<Result>("route-comparison", {
        method: "POST",
        body: {
          routes: selected.map((item) => {
            const [country_code, route_code] = item.split("|");
            return { country_code, route_code };
          }),
        },
      });
      setResult(response);
    } catch (error) {
      setResult({
        ok: false,
        error: error instanceof ApiError ? error.message : "Comparison service unavailable.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="route-comparison-heading">
      <form onSubmit={submit} aria-busy={loading}>
        <fieldset className="route-option-fieldset">
          <legend id="route-comparison-heading">Choose routes to compare</legend>
          <p id="route-comparison-help">Select 2–4 routes. Comparison uses route records and provenance instead of a hard-coded winner.</p>
          <div className="grid">
            {options.map((option) => (
              <label className="card route-option" key={option.key}>
                <input
                  type="checkbox"
                  checked={selected.includes(option.key)}
                  onChange={() => toggle(option.key)}
                  aria-describedby="route-comparison-help"
                />
                <strong>{option.label}</strong>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="actions">
          <button className="btn primary" type="submit" disabled={loading || selected.length < 2}>
            {loading ? "Comparing…" : "Compare selected routes"}
          </button>
          <a className="btn" href="/find">Find other pathways</a>
        </div>
      </form>

      {result ? (
        <div
          className="route-comparison-result"
          ref={resultRef}
          tabIndex={-1}
          aria-live="polite"
          aria-busy={loading}
        >
          {!result.ok ? (
            <article className="card" role="alert">
              <h3>Unable to compare</h3>
              <p>{result.error}</p>
            </article>
          ) : (
            <>
              <div className="grid">
                {result.routes?.map((route) => (
                  <article className="card" key={`${route.country_code}-${route.route_code}`}>
                    <span className="overline">{route.country_name} · {route.route_category}</span>
                    <h3>{route.route_name}</h3>
                    <p>{route.summary}</p>
                    <div className="mini-list">
                      <div><strong>Risk</strong><span>{route.risk_level || "review required"}</span></div>
                      <div><strong>Source</strong><span>{route.source_confidence || "not recorded"} confidence · {route.freshness_status || "not recorded"}</span></div>
                      <div><strong>Verified</strong><span>{route.verified_at ? new Date(route.verified_at).toLocaleDateString() : "No verification date recorded"}</span></div>
                      <div><strong>Estimated costs</strong><span>{route.costs.currency ? `${route.costs.currency} ${route.costs.minimum.toLocaleString()} – ${route.costs.maximum.toLocaleString()}` : "Currencies require separate review"}</span></div>
                      <div><strong>Documents</strong><span>{route.required_document_count} required · {route.conditional_document_count} conditional</span></div>
                      <div><strong>Provenance</strong><span>{route.provenance.source_kind || route.provenance.active_version_id || "database route record"}</span></div>
                    </div>
                    <div className="actions">
                      <a className="btn primary" href={`/route-checker?country=${route.country_code}&route=${route.route_code}`}>Check readiness</a>
                      <a className="btn" href={`/saved-routes?country=${route.country_code}&route=${route.route_code}`}>Save</a>
                    </div>
                  </article>
                ))}
              </div>
              <article className="result-block soft route-comparison-help">
                <h3>How to read this comparison</h3>
                {result.comparison_rules && Object.entries(result.comparison_rules).map(([key, value]) => (
                  <p key={key}><strong>{key.replaceAll("_", " ")}:</strong> {value}</p>
                ))}
                <p>{result.safety_note}</p>
              </article>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
