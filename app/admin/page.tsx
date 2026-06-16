const adminModules = [
  ["Sources", "Manage official source links, reliability level, and review frequency."],
  ["Routes", "Create and approve country-specific route versions."],
  ["Reviews", "Handle source-change alerts and route-review tasks."],
  ["Reports", "Inspect generated reports and stale-report warnings."],
];

export default function AdminPage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>Admin</span></a><nav className="nav"><a href="/admin/reviews">Reviews</a><a href="/">Home</a></nav></header>
      <section className="section">
        <h2>Admin foundation</h2>
        <p className="section-intro">Admin tools protect the trust system: sources, snapshots, route versions, review tasks, and report freshness.</p>
        <div className="grid">{adminModules.map(([title, text]) => <article className="card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
    </main>
  );
}
