import SiteHeader from "@/components/SiteHeader";
import WatchlistSignup from "@/components/WatchlistSignup";

const alertPrinciples = [
  {
    title: "Opt-in only",
    detail: "Choose what you want monitored and how you want to be contacted before any alert is sent.",
  },
  {
    title: "Source-review based",
    detail: "Alerts should point back to official or reviewed sources, with review dates where possible.",
  },
  {
    title: "Change alerts only",
    detail: "Alerts notify you about route changes, opening windows, deadlines, and checklist updates.",
  },
];

export default function WatchlistPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Watchlist and alerts" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Opt-in monitoring</span>
          <h1>Track the routes and opportunities you care about.</h1>
          <p className="lede">
            Watchlist alerts help you follow application openings, closing dates, result windows, eligibility changes, document updates, fee changes, and source-review updates.
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
            <p className="overline">Alert rules</p>
            <h2>Useful alerts without confusion</h2>
            <p className="section-intro">
              The watchlist should make MoveReady feel active and helpful. It should notify you about important changes, not replace your own final checks.
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
