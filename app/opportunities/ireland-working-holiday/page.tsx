const checks = [
  ["Authorisation, not always a visa", "Ireland's working holiday routes can be authorisation-based rather than ordinary visa routes. Users must follow the Ireland.ie instructions for their citizenship and location."],
  ["Country-specific rules", "Eligibility, age range, validity, permitted work, fees, and application office vary by partner country."],
  ["Arrival registration", "Some participants must register after arrival within the required timeframe. This should be included in the timeline before travel."],
  ["No route mixing", "Users should not assume they can enter under another visitor status and later convert inside Ireland unless official rules allow it."],
  ["Funds and insurance", "Prepare support funds, insurance, accommodation plan, and return/onward travel evidence where the official instructions require them."],
  ["Repeat use rules", "Some nationalities may have restrictions on repeated use, timing, or active authorisation overlap. Confirm from the relevant Irish mission."],
];

const timeline = [
  "Choose the Ireland working holiday page for your citizenship and current location",
  "Confirm age, eligibility, validity, fees, and application channel",
  "Prepare authorisation documents, funds, insurance, accommodation, and travel plan",
  "Submit only through the official Irish mission or application route",
  "Wait for authorisation before relying on work permission",
  "Plan arrival registration, accommodation, job search boundaries, and renewal or exit timeline",
];

export default function IrelandWorkingHolidayPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Ireland working holiday</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/opportunities">Opportunities</a>
          <a href="/watchlist?type=opportunity&code=IE-WHA&title=Ireland%20Working%20Holiday%20Authorisation">Create Alert</a>
          <a href="/timeline">Timeline</a>
          <a href="/readiness">Readiness</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Working holiday authorisation</span>
          <h1>Ireland Working Holiday Authorisation readiness.</h1>
          <p className="lede">Use this guide to confirm citizenship-specific rules, authorisation process, funds, insurance, arrival registration, and safe timing before travelling.</p>
          <div className="actions">
            <a className="btn primary" href="/watchlist?type=opportunity&code=IE-WHA&title=Ireland%20Working%20Holiday%20Authorisation">Create route alert</a>
            <a className="btn" href="/timeline">Save application timeline</a>
            <a className="btn" href="/readiness">Run readiness checks</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="route-detail-layout">
          <aside className="route-detail-side">
            <span className="overline">Route status</span>
            <h2>Ireland working holiday</h2>
            <p>For eligible young people from partner countries who want an extended holiday in Ireland with work permission under country-specific arrangements.</p>
            <div className="badge-row">
              <span className="badge">Ireland</span>
              <span className="badge">Working holiday</span>
              <span className="badge">Authorisation route</span>
              <span className="badge">Country-specific rules</span>
            </div>
            <div className="route-metrics">
              <div><strong>Primary action</strong><span>Find the right Ireland.ie country page</span></div>
              <div><strong>User risk</strong><span>Wrong channel, weak funds, arrival-status confusion</span></div>
              <div><strong>MoveReady role</strong><span>Readiness, reminders, arrival checklist</span></div>
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
              <p>Always verify the Ireland working holiday instructions for your citizenship and application location before relying on this route.</p>
              <div className="actions">
                <a className="btn primary" href="https://www.ireland.ie/en/usa/washington/services/visas/working-holiday-authorisation/" target="_blank" rel="noreferrer">Ireland WHA for US citizens</a>
                <a className="btn" href="https://www.ireland.ie/en/australia/canberra/services/visas/working-holiday-authorisations/" target="_blank" rel="noreferrer">Ireland WHA for Australians</a>
                <a className="btn" href="https://www.ireland.ie/en/canada/ottawa/services/visas/working-holiday-programme/" target="_blank" rel="noreferrer">Ireland WHA for Canadians</a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
