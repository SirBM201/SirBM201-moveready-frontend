import SiteHeader from "@/components/SiteHeader";
import WatchlistSignup from "@/components/WatchlistSignup";

const alertPrinciples = [
  {
    title: "Opt-in only",
    detail: "Users choose what they want monitored and how they want to be contacted before any alert is sent.",
  },
  {
    title: "Source-review based",
    detail: "Alerts should point back to official or reviewed sources, with review due dates where possible.",
  },
  {
    title: "No outcome guarantees",
    detail: "Alerts can notify users about changes and windows, but must not imply approval, selection, admission, or job success.",
  },
];

export default function WatchlistPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Watchlist and alerts" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Account Center: opt-in monitoring</span>
          <h1>Monitor the routes and opportunities a user cares about.</h1>
          <p className="lede">
            Watchlist alerts help users follow application openings, closing dates, result windows, eligibility changes, document updates, fee changes, and source-review updates. Every alert should remain consent-first and advisory.
          </p>
          <div className="actions">
            <a className="btn primary" href="/opportunities">Browse opportunities</a>
            <a className="btn" href="/saved-routes">Saved routes</a>
            <a className="btn" href="/dashboard">Back to Account Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <p className="overline">Alert trust rules</p>
            <h2>Useful alerts without shortcut promises</h2>
            <p className="section-intro">
              The watchlist should make MoveReady feel active and helpful, while protecting trust. It should notify users about changes, not sell certainty or unofficial shortcuts.
            </p>
          </div>
          <span className="status-dot">Consent first</span>
        </div>
        <div className="grid">
          {alertPrinciples.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <WatchlistSignup />
      </section>
    </main>
  );
}
