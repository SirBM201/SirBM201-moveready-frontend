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

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Reports</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                Find and review your saved readiness reports.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                Load reports from your signed-in account, report reference, email, or phone. Use reports as guidance, not approval.
              </p>
            </div>
            <span className="status-dot">Lookup active</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#report-lookup">Load reports</a>
            <a className="btn" href="/route-checker">Generate new report</a>
            <a className="btn" href="/dashboard">Back to Account</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="report-lookup">
        <ReportsLookup />
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Report basics</p>
            <h2>What to check in every report</h2>
            <p className="section-intro">
              A saved report should show the route context, user inputs, risk level, source status, and generated date so you can understand what the advice was based on.
            </p>
          </div>
          <span className="status-dot">Review before action</span>
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
    </main>
  );
}
