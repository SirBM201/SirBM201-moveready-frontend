import SiteHeader from "@/components/SiteHeader";
import WatchlistSignup from "@/components/WatchlistSignup";

const alertPrinciples = [
  {
    title: "You choose first",
    detail: "MoveReady only saves alerts you ask for. Choose the route, country, or opportunity you want to follow.",
  },
  {
    title: "Check official sources",
    detail: "Alerts are reminders to check changes. They should point back to official or reviewed sources where possible.",
  },
  {
    title: "Important changes only",
    detail: "Use alerts for openings, closing dates, eligibility changes, document changes, fees, and report refresh reminders.",
  },
];

export default function WatchlistPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Alerts" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Alerts</span>
          <h1>Get reminders for routes you care about.</h1>
          <p className="lede">
            Alerts help you remember important route changes such as application openings, closing dates, result windows, eligibility changes, document updates, fee changes, and source-review updates.
          </p>
          <div className="actions">
            <a className="btn primary" href="#create-alert">Create alert</a>
            <a className="btn" href="/opportunities">Browse opportunities</a>
            <a className="btn" href="/saved-routes">Saved routes</a>
            <a className="btn" href="/dashboard">Back to Account</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <p className="overline">Alert rules</p>
            <h2>Useful alerts without confusion</h2>
            <p className="section-intro">
              Alerts should help you remember what to check. They do not replace official websites, embassy instructions, school instructions, employer instructions, or government sources.
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

      <section className="section" id="create-alert">
        <WatchlistSignup />
      </section>
    </main>
  );
}
