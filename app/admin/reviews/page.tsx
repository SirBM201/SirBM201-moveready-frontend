const reviewTasks = [
  "Review Portugal starter residence route",
  "Review Estonia startup founder source and route facts",
  "Review Finland startup entrepreneur route facts",
  "Add document requirements after route approval",
  "Add budget and proof-of-funds facts after source review",
  "Mark old AI answers stale when route versions change",
];

export default function AdminReviewsPage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>Admin reviews</span></a><nav className="nav"><a href="/">Home</a><a href="/report-preview">Report</a></nav></header>
      <section className="section">
        <h2>Admin review queue</h2>
        <p className="section-intro">This is where source changes and starter route records become reviewed route versions. The backend route is protected by admin key.</p>
        <div className="grid">{reviewTasks.map((task) => <article className="card" key={task}><h3>{task}</h3><p>Status: open. Priority: high for starter source-backed routes.</p><div className="badge-row"><span className="badge">Needs review</span><span className="badge">Admin only</span></div></article>)}</div>
      </section>
    </main>
  );
}
