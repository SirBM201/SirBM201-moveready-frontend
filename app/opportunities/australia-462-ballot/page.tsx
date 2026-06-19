const checks = [
  ["Ballot countries", "The Work and Holiday subclass 462 pre-application ballot applies to first-time applicants from China, India, and Vietnam."],
  ["First visa only", "Country caps and ballot rules are focused on first Work and Holiday subclass 462 visas. Second and third Work and Holiday visas follow separate rules."],
  ["Random selection", "Registration in the ballot does not guarantee selection, visa invitation, or visa grant."],
  ["Program year", "Australia runs Work and Holiday country caps by program year, so users should monitor the current opening and closing dates."],
  ["Passport and citizenship", "Users should confirm passport country, age, education, funds, and country-specific requirements before registering."],
  ["Readiness after selection", "Selected users still need a complete visa application, supporting documents, fees, and health or character checks where required."],
];

const timeline = [
  "Confirm whether your passport country uses the subclass 462 ballot",
  "Check registration opening and closing dates for the current program year",
  "Prepare passport, identity, education, funds, and country-specific evidence",
  "Register in the ballot only through official Australian systems",
  "Monitor selection notice and invitation instructions",
  "If selected, submit the full subclass 462 visa application before the deadline",
  "Prepare insurance, arrival funds, travel plan, and employment expectations",
];

export default function Australia462BallotPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Australia 462 ballot</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/opportunities">Opportunities</a>
          <a href="/watchlist?type=opportunity&code=AU-462-BALLOT&title=Australia%20Work%20and%20Holiday%20462%20ballot">Create Alert</a>
          <a href="/timeline">Timeline</a>
          <a href="/services">Services</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Country-cap ballot route</span>
          <h1>Australia Work and Holiday 462 ballot readiness.</h1>
          <p className="lede">Track the subclass 462 pre-application ballot for China, India, and Vietnam passport holders, then prepare the full visa evidence if selected.</p>
          <div className="actions">
            <a className="btn primary" href="/watchlist?type=opportunity&code=AU-462-BALLOT&title=Australia%20Work%20and%20Holiday%20462%20ballot">Create ballot alert</a>
            <a className="btn" href="/timeline">Build timeline</a>
            <a className="btn" href="/readiness">Run readiness checks</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="route-detail-layout">
          <aside className="route-detail-side">
            <span className="overline">Route status</span>
            <h2>Work and Holiday subclass 462 ballot</h2>
            <p>Use this page to monitor ballot timing, country caps, selection notices, and document readiness before submitting the full visa application.</p>
            <div className="badge-row">
              <span className="badge">Australia</span>
              <span className="badge">Subclass 462</span>
              <span className="badge">China, India, Vietnam</span>
              <span className="badge">Country cap</span>
            </div>
            <div className="route-metrics">
              <div><strong>Primary action</strong><span>Monitor registration windows</span></div>
              <div><strong>User risk</strong><span>Missing ballot or invitation deadline</span></div>
              <div><strong>MoveReady role</strong><span>Alerts, evidence prep, travel readiness</span></div>
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
              <p>Confirm current ballot dates, country caps, and subclass 462 eligibility through Australia Home Affairs before acting.</p>
              <div className="actions">
                <a className="btn primary" href="https://immi.homeaffairs.gov.au/what-we-do/whm-program/latest-news/new-work-and-holiday-subclass-462-visa-pre-application-process" target="_blank" rel="noreferrer">Ballot process</a>
                <a className="btn" href="https://immi.homeaffairs.gov.au/what-we-do/whm-program/status-of-country-caps" target="_blank" rel="noreferrer">Country caps</a>
                <a className="btn" href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462/first-work-holiday-462" target="_blank" rel="noreferrer">First 462 visa</a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
