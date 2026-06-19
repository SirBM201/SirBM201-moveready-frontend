import { platformModules } from "@/lib/platformModules";

const liveRoutes = [
  {
    title: "Launch workspace",
    href: "/workspace",
    text: "Open the main working surface for routes, countries, opportunities, watchlists, saved routes, timelines, services, reports, and admin review.",
  },
  {
    title: "Compare routes",
    href: "/compare",
    text: "Compare Estonia startup, Finland D visa, official opportunities, readiness tools, saved routes, watchlists, and trusted services before committing.",
  },
  {
    title: "Compare countries",
    href: "/country-comparison",
    text: "Compare countries by live route availability, route categories, risk signals, source confidence, saved-country actions, and watchlist next steps.",
  },
  {
    title: "Trust center",
    href: "/trust",
    text: "Explain source-backed guidance, no approval guarantees, opt-in notifications, partner screening, and sensitive-document controls.",
  },
  {
    title: "Source review",
    href: "/sources",
    text: "Show how official sources, last verified dates, review due dates, risk labels, and route versioning protect users.",
  },
  {
    title: "Launch readiness",
    href: "/launch-readiness",
    text: "Review active product surfaces, deployment checks, provider screening boundaries, and launch safety controls.",
  },
  {
    title: "Official ballots and quota opportunities",
    href: "/opportunities",
    text: "Track DV lottery, youth mobility ballots, IEC pools, country caps, and quota routes with official-source safety notes.",
  },
  {
    title: "Finland D visa route",
    href: "/routes/finland-d-visa",
    text: "Check D visa readiness for eligible Finnish residence permit routes, passport handling, family planning, timeline, and first-arrival costs.",
  },
  {
    title: "Saved routes",
    href: "/saved-routes",
    text: "Keep selected countries, visa routes, scholarships, opportunities, and services for later lookup by email or phone.",
  },
  {
    title: "Application timeline",
    href: "/timeline",
    text: "Track documents, appointments, payment deadlines, result checks, travel dates, and follow-up steps.",
  },
  {
    title: "Trusted service requests",
    href: "/services",
    text: "Request courier, legalization, insurance, translation, expert review, admission, accommodation, pickup, and settlement support.",
  },
  {
    title: "Watchlist and alerts",
    href: "/watchlist",
    text: "Save routes, opportunities, scholarships, countries, or services and choose opt-in alert preferences for updates.",
  },
  {
    title: "Provider applications",
    href: "/partners/apply",
    text: "Capture courier, insurance, legalization, translation, expert review, admission, and settlement providers for screening.",
  },
  {
    title: "Readiness tools",
    href: "/readiness",
    text: "Check name consistency, documents, proof-of-funds gaps, and refusal-risk indicators before submitting evidence.",
  },
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
  { value: "Versioned", label: "Route facts keep an audit trail" },
  { value: "Safety-first", label: "No approval or lottery guarantees" },
  { value: "Expandable", label: "New services plug in cleanly" },
];

const availabilityLabel = {
  available: "Available",
  coming_soon: "Coming soon",
  partner_approval_pending: "Partner approval pending",
};

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
          <a href="/workspace">Workspace</a>
          <a href="/compare">Compare</a>
          <a href="/country-comparison">Countries</a>
          <a href="/opportunities">Opportunities</a>
          <a href="/services">Services</a>
          <a href="/saved-routes">Saved Routes</a>
          <a href="/timeline">Timeline</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/readiness">Readiness</a>
          <a href="/routes/finland-d-visa">Finland Route</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/trust">Trust</a>
          <a href="/sources">Sources</a>
          <a href="/launch-readiness">Launch</a>
          <a href="/platform">Platform</a>
        </nav>
      </header>

      <section className="hero-band" id="checker">
        <div className="hero-copy">
          <span className="eyebrow">Source-backed relocation readiness</span>
          <h1>Choose the route, then get ready properly.</h1>
          <p className="lede">
            MoveReady helps users compare realistic visa, study, work, business, family, scholarship, ballot, and relocation pathways, then prepare documents, funds, budget, insurance, timeline events, trusted services, and next steps from source-backed data.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Start route checker</a>
            <a className="btn" href="/compare">Compare routes</a>
            <a className="btn" href="/country-comparison">Compare countries</a>
            <a className="btn" href="/services">Request trusted service</a>
            <a className="btn" href="/readiness">Use readiness tools</a>
            <a className="btn" href="/trust">Review trust rules</a>
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
        <h2>Live readiness tools</h2>
        <p className="section-intro">
          The current tools focus on route intelligence, country comparison, official opportunities, saved routes, timelines, watchlists, provider applications, service requests, document readiness, budget estimates, scholarships, insurance notes, and source-backed reports.
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
            <h2>MoveReady platform</h2>
            <p className="section-intro">
              Services are organized so users can move from route choice to alerts, documents, funds, trusted support, and settlement inside one platform.
            </p>
          </div>
          <div className="actions">
            <a className="btn primary" href="/services">Request service</a>
            <a className="btn" href="/platform">View platform</a>
          </div>
        </div>
        <div className="module-preview-grid">
          {previewModules.map((module) => (
            <a className="module-tile" href={module.href} key={module.slug}>
              <span className="overline">{module.category}</span>
              <h3>{module.title}</h3>
              <p>{module.summary}</p>
              <span className={`badge module-status ${module.availability}`}>{availabilityLabel[module.availability]}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="report">
        <h2>Readiness report foundation</h2>
        <p className="section-intro">
          Every sensitive report keeps the route version, source snapshots, risk level, last verified date, review due date, and refresh status used when the report was generated.
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
            <span className="badge">Timeline events</span>
            <span className="badge">Provider support</span>
            <span className="badge">Service requests</span>
            <span className="badge">Opportunity alerts</span>
            <span className="badge">Source freshness</span>
          </div>
        </article>
      </section>
    </main>
  );
}
