import SiteHeader from "@/components/SiteHeader";
import LiveRouteGrid from "@/components/LiveRouteGrid";
import RouteReadinessForm from "@/components/RouteReadinessForm";

export default function RouteCheckerPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Route checker" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Live MVP workflow</span>
          <h1>Find the most realistic pathway before spending money.</h1>
          <p className="lede">Enter a basic profile and generate a starter checklist, budget estimate, and readiness report from the backend.</p>
          <div className="actions">
            <a className="btn" href="/routes/estonia-startup">Open Estonia startup route</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <RouteReadinessForm />
      </section>

      <section className="section">
        <h2>Live route records</h2>
        <p className="section-intro">These records come through the API. Each route should eventually have an active reviewed version, risk level, confidence status, and review due date.</p>
        <LiveRouteGrid />
      </section>
    </main>
  );
}