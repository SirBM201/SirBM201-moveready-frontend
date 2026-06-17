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
          <a href="/opportunities">Opportunities</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/routes/estonia-startup">Estonia Route</a>
          <a href="/country-checker">Countries</a>
          <a href="/report-preview">Report</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">MoveReady services</span>
          <h1>Visa, relocation, documents, alerts, and trusted services in one place.</h1>
          <p className="lede">
            MoveReady brings route intelligence, official opportunity monitoring, documents, funds, alerts, courier, legalization, insurance, appointments, family planning, and post-arrival support into one source-backed platform.
          </p>
          <div className="actions">
            <a className="btn primary" href="/opportunities">View official opportunities</a>
            <a className="btn" href="/route-checker">Use route checker</a>
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
