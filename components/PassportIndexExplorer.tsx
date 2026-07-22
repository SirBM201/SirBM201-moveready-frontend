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
  destination_region?: string;
  access_bucket?: string;
  access_label?: string;
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
  visa_on_arrival: "Visa on arrival / eVisa",
  evisa: "eTA / registration",
  visa_required: "Visa required / restricted",
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
    row.destination_region,
    row.access_bucket,
    row.access_label,
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
  return `${rows.length} provider/cache rows loaded`;
}

function valueOrDash(value: any) {
  if (value === null || value === undefined || value === "") return "Not available yet";
  return String(value);
}

function niceDate(value: any) {
  if (!value) return "Not synced yet";
  try {
    return new Date(String(value)).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(value);
  }
}

function categoryCountText(passportIndex: any, countKey: string, estimateKey: string, rows: AccessRow[], bucket: string) {
  const exact = passportIndex?.[countKey];
  if (exact !== null && exact !== undefined && exact !== "") return String(exact);
  const rowCount = countRows(rows, bucket);
  if (rowCount) return `${rowCount} listed now`;
  return passportIndex?.[estimateKey] || "Provider sync pending";
}

function providerRefreshText(refresh: any) {
  if (!refresh) return "not checked";
  if (refresh.synced) return "synced now";
  if (refresh.status === "cache_fresh") return "cache fresh";
  if (refresh.status === "skipped_provider_not_configured") return "not configured";
  if (refresh.attempted && refresh.error) return "sync failed";
  return refresh.status || "not needed";
}

function exceptionText(detail: any) {
  const exception = detail?.exception_rule;
  if (!exception || typeof exception !== "object") return "No conditional exception was supplied by the provider.";
  return (
    exception.full_text ||
    exception.description ||
    exception.name ||
    exception.exception_type_name ||
    "A conditional exception exists; confirm the exact conditions and official source."
  );
}

function registrationText(detail: any) {
  const registration = detail?.mandatory_registration;
  if (!registration || typeof registration !== "object" || !registration.name) {
    return "No separate mandatory registration was supplied by the provider.";
  }
  return registration.name;
}

