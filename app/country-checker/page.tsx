import LiveCountryGrid from "@/components/LiveCountryGrid";

export default function CountryCheckerPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Country checker</span></a>
        <nav className="nav"><a href="/route-checker">Route Checker</a><a href="/report-preview">Report</a></nav>
      </header>
      <section className="section">
        <h2>Country comparison starter</h2>
        <p className="section-intro">This page now loads countries through the API. As reviewed facts are added, it will compare route availability, funds pressure, family options, study options, startup fit, and arrival readiness.</p>
        <LiveCountryGrid />
      </section>
    </main>
  );
}
