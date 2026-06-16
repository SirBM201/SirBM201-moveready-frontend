const scholarshipFilters = [
  "Target country",
  "Education level",
  "Nationality eligibility",
  "Deadline status",
  "Full or partial funding",
  "Travel or living-cost support",
];

export default function ScholarshipsPage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>Scholarships</span></a><nav className="nav"><a href="/route-checker">Route Checker</a><a href="/budget-calculator">Budget</a><a href="/report-preview">Report</a></nav></header>
      <section className="hero-band">
        <div className="hero-copy">
          <span className="eyebrow">Student pathway module</span>
          <h1>Scholarships should support the route, not become the whole app.</h1>
          <p className="lede">MoveReady will help users find relevant funding options while still checking visa route, documents, insurance, proof of funds, and arrival readiness.</p>
        </div>
        <aside className="workflow-panel">
          <h2>Scholarship filters</h2>
          <div className="badge-row">{scholarshipFilters.map((item) => <span className="badge" key={item}>{item}</span>)}</div>
        </aside>
      </section>
    </main>
  );
}
