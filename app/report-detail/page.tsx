import ReportDetail from "@/components/ReportDetail";
import SiteHeader from "@/components/SiteHeader";

export default async function ReportDetailPage({ searchParams }: any) {
  const params = await searchParams;
  const refValue = params?.ref;
  const reportRef = Array.isArray(refValue) ? refValue[0] || "" : refValue || "";

  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Report detail" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Readiness report</span>
          <h1>Review one MoveReady report clearly.</h1>
          <p className="lede">
            Use this page to revisit a saved report, print it, or return to My Reports.
          </p>
          <div className="actions">
            <a className="btn primary" href="/my-reports">My reports</a>
            <a className="btn" href="/dashboard">Account Center</a>
            <a className="btn" href="/saved-routes">Saved routes</a>
          </div>
        </div>
      </section>

      {reportRef ? (
        <ReportDetail reportRef={reportRef} />
      ) : (
        <section className="section">
          <article className="result-block featured">
            <p className="overline">Report lookup</p>
            <h2>Enter a report reference from My Reports.</h2>
            <p>Open My Reports and choose a saved readiness report to review the full detail view.</p>
            <div className="actions">
              <a className="btn primary" href="/my-reports">Open My Reports</a>
            </div>
          </article>
        </section>
      )}
    </main>
  );
}
