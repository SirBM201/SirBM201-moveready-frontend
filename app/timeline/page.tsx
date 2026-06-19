import SiteHeader from "@/components/SiteHeader";
import TimelinePlanner from "@/components/TimelinePlanner";

const timelineUses = [
  {
    title: "Document preparation",
    detail: "Track passports, certificates, funds evidence, business documents, insurance, translations, and legalization steps.",
  },
  {
    title: "Application windows",
    detail: "Record due dates, opening periods, appointment dates, payment dates, and reminder dates for serious routes.",
  },
  {
    title: "Decision and arrival steps",
    detail: "Keep result windows, travel preparation, housing tasks, registration steps, and follow-up actions in one account.",
  },
];

export default function TimelinePage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Application timeline" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Account Center: timeline tracking</span>
          <h1>Turn relocation plans into dated actions.</h1>
          <p className="lede">
            Timeline helps users track documents, appointments, deadlines, results, travel steps, and follow-up tasks. In the full account system, each event should connect back to the user profile, selected route, report, or saved opportunity.
          </p>
          <div className="actions">
            <a className="btn primary" href="#timeline-planner">Add timeline event</a>
            <a className="btn" href="/saved-routes">Saved routes</a>
            <a className="btn" href="/dashboard">Back to Account Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <p className="overline">Timeline structure</p>
            <h2>Every plan needs dates, reminders, and status</h2>
            <p className="section-intro">
              The MVP timeline is contact-based. Later, verified login should join timeline events with reports, saved routes, alerts, and service requests so users can see their full relocation progress.
            </p>
          </div>
          <span className="status-dot">Reminder-ready</span>
        </div>
        <div className="grid">
          {timelineUses.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="timeline-planner">
        <TimelinePlanner />
      </section>
    </main>
  );
}
