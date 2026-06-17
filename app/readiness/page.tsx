import ReadinessTools from "@/components/ReadinessTools";

export default function ReadinessPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Readiness tools</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/platform">Platform</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/opportunities">Opportunities</a>
          <a href="/report-preview">Report</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Available tools</span>
          <h1>Check names, documents, funds, and refusal risk before applying.</h1>
          <p className="lede">
            These tools help users catch common readiness gaps before paying advisers, booking travel, or submitting route evidence.
          </p>
        </div>
      </section>

      <section className="section no-top-pad">
        <ReadinessTools />
      </section>
    </main>
  );
}
