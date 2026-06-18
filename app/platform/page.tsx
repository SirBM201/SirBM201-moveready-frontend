import { platformModules } from "@/lib/platformModules";

const availabilityLabel = {
  available: "Available",
  coming_soon: "Coming soon",
  partner_approval_pending: "Partner approval pending",
};

export default function PlatformPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Platform services</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/providers">Providers</a>
          <a href="/opportunities">Opportunities</a>
          <a href="/saved-routes">Saved Routes</a>
          <a href="/timeline">Timeline</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/readiness">Readiness</a>
          <a href="/sources">Sources</a>
          <a href="/launch-readiness">Launch</a>
          <a href="/route-checker">Route Checker</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">MoveReady services</span>
          <h1>Visa, relocation, documents, alerts, and trusted services in one place.</h1>
          <p className="lede">
            MoveReady brings route intelligence, official opportunity monitoring, documents, funds, timelines, alerts, courier, legalization, insurance, appointments, family planning, and post-arrival support into one source-backed platform.
          </p>
          <div className="actions">
            <a className="btn primary" href="/services">Request trusted service</a>
            <a className="btn" href="/readiness">Use readiness tools</a>
            <a className="btn" href="/watchlist">Create watchlist alert</a>
            <a className="btn" href="/partners/apply">Apply as provider</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="module-ledger">
          {platformModules.map((module) => (
            <a className="module-row" href={module.href} key={module.slug}>
              <div>
                <span className="overline">{module.category}</span>
                <h2>{module.title}</h2>
                <p>{module.summary}</p>
              </div>
              <div className="module-row-meta">
                <span className={`badge module-status ${module.availability}`}>{availabilityLabel[module.availability]}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
