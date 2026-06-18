import AdminGeneratedReports from "@/components/AdminGeneratedReports";

export default function AdminReportsPage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>Admin reports</span></a><nav className="nav"><a href="/admin">Admin</a><a href="/my-reports">My Reports</a><a href="/report-preview">Preview</a></nav></header>
      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Admin workflow</span>
          <h1>Review saved readiness reports.</h1>
          <p className="lede">Generated reports keep their route, source, input, risk, and status so admin can track delivery, refreshes, and stale report follow-up.</p>
        </div>
      </section>
      <AdminGeneratedReports />
    </main>
  );
}
