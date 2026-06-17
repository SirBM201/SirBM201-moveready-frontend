import { platformModules } from "@/lib/platformModules";

const liveRoutes = [
  {
    title: "Estonia startup route",
    href: "/routes/estonia-startup",
    text: "Review Startup Committee, D visa, document, funds, insurance, and budget readiness for Estonia startup founders.",
  },
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
    title: "Readiness reports",
    href: "/report-preview",
    text: "Generate a route-specific action plan with risk notes, source status, and next steps.",
  },
];

const trustItems = [
  { value: "Source-first", label: "AI explains approved route data" },
  { value: "Versioned", label: "Old route facts are kept for audit" },
  { value: "Reviewed", label: "Admin tasks track source changes" },
  { value: "Expandable", label: "Future services stay feature-flagged" },
];

export default function Home() {
  const previewModules = platformModules.slice(0, 6);

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Global relocation readiness platform</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/routes/estonia-startup">Estonia Route</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/country-checker">Countries</a>
          <a href="/platform">Platform</a>
          <a href="/report-preview">Report</a>
        </nav>
      </header>

      <section className="hero-band" id="checker">
        <div className="hero-copy">
          <span className="eyebrow">Working MVP name - final brand later</span>
          <h1>Choose the route, then get ready properly.</h1>
          <p className="lede">
            MoveReady helps users compare realistic visa, study, work, business, family, scholarship, ballot, and relocation pathways, then prepare documents, funds, budget, insurance, and next steps from source-backed data.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Start route checker</a>
            <a className="btn" href="/routes/estonia-startup">View Estonia startup route</a>
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
                <option value="ballot">Ballot or quota opportunity</option>
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
            <a className="btn primary" href="/route-checker">Generate starter plan</a>
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
        <h2>Live MVP modules</h2>
        <p className="section-intro">
          The current version focuses on intelligence, readiness, and source-backed reports. Execution services stay planned until their workflows are safe to activate.
        </p>
        <div className="grid">
          {liveRoutes.map((route) => (
            <a className="card" href={route.href} key={route.title}>
              <h3>{route.title}</h3>
              <p>{route.text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="platform-map">
        <div className="section-heading-row">
          <div>
            <h2>Planned platform expansion</h2>
            <p className="section-intro">
              These modules are designed into the platform now so future APIs, alerts, partners, courier, legalization, and settlement features have a clear place to plug in.
            </p>
          </div>
          <a className="btn" href="/platform">View full map</a>
        </div>
        <div className="module-preview-grid">
          {previewModules.map((module) => (
            <a className="module-tile" href={module.href} key={module.slug}>
              <span className="overline">{module.phase}</span>
              <h3>{module.title}</h3>
              <p>{module.summary}</p>
              <span className="badge">{module.status === "partner_pending" ? "Partner pending" : "Planned"}</span>
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
            <span className="badge">Opportunity alerts</span>
            <span className="badge">Source freshness</span>
          </div>
        </article>
      </section>
    </main>
  );
}
