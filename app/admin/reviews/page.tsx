import AdminReviewTasks from "@/components/AdminReviewTasks";

const reviewAreas = [
  "Official source records",
  "Route fact review",
  "Opportunity window review",
  "Document and funds rule review",
  "Source-change follow-up",
  "Stale report and answer checks",
];

export default function AdminReviewsPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Admin reviews</span>
        </a>
        <nav className="nav">
          <a href="/admin">Admin</a>
          <a href="/admin/reports">Reports</a>
          <a href="/sources">Source Policy</a>
          <a href="/launch-readiness">Launch</a>
          <a href="/">Home</a>
        </nav>
      </header>

      <section className="section">
        <span className="eyebrow">Admin only</span>
        <h2>Source review and route approval</h2>
        <p className="section-intro">
          Use this workspace to add trusted source records and inspect review tasks before sensitive route, document, funds, or opportunity guidance is promoted.
        </p>
        <div className="badge-row">
          {reviewAreas.map((area) => <span className="badge" key={area}>{area}</span>)}
        </div>
      </section>

      <section className="section no-top-pad">
        <AdminReviewTasks />
      </section>
    </main>
  );
}
