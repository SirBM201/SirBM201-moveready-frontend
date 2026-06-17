import LiveOpportunities from "@/components/LiveOpportunities";

export default function OpportunitiesPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Official ballots and quota opportunities</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/country-checker">Countries</a>
          <a href="/platform">Services</a>
          <a href="/report-preview">Report</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Official-source opportunity monitoring</span>
          <h1>Track visa lotteries, ballots, invitation pools, and quota routes safely.</h1>
          <p className="lede">
            MoveReady lists limited opportunity routes with official links, source confidence, application-window notes, and scam-safe reminders. Use this as a monitoring guide, not a promise of selection or approval.
          </p>
          <div className="actions">
            <a className="btn primary" href="/watchlist?type=opportunity">Create opportunity alert</a>
            <a className="btn" href="/route-checker">Check your route</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <LiveOpportunities />
      </section>
    </main>
  );
}