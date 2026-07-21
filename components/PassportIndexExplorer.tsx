"use client";

import { useEffect, useMemo, useState } from "react";
import { apiJson } from "@/lib/api";

type PassportOption = {
  country: string;
  country_key: string;
  region: string;
  confidence: string;
};

type AccessRow = {
  destination?: string;
  access_bucket?: string;
  access_type?: string;
  stay?: string;
  maximum_stay?: string;
  conditions?: string;
  source_status?: string;
  confidence?: string;
  official_source_name?: string;
  official_source_url?: string;
  last_verified?: string;
};

const defaultPassportOptions: PassportOption[] = [
  { country: "Nigeria", country_key: "nigeria", region: "West Africa", confidence: "starter_pending_official_review" },
  { country: "Ghana", country_key: "ghana", region: "West Africa", confidence: "starter_pending_official_review" },
  { country: "Kenya", country_key: "kenya", region: "East Africa", confidence: "starter_pending_official_review" },
  { country: "India", country_key: "india", region: "South Asia", confidence: "starter_pending_official_review" },
  { country: "Pakistan", country_key: "pakistan", region: "South Asia", confidence: "starter_pending_official_review" },
  { country: "Philippines", country_key: "philippines", region: "Southeast Asia", confidence: "starter_pending_official_review" },
  { country: "Kuwait", country_key: "kuwait", region: "Gulf", confidence: "starter_pending_official_review" },
];

const categoryLabels: Record<string, string> = {
  all: "All",
  visa_free: "Visa-free",
  visa_on_arrival: "Visa on arrival",
  evisa: "eVisa / ETA",
  visa_required: "Visa required",
};

const categoryOrder = ["all", "visa_free", "visa_on_arrival", "evisa", "visa_required"];

function normalizeRows(rows: AccessRow[] | undefined, accessBucket: string): AccessRow[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => ({ ...row, access_bucket: row.access_bucket || accessBucket }));
}

function getAccessRows(passportIndex: any): AccessRow[] {
  if (!passportIndex) return [];

  if (Array.isArray(passportIndex.destination_access_rows) && passportIndex.destination_access_rows.length) {
    return passportIndex.destination_access_rows;
  }

  return [
    ...normalizeRows(passportIndex.visa_free_examples, "visa_free"),
    ...normalizeRows(passportIndex.visa_on_arrival_examples, "visa_on_arrival"),
    ...normalizeRows(passportIndex.evisa_examples, "evisa"),
    ...normalizeRows(passportIndex.visa_required_examples, "visa_required"),
  ];
}

