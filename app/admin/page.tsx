import AdminReadinessChecks from "@/components/AdminReadinessChecks";
import AdminServiceRequests from "@/components/AdminServiceRequests";

const adminModules = [
  ["Service requests", "Review user interest for alerts, courier, insurance, legalization, documents, and expert support."],
  ["Readiness checks", "Inspect saved name, document, funds, and refusal-risk checks."],
  ["Sources", "Manage official source links, reliability level, and review frequency."],
  ["Routes", "Create and approve country-specific route versions."],
  ["Reviews", "Handle source-change alerts and route-review tasks."],
  ["Reports", "Inspect generated reports and stale-report warnings."],
];

export default function AdminPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Admin</span>
        </a>
        <nav className="nav">
          <a href="/admin/reviews">Reviews</a>
          <a href="/platform">Platform</a>
          <a href="/readiness">Readiness</a>
          <a href="/">Home</a>
        </nav>
      </header>
      <section className="section">
        <h2>Admin workspace</h2>
        <p className="section-intro">Admin tools protect the trust system: user requests, sources, snapshots, route versions, review tasks, readiness checks, and report freshness.</p>
        <div className="grid">
          {adminModules.map(([title, text]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <AdminServiceRequests />
      <AdminReadinessChecks />
    </main>
  );
}
