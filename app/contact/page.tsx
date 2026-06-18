export default function ContactPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Contact</span></a>
        <nav className="nav"><a href="/services">Services</a><a href="/watchlist">Watchlist</a><a href="/privacy">Privacy</a></nav>
      </header>

      <section className="legal-hero">
        <span className="eyebrow">Contact MoveReady</span>
        <h1>Use the right request path so the response is useful.</h1>
        <p className="lede">For route planning, use the route checker. For courier, legalization, insurance, translation, expert review, accommodation, pickup, or settlement support, use the service request form.</p>
        <div className="actions">
          <a className="btn primary" href="/services">Request service</a>
          <a className="btn" href="/route-checker">Use route checker</a>
          <a className="btn" href="/watchlist">Create alert</a>
        </div>
      </section>

      <section className="legal-section">
        <article className="legal-block">
          <h2>Before submitting documents</h2>
          <p>Do not send passports, certificates, bank statements, identity files, or family documents until MoveReady confirms the correct service workflow and provider handling rules.</p>
        </article>
        <article className="legal-block">
          <h2>For providers</h2>
          <p>Courier, insurance, legalization, translation, notary, admission, accommodation, pickup, expert review, and settlement providers should apply through the provider application page before public handoff.</p>
          <div className="actions"><a className="btn" href="/partners/apply">Provider apply</a></div>
        </article>
      </section>
    </main>
  );
}
