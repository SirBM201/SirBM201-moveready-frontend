import SiteHeader from "@/components/SiteHeader";
import LiveRouteGrid from "@/components/LiveRouteGrid";
import RouteReadinessForm from "@/components/RouteReadinessForm";

export default function RouteCheckerPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Route checker" />

      <section className="section route-checker-hero">
        <div>
          <span className="eyebrow">Check Route</span>
          <h1>Check your route before you spend money.</h1>
          <p className="section-intro">
            Load your active profile, confirm the basic details, then generate a simple readiness report with checklist, budget range, risk label, and next steps.
          </p>
          <div className="actions">
            <a className="btn primary" href="#route-check-form">Go to form</a>
            <a className="btn" href="/dashboard">Open Account</a>
            <a className="btn" href="/my-reports">My reports</a>
          </div>
        </div>

        <aside className="quick-step-strip" aria-label="Route checker steps">
          <div><strong>1</strong><span>Load active profile</span></div>
          <div><strong>2</strong><span>Check the details</span></div>
          <div><strong>3</strong><span>Generate report</span></div>
        </aside>
      </section>

      <section className="section no-top-pad" id="route-check-form">
        <RouteReadinessForm />
      </section>

      <section className="section reviewer-section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Optional reviewer information</p>
            <h2>Route source records</h2>
            <p className="section-intro">
              This section is mainly for MoveReady reviewers. Normal users can ignore it after generating their report above.
            </p>
          </div>
          <span className="status-dot">For review</span>
        </div>
        <LiveRouteGrid />
      </section>
    </main>
  );
}
