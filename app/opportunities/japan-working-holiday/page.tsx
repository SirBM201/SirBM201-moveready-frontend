const checks = [
  ["Partner-country route", "Japan working holiday programmes are based on bilateral arrangements. Users must confirm their nationality, age range, quota, and embassy procedure from the official Japanese mission for their country."],
  ["Holiday-first purpose", "The route is primarily for holiday and cultural experience. Employment is usually incidental to help supplement travel funds."],
  ["Quota and timing", "Some partner-country routes may use annual limits or intake windows. MoveReady should monitor official embassy instructions before telling users a route is open."],
  ["Funds and insurance", "Prepare evidence of support funds, return or onward travel plan where required, and insurance or medical readiness according to local embassy instructions."],
  ["No status confusion", "This route should not be presented as a skilled work, permanent migration, or guaranteed employment route."],
  ["Document readiness", "Prepare passport, application form, photo, itinerary, resume or motivation letter, bank evidence, and any country-specific documents listed by the embassy."],
];

const timeline = [
  "Confirm your nationality is included in Japan's working holiday partner list",
  "Check age, quota, and application location rules from the relevant Japanese embassy or consulate",
  "Prepare funds, itinerary, photo, application form, and supporting documents",
  "Submit through the official embassy or consular process",
  "Track visa validity, entry deadline, insurance, accommodation, and first-arrival budget",
  "Avoid treating temporary work as the main purpose of stay",
];

export default function JapanWorkingHolidayPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Japan working holiday</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/opportunities">Opportunities</a>
          <a href="/watchlist?type=opportunity&code=JP-WH&title=Japan%20Working%20Holiday%20Programme">Create Alert</a>
          <a href="/timeline">Timeline</a>
          <a href="/readiness">Readiness</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Youth mobility route</span>
          <h1>Japan Working Holiday Programme readiness.</h1>
          <p className="lede">Use this route guide to check partner-country eligibility, embassy instructions, quota timing, funds, insurance, and document readiness before applying.</p>
          <div className="actions">
            <a className="btn primary" href="/watchlist?type=opportunity&code=JP-WH&title=Japan%20Working%20Holiday%20Programme">Create route alert</a>
            <a className="btn" href="/timeline">Save application timeline</a>
            <a className="btn" href="/readiness">Run readiness checks</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="route-detail-layout">
          <aside className="route-detail-side">
            <span className="overline">Route status</span>
            <h2>Japan working holiday</h2>
            <p>Designed for eligible young people from partner countries who want an extended holiday in Japan with limited incidental work rights.</p>
            <div className="badge-row">
              <span className="badge">Japan</span>
              <span className="badge">Working holiday</span>
              <span className="badge">Partner-country route</span>
              <span className="badge">Embassy rules required</span>
            </div>
            <div className="route-metrics">
              <div><strong>Primary action</strong><span>Confirm embassy-specific rules</span></div>
              <div><strong>User risk</strong><span>Wrong purpose, closed quota, weak funds</span></div>
              <div><strong>MoveReady role</strong><span>Eligibility, reminders, document prep</span></div>
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
              <p>Always confirm current partner countries, quotas, and local application rules from Japan's Ministry of Foreign Affairs and the relevant Japanese mission.</p>
              <div className="actions">
                <a className="btn primary" href="https://www.mofa.go.jp/j_info/visit/w_holiday/index.html" target="_blank" rel="noreferrer">Japan MOFA working holiday</a>
                <a className="btn" href="https://www.mofa.go.jp/j_info/visit/visa/index.html" target="_blank" rel="noreferrer">Japan visa information</a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
