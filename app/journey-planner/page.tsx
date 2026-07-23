import JourneyPlanner from "@/components/JourneyPlanner";
import SettlementTimelineWorkspace from "@/components/SettlementTimelineWorkspace";
import SiteHeader from "@/components/SiteHeader";


const journeyStages = [
  {
    title: "Prepare documents correctly",
    text: "Organize translation, notarization, authentication, apostille, and embassy-legalization steps only after the receiving authority confirms the path.",
  },
  {
    title: "Plan the full household",
    text: "Create member-level document, funds, accommodation, insurance, school, consent, medical, and arrival tasks.",
  },
  {
    title: "Turn appointments into dated actions",
    text: "Work backwards from biometrics, interview, submission, or collection dates and save tasks into the existing MoveReady timeline.",
  },
  {
    title: "Continue after approval",
    text: "Prepare accommodation, connectivity, registration, banking, tax, health, school, transport, work, and first-90-days settlement tasks, then save them to the private timeline with consent.",
  },
];


export default function JourneyPlannerPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Journey Planner" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Application to arrival</span>
          <h1>Plan the steps that sit between eligibility and a successful move.</h1>
          <p className="lede">
            MoveReady provides practical self-service planners for document handling, family relocation, appointments, and post-arrival settlement. Every result remains advisory and source-confirmation first.
          </p>
          <div className="actions">
            <a className="btn primary" href="#journey-tools">Open journey tools</a>
            <a className="btn" href="#settlement-execution">Save settlement timeline</a>
            <a className="btn" href="/journey-plans">My saved plans</a>
            <a className="btn" href="/route-checker">Check relocation route</a>
            <a className="btn" href="/readiness">Use readiness tools</a>
            <a className="btn" href="/timeline">Open timeline</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="grid">
          {journeyStages.map((stage) => (
            <article className="card" key={stage.title}>
              <h3>{stage.title}</h3>
              <p>{stage.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="journey-tools">
        <JourneyPlanner />
      </section>

      <section className="section" id="settlement-execution">
        <div className="section-heading-row">
          <div>
            <p className="overline">Settlement execution</p>
            <h2>Convert the arrival checklist into dated private timeline actions.</h2>
            <p className="section-intro">This form adds explicit arrival date, contact lookup, storage consent, and timeline-save controls. It does not activate external messages or replace local official deadlines.</p>
          </div>
          <span className="status-dot">Timeline consent</span>
        </div>
        <SettlementTimelineWorkspace />
      </section>

      <section className="section">
        <article className="result-block soft">
          <p className="overline">Trust boundary</p>
          <h2>MoveReady organizes the work; official authorities define the rule.</h2>
          <p>
            Confirm destination-government, embassy, visa-centre, receiving-institution, tax, municipal, school, health, insurance, airline, and document-authority instructions before paying, submitting, posting originals, travelling, or relying on a generated checklist.
          </p>
        </article>
      </section>
    </main>
  );
}
