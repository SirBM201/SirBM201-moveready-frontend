"use client";

import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api";

type PassportOption = {
  country: string;
  country_key: string;
  region: string;
  confidence: string;
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

function renderRows(rows: any[] | undefined, emptyText: string) {
  if (!rows?.length) return <p className="form-status">{emptyText}</p>;
  return (
    <div className="mini-list">
      {rows.map((row, index) => (
        <div key={`${row.destination || "destination"}-${index}`}>
          <strong>{row.destination || "Destination"}</strong>
          <span><strong>Access type:</strong> {row.access_type || "Check official source"}</span>
          <span><strong>Stay:</strong> {row.stay || "Varies"}</span>
          <span><strong>Conditions:</strong> {row.conditions || "Confirm official rules before booking."}</span>
        </div>
      ))}
    </div>
  );
}

export default function PassportIndexExplorer() {
  const [passportCountry, setPassportCountry] = useState("Nigeria");
  const [passportOptions, setPassportOptions] = useState<PassportOption[]>(defaultPassportOptions);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Choose a passport country, then click the green button.");

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
    setMessage("Checking passport index starter record...");
    try {
      const data = await apiJson<any>("visa-power/passport-index/check", {
        method: "POST",
        useAuthToken: false,
        body: { passport_country: passportCountry },
      });
      setResult(data);
      setMessage("Passport index result ready. Treat it as starter guidance and confirm official sources.");
    } catch (error: any) {
      setMessage(error?.message || "Passport index check failed. Confirm the API deployment and try again.");
    } finally {
      setLoading(false);
    }
  }

  const passportIndex = result?.passport_index;

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
          This checks your passport alone. For extra benefits from visas you already hold, use Visa Power after this.
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
                  <h2>{passportIndex.country} passport starter index</h2>
                </div>
                <span className="status-dot">{passportIndex.passport_opportunity_score}/100</span>
              </div>
              <p>{passportIndex.summary}</p>
              <div className="badge-row">
                <span className="badge">Band: {passportIndex.passport_strength_band}</span>
                <span className="badge">Source: {passportIndex.confidence}</span>
                <span className="badge">Reviewed: {passportIndex.last_reviewed}</span>
              </div>
            </article>

            <article className="result-block">
              <p className="overline">Access categories</p>
              <h2>What to verify before travel</h2>
              <div className="mini-list two-col-list">
                <div><strong>Visa-free</strong><span>{passportIndex.visa_free_count_estimate}</span></div>
                <div><strong>Visa on arrival</strong><span>{passportIndex.visa_on_arrival_count_estimate}</span></div>
                <div><strong>eVisa / ETA</strong><span>{passportIndex.evisa_count_estimate}</span></div>
                <div><strong>Visa required</strong><span>{passportIndex.visa_required_count_estimate}</span></div>
              </div>
            </article>

            <article className="result-block soft">
              <p className="overline">Examples</p>
              <h2>Starter examples, not final permission</h2>
              <h3>Visa-free or simplified examples</h3>
              {renderRows(passportIndex.visa_free_examples, "No visa-free examples are available in this starter record yet.")}
              <h3>Visa on arrival examples</h3>
              {renderRows(passportIndex.visa_on_arrival_examples, "No visa-on-arrival examples are available in this starter record yet.")}
              <h3>eVisa examples</h3>
              {renderRows(passportIndex.evisa_examples, "No eVisa examples are available in this starter record yet.")}
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
            </article>
          </div>
        ) : (
          <div className="empty-result">
            <p className="overline">What you will get</p>
            <h2>Your passport strength, access categories, examples, and safety notes will appear here.</h2>
            <p>
              MoveReady will show starter passport-index guidance. It does not replace official destination rules, airline checks, or border officer decisions.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
