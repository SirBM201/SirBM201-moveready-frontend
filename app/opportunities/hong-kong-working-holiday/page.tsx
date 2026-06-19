const checks = [
  ["Annual quota route", "Hong Kong's Working Holiday Scheme uses annual quotas for participating countries. Qualified applications are generally handled on a first-come, first-served basis while quota remains."],
  ["Participating countries", "Users must confirm that their nationality is listed under the HKSAR Working Holiday Scheme before preparing an application."],
  ["Holiday-first purpose", "The route is for holiday and cultural exchange. Temporary work and short study are allowed only within scheme conditions."],
  ["No repeat under same scheme", "Users should not assume they can use the same Working Holiday Scheme more than once."],
  ["No dependants", "Dependent spouse or child applications are not treated as part of this working holiday route."],
  ["Status tracking", "After submission, users should track acknowledgement, application status, payment, entry label or visa arrangement, travel dates, and insurance."],
];

const timeline = [
  "Confirm nationality appears in Hong Kong's participating-country list",
  "Check annual quota and whether applications are still being accepted",
  "Prepare passport, application form, photo, funds, insurance, and travel plan evidence",
  "Submit through the official HKSAR Immigration Department process",
  "Track application status after acknowledgement",
  "Plan arrival, temporary work limits, study limits, insurance, and accommodation",
];

export default function HongKongWorkingHolidayPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Hong Kong working holiday</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/opportunities">Opportunities</a>
          <a href="/watchlist?type=opportunity&code=HK-WHS&title=Hong%20Kong%20Working%20Holiday%20Scheme">Create Alert</a>
          <a href="/timeline">Timeline</a>
          <a href="/readiness">Readiness</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Annual quota route</span>
          <h1>Hong Kong Working Holiday Scheme readiness.</h1>
          <p className="lede">Track participating countries, annual quotas, first-come processing risk, temporary work limits, funds, insurance, and application-status steps.</p>
          <div className="actions">
            <a className="btn primary" href="/watchlist?type=opportunity&code=HK-WHS&title=Hong%20Kong%20Working%20Holiday%20Scheme">Create route alert</a>
            <a className="btn" href="/timeline">Save application timeline</a>
            <a className="btn" href="/readiness">Run readiness checks</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="route-detail-layout">
          <aside className="route-detail-side">
            <span className="overline">Route status</span>
            <h2>Hong Kong working holiday</h2>
            <p>For eligible nationals of participating countries who want a temporary working holiday stay in Hong Kong under annual country quotas.</p>
            <div className="badge-row">
              <span className="badge">Hong Kong</span>
              <span className="badge">Working holiday</span>
              <span className="badge">Annual quota</span>
              <span className="badge">First-come quota risk</span>
            </div>
            <div className="route-metrics">
              <div><strong>Primary action</strong><span>Check country quota and application status</span></div>
              <div><strong>User risk</strong><span>Quota used, weak funds, wrong purpose</span></div>
              <div><strong>MoveReady role</strong><span>Quota alerts, document prep, timeline</span></div>
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
              <p>Always verify participating countries, quotas, eligibility, and application status instructions from the Hong Kong Immigration Department.</p>
              <div className="actions">
                <a className="btn primary" href="https://www.immd.gov.hk/eng/services/visas/working_holiday_scheme.html" target="_blank" rel="noreferrer">HKSAR Working Holiday Scheme</a>
                <a className="btn" href="https://www.immd.gov.hk/eng/services/visas/immigration-entry-guideline.html" target="_blank" rel="noreferrer">Entry guidelines and quotas</a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
