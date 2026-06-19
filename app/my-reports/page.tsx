import SiteHeader from "@/components/SiteHeader";
import ReportsLookup from "@/components/ReportsLookup";

const reportTrustItems = [
  {
    title: "Generated date",
    detail: "Every report should show when the advice was generated so users know whether it may need a refresh.",
  },
  {
    title: "Risk label",
    detail: "Reports should keep visible risk labels instead of sounding like a guaranteed approval path.",
  },
  {
    title: "Source version",
    detail: "As route data matures, reports should preserve the rule/source version used at the time of generation.",
  },
];

export default function MyReportsPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="My reports" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Account Center: readiness history</span>
          <h1>Keep every readiness report connected to the user account.</h1>
          <p className="lede">
            My Reports lets a user retrieve saved readiness outputs by report reference, email, or phone. In the full account system, these reports become the user’s relocation history with refresh tracking, risk labels, and source-version transparency.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Generate new report</a>
            <a className="btn" href="/dashboard">Back to Account Center</a>
            <a className="btn" href="/report-preview">View report preview</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <p className="overline">Report ownership</p>
            <h2>What a saved report should remember</h2>
            <p className="section-intro">
              Reports are more than downloadable content. They should preserve the user input, selected route, risk context, source confidence, and generated date so the advice remains transparent and reviewable.
            </p>
          </div>
          <span className="status-dot">Lookup active</span>
        </div>
        <div className="grid">
          {reportTrustItems.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <ReportsLookup />
      </section>
    </main>
  );
}
