const checks = [
  ["Official entry only", "Submit through the official E-DV route during the published registration period. MoveReady should help users prepare, not promise selection."],
  ["No duplicate entries", "Treat one-person, one-entry rules as a hard safety control for every registration period."],
  ["Confirmation number", "Users must keep the confirmation number because it is needed to check selection status and continue if selected."],
  ["Qualification check", "Before entry, review education or qualifying work-experience requirements and country eligibility from the official instructions."],
  ["Scam prevention", "No agent can guarantee selection. The app should warn users against fake emails, fake result messages, and paid guarantee offers."],
  ["Family details", "Prepare spouse and child information carefully because DV entries and later processing depend on accurate family details."],
];

const timeline = [
  "Check official registration window and eligibility country rules",
  "Prepare passport details where required by current instructions",
  "Prepare compliant digital photo for the principal applicant and family members",
  "Submit only through the official entry website during the open window",
  "Save confirmation page and confirmation number securely",
  "Create result-check reminder before Entrant Status Check opens",
  "If selected, confirm qualifications, submit DS-260, prepare documents, and follow official instructions",
];

export default function USADVOpportunityPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>USA DV opportunity</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/opportunities">Opportunities</a>
          <a href="/watchlist?type=opportunity&code=US-DV&title=USA%20Diversity%20Visa%20Program">Create Alert</a>
          <a href="/timeline">Timeline</a>
          <a href="/trust">Trust</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Official lottery route</span>
          <h1>USA Diversity Visa Program readiness.</h1>
          <p className="lede">Prepare safely for the DV lottery with official-source checks, confirmation-number reminders, scam warnings, and document readiness before any result or visa processing step.</p>
          <div className="actions">
            <a className="btn primary" href="/watchlist?type=opportunity&code=US-DV&title=USA%20Diversity%20Visa%20Program">Create DV alert</a>
            <a className="btn" href="/timeline">Save result-check reminder</a>
            <a className="btn" href="/readiness">Run readiness checks</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="route-detail-layout">
          <aside className="route-detail-side">
            <span className="overline">Route status</span>
            <h2>Diversity Visa Program</h2>
            <p>Use this page as a preparation and monitoring workspace. Selection is random and is never guaranteed by MoveReady or any provider.</p>
            <div className="badge-row">
              <span className="badge">United States</span>
              <span className="badge">Lottery</span>
              <span className="badge">Official source required</span>
              <span className="badge">No guarantee</span>
            </div>
            <div className="route-metrics">
              <div><strong>Primary action</strong><span>Monitor entry and result windows</span></div>
              <div><strong>User risk</strong><span>Scams, duplicates, lost confirmation number</span></div>
              <div><strong>MoveReady role</strong><span>Readiness, reminders, safety checks</span></div>
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
              <p>Always confirm the current entry window, instructions, and result-check rules from the U.S. Department of State before acting.</p>
              <div className="actions">
                <a className="btn primary" href="https://travel.state.gov/content/travel/en/us-visas/immigrate/diversity-visa-program-entry.html" target="_blank" rel="noreferrer">Submit entry guidance</a>
                <a className="btn" href="https://travel.state.gov/content/travel/en/us-visas/immigrate/diversity-visa-program-entry/diversity-visa-instructions.html" target="_blank" rel="noreferrer">DV instructions</a>
                <a className="btn" href="https://dvprogram.state.gov/" target="_blank" rel="noreferrer">Entry status check</a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
