"use client";

import { useMemo, useState } from "react";

type HeldVisaCode =
  | "canada_visitor"
  | "us_visitor"
  | "uk_visitor"
  | "schengen_visitor"
  | "australia_visitor"
  | "japan_visitor";

type HeldVisaOption = {
  code: HeldVisaCode;
  label: string;
  helper: string;
};

type BenefitRule = {
  id: string;
  destination: string;
  destinationRegion: string;
  eligibleVisaCodes: HeldVisaCode[];
  separateVisaNeeded: string;
  maximumStay: string;
  conditions: string;
  officialSourceName: string;
  officialSourceUrl: string;
  lastVerified: string;
  confidence: "official reviewed" | "source review needed";
  premiumNote: string;
};

const heldVisaOptions: HeldVisaOption[] = [
  {
    code: "canada_visitor",
    label: "Canada visitor visa",
    helper: "Example: valid Canadian visitor visa in your passport.",
  },
  {
    code: "us_visitor",
    label: "U.S. visitor visa",
    helper: "Example: valid B1/B2 or visitor visa.",
  },
  {
    code: "uk_visitor",
    label: "UK visitor visa",
    helper: "Example: valid UK standard visitor visa.",
  },
  {
    code: "schengen_visitor",
    label: "Schengen visitor visa",
    helper: "Example: valid Schengen short-stay visitor visa.",
  },
  {
    code: "australia_visitor",
    label: "Australia visitor visa",
    helper: "Useful for some transit or third-country travel-benefit rules.",
  },
  {
    code: "japan_visitor",
    label: "Japan visitor visa",
    helper: "Useful for selected third-country visa-exemption rules.",
  },
];

const benefitRules: BenefitRule[] = [
  {
    id: "mexico-strong-visa-exemption",
    destination: "Mexico",
    destinationRegion: "North America",
    eligibleVisaCodes: ["canada_visitor", "us_visitor", "uk_visitor", "schengen_visitor", "japan_visitor"],
    separateVisaNeeded: "Usually no Mexican visa for eligible visitor purposes",
    maximumStay: "Stay is decided under Mexico visitor rules at entry; confirm the current visitor limit before travel.",
    conditions: "The visa or residence document must be valid and current. Travel purpose should remain non-remunerated unless the official rule says otherwise. Passport, entry record, funds, ticket, and border questions still apply.",
    officialSourceName: "Mexico National Immigration Institute (INM)",
    officialSourceUrl: "https://www.gob.mx/inm/documentos/paises-y-regiones-que-requieren-visa-para-viajar-a-mexico",
    lastVerified: "2026-07-20",
    confidence: "official reviewed",
    premiumNote: "Good planning option for users who already hold a valid Canada, U.S., UK, Schengen, or Japan visa.",
  },
  {
    id: "dominican-republic-multiple-entry-visa",
    destination: "Dominican Republic",
    destinationRegion: "Caribbean",
    eligibleVisaCodes: ["canada_visitor", "us_visitor", "uk_visitor", "schengen_visitor"],
    separateVisaNeeded: "Usually no Dominican tourist visa when the qualifying visa/residence rule applies",
    maximumStay: "Tourist stay and tourist-card conditions must be confirmed before travel.",
    conditions: "Rule is tied to permanent residence or a valid multiple-entry visa from Canada, the United States, the United Kingdom, or Schengen/EU for tourist purposes. Passport validity and tourist entry conditions still apply.",
    officialSourceName: "Dominican Republic Ministry of Foreign Affairs (MIREX)",
    officialSourceUrl: "https://consultas.mirex.gob.do/servicios/visas/consulta-de-requisitos-para-extranjeros-ingresar-a-la-republica-dominicana",
    lastVerified: "2026-07-20",
    confidence: "official reviewed",
    premiumNote: "Strong example of why one valid visa can increase travel options beyond the issuing country.",
  },
  {
    id: "panama-decree-521-strong-visa",
    destination: "Panama",
    destinationRegion: "Central America",
    eligibleVisaCodes: ["canada_visitor", "us_visitor", "uk_visitor", "schengen_visitor", "australia_visitor", "japan_visitor"],
    separateVisaNeeded: "Sometimes no stamped tourist visa when the qualifying visa rule applies",
    maximumStay: "Tourist stay is decided under Panama tourist entry rules and must be checked before travel.",
    conditions: "The qualifying visa is commonly expected to be multiple-entry, already used in the issuing country or region, and valid for the required remaining period. Tourist entry rules still require passport, funds, return/onward ticket, and border checks.",
    officialSourceName: "Panama National Migration Service (SNM)",
    officialSourceUrl: "https://www.migracion.gob.pa/decretos-y-resoluciones-2018/",
    lastVerified: "2026-07-20",
    confidence: "official reviewed",
    premiumNote: "Needs a careful rule screen because Panama conditions can depend on visa use history and remaining validity.",
  },
  {
    id: "costa-rica-us-canada-exemption",
    destination: "Costa Rica",
    destinationRegion: "Central America",
    eligibleVisaCodes: ["canada_visitor", "us_visitor"],
    separateVisaNeeded: "May not need a Costa Rica consular visa for eligible visa-required nationalities",
    maximumStay: "Often 30 days for some visa-required groups, extendable up to 90 days; the officer decides the actual stay.",
    conditions: "U.S. or Canada visa/residence must normally be valid for at least three months at entry. U.S. transit C1, C2, and C3 visas are not accepted for this exemption. Passport and border-control checks still apply.",
    officialSourceName: "Costa Rica Directorate of Migration and Foreigners",
    officialSourceUrl: "https://www.migracion.go.cr/Paginas/Visas.aspx",
    lastVerified: "2026-07-20",
    confidence: "official reviewed",
    premiumNote: "Useful for users who hold U.S. or Canadian documents, but it must be checked against nationality and visa category.",
  },
];

