const checks = [
  ["One-time youth route", "Korea's working holiday route is for eligible young people from partner countries. Users must confirm nationality, age, quota, and application location before preparing documents."],
  ["Holiday-first purpose", "The route allows an extended holiday in Korea, with short-term employment as a secondary part of the stay."],
  ["Funds and insurance", "Prepare minimum funds and health-insurance evidence according to the official Korean working holiday instructions for your nationality."],
  ["No dependants", "Users should not assume family members can join under this route. Dependant rules must be checked from official sources before planning."],
  ["Registration after arrival", "Longer stays may require foreign resident registration after entry. Users should plan the arrival timeline before travel."],
  ["Country-specific rules", "Some agreements have different age limits, quotas, extension rules, and embassy procedures."],
];

const timeline = [
  "Check Korea working holiday eligibility by nationality",
  "Confirm age range, quota, required location of application, and embassy instructions",
  "Prepare passport, application form, photo, funds, insurance, and purpose evidence",
  "Submit through the official Korean mission or approved channel",
  "Plan arrival, accommodation, funds, insurance validity, and registration where required",
  "Use work only within the allowed working holiday conditions",
];

export default function KoreaWorkingHolidayPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Korea working holiday</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/opportunities">Opportunities</a>
          <a href="/watchlist?type=opportunity&code=KR-WH&title=Korea%20Working%20Holiday%20Visa">Create Alert</a>
          <a href="/timeline">Timeline</a>
          <a href="/readiness">Readiness</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Youth mobility route</span>
          <h1>Korea Working Holiday Visa readiness.</h1>
          <p className="lede">Prepare safely for Korea's working holiday route with nationality checks, quota monitoring, funds, insurance, application timing, and arrival planning.</p>
          <div className="actions">
            <a className="btn primary" href="/watchlist?type=opportunity&code=KR-WH&title=Korea%20Working%20Holiday%20Visa">Create route alert</a>
            <a className="btn" href="/timeline">Save application timeline</a>
            <a className="btn" href="/readiness">Run readiness checks</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="route-detail-layout">
          <aside className="route-detail-side">
            <span className="overline">Route status</span>
            <h2>Korea working holiday</h2>
            <p>For eligible nationals of partner countries who want an extended holiday in Korea with limited short-term work as a secondary purpose.</p>
            <div className="badge-row">
              <span className="badge">South Korea</span>
              <span className="badge">Working holiday</span>
              <span className="badge">Partner-country route</span>
              <span className="badge">Quota check required</span>
            </div>
            <div className="route-metrics">
              <div><strong>Primary action</strong><span>Confirm nationality-specific instructions</span></div>
              <div><strong>User risk</strong><span>Wrong embassy, weak funds, missing insurance</span></div>
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
              <p>Always verify current eligibility, quotas, and application rules from Korea's official Working Holiday Info Center or the Korean mission serving your country.</p>
              <div className="actions">
                <a className="btn primary" href="https://whic.mofa.go.kr/contents.do?contentsNo=38&menuNo=90" target="_blank" rel="noreferrer">Korea working holiday overview</a>
                <a className="btn" href="https://whic.mofa.go.kr/eng/" target="_blank" rel="noreferrer">Working Holiday Info Center</a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
