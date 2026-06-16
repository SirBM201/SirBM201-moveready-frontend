const countries = [
  ["Portugal", "General residence, digital remote work, study, visit, family, business research"],
  ["Estonia", "Startup founder, digital business, study, work, and e-residency-adjacent planning"],
  ["Finland", "Startup entrepreneur, study, work, family, and long-term settlement planning"],
];

export default function CountryCheckerPage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>Country checker</span></a><nav className="nav"><a href="/route-checker">Route Checker</a><a href="/report-preview">Report</a></nav></header>
      <section className="section">
        <h2>Country comparison starter</h2>
        <p className="section-intro">The country checker should compare route availability, proof-of-funds pressure, family friendliness, study options, startup fit, and post-arrival readiness.</p>
        <div className="grid">{countries.map(([name, text]) => <article className="card" key={name}><h3>{name}</h3><p>{text}</p><div className="badge-row"><span className="badge">Starter country</span><span className="badge">Source review needed</span></div></article>)}</div>
      </section>
    </main>
  );
}
