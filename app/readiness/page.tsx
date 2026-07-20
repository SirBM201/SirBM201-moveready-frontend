import SiteHeader from "@/components/SiteHeader";
import ReadinessTools from "@/components/ReadinessTools";

export default function ReadinessPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Readiness tools" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Available tools</span>
          <h1>Check names, documents, funds, and refusal risk before applying.</h1>
          <p className="lede">
            These tools help users catch common readiness gaps before paying advisers, booking travel, or submitting route evidence.
          </p>
          <div className="actions">
            <a className="btn primary" href="#readiness-tools">Open tools</a>
            <a className="btn" href="/route-checker">Generate report</a>
            <a className="btn" href="/dashboard">Back to Account</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="readiness-tools">
        <ReadinessTools />
      </section>
    </main>
  );
}
