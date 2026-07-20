import SiteHeader from "@/components/SiteHeader";
import LiveRouteGrid from "@/components/LiveRouteGrid";
import RouteReadinessForm from "@/components/RouteReadinessForm";

export default function RouteCheckerPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Route checker" />

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Check Route</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                Check your route before you spend money.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                Use the active profile from Account, confirm the details, then generate a simple report with checklist, budget, risk label, and next steps.
              </p>
            </div>
            <span className="status-dot">3 steps</span>
          </div>
          <div className="badge-row" style={{ marginTop: 10 }}>
            <span className="badge">1. Load active profile</span>
            <span className="badge">2. Check details</span>
            <span className="badge">3. Generate report</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#route-check-form">Go to form</a>
            <a className="btn" href="/dashboard">Open Account</a>
            <a className="btn" href="/my-reports">My reports</a>
          </div>
        </div>
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
