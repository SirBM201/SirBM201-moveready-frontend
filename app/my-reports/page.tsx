import SiteHeader from "@/components/SiteHeader";
import ReportsLookup from "@/components/ReportsLookup";

const reportTrustItems = [
  {
    title: "Generated date",
    detail: "Check when the report was created so you know whether it may need a refresh.",
  },
  {
    title: "Risk label",
    detail: "Use the risk label as a warning signal before relying on the route plan.",
  },
  {
    title: "Source status",
    detail: "Review source status and route context before printing, sharing, or requesting support.",
  },
];

export default function MyReportsPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="My reports" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Readiness history</span>
          <h1>Find and review your saved readiness reports.</h1>
          <p className="lede">
            Load reports from your signed-in account, report reference, email, or phone. Use each report as an action plan for documents, funds, route questions, and next steps.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Generate new report</a>
            <a className="btn" href="/dashboard">Back to Account Center</a>
            <a className="btn" href="/saved-routes">Saved routes</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <p className="overline">Report basics</p>
            <h2>What to check in every report</h2>
            <p className="section-intro">
              A saved report should show the route context, user inputs, risk level, source status, and generated date so you can understand what the advice was based on.
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
