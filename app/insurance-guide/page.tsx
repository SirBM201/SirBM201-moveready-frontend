const insuranceTypes = [
  { title: "Travel insurance", text: "Useful for visitor routes, flight disruption, emergency coverage, and short-term trips." },
  { title: "Health insurance", text: "Often relevant for residence, student, family, and long-stay routes." },
  { title: "Student insurance", text: "May need minimum coverage amounts or school-approved coverage rules." },
  { title: "Family insurance", text: "Family relocation may require dependent coverage and proof for each member." },
  { title: "Work-route insurance", text: "May depend on employer coverage, national health system registration, or private cover." },
  { title: "Route-specific rules", text: "Every requirement should point to a source and last verified date before production use." },
];

export default function InsuranceGuidePage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>Insurance guide</span></a><nav className="nav"><a href="/route-checker">Route Checker</a><a href="/document-checklist">Documents</a><a href="/report-preview">Report</a></nav></header>
      <section className="section">
        <h2>Insurance readiness</h2>
        <p className="section-intro">The MVP should help users understand the difference between travel insurance and health insurance, and when each may be required.</p>
        <div className="grid">{insuranceTypes.map((item) => <article className="card" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </section>
    </main>
  );
}
