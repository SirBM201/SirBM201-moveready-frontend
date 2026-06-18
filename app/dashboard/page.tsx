import ProfileDashboard from "@/components/ProfileDashboard";

export default function DashboardPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>User dashboard</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/saved-routes">Saved Routes</a>
          <a href="/timeline">Timeline</a>
          <a href="/services">Services</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/readiness">Readiness</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/my-reports">My Reports</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Available now: profile saving</span>
          <h1>Build one relocation profile for reports, alerts, routes, and timelines.</h1>
          <p className="lede">
            Save the user context once, then use it to generate readiness reports, save routes, create timeline events, request watchlist alerts, request services, and support future account-based dashboards.
          </p>
          <div className="actions">
            <a className="btn primary" href="/timeline">Open timeline</a>
            <a className="btn" href="/saved-routes">Saved routes</a>
            <a className="btn" href="/services">Request service</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <ProfileDashboard />
      </section>
    </main>
  );
}