function rowText(row: AccessRow) {
  return [
    row.destination,
    row.access_bucket,
    row.access_type,
    row.stay,
    row.maximum_stay,
    row.conditions,
    row.source_status,
    row.confidence,
    row.official_source_name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function countRows(rows: AccessRow[], category: string) {
  if (category === "all") return rows.length;
  return rows.filter((row) => (row.access_bucket || "").toLowerCase() === category).length;
}

function resultCountText(rows: AccessRow[], isStarterRecord: boolean) {
  if (!rows.length) return "No destination rows loaded yet";
  if (isStarterRecord) return `${rows.length} starter rows loaded`;
  return `${rows.length} destination rows loaded`;
}

export default function PassportIndexExplorer() {
  const [passportCountry, setPassportCountry] = useState("Nigeria");
  const [passportOptions, setPassportOptions] = useState<PassportOption[]>(defaultPassportOptions);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Choose a passport country, then click the green button.");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let alive = true;
    apiJson<any>("visa-power/passport-index/options", { useAuthToken: false, timeoutMs: 15000 })
      .then((data) => {
        if (!alive) return;
        if (Array.isArray(data.passport_country_options) && data.passport_country_options.length) {
          setPassportOptions(data.passport_country_options);
        }
      })
      .catch(() => {
        if (alive) setMessage("Starter passport options loaded. API options can refresh after backend deploy.");
      });
    return () => {
      alive = false;
    };
  }, []);

  async function checkPassport() {
    setLoading(true);
    setMessage("Checking passport access list...");
    try {
      const data = await apiJson<any>("visa-power/passport-index/check", {
        method: "POST",
        useAuthToken: false,
        body: { passport_country: passportCountry },
      });
      setResult(data);
      setActiveCategory("all");
      setSearchTerm("");
      setMessage("Passport result ready. The country list is shown on this same page.");
    } catch (error: any) {
      setMessage(error?.message || "Passport index check failed. Confirm the API deployment and try again.");
    } finally {
      setLoading(false);
    }
  }

  const passportIndex = result?.passport_index;
  const accessRows = useMemo(() => getAccessRows(passportIndex), [passportIndex]);
  const isStarterRecord = String(passportIndex?.confidence || "").includes("starter") || String(passportIndex?.confidence || "").includes("pending");
  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return accessRows.filter((row) => {
      const matchesCategory = activeCategory === "all" || (row.access_bucket || "").toLowerCase() === activeCategory;
      const matchesSearch = !query || rowText(row).includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [accessRows, activeCategory, searchTerm]);

  return (
    <div className="live-workspace">
      <section className="workflow-panel live-form">
        <div className="panel-heading">
          <div>
            <p className="overline">Passport Index</p>
            <h2>Check passport-only travel access</h2>
          </div>
          <span className="status-dot">Starter</span>
        </div>

        <p className="form-status">
          Select your passport and click the green button. The country list will show here under visa-free, visa on arrival, eVisa, and visa required.
        </p>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="passport_country_index">Passport country</label>
            <select id="passport_country_index" value={passportCountry} onChange={(event) => setPassportCountry(event.target.value)}>
              {passportOptions.map((option) => (
                <option value={option.country} key={option.country_key}>{option.country} · {option.region}</option>
              ))}
            </select>
          </div>

          <button className="btn primary full" type="button" onClick={checkPassport} disabled={loading}>
            {loading ? "Checking..." : "Check my passport"}
          </button>
          <a className="btn full" href="/visa-power">Check visas I already hold</a>
          <a className="btn full" href="/route-checker">Check relocation route</a>
          <p className="form-status">{message}</p>
        </div>
      </section>

      <section className="result-panel" aria-live="polite">
        {passportIndex ? (
          <div className="result-stack">
            <article className="result-block featured">
              <div className="panel-heading">
                <div>
                  <p className="overline">Passport snapshot</p>
                  <h2>{passportIndex.country} passport travel access</h2>
                </div>
                <span className="status-dot">{passportIndex.passport_opportunity_score}/100</span>
              </div>
              <p>{passportIndex.summary}</p>
              <div className="badge-row">
                <span className="badge">Band: {passportIndex.passport_strength_band}</span>
                <span className="badge">Rows: {resultCountText(accessRows, isStarterRecord)}</span>
                <span className="badge">Source: {passportIndex.confidence}</span>
                <span className="badge">Reviewed: {passportIndex.last_reviewed}</span>
              </div>
            </article>

            <article className="result-block">
              <div className="panel-heading">
                <div>
                  <p className="overline">Country list</p>
                  <h2>Destinations you can review from this page</h2>
                  <p className="section-intro" style={{ marginBottom: 0 }}>
                    Use the buttons to switch categories. No need to open another page just to see visa-free, visa-on-arrival, eVisa, or visa-required rows.
                  </p>
                </div>
                <span className="status-dot">{filteredRows.length} shown</span>
              </div>

              <div className="mini-list two-col-list" style={{ marginTop: 0 }}>
                <div><strong>Visa-free</strong><span>{passportIndex.visa_free_count_estimate}</span></div>
                <div><strong>Visa on arrival</strong><span>{passportIndex.visa_on_arrival_count_estimate}</span></div>
                <div><strong>eVisa / ETA</strong><span>{passportIndex.evisa_count_estimate}</span></div>
                <div><strong>Visa required</strong><span>{passportIndex.visa_required_count_estimate}</span></div>
              </div>

              <div className="actions" style={{ marginTop: 16 }}>
                {categoryOrder.map((category) => (
                  <button
                    className={`btn ${activeCategory === category ? "primary" : ""}`}
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                  >
                    {categoryLabels[category]} ({countRows(accessRows, category)})
                  </button>
                ))}
              </div>

              <div className="field" style={{ marginTop: 14 }}>
                <label htmlFor="passport_index_search">Search destination or rule</label>
                <input
                  id="passport_index_search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Example: Ghana, eVisa, visa required, 30 days"
                />
              </div>

              {isStarterRecord ? (
                <p className="form-status">
                  Launch note: this page now supports the full country-list experience. The current backend may still contain starter rows until each destination is officially verified. MoveReady should not invent unverified country access.
                </p>
              ) : null}
            </article>

            <article className="result-block soft">
              <div className="panel-heading">
                <div>
                  <p className="overline">Destination rows</p>
                  <h2>{categoryLabels[activeCategory]} destinations</h2>
                </div>
                <span className="status-dot">{filteredRows.length}</span>
              </div>

              {filteredRows.length ? (
                <div className="mini-list">
                  {filteredRows.map((row, index) => (
                    <div key={`${row.destination || "destination"}-${row.access_bucket || "access"}-${index}`}>
                      <strong>{row.destination || "Destination"}</strong>
                      <span><strong>Category:</strong> {categoryLabels[row.access_bucket || ""] || row.access_bucket || "Check official source"}</span>
                      <span><strong>Access type:</strong> {row.access_type || "Check official source"}</span>
                      <span><strong>Stay:</strong> {row.maximum_stay || row.stay || "Confirm current stay rule before travel"}</span>
                      <span><strong>Conditions:</strong> {row.conditions || "Confirm official rules before booking."}</span>
                      <span><strong>Source status:</strong> {row.source_status || row.confidence || passportIndex.confidence || "Needs review"}</span>
                      {row.official_source_url ? (
                        <a className="btn" href={row.official_source_url} target="_blank" rel="noreferrer" style={{ marginTop: 8, width: "fit-content" }}>
                          Open official source
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="form-status">
                  No rows match this category or search. Clear the search or choose All.
                </p>
              )}
            </article>

            <article className="result-block soft">
              <p className="overline">Safety and validity</p>
              <h2>Check these before booking</h2>
              <div className="mini-list">
                <div><strong>Passport validity</strong><span>{passportIndex.validity_notes}</span></div>
                <div><strong>Renewal timing</strong><span>{passportIndex.renewal_notes}</span></div>
                <div><strong>Official source order</strong><span>{passportIndex.official_source_priority?.join(" → ")}</span></div>
                <div><strong>Important</strong><span>{result.safety_note}</span></div>
              </div>
              <div className="actions">
                <a className="btn primary" href="/visa-power">Check visas I already hold</a>
                <a className="btn" href="/watchlist">Create reminder</a>
                <a className="btn" href="/route-checker">Check relocation route</a>
              </div>
            </article>
          </div>
        ) : (
          <div className="empty-result">
            <p className="overline">What you will get</p>
            <h2>Country lists will appear here after you click Check my passport.</h2>
            <p>
              MoveReady will group destinations by visa-free, visa on arrival, eVisa/ETA, and visa required. It does not replace official destination rules, airline checks, or border officer decisions.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
