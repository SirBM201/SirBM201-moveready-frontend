const fundChecks = [
  "Official minimum amount for the selected route",
  "How long funds must be held before application",
  "Accepted bank statement format",
  "Sponsor rules and relationship evidence",
  "Scholarship or funding-letter acceptance",
  "Family-member amount adjustment",
];

export default function ProofOfFundsPage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>Proof of funds</span></a><nav className="nav"><a href="/budget-calculator">Budget</a><a href="/document-checklist">Documents</a><a href="/report-preview">Report</a></nav></header>
      <section className="section">
        <h2>Proof-of-funds readiness</h2>
        <p className="section-intro">This module should help users know whether their available funds, bank history, sponsor evidence, or scholarship support may be enough for a selected route.</p>
        <div className="grid">
          {fundChecks.map((item) => <article className="card" key={item}><h3>{item}</h3><p>Needs country and route-specific source review before production guidance.</p></article>)}
        </div>
      </section>
    </main>
  );
}
