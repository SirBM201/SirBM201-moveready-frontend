import SiteHeader from "@/components/SiteHeader";

const budgetItems = [
  ["Official proof-of-funds", "Use the current requirement for the selected pathway and family size. Never substitute a generic estimate for an official threshold."],
  ["Application & government fees", "Track fees separately from proof-of-funds because fees are money you spend, not settlement funds you merely demonstrate."],
  ["Documents & compliance", "Budget for translations, certification, legalization, medicals, police records or other route-specific preparation where required."],
  ["Travel & arrival", "Estimate flights, airport transport, temporary accommodation and first-arrival essentials."],
  ["Settlement reserve", "Keep a practical buffer beyond mandatory funds so an approval does not leave the move financially fragile."],
];

const readiness = [
  ["Available funds", "What you can legitimately evidence today."],
  ["Known official requirement", "Route-specific proof-of-funds or settlement requirement, with source and rule date."],
  ["Execution budget", "Expected relocation and application costs."],
  ["Funding gap", "Target funds minus available funds. Unknown official requirements remain Needs assessment."],
];

export default function BudgetCalculatorPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Financial readiness" />
      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <p className="overline">MOVE · Financial Readiness</p>
          <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>Know the full money target before you commit.</h1>
          <p className="section-intro">MoveReady separates official proof-of-funds from the money you will actually spend to apply, relocate and settle. A route is not financially ready merely because the application fee is affordable.</p>
          <div className="actions" style={{ marginTop: 14 }}><a className="btn primary" href="/proof-of-funds">Check proof of funds</a><a className="btn" href="/route-checker">Opportunity Finder</a><a className="btn" href="/my-journey">My Journey</a></div>
        </div>
      </section>
      <section className="section no-top-pad">
        <div className="section-heading-row"><div><p className="overline">Readiness model</p><h2>One financial picture, four distinct inputs</h2></div><span className="status-dot">No invented thresholds</span></div>
        <div className="grid">{readiness.map(([name, detail]) => <article className="card" key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
      </section>
      <section className="section">
        <div className="live-workspace">
          <article className="workflow-panel"><p className="overline">Planning inputs</p><h2>Build your relocation budget</h2><div className="form-grid"><div className="field"><label>Planning currency</label><select defaultValue="EUR"><option>EUR</option><option>USD</option><option>CAD</option><option>GBP</option><option>NGN</option><option>KWD</option></select></div><div className="field"><label>Family members relocating</label><input inputMode="numeric" placeholder="1" /></div><div className="field"><label>Pathway category</label><select defaultValue="work"><option>work</option><option>skilled PR</option><option>study</option><option>startup / business</option><option>family</option><option>job seeker</option><option>digital nomad</option></select></div><div className="actions"><a className="btn primary" href="/proof-of-funds">Continue to funds check</a></div></div></article>
          <article className="result-panel"><div className="result-block featured"><p className="overline">Important</p><h2>Unknown is not zero.</h2><p>If MoveReady does not yet have a verified official funds requirement for the selected pathway, the result should say <strong>Needs assessment</strong>. It must not report 100% financial readiness from missing data.</p><p className="muted">Material funds rules should carry official-source provenance and a checked/updated date before the user relies on them.</p></div></article>
        </div>
      </section>
      <section className="section"><div className="section-heading-row"><div><p className="overline">Budget structure</p><h2>What the target should include</h2></div></div><div className="grid">{budgetItems.map(([name, detail]) => <article className="card" key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div></section>
    </main>
  );
}
