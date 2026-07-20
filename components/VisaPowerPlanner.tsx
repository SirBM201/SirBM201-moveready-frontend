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

function renderAccessRows(rows: any[] | undefined, emptyText: string) {
  if (!rows?.length) return <p className="form-status">{emptyText}</p>;
  return (
    <div className="mini-list">
      {rows.map((row, index) => (
        <div key={`${row.destination || "row"}-${index}`}>
          <strong>{row.destination || "Destination"}</strong>
          <span><strong>Access:</strong> {row.access_type || "Check official rule"}</span>
          <span><strong>Stay:</strong> {row.stay || "Varies"}</span>
          <span><strong>Conditions:</strong> {row.conditions || "Confirm official source before travel."}</span>
        </div>
      ))}
    </div>
  );
}

export default function VisaPowerPlanner() {
  const [passportCountry, setPassportCountry] = useState("Nigeria");
  const [selectedVisas, setSelectedVisas] = useState<string[]>(["canada_visitor"]);
  const [multipleEntry, setMultipleEntry] = useState(true);
  const [visaUsedBefore, setVisaUsedBefore] = useState(false);
  const [visaOptions, setVisaOptions] = useState<HeldVisaOption[]>(defaultVisaOptions);
  const [passportOptions, setPassportOptions] = useState<PassportOption[]>(defaultPassportOptions);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Ready. Select your passport and visas, then click the green button.");

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
    setLoading(true);
    setMessage("Checking passport index and visa benefits...");
    try {
      const data = await apiJson<any>("visa-power/check", {
        method: "POST",
        useAuthToken: false,
        body: {
          passport_country: passportCountry,
          held_visas: selectedVisas,
          multiple_entry_confirmed: multipleEntry,
          visa_used_before_confirmed: visaUsedBefore,
        },
      });
      setResult(data);
      setMessage("Result ready. Review the score, matches, and safety notes before acting.");
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
          Select your passport country and any valid strong visas you already hold. MoveReady will show a starter passport index, possible visa-benefit destinations, conditions, and source status.
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
            <p className="form-status" style={{ marginTop: 4 }}>Tick only visas that are valid now.</p>
            <div className="mini-list simple-status-list">
              {visaOptions.map((option) => (
                <label className="checkbox-field" key={option.code}>
                  <input type="checkbox" checked={selectedVisas.includes(option.code)} onChange={() => setSelectedVisas((current) => toggleVisa(current, option.code))} />
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
                <span className="badge">With selected visas: {result.visa_opportunity_score}/100</span>
                <span className="badge">Combined: {result.combined_opportunity_score}/100</span>
                <span className="badge">Multiple-entry: {multipleEntry ? "yes" : "check"}</span>
                <span className="badge">Used before: {visaUsedBefore ? "yes" : "may be required"}</span>
              </div>
            </article>

            {passportIndex && (
              <article className="result-block">
                <p className="overline">Passport index starter</p>
                <h2>{passportIndex.country} passport snapshot</h2>
                <p>{passportIndex.summary}</p>
                <div className="badge-row">
                  <span className="badge">Band: {passportIndex.passport_strength_band}</span>
                  <span className="badge">Score: {passportIndex.passport_opportunity_score}/100</span>
                  <span className="badge">Source: {passportIndex.confidence}</span>
                  <span className="badge">Reviewed: {passportIndex.last_reviewed}</span>
                </div>
                <div className="mini-list two-col-list">
                  <div><strong>Visa-free count</strong><span>{passportIndex.visa_free_count_estimate}</span></div>
                  <div><strong>Visa on arrival count</strong><span>{passportIndex.visa_on_arrival_count_estimate}</span></div>
                  <div><strong>eVisa count</strong><span>{passportIndex.evisa_count_estimate}</span></div>
                  <div><strong>Visa-required note</strong><span>{passportIndex.visa_required_count_estimate}</span></div>
                </div>
              </article>
            )}

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
                      <span>{rule.premium_note}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="form-status">Select at least one existing visa to see possible visa-benefit matches.</p>
              )}
            </article>

            {passportIndex && (
              <article className="result-block soft">
                <p className="overline">Passport access examples</p>
                <h2>Starter examples to verify before booking</h2>
                <h3>Visa-free or simplified examples</h3>
                {renderAccessRows(passportIndex.visa_free_examples, "No visa-free examples are available in the starter record yet.")}
                <h3>Visa on arrival examples</h3>
                {renderAccessRows(passportIndex.visa_on_arrival_examples, "No visa-on-arrival examples are available in the starter record yet.")}
                <h3>eVisa examples</h3>
                {renderAccessRows(passportIndex.evisa_examples, "No eVisa examples are available in the starter record yet.")}
              </article>
            )}

            <article className="result-block soft">
              <p className="overline">Safety rules</p>
              <h2>This is not permission to travel yet.</h2>
              <div className="mini-list">
                <div><strong>Check official source</strong><span>{result.safety_note}</span></div>
                <div><strong>Check visa conditions</strong><span>Some destinations require a valid visa, multiple-entry visa, previous use, minimum remaining validity, return ticket, proof of funds, hotel address, or tourist-only purpose.</span></div>
                <div><strong>Save and re-check later</strong><span>Rules change often. Save routes and create alerts only for destinations you truly care about.</span></div>
              </div>
            </article>
          </div>
        ) : (
          <div className="empty-result">
            <p className="overline">What you will get</p>
            <h2>Your passport index, visa benefits, score, and conditions will appear here.</h2>
            <p>
              MoveReady will compare your passport country and selected visas against starter rules. The result is advisory and must be checked against official sources before travel.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
