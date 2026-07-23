import MyJourneyOverview from "@/components/MyJourneyOverview";
import SiteHeader from "@/components/SiteHeader";

export default function MyJourneyPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="My MoveReady Journey" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">One narrative account view</span>
          <h1>See where your relocation journey stands from first profile to settlement.</h1>
          <p className="lede">
            My Journey uses your verified account records to show which stages are recorded, active, incomplete, or in need of attention. It never assumes a missing step is complete.
          </p>
          <div className="actions">
            <a className="btn primary" href="#journey-overview">Open journey overview</a>
            <a className="btn" href="/action-center">Action Center</a>
            <a className="btn" href="/applications">Applications</a>
            <a className="btn" href="/dashboard">Account Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="journey-overview">
        <MyJourneyOverview />
      </section>
    </main>
  );
}
