const dashboardItems = [
  ["Saved routes", "Compare selected countries and pathways."],
  ["Readiness score", "Track documents, funds, budget, insurance, and source freshness."],
  ["Reports", "Open generated relocation readiness reports."],
  ["Alerts", "Get notified when a route version changes or a report becomes stale."],
];

export default function DashboardPage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>User dashboard</span></a><nav className="nav"><a href="/route-checker">Route Checker</a><a href="/my-reports">My Reports</a></nav></header>
      <section className="section">
        <h2>Dashboard foundation</h2>
        <p className="section-intro">This placeholder prepares the user area. Later it will connect to auth, saved routes, generated reports, and route-change alerts.</p>
        <div className="grid">{dashboardItems.map(([title, text]) => <article className="card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
    </main>
  );
}
