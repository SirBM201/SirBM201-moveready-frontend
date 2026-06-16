const sections = [
  ["Profile summary", "Goal, current country, target country, route category, family size, funds, and timeline."],
  ["Route readiness", "Eligibility notes and risk level tied to the active route version."],
  ["Document readiness", "Required, conditional, recommended, and optional documents."],
  ["Funds and budget", "Proof-of-funds pressure plus estimated application and arrival costs."],
  ["Insurance notes", "Travel, health, student, family, or work insurance expectations."],
  ["Source freshness", "Last verified date, review due date, source count, and refresh warning."],
];

export default function ReportPreviewPage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>Report preview</span></a><nav className="nav"><a href="/route-checker">Route Checker</a><a href="/budget-calculator">Budget</a><a href="/admin/reviews">Admin</a></nav></header>
      <section className="hero-band">
        <div className="hero-copy">
          <span className="eyebrow">Paid report foundation</span>
          <h1>Relocation readiness report</h1>
          <p className="lede">The report should be the first monetizable product: a practical action plan that preserves the source and route version used when it was generated.</p>
          <div className="actions"><a className="btn primary" href="/route-checker">Start route checker</a><a className="btn" href="/document-checklist">Review documents</a></div>
        </div>
        <aside className="workflow-panel">
          <h2>Trust status</h2>
          <div className="badge-row">
            <span className="badge">Risk: medium</span>
            <span className="badge">Status: generated</span>
            <span className="badge">Source: starter review</span>
            <span className="badge">Refresh: recommended after route approval</span>
          </div>
        </aside>
      </section>
      <section className="section">
        <h2>Report sections</h2>
        <div className="grid">{sections.map(([title, text]) => <article className="card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
    </main>
  );
}