function toggleVisa(current: HeldVisaCode[], code: HeldVisaCode) {
  return current.includes(code) ? current.filter((item) => item !== code) : [...current, code];
}

function uniqueDestinations(rules: BenefitRule[]) {
  return new Set(rules.map((rule) => rule.destination)).size;
}

function selectedLabels(selected: HeldVisaCode[]) {
  if (!selected.length) return "No existing visas selected yet";
  return heldVisaOptions.filter((item) => selected.includes(item.code)).map((item) => item.label).join(" + ");
}

export default function VisaPowerPlanner() {
  const [passportCountry, setPassportCountry] = useState("Nigeria");
  const [selectedVisas, setSelectedVisas] = useState<HeldVisaCode[]>(["canada_visitor"]);
  const [multipleEntry, setMultipleEntry] = useState(true);
  const [visaUsedBefore, setVisaUsedBefore] = useState(false);

  const matchedRules = useMemo(() => {
    return benefitRules.filter((rule) => rule.eligibleVisaCodes.some((code) => selectedVisas.includes(code)));
  }, [selectedVisas]);

  const destinationCount = uniqueDestinations(matchedRules);
  const reviewedCount = matchedRules.filter((rule) => rule.confidence === "official reviewed").length;
  const score = Math.min(100, Math.round(20 + destinationCount * 13 + selectedVisas.length * 7 + reviewedCount * 3));

  return (
    <div className="live-workspace">
      <section className="workflow-panel live-form">
        <div className="panel-heading">
          <div>
            <p className="overline">Visa stack</p>
            <h2>Enter visas you already hold</h2>
          </div>
          <span className="status-dot">Premium preview</span>
        </div>

        <p className="form-status">
          This tool shows possible extra travel benefits from visas you already hold. It is for planning only. Always confirm with the official destination source, airline, and border authority before travel.
        </p>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="passport_country">Passport country</label>
            <input id="passport_country" value={passportCountry} onChange={(event) => setPassportCountry(event.target.value)} placeholder="Example: Nigeria" />
          </div>

          <div className="mini-list simple-status-list">
            {heldVisaOptions.map((option) => (
              <label className="checkbox-field" key={option.code}>
                <input type="checkbox" checked={selectedVisas.includes(option.code)} onChange={() => setSelectedVisas((current) => toggleVisa(current, option.code))} />
                <span><strong>{option.label}</strong><br />{option.helper}</span>
              </label>
            ))}
          </div>

          <label className="checkbox-field">
            <input type="checkbox" checked={multipleEntry} onChange={(event) => setMultipleEntry(event.target.checked)} />
            <span>My selected visa is multiple-entry where the destination rule requires it.</span>
          </label>

          <label className="checkbox-field">
            <input type="checkbox" checked={visaUsedBefore} onChange={(event) => setVisaUsedBefore(event.target.checked)} />
            <span>I have already used the visa to enter the issuing country or region where the destination rule requires previous use.</span>
          </label>
        </div>
      </section>

      <section className="result-panel" aria-live="polite">
        <div className="result-stack">
          <article className="result-block featured">
            <div className="panel-heading">
              <div>
                <p className="overline">Visa Opportunity Score</p>
                <h2>{score}/100 starter travel-benefit score</h2>
              </div>
              <span className="status-dot">{destinationCount} matched</span>
            </div>
            <p>
              Passport: <strong>{passportCountry || "Not set"}</strong>. Visa stack: <strong>{selectedLabels(selectedVisas)}</strong>.
            </p>
            <div className="badge-row">
              <span className="badge">Passport index: planned</span>
              <span className="badge">Visa benefits: {destinationCount} destinations</span>
              <span className="badge">Official-source rows: {reviewedCount}</span>
              <span className="badge">Multiple-entry: {multipleEntry ? "yes" : "check"}</span>
              <span className="badge">Used before: {visaUsedBefore ? "yes" : "may be required"}</span>
            </div>
          </article>

          <article className="result-block">
            <p className="overline">Possible travel benefits</p>
            <h2>Countries that may become easier because of your existing visa</h2>
            {matchedRules.length ? (
              <div className="mini-list">
                {matchedRules.map((rule) => (
                  <div key={rule.id}>
                    <strong>{rule.destination} · {rule.destinationRegion}</strong>
                    <span><strong>Separate visa needed?</strong> {rule.separateVisaNeeded}</span>
                    <span><strong>Maximum stay:</strong> {rule.maximumStay}</span>
                    <span><strong>Conditions:</strong> {rule.conditions}</span>
                    <span><strong>Source:</strong> <a href={rule.officialSourceUrl} target="_blank" rel="noreferrer">{rule.officialSourceName}</a></span>
                    <span><strong>Last verified:</strong> {rule.lastVerified} · {rule.confidence}</span>
                    <span>{rule.premiumNote}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="form-status">Select at least one existing visa to see possible travel-benefit matches.</p>
            )}
          </article>

          <article className="result-block soft">
            <p className="overline">Safety rules</p>
            <h2>This is not permission to travel yet.</h2>
            <div className="mini-list">
              <div><strong>Check official source</strong><span>Rules change often. MoveReady should show last verified date, source confidence, and the official link.</span></div>
              <div><strong>Check visa conditions</strong><span>Some destinations require a valid visa, multiple-entry visa, previous use, minimum remaining validity, return ticket, proof of funds, hotel address, or tourist-only purpose.</span></div>
              <div><strong>Check your personal history</strong><span>Prior refusal, overstays, lost documents, weak ties, or unclear purpose can still affect border entry.</span></div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
