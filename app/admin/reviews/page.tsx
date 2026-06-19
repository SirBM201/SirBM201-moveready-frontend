import AdminReviewTasks from "@/components/AdminReviewTasks";
import OpportunitySourceReadinessPanel from "@/components/OpportunitySourceReadinessPanel";
import SourceReadinessPanel from "@/components/SourceReadinessPanel";

const reviewAreas = [
  "Official source records",
  "Route fact review",
  "Opportunity window review",
  "Document and funds rule review",
  "Source-change follow-up",
  "Stale report and answer checks",
];

const reviewActions = [
  { label: "Route source status", href: "#routes" },
  { label: "Opportunity source status", href: "#opportunities" },
  { label: "Review tasks", href: "#tasks" },
  { label: "Source policy", href: "/sources" },
  { label: "Admin dashboard", href: "/admin" },
];

export default function AdminReviewsPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Admin reviews</span>
        </a>
        <nav className="nav" aria-label="Admin navigation">
          <a href="/admin">Admin</a>
          <a href="/admin/reports">Reports</a>
          <a href="/sources">Sources</a>
          <a href="/launch-readiness">Launch</a>
          <a href="/">Home</a>
        </nav>
      </header>

      <section className="section">
        <span className="eyebrow">Admin only</span>
        <h2>Source review and route approval</h2>
        <p className="section-intro">
          Check live route freshness, opportunity windows, trusted source records, and admin review tasks before sensitive guidance is promoted or refreshed.
        </p>
        <div className="badge-row">
          {reviewAreas.map((area) => <span className="badge" key={area}>{area}</span>)}
        </div>
        <div className="actions">
          {reviewActions.map((action) => (
            <a className={action.href.startsWith("#") ? "btn primary" : "btn"} href={action.href} key={action.href}>{action.label}</a>
          ))}
        </div>
      </section>

      <section className="section no-top-pad" id="routes">
        <SourceReadinessPanel />
      </section>

      <section className="section" id="opportunities">
        <OpportunitySourceReadinessPanel />
      </section>

      <section className="section" id="tasks">
        <div className="section-heading-row">
          <div>
            <h2>Review task and trusted source controls</h2>
            <p className="section-intro">
              Use the admin key to load open tasks, add trusted sources, and inspect the records behind public route and opportunity guidance.
            </p>
          </div>
          <div className="badge-row">
            <span className="badge">Admin key required</span>
            <span className="badge">Audit trail</span>
          </div>
        </div>
        <AdminReviewTasks />
      </section>
    </main>
  );
}
