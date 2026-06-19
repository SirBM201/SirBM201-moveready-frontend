import SiteHeader from "@/components/SiteHeader";
import CountryComparisonWorkspace from "@/components/CountryComparisonWorkspace";

export default function CountryComparisonPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Country comparison" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Country comparison</span>
          <h1>Compare countries by routes, risk, source confidence, and next steps.</h1>
          <p className="lede">
            Use live country and route records to decide where to focus first, then save the country, create alerts, or generate a readiness report.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Run route checker</a>
            <a className="btn" href="/saved-routes">View saved routes</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <CountryComparisonWorkspace />
      </section>
    </main>
  );
}