export default function PassportIndexExplorer() {
  const [passportCountry, setPassportCountry] = useState("Nigeria");
  const [passportOptions, setPassportOptions] = useState<PassportOption[]>(defaultPassportOptions);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Choose a passport country, then click the green button.");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [detailResult, setDetailResult] = useState<any | null>(null);
  const [detailDestination, setDetailDestination] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailMessage, setDetailMessage] = useState("");

  useEffect(() => {
    let alive = true;
    apiJson<any>("visa-power/passport-index/options", {
      useAuthToken: false,
      timeoutMs: 15000,
    })
      .then((data) => {
        if (!alive) return;
        if (Array.isArray(data.passport_country_options) && data.passport_country_options.length) {
          setPassportOptions(data.passport_country_options);
        }
        if (data?.provider_status?.ready_to_sync) {
          setMessage(`Choose a passport country. Provider cache refresh is ready: ${data.provider_status.sync_frequency}.`);
        } else if (data?.provider_status?.sync_frequency) {
          setMessage(`Choose a passport country. Provider cache refresh: ${data.provider_status.sync_frequency}.`);
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
    setDetailResult(null);
    setDetailDestination("");
    setDetailMessage("");
    try {
      const data = await apiJson<any>("visa-power/passport-index/check", {
        method: "POST",
        useAuthToken: false,
        body: { passport_country: passportCountry },
        timeoutMs: 30000,
      });
      setResult(data);
      setActiveCategory("all");
      setSearchTerm("");
      if (data?.provider_refresh?.synced) {
        setMessage("Provider data synced. The full country list is shown on this same page.");
      } else if (data?.provider_refresh?.attempted && data?.provider_refresh?.error) {
        setMessage("Provider sync was attempted but failed. Starter/cache rows are shown until the provider setting is corrected.");
      } else {
        setMessage("Passport result ready. The country list is shown on this same page.");
      }
    } catch (error: any) {
      setMessage(error?.message || "Passport index check failed. Confirm the API deployment and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function checkDestination(row: AccessRow) {
    const destination = String(row.destination || "").trim();
    if (!destination) return;

    setDetailDestination(destination);
    setDetailLoading(true);
    setDetailMessage(`Checking the detailed ${destination} rule...`);
    try {
      const data = await apiJson<any>("visa-power/passport-index/destination/check", {
        method: "POST",
        useAuthToken: false,
        body: {
          passport_country: passportCountry,
          destination,
        },
        timeoutMs: 30000,
      });
      setDetailResult(data);
      setDetailMessage(
        data?.status === "detail_cache_hit"
          ? "Detailed rule loaded from the seven-day database cache."
          : "Detailed rule refreshed from the provider and saved to the database cache.",
      );

      const detail = data?.detail;
      if (detail && result?.passport_index?.destination_access_rows) {
        setResult((current: any) => ({
          ...current,
          passport_index: {
            ...current.passport_index,
            destination_access_rows: current.passport_index.destination_access_rows.map((item: AccessRow) =>
              item.destination === destination
                ? {
                    ...item,
                    destination_region: detail.destination_continent || item.destination_region,
                    access_bucket: detail.access_bucket || item.access_bucket,
                    access_label: categoryLabels[detail.access_bucket] || item.access_label,
                    access_type: detail.access_type || item.access_type,
                    maximum_stay: detail.maximum_stay || item.maximum_stay,
                    conditions: detail.conditions || item.conditions,
                    official_source_name: detail.official_source_name || item.official_source_name,
                    official_source_url: detail.official_source_url || item.official_source_url,
                    source_status: detail.source_status || item.source_status,
                    confidence: detail.confidence || item.confidence,
                    last_verified: detail.provider_generated_at || item.last_verified,
                  }
                : item,
            ),
          },
        }));
      }

      window.setTimeout(() => {
        document.getElementById("passport-destination-detail")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    } catch (error: any) {
      setDetailResult(null);
      setDetailMessage(error?.message || `The detailed ${destination} rule could not be loaded.`);
    } finally {
      setDetailLoading(false);
    }
  }

  const passportIndex = result?.passport_index;
  const cacheStatus = result?.cache_status || {};
  const providerStatus = result?.provider_status || {};
  const providerRefresh = result?.provider_refresh || {};
  const accessRows = useMemo(() => getAccessRows(passportIndex), [passportIndex]);
  const isStarterRecord = useMemo(() => {
    const dataSource = String(cacheStatus.data_source || passportIndex?.data_source || "").toLowerCase();
    const providerName = String(cacheStatus.source_provider || passportIndex?.source_provider || "").toLowerCase();
    const confidence = String(passportIndex?.confidence || cacheStatus.source_status || "").toLowerCase();
    return dataSource.includes("starter") || providerName.includes("starter") || confidence.includes("starter_");
  }, [cacheStatus.data_source, cacheStatus.source_provider, cacheStatus.source_status, passportIndex]);
  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return accessRows.filter((row) => {
      const matchesCategory = activeCategory === "all" || (row.access_bucket || "").toLowerCase() === activeCategory;
      const matchesSearch = !query || rowText(row).includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [accessRows, activeCategory, searchTerm]);

  const detail = detailResult?.detail;

  return (
    <div className="live-workspace">
      <section className="workflow-panel live-form" id="passport-index-tool">
        <div className="panel-heading">
          <div>
            <p className="overline">Passport Index</p>
            <h2>Check passport-only travel access</h2>
          </div>
          <span className="status-dot">Rating included</span>
        </div>

        <p className="form-status">
          Select your passport and click the green button. The overview is cached weekly. Open a destination only when you need its detailed current rule.
        </p>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="passport_country_index">Passport country</label>
            <select
              id="passport_country_index"
              value={passportCountry}
              onChange={(event) => setPassportCountry(event.target.value)}
            >
              {passportOptions.map((option) => (
                <option value={option.country} key={option.country_key}>
                  {option.country} · {option.region}
                </option>
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
                <span className="badge">Rating: {passportIndex.passport_opportunity_score}/100</span>
                <span className="badge">Rank: {valueOrDash(passportIndex.passport_rank)}</span>
                <span className="badge">Band: {passportIndex.passport_strength_band}</span>
                <span className="badge">Rows: {resultCountText(accessRows, isStarterRecord)}</span>
                <span className="badge">Provider: {cacheStatus.source_provider || passportIndex.source_provider || "Starter cache"}</span>
                <span className="badge">Refresh: {providerRefreshText(providerRefresh)}</span>
                <span className="badge">Synced: {niceDate(cacheStatus.last_synced_at || passportIndex.last_synced_at)}</span>
                <span className="badge">Next: {niceDate(cacheStatus.next_sync_due_at || passportIndex.next_sync_due_at)}</span>
              </div>
            </article>

            <article className="result-block">
              <div className="panel-heading">
                <div>
                  <p className="overline">Country list</p>
                  <h2>Destinations you can review from this page</h2>
                  <p className="section-intro" style={{ marginBottom: 0 }}>
                    The weekly map is an overview. Blue, yellow, and red are combined provider categories. Use “Check detailed rule” before relying on a destination row.
                  </p>
                </div>
                <span className="status-dot">{filteredRows.length} shown</span>
              </div>

              <div className="mini-list two-col-list" style={{ marginTop: 0 }}>
                <div>
                  <strong>Visa-free</strong>
                  <span>{categoryCountText(passportIndex, "visa_free_count", "visa_free_count_estimate", accessRows, "visa_free")}</span>
                </div>
                <div>
                  <strong>Visa on arrival / eVisa</strong>
                  <span>{categoryCountText(passportIndex, "visa_on_arrival_count", "visa_on_arrival_count_estimate", accessRows, "visa_on_arrival")}</span>
                </div>
                <div>
                  <strong>eTA / registration</strong>
                  <span>{categoryCountText(passportIndex, "evisa_count", "evisa_count_estimate", accessRows, "evisa")}</span>
                </div>
                <div>
                  <strong>Visa required / restricted</strong>
                  <span>{categoryCountText(passportIndex, "visa_required_count", "visa_required_count_estimate", accessRows, "visa_required")}</span>
                </div>
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
                  placeholder="Example: Ghana, Canada, eVisa, visa required, 30 days"
                />
              </div>

              {providerRefresh?.attempted && providerRefresh?.error ? (
                <p className="form-status">
                  Provider sync note: {providerRefresh.error}. Check the provider URL, method, host header, and country-code format in Railway.
                </p>
              ) : null}

              {isStarterRecord ? (
                <p className="form-status">
                  Launch note: these are starter rows. Once provider sync succeeds, this same page will show provider/cache rows without users opening another page.
                </p>
              ) : null}
            </article>

            {detail || detailMessage ? (
              <article className="result-block featured" id="passport-destination-detail">
                <div className="panel-heading">
                  <div>
                    <p className="overline">Destination-specific check</p>
                    <h2>{detail?.destination || detailDestination} entry-rule details</h2>
                  </div>
                  <span className="status-dot">{detailLoading ? "Checking" : detailResult?.status === "detail_cache_hit" ? "Cached" : "Refreshed"}</span>
                </div>

                <p className="form-status">{detailMessage}</p>

                {detail ? (
                  <>
                    <div className="badge-row">
                      <span className="badge">Access: {detail.access_type || "Check current rule"}</span>
                      <span className="badge">Stay: {detail.maximum_stay || "Not supplied"}</span>
                      <span className="badge">Passport validity: {detail.passport_validity || "Not supplied"}</span>
                      <span className="badge">Provider date: {niceDate(detail.provider_generated_at)}</span>
                    </div>

                    <div className="mini-list two-col-list" style={{ marginTop: 16 }}>
                      <div><strong>Primary rule</strong><span>{detail.primary_rule?.name || "Not supplied"}{detail.primary_rule?.duration ? ` · ${detail.primary_rule.duration}` : ""}</span></div>
                      <div><strong>Secondary rule</strong><span>{detail.secondary_rule?.name || "Not supplied"}{detail.secondary_rule?.duration ? ` · ${detail.secondary_rule.duration}` : ""}</span></div>
                      <div><strong>Mandatory registration</strong><span>{registrationText(detail)}</span></div>
                      <div><strong>Conditional exception</strong><span>{exceptionText(detail)}</span></div>
                      <div><strong>Destination information</strong><span>{[detail.capital, detail.currency_code, detail.phone_code, detail.timezone].filter(Boolean).join(" · ") || "Not supplied"}</span></div>
                      <div><strong>Source status</strong><span>{detail.source_status || detail.confidence || "Provider detail pending official confirmation"}</span></div>
                    </div>

                    <p>{detail.conditions}</p>
                    <p className="form-status">{detail.safety_note}</p>

                    <div className="actions">
                      {detail.official_source_url ? (
                        <a className="btn primary" href={detail.official_source_url} target="_blank" rel="noreferrer">
                          Open supplied official source
                        </a>
                      ) : null}
                      {detail.embassy_url ? (
                        <a className="btn" href={detail.embassy_url} target="_blank" rel="noreferrer">
                          Open embassy directory
                        </a>
                      ) : null}
                      <a className="btn" href="/watchlist">Create re-check reminder</a>
                    </div>
                  </>
                ) : null}
              </article>
            ) : null}

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
                  {filteredRows.map((row, index) => {
                    const destination = row.destination || "Destination";
                    const checkingThisRow = detailLoading && detailDestination === destination;
                    return (
                      <div key={`${destination}-${row.access_bucket || "access"}-${index}`}>
                        <strong>{destination}</strong>
                        <span><strong>Overview category:</strong> {row.access_label || categoryLabels[row.access_bucket || ""] || row.access_bucket || "Check official source"}</span>
                        <span><strong>Access type:</strong> {row.access_type || "Check detailed rule"}</span>
                        <span><strong>Stay:</strong> {row.maximum_stay || row.stay || "Open the detailed rule to check the current stay limit"}</span>
                        <span><strong>Conditions:</strong> {row.conditions || "Confirm official rules before booking."}</span>
                        <span><strong>Source status:</strong> {row.source_status || row.confidence || passportIndex.confidence || "Needs review"}</span>
                        <div className="actions" style={{ marginTop: 8 }}>
                          <button
                            className="btn primary"
                            type="button"
                            disabled={detailLoading}
                            onClick={() => checkDestination(row)}
                          >
                            {checkingThisRow ? "Checking detailed rule..." : "Check detailed rule"}
                          </button>
                          {row.official_source_url ? (
                            <a className="btn" href={row.official_source_url} target="_blank" rel="noreferrer">
                              Open saved source
                            </a>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
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
                <div><strong>Data source</strong><span>{cacheStatus.data_source || passportIndex.data_source || "provider cache or starter fallback"}</span></div>
                <div><strong>Provider status</strong><span>{providerStatus.ready_to_sync ? "Provider ready to sync" : "Provider not fully configured or not enabled"}</span></div>
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
            <h2>Passport rating and country lists will appear here after you click Check my passport.</h2>
            <p>
              MoveReady groups the weekly overview by provider colour. Open a destination for its detailed rule, stay length, passport-validity requirement, registration, exception, and source link.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
