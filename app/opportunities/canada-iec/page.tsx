const checks = [
  ["Pool model", "IEC uses candidate pools and invitation rounds. Creating a profile does not mean the user has received an invitation or work permit."],
  ["Citizenship eligibility", "Eligibility depends on the applicant's country or territory of citizenship and the IEC category available to that country."],
  ["Category fit", "Users should check whether Working Holiday, Young Professionals, or International Co-op applies to their profile."],
  ["Invitation deadline", "After an invitation, users usually have a limited time to accept and submit a complete work permit application."],
  ["Funds and insurance", "Applicants should prepare evidence of funds and health insurance expectations before travel planning."],
  ["Quota tracking", "Rounds continue until spots run out or the season closes, so users need monitoring rather than one-time reading."],
];

const timeline = [
  "Check country or territory eligibility",
  "Select the correct IEC category",
  "Create or update candidate profile when the season is open",
  "Monitor invitation rounds and remaining spots",
  "Accept invitation before the deadline if invited",
  "Submit work permit application with required documents",
  "Prepare insurance, funds evidence, travel plan, and arrival checklist",
];

export default function CanadaIECOpportunityPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Canada IEC opportunity</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/opportunities">Opportunities</a>
          <a href="/watchlist?type=opportunity&code=CA-IEC&title=Canada%20International%20Experience%20Canada">Create Alert</a>
          <a href="/timeline">Timeline</a>
          <a href="/services">Services</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Invitation-pool route</span>
          <h1>Canada IEC pool readiness.</h1>
          <p className="lede">Track International Experience Canada eligibility, pools, invitation rounds, quota pressure, deadlines, documents, funds, insurance, and arrival preparation.</p>
          <div className="actions">
            <a className="btn primary" href="/watchlist?type=opportunity&code=CA-IEC&title=Canada%20International%20Experience%20Canada">Create IEC alert</a>
            <a className="btn" href="/timeline">Build timeline</a>
            <a className="btn" href="/budget-calculator">Estimate budget</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="route-detail-layout">
          <aside className="route-detail-side">
            <span className="overline">Route status</span>
            <h2>International Experience Canada</h2>
            <p>Use this page to monitor IEC invitation pools and prepare evidence before a time-sensitive invitation arrives.</p>
            <div className="badge-row">
              <span className="badge">Canada</span>
              <span className="badge">Invitation pool</span>
              <span className="badge">Quota monitored</span>
              <span className="badge">Country eligibility</span>
            </div>
            <div className="route-metrics">
              <div><strong>Primary action</strong><span>Monitor pools and invitations</span></div>
              <div><strong>User risk</strong><span>Missed invitation deadline</span></div>
              <div><strong>MoveReady role</strong><span>Alerts, timeline, document readiness</span></div>
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
              <p>Confirm current pools, invitation rounds, country eligibility, and application instructions on Canada.ca before acting.</p>
              <div className="actions">
                <a className="btn primary" href="https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec.html" target="_blank" rel="noreferrer">IEC overview</a>
                <a className="btn" href="https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec/rounds-invitations.html" target="_blank" rel="noreferrer">Rounds of invitations</a>
                <a className="btn" href="https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec/eligibility.html" target="_blank" rel="noreferrer">Check eligibility</a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
