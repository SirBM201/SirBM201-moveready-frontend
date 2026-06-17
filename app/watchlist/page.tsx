import WatchlistSignup from "@/components/WatchlistSignup";

export default function WatchlistPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Watchlist and alerts</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/opportunities">Opportunities</a>
          <a href="/readiness">Readiness</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/platform">Services</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Coming soon: notification sending</span>
          <h1>Save routes and opportunities you want MoveReady to monitor.</h1>
          <p className="lede">
            Users can opt in for alerts about application openings, closing dates, result windows, eligibility changes, document changes, fee changes, and source-review updates.
          </p>
        </div>
      </section>

      <section className="section no-top-pad">
        <WatchlistSignup />
      </section>
    </main>
  );
}
