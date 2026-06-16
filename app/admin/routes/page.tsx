const routeAdminItems = ["Draft route", "Pending review", "Active version", "Superseded version", "Retired route", "Linked sources"];

export default function AdminRoutesPage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>Admin routes</span></a><nav className="nav"><a href="/admin">Admin</a><a href="/admin/sources">Sources</a></nav></header>
      <section className="section">
        <h2>Route version management</h2>
        <p className="section-intro">The admin should approve route versions before the public app uses them for sensitive answers or generated reports.</p>
        <div className="grid">{routeAdminItems.map((item) => <article className="card" key={item}><h3>{item}</h3><p>Route lifecycle state used to protect answer freshness.</p></article>)}</div>
      </section>
    </main>
  );
}
