const checks = [
  ["Ballot route", "The India Young Professionals Scheme visa uses a ballot before selected applicants can apply."],
  ["Nationality scope", "This route is for eligible Indian citizens who meet age, qualification, savings, and other official requirements."],
  ["Limited places", "The route has a fixed annual allocation, so monitoring opening windows and result timing matters."],
  ["Selection is not approval", "Being selected in the ballot allows the person to apply. It does not guarantee the visa will be granted."],
  ["Savings evidence", "Users should prepare current savings evidence and check the official minimum savings rule before applying."],
  ["Deadline after selection", "Selected users must apply within the official deadline, so documents should be prepared before results."],
];

const timeline = [
  "Confirm Indian citizenship, age, qualification, and savings eligibility",
  "Check the current ballot opening and closing window",
  "Enter the ballot only through GOV.UK instructions",
  "Watch for ballot result notification",
  "If selected, prepare and submit the visa application before the deadline",
  "Prepare funds evidence, identity documents, tuberculosis test where required, and travel plan",
  "Save expiry, arrival, accommodation, and insurance tasks in MoveReady timeline",
];

export default function UKIndiaYoungProfessionalsPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>UK India Young Professionals</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/opportunities">Opportunities</a>
          <a href="/watchlist?type=opportunity&code=UK-IYPS&title=UK%20India%20Young%20Professionals%20Scheme">Create Alert</a>
          <a href="/timeline">Timeline</a>
          <a href="/budget-calculator">Budget</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Official ballot route</span>
          <h1>UK India Young Professionals ballot readiness.</h1>
          <p className="lede">Track the ballot, prepare eligibility evidence, and move quickly if selected without treating selection as visa approval.</p>
          <div className="actions">
            <a className="btn primary" href="/watchlist?type=opportunity&code=UK-IYPS&title=UK%20India%20Young%20Professionals%20Scheme">Create ballot alert</a>
            <a className="btn" href="/timeline">Build timeline</a>
            <a className="btn" href="/budget-calculator">Check funds</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="route-detail-layout">
          <aside className="route-detail-side">
            <span className="overline">Route status</span>
            <h2>India Young Professionals Scheme</h2>
            <p>Use this workspace to monitor ballot windows, eligibility, evidence, and application deadlines for selected users.</p>
            <div className="badge-row">
              <span className="badge">United Kingdom</span>
              <span className="badge">India</span>
              <span className="badge">Ballot</span>
              <span className="badge">Limited places</span>
            </div>
            <div className="route-metrics">
              <div><strong>Primary action</strong><span>Monitor ballot windows</span></div>
              <div><strong>User risk</strong><span>Confusing selection with visa approval</span></div>
              <div><strong>MoveReady role</strong><span>Alerts, funds check, deadline tracking</span></div>
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
              <p>Confirm current eligibility, ballot dates, savings rules, and application instructions on GOV.UK before acting.</p>
              <div className="actions">
                <a className="btn primary" href="https://www.gov.uk/india-young-professionals-scheme-visa" target="_blank" rel="noreferrer">Visa overview</a>
                <a className="btn" href="https://www.gov.uk/guidance/india-young-professionals-scheme-visa-ballot-system" target="_blank" rel="noreferrer">Ballot guidance</a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
