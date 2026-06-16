const routes = [
  {
    title: "Route checker",
    href: "/route-checker",
    text: "Compare study, work, startup, family, scholarship, visitor, and digital-nomad pathways before spending money.",
  },
  {
    title: "Document checklist",
    href: "/document-checklist",
    text: "Turn a route into a practical document list with required, conditional, and recommended items.",
  },
  {
    title: "Funds and budget readiness",
    href: "/budget-calculator",
    text: "Estimate application costs, proof-of-funds pressure, insurance, travel, accommodation, and first-arrival costs.",
  },
  {
    title: "Scholarship matching",
    href: "/scholarships",
    text: "Help students find funding routes without making scholarship research the whole product.",
  },
  {
    title: "Insurance guidance",
    href: "/insurance-guide",
    text: "Show when travel, student, health, family, or work insurance may be needed for a route.",
  },
  {
    title: "Readiness reports",
    href: "/report-preview",
    text: "Generate a route-specific action plan with risk notes, source status, and next steps.",
  },
];

const trustItems = [
  { value: "Source-first", label: "AI explains approved route data" },
  { value: "Versioned", label: "Old route facts are kept for audit" },
  { value: "Reviewed", label: "Admin tasks track source changes" },
  { value: "Practical", label: "Documents, funds, budget, and insurance" },
];

export default function Home() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Global relocation readiness platform</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/route-checker">Route Checker</a>
          <a href="/document-checklist">Documents</a>
          <a href="/budget-calculator">Budget</a>
          <a href="/scholarships">Scholarships</a>
          <a href="/insurance-guide">Insurance</a>
          <a href="/report-preview">Report</a>
        </nav>
      </header>

      <section className="hero-band" id="checker">
        <div className="hero-copy">
          <span className="eyebrow">Working MVP name - final brand later</span>
          <h1>Choose the route, then get ready properly.</h1>
          <p className="lede">
            MoveReady helps users compare realistic visa, study, work, business, family, scholarship, and relocation pathways, then prepare documents, funds, budget, insurance, and next steps from source-backed data.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Start route checker</a>
            <a className="btn" href="/report-preview">Preview readiness report</a>
          </div>
        </div>

        <aside className="workflow-panel" aria-label="Route readiness starter">
          <h2>Start route readiness</h2>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="goal">Main goal</label>
              <select id="goal" defaultValue="business">
                <option value="study">Study or scholarship</option>
                <option value="work">Work abroad</option>
                <option value="business">Startup or business</option>
                <option value="family">Family relocation</option>
                <option value="visit">Visitor route</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="from">Current country</label>
              <input id="from" placeholder="Example: Kuwait" />
            </div>
            <div className="field">
              <label htmlFor="target">Target country</label>
              <input id="target" placeholder="Example: Estonia, Portugal, Finland" />
            </div>
            <a className="btn primary" href="/report-preview">Generate starter plan</a>
          </div>
        </aside>
      </section>

      <section className="trust-strip" id="trust">
        {trustItems.map((item) => (
          <div className="trust-item" key={item.value}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="section" id="modules">
        <h2>MVP modules</h2>
        <p className="section-intro">
          The first version should focus on intelligence, readiness, and reports. Courier, notary, flight, hotel, taxi, and consultant marketplaces can come after the trusted route foundation is working.
        </p>
        <div className="grid">
          {routes.map((route) => (
            <a className="card" href={route.href} key={route.title}>
              <h3>{route.title}</h3>
              <p>{route.text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="report">
        <h2>Readiness report foundation</h2>
        <p className="section-intro">
          Every sensitive report should keep the route version, source snapshots, risk level, last verified date, review due date, and refresh status used when the report was generated.
        </p>
        <article className="card">
          <h3>Example report sections</h3>
          <div className="badge-row">
            <span className="badge">Route summary</span>
            <span className="badge">Eligibility notes</span>
            <span className="badge">Document checklist</span>
            <span className="badge">Proof of funds</span>
            <span className="badge">Budget estimate</span>
            <span className="badge">Insurance notes</span>
            <span className="badge">Scholarship options</span>
            <span className="badge">Next steps</span>
            <span className="badge">Source freshness</span>
          </div>
        </article>
      </section>
    </main>
  );
}
