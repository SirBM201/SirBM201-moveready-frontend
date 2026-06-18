import ReportsLookup from "@/components/ReportsLookup";

export default function MyReportsPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>My reports</span>
        </a>
        <nav className="nav">
          <a href="/dashboard">Dashboard</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/report-preview">Report Preview</a>
          <a href="/">Home</a>
        </nav>
      </header>
      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Available now: report lookup</span>
          <h1>Retrieve saved readiness reports.</h1>
          <p className="lede">Reports preserve the route, input, risk label, and generated report payload used at the time they were created.</p>
        </div>
      </section>
      <section className="section no-top-pad">
        <ReportsLookup />
      </section>
    </main>
  );
}