const budgetItems = [
  ["Application and visa fees", "100 - 600"],
  ["Document preparation", "50 - 400"],
  ["Insurance", "80 - 600"],
  ["Flight and first arrival", "500 - 1,500"],
  ["Initial accommodation", "800 - 2,500"],
  ["Settlement buffer", "500 - 2,000"],
];

export default function BudgetCalculatorPage() {
  return (
    <main className="page-shell">
      <header className="topbar"><a className="brand" href="/"><strong>Project MoveReady</strong><span>Budget calculator</span></a><nav className="nav"><a href="/route-checker">Route Checker</a><a href="/proof-of-funds">Proof of Funds</a><a href="/report-preview">Report</a></nav></header>
      <section className="hero-band">
        <div className="hero-copy">
          <span className="eyebrow">Starter estimate</span>
          <h1>Estimate the money pressure before applying.</h1>
          <p className="lede">The first calculator separates application costs from proof-of-funds expectations. This avoids the common mistake of treating visa fee as the only relocation cost.</p>
        </div>
        <aside className="workflow-panel">
          <h2>Budget inputs</h2>
          <div className="form-grid">
            <div className="field"><label>Currency</label><select defaultValue="EUR"><option>EUR</option><option>USD</option><option>GBP</option><option>NGN</option><option>KWD</option></select></div>
            <div className="field"><label>Family members</label><input placeholder="0" /></div>
            <div className="field"><label>Route category</label><select defaultValue="startup"><option>startup</option><option>study</option><option>work</option><option>visit</option></select></div>
            <a className="btn primary" href="/report-preview">Add to report</a>
          </div>
        </aside>
      </section>
      <section className="section">
        <h2>Starter budget buckets</h2>
        <div className="grid">
          {budgetItems.map(([name, range]) => <article className="card" key={name}><h3>{name}</h3><p>Starter range: {range}. Replace with route-specific official/market data after review.</p></article>)}
        </div>
      </section>
    </main>
  );
}
