import SiteHeader from "@/components/SiteHeader";
import WatchlistInbox from "@/components/WatchlistInbox";
import WatchlistSignup from "@/components/WatchlistSignup";


const alertPrinciples = [
  {
    title: "You choose first",
    detail: "MoveReady only saves alerts you ask for. Choose the route, country, opportunity, scholarship, or service you want to follow.",
  },
  {
    title: "Check official sources",
    detail: "In-app alerts summarize stored reviewed records and point back to official sources. They do not claim a live government decision or result.",
  },
  {
    title: "Important changes only",
    detail: "Use alerts for openings, closing dates, result windows, eligibility changes, document changes, fees, and source-review reminders.",
  },
];


export default function WatchlistPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Alerts" />

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Alerts</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                Follow important routes without pretending every source is live.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                Verified accounts now have an in-app watchlist inbox. MoveReady compares active watches with stored reviewed opportunity records and keeps email or WhatsApp delivery disabled until operational credentials and approvals are ready.
              </p>
            </div>
            <span className="status-dot">Consent first</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#alert-inbox">Open alert inbox</a>
            <a className="btn" href="#create-alert">Create alert</a>
            <a className="btn" href="/opportunities">Browse opportunities</a>
            <a className="btn" href="/saved-routes">Saved routes</a>
            <a className="btn" href="/dashboard">Back to Account</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <WatchlistInbox />
      </section>

      <section className="section" id="create-alert">
        <WatchlistSignup />
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Alert rules</p>
            <h2>Useful alerts without confusion</h2>
            <p className="section-intro">
              Alerts help users remember what to check. They do not replace official websites, embassy instructions, school instructions, employer instructions, government sources, or personal application accounts.
            </p>
          </div>
          <span className="status-dot">Official sources matter</span>
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
    </main>
  );
}
