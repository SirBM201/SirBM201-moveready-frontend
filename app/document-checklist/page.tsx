const checklist = [
  ["Valid passport", "Required", "Check validity, blank pages, and name consistency."],
  ["Proof of funds", "Required", "Bank statements, sponsor evidence, scholarship award, or business funds."],
  ["Purpose evidence", "Required", "Admission, job offer, business plan, invitation, or family proof."],
  ["Civil documents", "Conditional", "Birth, marriage, police, or family documents where required."],
  ["Insurance evidence", "Conditional", "Travel, student, health, or family insurance depending on route."],
  ["Translations/legalization", "Conditional", "Certified translation, notarization, apostille, or authentication may be needed."],
];

export default function DocumentChecklistPage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>Document checklist</span></a><nav className="nav"><a href="/route-checker">Route Checker</a><a href="/budget-calculator">Budget</a><a href="/report-preview">Report</a></nav></header>
      <section className="section">
        <h2>Document readiness checklist</h2>
        <p className="section-intro">The MVP checklist separates required, conditional, recommended, and optional documents. Later, every item should point to a route version and trusted source.</p>
        <div className="grid">
          {checklist.map(([name, level, details]) => (
            <article className="card" key={name}>
              <h3>{name}</h3>
              <p>{details}</p>
              <div className="badge-row"><span className="badge">{level}</span><span className="badge">Source pending</span></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
