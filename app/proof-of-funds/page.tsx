import SiteHeader from "@/components/SiteHeader";

const fundChecks = [
  ["Official minimum", "Verified requirement for the selected pathway and family size."],
  ["Holding/history rule", "Whether funds must be held for a stated period and what account history is required."],
  ["Evidence format", "Accepted statements, balance certificates or other evidence specified by the authority."],
  ["Source of funds", "Whether salary savings, sale proceeds, gifts or other sources need explanation or supporting evidence."],
  ["Sponsor / third-party support", "Whether sponsorship is permitted and which relationship or undertaking evidence is required."],
  ["Scholarship / funding letter", "Whether an award or funding letter can satisfy some or all of the requirement."],
  ["Family adjustment", "How accompanying family members change the verified requirement."],
];

const statuses = [
  ["Ready", "Available eligible funds meet or exceed the verified requirement, subject to evidence-quality checks."],
  ["Gap", "A verified requirement exists but eligible available funds are below it."],
  ["Needs assessment", "MoveReady does not yet have enough verified rule or user evidence to calculate safely."],
];

export default function ProofOfFundsPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Proof of funds" />
      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <p className="overline">MOVE · Financial Readiness</p>
          <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>Can you prove the money the pathway actually requires?</h1>
          <p className="section-intro">Proof of funds is not the same as your relocation budget. MoveReady should assess the official requirement, the eligibility of the funds, the evidence history and the effect of family size before declaring readiness.</p>
          <div className="actions" style={{ marginTop: 14 }}><a className="btn primary" href="/budget-calculator">Build full financial plan</a><a className="btn" href="/document-checklist">Documents</a><a className="btn" href="/route-checker">Opportunity Finder</a></div>
        </div>
      </section>
      <section className="section no-top-pad">
        <div className="section-heading-row"><div><p className="overline">Assessment states</p><h2>Clear results without false precision</h2></div><span className="status-dot">Official-source aware</span></div>
        <div className="grid">{statuses.map(([name, detail]) => <article className="card" key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
      </section>
      <section className="section">
        <div className="section-heading-row"><div><p className="overline">Evidence model</p><h2>What MoveReady must check</h2><p className="section-intro">Material rules should carry an official source and checked/updated date. If the rule is unknown or stale, the product should ask for verification rather than invent a threshold.</p></div></div>
        <div className="grid">{fundChecks.map(([name, detail]) => <article className="card" key={name}><h3>{name}</h3><p>{detail}</p><span className="status-dot">Verify for selected pathway</span></article>)}</div>
      </section>
      <section className="section"><div className="result-block"><p className="overline">Next best action</p><h2>Turn a funds result into an action.</h2><p>A funding gap should send the user to a savings target and financial plan. Missing evidence should send them to Documents. A verified-ready result should allow the selected opportunity to continue toward application execution.</p><div className="actions"><a className="btn" href="/budget-calculator">Financial plan</a><a className="btn" href="/evidence-pack">Evidence & documents</a><a className="btn primary" href="/applications">Application tracker</a></div></div></section>
    </main>
  );
}
