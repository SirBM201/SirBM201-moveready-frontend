const checks = [
  ["Quota route", "Pacific Access Category and Samoan Quota are annual quota ballot routes for eligible citizens of specific Pacific countries."],
  ["Country eligibility", "Users must confirm the exact country eligibility rules because these routes are not open to every nationality."],
  ["Ballot draw", "A successful ballot registration is not final residence approval. Selected users must still meet resident visa instructions."],
  ["Result tracking", "Users should keep registration details and monitor official result-check instructions after the ballot closes."],
  ["Family evidence", "Family members may require accurate relationship and identity evidence, so documents should be prepared before selection."],
  ["Settlement readiness", "Selected users should plan funds, employment, accommodation, documents, medical checks, and police certificates where required."],
];

const timeline = [
  "Confirm whether your citizenship is eligible for PAC or Samoan Quota",
  "Check ballot registration opening and closing dates",
  "Prepare identity, family, contact, and eligibility information",
  "Register only through official Immigration New Zealand instructions",
  "Save ballot reference and result-check timing",
  "If selected, prepare full residence application evidence",
  "Plan medical, police, family, work, funds, accommodation, and settlement tasks",
];

export default function NewZealandQuotaBallotsPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>New Zealand quota ballots</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/opportunities">Opportunities</a>
          <a href="/watchlist?type=opportunity&code=NZ-QUOTA&title=New%20Zealand%20quota%20ballots">Create Alert</a>
          <a href="/timeline">Timeline</a>
          <a href="/services">Services</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Annual quota ballot routes</span>
          <h1>New Zealand Pacific quota ballot readiness.</h1>
          <p className="lede">Track Pacific Access Category and Samoan Quota ballot windows, result checks, eligibility, family evidence, and residence application preparation.</p>
          <div className="actions">
            <a className="btn primary" href="/watchlist?type=opportunity&code=NZ-QUOTA&title=New%20Zealand%20quota%20ballots">Create quota alert</a>
            <a className="btn" href="/timeline">Save result reminder</a>
            <a className="btn" href="/services">Request document support</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="route-detail-layout">
          <aside className="route-detail-side">
            <span className="overline">Route status</span>
            <h2>Pacific Access and Samoan Quota ballots</h2>
            <p>Use this page to monitor annual ballot windows and prepare residence evidence if selected.</p>
            <div className="badge-row">
              <span className="badge">New Zealand</span>
              <span className="badge">Pacific Access Category</span>
              <span className="badge">Samoan Quota</span>
              <span className="badge">Annual quota</span>
            </div>
            <div className="route-metrics">
              <div><strong>Primary action</strong><span>Monitor ballot and result windows</span></div>
              <div><strong>User risk</strong><span>Selection confused with residence approval</span></div>
              <div><strong>MoveReady role</strong><span>Alerts, document planning, settlement checklist</span></div>
            </div>
          </aside>

          <div className="route-detail-main">
            <section className="detail-section">
              <h3>Readiness checks</h3>
              <div className="mini-list">
                {checks.map(([title, text]) => <div key={title}><strong>{title}</strong><span>{text}</span></div>)}
              </div>
            </section>

            <section className="detail-section">
              <h3>Suggested timeline</h3>
              <div className="badge-row">
                {timeline.map((item) => <span className="badge" key={item}>{item}</span>)}
              </div>
            </section>

            <section className="detail-section">
              <h3>Official links</h3>
              <p>Confirm country eligibility, ballot dates, result-check windows, and full residence instructions through Immigration New Zealand.</p>
              <div className="actions">
                <a className="btn primary" href="https://www.immigration.govt.nz/new-zealand-visas/visas/visa/pacific-access-category-resident-visa" target="_blank" rel="noreferrer">Pacific Access Category</a>
                <a className="btn" href="https://www.immigration.govt.nz/new-zealand-visas/visas/visa/samoan-quota-resident-visa" target="_blank" rel="noreferrer">Samoan Quota</a>
                <a className="btn" href="https://www.immigration.govt.nz/new-zealand-visas/preparing-a-visa-application/pacific-visa-ballots/2026-pacific-visa-ballot-results" target="_blank" rel="noreferrer">Ballot results</a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
