import AccountActionCenter from "@/components/AccountActionCenter";
import SiteHeader from "@/components/SiteHeader";

const areas = [
  ["Applications", "Deadlines, appointments, additional-document requests, source status, payments, refusals, and decisions."],
  ["Evidence and documents", "Missing, expired, expiring, untranslated, unlegalized, stale, or incomplete evidence records."],
  ["Timeline", "Pending, missed, high-priority, or near-due tasks across application and settlement planning."],
  ["Commercial and provider", "Quotes requiring review, pending payments, consent-controlled handoffs, disputes, and blocked fulfillment."],
  ["Support and privacy", "Cases waiting for your response, escalations, and privacy requests requiring identity or scope information."],
];

export default function ActionCenterPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Private Action Center" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">One ranked next-action view</span>
          <h1>See what needs attention before a deadline, payment, submission, or provider step is missed.</h1>
          <p className="lede">
            The Action Center reads your existing private records and ranks the next review. It does not create a second copy of your application, document, quote, support, or privacy data.
          </p>
          <div className="actions">
            <a className="btn primary" href="#action-workspace">Review next actions</a>
            <a className="btn" href="/applications">Applications</a>
            <a className="btn" href="/evidence-pack">Evidence</a>
            <a className="btn" href="/timeline">Timeline</a>
            <a className="btn" href="/dashboard">Account Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="grid">
          {areas.map(([title, detail]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section no-top-pad" id="action-workspace">
        <AccountActionCenter />
      </section>
    </main>
  );
}
