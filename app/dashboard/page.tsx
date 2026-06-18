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
          <a href="/route-checker">Route Checker</a>
          <a href="/readiness">Readiness</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/my-reports">My Reports</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Available now: profile saving</span>
          <h1>Build one relocation profile for reports, alerts, and services.</h1>
          <p className="lede">
            Save the user context once, then use it to generate readiness reports, save routes, create watchlist alerts, request services, and support future account-based dashboards.
          </p>
        </div>
      </section>

      <section className="section no-top-pad">
        <ProfileDashboard />
      </section>
    </main>
  );
}