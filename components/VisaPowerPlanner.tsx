"use client";

import { useEffect, useMemo, useState } from "react";
import { apiJson } from "@/lib/api";

type HeldVisaOption = {
  code: string;
  label: string;
  helper: string;
};

type PassportOption = {
  country: string;
  country_key: string;
  region: string;
  confidence: string;
};

const defaultVisaOptions: HeldVisaOption[] = [
  { code: "canada_visitor", label: "Canada visitor visa", helper: "Valid Canadian visitor visa in your passport." },
  { code: "us_visitor", label: "U.S. visitor visa", helper: "Valid U.S. visitor visa, such as B1/B2." },
  { code: "uk_visitor", label: "UK visitor visa", helper: "Valid UK standard visitor visa." },
  { code: "schengen_visitor", label: "Schengen visitor visa", helper: "Valid Schengen short-stay visitor visa." },
  { code: "australia_visitor", label: "Australia visitor visa", helper: "Valid Australia visitor visa." },
  { code: "japan_visitor", label: "Japan visitor visa", helper: "Valid Japan visitor visa." },
];

const defaultPassportOptions: PassportOption[] = [
  { country: "Nigeria", country_key: "nigeria", region: "West Africa", confidence: "starter_pending_official_review" },
  { country: "Ghana", country_key: "ghana", region: "West Africa", confidence: "starter_pending_official_review" },
  { country: "Kenya", country_key: "kenya", region: "East Africa", confidence: "starter_pending_official_review" },
  { country: "India", country_key: "india", region: "South Asia", confidence: "starter_pending_official_review" },
  { country: "Pakistan", country_key: "pakistan", region: "South Asia", confidence: "starter_pending_official_review" },
  { country: "Philippines", country_key: "philippines", region: "Southeast Asia", confidence: "starter_pending_official_review" },
  { country: "Kuwait", country_key: "kuwait", region: "Gulf", confidence: "starter_pending_official_review" },
];

function toggleVisa(current: string[], code: string) {
  return current.includes(code) ? current.filter((item) => item !== code) : [...current, code];
}

function labelFor(code: string, options: HeldVisaOption[]) {
  return options.find((item) => item.code === code)?.label || code;
}

function valueOrEstimate(passportIndex: any, exactKey: string, estimateKey: string) {
  const exact = passportIndex?.[exactKey];
  if (exact !== null && exact !== undefined && exact !== "") return String(exact);
  return passportIndex?.[estimateKey] || "Provider data pending";
}

function niceDate(value: any) {
  if (!value) return "Not available";
  try {
    return new Date(String(value)).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(value);
  }
}

function cacheLabel(result: any) {
  const dataSource = result?.cache_status?.data_source || result?.passport_index?.data_source;
  if (String(dataSource || "").includes("provider")) return "Provider database cache";
  if (String(dataSource || "").includes("starter")) return "Starter fallback";
  return dataSource || "Passport data source pending";
}

