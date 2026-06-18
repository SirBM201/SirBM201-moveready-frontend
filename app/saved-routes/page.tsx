import SavedRoutesManager from "@/components/SavedRoutesManager";

export default function SavedRoutesPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Saved routes</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/opportunities">Opportunities</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/my-reports">My Reports</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Available now: route saving</span>
          <h1>Keep the routes and opportunities you want to revisit.</h1>
          <p className="lede">
            Save a route, opportunity, scholarship, country, or service with contact consent, then retrieve it later by email or phone.
          </p>
        </div>
      </section>

      <section className="section no-top-pad">
        <SavedRoutesManager />
      </section>
    </main>
  );
}
