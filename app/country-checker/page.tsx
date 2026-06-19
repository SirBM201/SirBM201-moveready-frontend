import LiveCountryGrid from "@/components/LiveCountryGrid";

export default function CountryCheckerPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Country checker</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/country-comparison">Compare Countries</a>
          <a href="/compare">Compare Routes</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/report-preview">Report</a>
        </nav>
      </header>
      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>Country comparison starter</h2>
            <p className="section-intro">This page loads countries through the API. Use the comparison workspace for route counts, source confidence, risk signals, saved countries, and watchlist actions.</p>
          </div>
          <div className="actions">
            <a className="btn primary" href="/country-comparison">Open comparison workspace</a>
          </div>
        </div>
        <LiveCountryGrid />
      </section>
    </main>
  );
}
