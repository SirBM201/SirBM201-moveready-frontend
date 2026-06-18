const workflows = [
  {
    title: "Route readiness",
    status: "Available",
    href: "/route-checker",
    summary: "Generate checklist, budget estimate, risk label, and readiness report from route inputs.",
  },
  {
    title: "Country comparison",
    status: "Available",
    href: "/country-checker",
    summary: "Review supported countries and route records as they are approved in the source-backed database.",
  },
  {
    title: "Estonia startup route",
    status: "Available",
    href: "/routes/estonia-startup",
    summary: "Open the Estonia founder route workspace with facts, documents, budget, and report action.",
  },
  {
    title: "Finland D visa route",
    status: "Available",
    href: "/routes/finland-d-visa",
    summary: "Use the Migri-backed D visa route page while the database seed is completed.",
  },
  {
    title: "Official opportunities",
    status: "Available",
    href: "/platform/opportunities",
    summary: "Track lottery, ballot, quota, and invitation-pool opportunities with scam-safe guidance.",
  },
  {
    title: "Watchlist alerts",
    status: "Available",
    href: "/watchlist",
    summary: "Save opt-in alert requests for routes, opportunities, scholarships, countries, and services.",
  },
  {
    title: "Saved routes",
    status: "Available",
    href: "/saved-routes",
    summary: "Save route decisions and retrieve them by email or phone.",
  },
  {
    title: "Application timeline",
    status: "Available",
    href: "/timeline",
    summary: "Store document, appointment, application, payment, travel, and arrival reminders.",
  },
  {
    title: "Trusted services",
    status: "Available",
    href: "/services",
    summary: "Capture requests for courier, documents, insurance, translation, accommodation, and settlement help.",
  },
  {
    title: "Provider applications",
    status: "Available",
    href: "/partners/apply",
    summary: "Let couriers, insurers, reviewers, translators, and relocation providers apply for review.",
  },
  {
    title: "My reports",
    status: "Available",
    href: "/my-reports",
    summary: "Retrieve saved readiness reports by reference, email, or phone.",
  },
  {
    title: "Admin review",
    status: "Available",
    href: "/admin",
    summary: "Review submitted requests, saved records, readiness checks, watchlists, and provider applications.",
  },
];

const controls = [
  "Reviewed source data before sensitive route claims",
  "No approval guarantees or success promises",
  "Contact only after user consent",
  "Provider review before public handoff",
  "Official links for lottery and ballot submissions",
  "Report and saved-route records preserved for lookup",
];

export default function WorkspacePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Workspace</span>
        </a>
        <nav className="nav">
          <a href="/dashboard">Dashboard</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/platform/opportunities">Opportunities</a>
          <a href="/services">Services</a>
          <a href="/admin">Admin</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Launch workspace</span>
          <h1>Operate the full MoveReady product from one place.</h1>
          <p className="lede">
            This page links the active user flows, admin surfaces, trust controls, and route pages without exposing internal roadmap language.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Start route check</a>
            <a className="btn" href="/watchlist">Create watchlist</a>
            <a className="btn" href="/admin">Open admin</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <h2>Product Areas</h2>
            <p className="section-intro">Each area is accessible for launch testing. Partner handoffs and external API delivery remain controlled by review and approval.</p>
          </div>
          <span className="status-dot">Ready for testing</span>
        </div>
        <div className="module-preview-grid">
          {workflows.map((item) => (
            <a className="module-tile" href={item.href} key={item.title}>
              <div className="badge-row">
                <span className="badge module-status available">{item.status}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>Safety Controls</h2>
            <p className="section-intro">These controls should remain visible across policy, service, and admin decisions.</p>
          </div>
          <a className="btn" href="/safety">Safety page</a>
        </div>
        <div className="grid">
          {controls.map((item) => (
            <article className="card" key={item}>
              <h3>{item}</h3>
              <p>Keep this behavior consistent before adding more country routes or approved service partners.</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
