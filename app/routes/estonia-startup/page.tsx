import LiveRouteDetail from "@/components/LiveRouteDetail";

export default function EstoniaStartupRoutePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Estonia startup route</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/country-checker">Countries</a>
          <a href="/report-preview">Report</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Official-source starter route</span>
          <h1>Estonia startup founder pathway.</h1>
          <p className="lede">
            A focused route workspace for non-EU founders preparing Startup Committee evidence, D visa readiness, documents, funds, insurance, and next-step reporting.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Generate readiness report</a>
            <a className="btn" href="/country-checker">Compare countries</a>
          </div>
        </div>
      </section>

      <LiveRouteDetail countryCode="EE" routeCode="startup-founder" />
    </main>
  );
}
