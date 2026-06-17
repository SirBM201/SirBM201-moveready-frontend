import { platformModules } from "@/lib/platformModules";

const statusLabel = {
  live: "Live now",
  planned: "Planned",
  partner_pending: "Partner pending",
};

export default function PlatformPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Platform architecture</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/routes/estonia-startup">Estonia Route</a>
          <a href="/country-checker">Countries</a>
          <a href="/report-preview">Report</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Full platform map</span>
          <h1>Build the full structure now. Activate modules only when ready.</h1>
          <p className="lede">
            MoveReady is structured for route intelligence, official opportunity monitoring, documents, funds, alerts, courier, legalization, insurance, appointments, family planning, and post-arrival support.
          </p>
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
                <span className="badge">{module.phase}</span>
                <span className={`badge module-status ${module.status}`}>{statusLabel[module.status]}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
