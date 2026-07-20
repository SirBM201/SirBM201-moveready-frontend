import SiteHeader from "@/components/SiteHeader";
import LiveRouteGrid from "@/components/LiveRouteGrid";
import RouteReadinessForm from "@/components/RouteReadinessForm";

export default function RouteCheckerPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Route checker" />

      <section className="hero-band" style={{ paddingTop: 24, paddingBottom: 18 }}>
        <div className="hero-copy">
          <span className="eyebrow">Check Route</span>
          <h1 style={{ fontSize: "clamp(34px, 4.4vw, 52px)", lineHeight: 1.05, marginBottom: 12 }}>
            Check your route before you spend money.
          </h1>
          <p className="section-intro">
            Load your active profile, confirm the basic details, then generate a simple readiness report with checklist, budget range, risk label, and next steps.
          </p>
          <div className="actions" style={{ marginTop: 16 }}>
            <a className="btn primary" href="#route-check-form">Go to form</a>
            <a className="btn" href="/dashboard">Open Account</a>
            <a className="btn" href="/my-reports">My reports</a>
          </div>
        </div>

        <aside className="workflow-panel">
          <h2>Simple order</h2>
          <div className="mini-list">
            <div><strong>1. Load active profile</strong><span>Use the profile selected in Account.</span></div>
            <div><strong>2. Check the details</strong><span>Confirm country, route, funds, family count, and timeline.</span></div>
            <div><strong>3. Generate report</strong><span>Open or save the report reference after it appears.</span></div>
          </div>
        </aside>
      </section>

      <section className="section no-top-pad" id="route-check-form">
        <RouteReadinessForm />
      </section>

      <section className="section">
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
