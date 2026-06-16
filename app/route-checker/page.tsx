const routeOptions = [
  { title: "Study", fit: "Admission, scholarship, tuition, proof of funds, insurance", risk: "Medium" },
  { title: "Startup", fit: "Founder role, innovation, traction, funds, relocation intent", risk: "Medium" },
  { title: "Work", fit: "Job offer, employer sponsorship, qualifications, salary threshold", risk: "High" },
  { title: "Family", fit: "Relationship evidence, sponsor status, income, housing", risk: "High" },
  { title: "Visit", fit: "Purpose, ties to residence country, travel funds, return plan", risk: "Medium" },
  { title: "Digital nomad", fit: "Remote income, clients, insurance, accommodation, tax exposure", risk: "Medium" },
];

export default function RouteCheckerPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Route checker</span></a>
        <nav className="nav"><a href="/">Home</a><a href="/document-checklist">Documents</a><a href="/report-preview">Report</a></nav>
      </header>
      <section className="hero-band">
        <div className="hero-copy">
          <span className="eyebrow">MVP workflow</span>
          <h1>Find the most realistic pathway before spending money.</h1>
          <p className="lede">The checker starts with the user's goal, current country, target country, family size, funds, and timeline. It then points them toward route categories that deserve deeper review.</p>
        </div>
        <aside className="workflow-panel">
          <h2>Profile inputs</h2>
          <div className="form-grid">
            <div className="field"><label>Main goal</label><select defaultValue="startup"><option>Study</option><option>Startup</option><option>Work</option><option>Family</option><option>Visit</option></select></div>
            <div className="field"><label>Current country</label><input placeholder="Example: Kuwait" /></div>
            <div className="field"><label>Target country</label><input placeholder="Example: Estonia" /></div>
            <div className="field"><label>Available funds</label><input placeholder="Example: 12000 EUR" /></div>
            <a className="btn primary" href="/report-preview">Preview result</a>
          </div>
        </aside>
      </section>
      <section className="section">
        <h2>Route categories</h2>
        <p className="section-intro">These are starter categories. Later, each category will be connected to approved country-specific route versions and source snapshots.</p>
        <div className="grid">
          {routeOptions.map((route) => (
            <article className="card" key={route.title}>
              <h3>{route.title}</h3>
              <p>{route.fit}</p>
              <div className="badge-row"><span className="badge">Risk: {route.risk}</span><span className="badge">Needs source review</span></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
