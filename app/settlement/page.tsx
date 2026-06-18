import GeneralServiceRequestForm from "@/components/GeneralServiceRequestForm";

const settlementTasks = [
  "Airport pickup",
  "Temporary accommodation",
  "SIM card and local phone setup",
  "Bank account or payment setup",
  "Tax number or local registration",
  "Residence address registration",
  "Health insurance activation",
  "School or childcare setup",
  "Local transport and first-week movement",
  "Family arrival checklist",
];

export default function SettlementPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Post-arrival settlement</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a><a href="/services">Services</a><a href="/timeline">Timeline</a><a href="/family-planner">Family Planner</a><a href="/partners/apply">Provider Apply</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Partner approval pending</span>
          <h1>Turn approval into a managed arrival plan.</h1>
          <p className="lede">After visa or residence approval, users still need housing, pickup, registration, banking, insurance, school, transport, and local setup. MoveReady can capture these needs before connecting approved providers.</p>
        </div>
      </section>

      <section className="section no-top-pad">
        <h2>Arrival checklist</h2>
        <article className="card"><div className="badge-row">{settlementTasks.map((item) => <span className="badge" key={item}>{item}</span>)}</div></article>
      </section>

      <section className="section">
        <GeneralServiceRequestForm defaultService="settlement" />
      </section>
    </main>
  );
}
