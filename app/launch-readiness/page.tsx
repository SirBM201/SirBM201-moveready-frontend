const launchChecks = [
  {
    area: "Routes",
    status: "Active",
    title: "Core route guidance",
    text: "Country, route, route detail, checklist, budget, report, Estonia startup, and Finland D visa surfaces are present.",
  },
  {
    area: "Readiness",
    status: "Active",
    title: "Document and funds tools",
    text: "Name consistency, document readiness, proof-of-funds planning, and refusal-risk checks are available with backend storage support.",
  },
  {
    area: "Monitoring",
    status: "Active",
    title: "Watchlist and saved routes",
    text: "Users can save routes and opt into monitoring preferences. Message delivery should remain consent-based and provider-controlled.",
  },
  {
    area: "Opportunities",
    status: "Active",
    title: "Official ballots and quota routes",
    text: "The opportunity page can track DV lottery, youth mobility ballots, IEC pools, and quota windows with safety warnings and official source links.",
  },
  {
    area: "Services",
    status: "Active",
    title: "Service request capture",
    text: "Users can request courier, legalization, insurance, expert review, admission, accommodation, airport pickup, and settlement support.",
  },
  {
    area: "Providers",
    status: "Screening required",
    title: "Provider applications",
    text: "Providers can apply, but public listing and handoff should only happen after admin review, compliance checks, and source approval.",
  },
  {
    area: "Trust",
    status: "Active",
    title: "Source and safety rules",
    text: "Trust, safety, privacy, terms, source-review, and no-guarantee messaging are available as public pages.",
  },
  {
    area: "Admin",
    status: "Protected",
    title: "Review workspace",
    text: "Admin pages can inspect reports, review tasks, profiles, saved routes, timeline events, partner applications, requests, watchlists, and readiness checks.",
  },
];

const deploymentChecks = [
  "Confirm backend database setup is complete, including corrected Finland D visa route records.",
  "Confirm Railway backend health and route endpoints after deployment completes.",
  "Confirm Vercel frontend has the latest production deployment.",
  "Set frontend API base to the active backend URL.",
  "Keep admin key private and test admin pages only with the correct key.",
  "Test one full user flow: route checker, report generation, save route, watchlist, timeline, service request, provider application, and report lookup.",
  "Review public pages for no false guarantees, no hidden legal claims, and no unapproved partner handoff language.",
];

export default function LaunchReadinessPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Launch readiness</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/workspace">Workspace</a>
          <a href="/trust">Trust</a>
          <a href="/sources">Sources</a>
          <a href="/admin">Admin</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Launch control</span>
          <h1>Confirm what is active before public promotion.</h1>
          <p className="lede">
            This page keeps launch checks visible without exposing internal roadmap language. It separates live user actions from provider handoffs that need approval.
          </p>
        </div>
      </section>

      <section className="section no-top-pad">
        <h2>Product readiness</h2>
        <p className="section-intro">
          These are user-facing capabilities and safety controls currently represented in the app structure.
        </p>
        <div className="module-ledger">
          {launchChecks.map((item) => (
            <article className="module-row" key={item.title}>
              <div>
                <span className="overline">{item.area}</span>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </div>
              <div className="module-row-meta">
                <span className="badge">{item.status}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Deployment checks</h2>
        <p className="section-intro">
          Run these checks after backend and frontend deployments settle.
        </p>
        <article className="card">
          <div className="mini-list">
            {deploymentChecks.map((item) => <div key={item}><strong>{item}</strong></div>)}
          </div>
        </article>
      </section>
    </main>
  );
}
