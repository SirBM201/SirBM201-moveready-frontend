import JourneyPlanner from "@/components/JourneyPlanner";
import SiteHeader from "@/components/SiteHeader";
import TimelinePlanner from "@/components/TimelinePlanner";


const timelineUses = [
  {
    title: "Document preparation",
    detail: "Track certificates, funds evidence, business documents, insurance, translations, and legalization steps.",
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
          <span className="eyebrow">Timeline tracking</span>
          <h1>Turn relocation plans into dated actions.</h1>
          <p className="lede">
            Work backwards from an embassy, visa-centre, biometrics, interview, submission, or passport-collection date. Generated appointment tasks can be saved into the existing MoveReady timeline with user consent.
          </p>
          <div className="actions">
            <a className="btn primary" href="#appointment-planner-tool">Plan an appointment</a>
            <a className="btn" href="#timeline-planner">Add one timeline event</a>
            <a className="btn" href="/journey-planner">Open full journey planner</a>
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
              Timeline supports both account loading and email or phone lookup. Events connect with reports, saved routes, alerts, service requests, appointment preparation, and arrival planning.
            </p>
          </div>
          <span className="status-dot">Verified + reminder-ready</span>
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

      <section className="section" id="appointment-planner-tool">
        <JourneyPlanner mode="appointment" />
      </section>

      <section className="section" id="timeline-planner">
        <TimelinePlanner />
      </section>
    </main>
  );
}
