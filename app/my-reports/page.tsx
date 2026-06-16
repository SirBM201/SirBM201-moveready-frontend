const reports = [
  ["MRR-starter", "Estonia startup readiness", "Generated", "Refresh after route review"],
  ["MRR-sample", "Portugal residence readiness", "Draft", "Needs approved route facts"],
];

export default function MyReportsPage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>My reports</span></a><nav className="nav"><a href="/dashboard">Dashboard</a><a href="/report-preview">Report Preview</a></nav></header>
      <section className="section">
        <h2>Saved reports</h2>
        <p className="section-intro">Reports should preserve the source and route version used at generation time. If route facts change, the report should show a refresh warning instead of silently changing.</p>
        <div className="grid">{reports.map(([ref, title, status, note]) => <article className="card" key={ref}><h3>{title}</h3><p>{ref}</p><div className="badge-row"><span className="badge">{status}</span><span className="badge">{note}</span></div></article>)}</div>
      </section>
    </main>
  );
}
