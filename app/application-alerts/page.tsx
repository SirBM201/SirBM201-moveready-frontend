import ApplicationAlertInbox from "@/components/ApplicationAlertInbox";
import SiteHeader from "@/components/SiteHeader";

const alertRules = [
  {
    title: "In-app and private",
    text: "Alerts remain under the verified account. This page does not activate external email, WhatsApp, Telegram, or SMS delivery.",
  },
  {
    title: "Generated from case metadata",
    text: "The daily scan checks recorded deadlines, appointments, stages, source status, payment status, refusals, and approval follow-up. It does not read raw authority documents.",
  },
  {
    title: "Official notice controls",
    text: "Every alert is a planning signal. The authority’s actual notice, time zone, deadline, evidence, payment, and submission channel remain controlling.",
  },
  {
    title: "Dismissal is reversible",
    text: "A dismissed alert stays private and can be reopened. A later higher-severity detection may automatically reopen the alert.",
  },
];

export default function ApplicationAlertsPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Private Application Alerts" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Unattended application monitoring</span>
          <h1>See urgent deadlines, appointments, evidence requests, source risks, payments, refusals, and decision follow-up.</h1>
          <p className="lede">
            MoveReady refreshes private in-app application alerts through a protected daily scan. Alerts help you prioritize action but do not replace current official notices or professional advice.
          </p>
          <div className="actions">
            <a className="btn primary" href="#alert-inbox">Open alert inbox</a>
            <a className="btn" href="/applications">Application Center</a>
            <a className="btn" href="/timeline">Timeline</a>
            <a className="btn" href="/dashboard">Account Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="alert-inbox">
        <ApplicationAlertInbox />
      </section>

      <section className="section">
        <div className="grid">
          {alertRules.map((rule) => (
            <article className="card" key={rule.title}>
              <h3>{rule.title}</h3>
              <p>{rule.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
