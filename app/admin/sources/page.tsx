const sourceFields = ["Source name", "Official URL", "Country", "Source type", "Reliability level", "Review frequency", "Last checked", "Next review due"];

export default function AdminSourcesPage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>Admin sources</span></a><nav className="nav"><a href="/admin">Admin</a><a href="/admin/reviews">Reviews</a></nav></header>
      <section className="section">
        <h2>Trusted source management</h2>
        <p className="section-intro">Sources are the foundation of trust. Every sensitive route answer should point back to reviewed source records and snapshots.</p>
        <div className="grid">{sourceFields.map((field) => <article className="card" key={field}><h3>{field}</h3><p>Admin-managed source metadata for freshness and audit trails.</p></article>)}</div>
      </section>
    </main>
  );
}
