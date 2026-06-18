import TimelinePlanner from "@/components/TimelinePlanner";

export default function TimelinePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Application timeline</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/saved-routes">Saved Routes</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/readiness">Readiness</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/my-reports">My Reports</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Available now: timeline tracking</span>
          <h1>Track documents, appointments, deadlines, results, and travel steps.</h1>
          <p className="lede">
            Save route-specific tasks and reminder dates so the relocation process stays organized before application, decision, and arrival.
          </p>
        </div>
      </section>

      <section className="section no-top-pad">
        <TimelinePlanner />
      </section>
    </main>
  );
}
