const reportStates = ["Generated", "Paid", "Delivered", "Stale", "Refreshed", "Archived"];

export default function AdminReportsPage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>Admin reports</span></a><nav className="nav"><a href="/admin">Admin</a><a href="/report-preview">Preview</a></nav></header>
      <section className="section">
        <h2>Report monitoring</h2>
        <p className="section-intro">Generated reports should keep the route and source version used at creation time. Admin should be able to see stale reports after route changes.</p>
        <div className="grid">{reportStates.map((state) => <article className="card" key={state}><h3>{state}</h3><p>Report lifecycle status for readiness report operations.</p></article>)}</div>
      </section>
    </main>
  );
}