export default function VisaPowerPlanner() {
  const [passportCountry, setPassportCountry] = useState("Nigeria");
  const [selectedVisas, setSelectedVisas] = useState<string[]>(["canada_visitor"]);
  const [multipleEntry, setMultipleEntry] = useState(true);
  const [visaUsedBefore, setVisaUsedBefore] = useState(false);
  const [priorEntryRefusal, setPriorEntryRefusal] = useState(false);
  const [visaCancelledOrRevoked, setVisaCancelledOrRevoked] = useState(false);
  const [visaOptions, setVisaOptions] = useState<HeldVisaOption[]>(defaultVisaOptions);
  const [passportOptions, setPassportOptions] = useState<PassportOption[]>(defaultPassportOptions);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Ready. Select your passport and valid visas, then click the green button.");

  useEffect(() => {
    let alive = true;
    apiJson<any>("visa-power/options", { useAuthToken: false, timeoutMs: 15000 })
      .then((data) => {
        if (!alive) return;
        if (Array.isArray(data.held_visa_options) && data.held_visa_options.length) {
          setVisaOptions(data.held_visa_options);
        }
        if (Array.isArray(data.passport_country_options) && data.passport_country_options.length) {
          setPassportOptions(data.passport_country_options);
        }
      })
      .catch(() => {
        if (alive) setMessage("Starter options loaded. API options can refresh after the backend deploy finishes.");
      });
    return () => {
      alive = false;
    };
  }, []);

  const selectedVisaText = useMemo(() => {
    if (!selectedVisas.length) return "No existing strong visa selected yet";
    return selectedVisas.map((code) => labelFor(code, visaOptions)).join(" + ");
  }, [selectedVisas, visaOptions]);

  async function runCheck() {
    if (visaCancelledOrRevoked && selectedVisas.length) {
      setResult(null);
      setMessage("Do not rely on a cancelled or revoked visa. Untick that visa or confirm its current validity with the issuing authority before using Visa Power.");
      return;
    }

    setLoading(true);
    setMessage("Checking passport cache and visa-benefit rules...");
    try {
      const data = await apiJson<any>("visa-power/check", {
        method: "POST",
        useAuthToken: false,
        body: {
          passport_country: passportCountry,
          held_visas: selectedVisas,
          multiple_entry_confirmed: multipleEntry,
          visa_used_before_confirmed: visaUsedBefore,
          prior_entry_refusal_declared: priorEntryRefusal,
          visa_cancelled_or_revoked_declared: visaCancelledOrRevoked,
        },
        timeoutMs: 30000,
      });
      setResult(data);
      setMessage("Result ready. Review every condition and open the official source before relying on a match.");
    } catch (error: any) {
      setMessage(error?.message || "Visa Power check failed. Confirm the API deployment and try again.");
    } finally {
      setLoading(false);
    }
  }

  const passportIndex = result?.passport_index;
  const matches: any[] = result?.matches || [];

  return (
    <div className="live-workspace">
      <section className="workflow-panel live-form">
        <div className="panel-heading">
          <div>
            <p className="overline">Passport + visa stack</p>
            <h2>Check travel benefits you may already have</h2>
          </div>
          <span className="status-dot">Premium preview</span>
        </div>

        <p className="form-status">
          Select your passport and only visas that remain valid now. MoveReady combines the weekly passport cache with reviewed third-country visa-benefit rules.
        </p>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="passport_country">Passport country</label>
            <select id="passport_country" value={passportCountry} onChange={(event) => setPassportCountry(event.target.value)}>
              {passportOptions.map((option) => (
                <option value={option.country} key={option.country_key}>{option.country} · {option.region}</option>
              ))}
            </select>
          </div>

          <div className="result-block soft">
            <strong>Existing visas you hold</strong>
            <p className="form-status" style={{ marginTop: 4 }}>Tick only visas that are valid and have not been cancelled or revoked.</p>
            <div className="mini-list simple-status-list">
              {visaOptions.map((option) => (
                <label className="checkbox-field" key={option.code}>
                  <input
                    type="checkbox"
                    checked={selectedVisas.includes(option.code)}
                    onChange={() => setSelectedVisas((current) => toggleVisa(current, option.code))}
                  />
                  <span><strong>{option.label}</strong><br />{option.helper}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="checkbox-field">
            <input type="checkbox" checked={multipleEntry} onChange={(event) => setMultipleEntry(event.target.checked)} />
            <span>My selected visa is multiple-entry where the destination rule requires it.</span>
          </label>

          <label className="checkbox-field">
            <input type="checkbox" checked={visaUsedBefore} onChange={(event) => setVisaUsedBefore(event.target.checked)} />
            <span>I have already used the visa to enter the issuing country or region where the destination rule requires previous use.</span>
          </label>

          <label className="checkbox-field">
            <input type="checkbox" checked={priorEntryRefusal} onChange={(event) => setPriorEntryRefusal(event.target.checked)} />
            <span>I have previously been refused entry, denied admission, or asked to withdraw at a border while holding one of these visas.</span>
          </label>

          <label className="checkbox-field">
            <input type="checkbox" checked={visaCancelledOrRevoked} onChange={(event) => setVisaCancelledOrRevoked(event.target.checked)} />
            <span>A selected visa may have been cancelled or revoked. MoveReady must not treat it as a valid travel benefit until confirmed.</span>
          </label>

          <button className="btn primary full" type="button" onClick={runCheck} disabled={loading}>
            {loading ? "Checking..." : "Check Visa Power and Passport Index"}
          </button>
          <p className="form-status">{message}</p>
        </div>
      </section>

      <section className="result-panel" aria-live="polite">
        {result ? (
          <div className="result-stack">
            <article className="result-block featured">
              <div className="panel-heading">
                <div>
                  <p className="overline">Opportunity score</p>
                  <h2>{result.combined_opportunity_score}/100 combined travel-opportunity score</h2>
                </div>
                <span className="status-dot">{result.matched_destination_count} visa-benefit matches</span>
              </div>
              <p>
                Passport: <strong>{result.passport_country}</strong>. Visa stack: <strong>{selectedVisaText}</strong>.
              </p>
              <div className="badge-row">
                <span className="badge">Passport alone: {result.passport_only_score}/100</span>
                <span className="badge">Visa benefit score: {result.visa_opportunity_score}/100</span>
                <span className="badge">Combined: {result.combined_opportunity_score}/100</span>
                <span className="badge">Multiple-entry: {multipleEntry ? "confirmed" : "check"}</span>
                <span className="badge">Used for successful entry: {visaUsedBefore ? "confirmed" : "not confirmed"}</span>
                <span className="badge">Passport source: {cacheLabel(result)}</span>
              </div>

              {priorEntryRefusal ? (
                <p className="form-status" style={{ marginTop: 14 }}>
                  Travel-history warning: a previous refusal or denied admission does not automatically prove the visa is cancelled, but it may affect border questioning, disclosure duties, future applications, and whether the traveller should rely on a third-country exemption. Confirm the visa remains valid and answer all immigration questions truthfully.
                </p>
              ) : null}
            </article>

            {passportIndex ? (
              <article className="result-block">
                <div className="panel-heading">
                  <div>
                    <p className="overline">Passport Index database</p>
                    <h2>{passportIndex.country} passport snapshot</h2>
                  </div>
                  <span className="status-dot">{passportIndex.destination_access_rows?.length || 0} rows</span>
                </div>
                <p>{passportIndex.summary}</p>
                <div className="badge-row">
                  <span className="badge">Band: {passportIndex.passport_strength_band}</span>
                  <span className="badge">Score: {passportIndex.passport_opportunity_score}/100</span>
                  <span className="badge">Source: {passportIndex.source_provider || result?.cache_status?.source_provider || passportIndex.confidence}</span>
                  <span className="badge">Synced: {niceDate(passportIndex.last_synced_at || result?.cache_status?.last_synced_at)}</span>
                </div>
                <div className="mini-list two-col-list">
                  <div><strong>Visa-free overview</strong><span>{valueOrEstimate(passportIndex, "visa_free_count", "visa_free_count_estimate")}</span></div>
                  <div><strong>Visa on arrival / eVisa overview</strong><span>{valueOrEstimate(passportIndex, "visa_on_arrival_count", "visa_on_arrival_count_estimate")}</span></div>
                  <div><strong>eTA / registration overview</strong><span>{valueOrEstimate(passportIndex, "evisa_count", "evisa_count_estimate")}</span></div>
                  <div><strong>Visa required / restricted overview</strong><span>{valueOrEstimate(passportIndex, "visa_required_count", "visa_required_count_estimate")}</span></div>
                </div>
                <div className="actions">
                  <a className="btn primary" href="/passport-index">Open full Passport Index</a>
                </div>
              </article>
            ) : null}

            <article className="result-block">
              <p className="overline">Visa Power benefits</p>
              <h2>Countries that may become easier because of your existing visa</h2>
              {matches.length ? (
                <div className="mini-list">
                  {matches.map((rule) => (
                    <div key={rule.id}>
                      <strong>{rule.destination} · {rule.destination_region}</strong>
                      <span><strong>Separate visa needed?</strong> {rule.separate_visa_needed}</span>
                      <span><strong>Maximum stay:</strong> {rule.maximum_stay}</span>
                      <span><strong>Conditions:</strong> {rule.conditions}</span>
                      <span><strong>Source:</strong> <a href={rule.official_source_url} target="_blank" rel="noreferrer">{rule.official_source_name}</a></span>
                      <span><strong>Last verified:</strong> {rule.last_verified} · {rule.confidence}</span>
                      {rule.condition_warnings?.length ? <span><strong>Check first:</strong> {rule.condition_warnings.join(" ")}</span> : null}
                      {priorEntryRefusal ? <span><strong>Personal-history check:</strong> Confirm the prior border refusal does not affect this exemption and disclose it whenever an authority asks.</span> : null}
                      <span>{rule.premium_note}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="form-status">Select at least one existing valid visa to see possible visa-benefit matches.</p>
              )}
            </article>

            <article className="result-block soft">
              <p className="overline">Safety rules</p>
              <h2>This is not permission to travel yet.</h2>
              <div className="mini-list">
                <div><strong>Check official source</strong><span>{result.safety_note}</span></div>
                <div><strong>Check visa validity</strong><span>A visa sticker remaining in a passport does not by itself prove that the visa has not been cancelled, revoked, limited, or electronically invalidated.</span></div>
                <div><strong>Check prior-use wording</strong><span>Attempting travel but being denied admission is not the same as successfully using the visa to enter the issuing country.</span></div>
                <div><strong>Check destination conditions</strong><span>Rules may require multiple entry, previous successful use, minimum remaining validity, tourist purpose, funds, return ticket, hotel address, and passport validity.</span></div>
                <div><strong>Save and re-check later</strong><span>Rules change. Save routes and create alerts only for destinations you truly care about.</span></div>
              </div>
              <div className="actions">
                <a className="btn primary" href="/passport-index">Open Passport Index</a>
                <a className="btn" href="/watchlist">Create alert</a>
                <a className="btn" href="/route-checker">Check relocation route</a>
              </div>
            </article>
          </div>
        ) : (
          <div className="empty-result">
            <p className="overline">What you will get</p>
            <h2>Your passport cache, visa benefits, score, and conditions will appear here.</h2>
            <p>
              MoveReady combines the provider-backed Passport Index with reviewed visa-benefit rules. The result remains advisory and must be checked against official sources before travel.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
