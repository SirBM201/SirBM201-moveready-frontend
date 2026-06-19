import CountryComparisonWorkspace from "@/components/CountryComparisonWorkspace";

export default function CountryComparisonPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Country comparison</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/compare">Compare Routes</a>
          <a href="/country-checker">Countries</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/services">Services</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Country comparison</span>
          <h1>Compare countries by routes, risk, source confidence, and next steps.</h1>
          <p className="lede">
            Use live country and route records to decide where to focus first, then save the country, create alerts, or generate a readiness report.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Run route checker</a>
            <a className="btn" href="/saved-routes">View saved routes</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <CountryComparisonWorkspace />
      </section>
    </main>
  );
}
