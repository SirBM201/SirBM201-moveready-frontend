import GeneralServiceRequestForm from "@/components/GeneralServiceRequestForm";
import JourneyPlanner from "@/components/JourneyPlanner";
import SiteHeader from "@/components/SiteHeader";


const settlementTasks = [
  "Airport and first-night safety",
  "Temporary and longer-term accommodation",
  "SIM card and local connectivity",
  "Bank account or payment setup",
  "Tax number or social-security setup",
  "Residence and address registration",
  "Health insurance and primary care",
  "School or childcare setup",
  "Local transport and first-week movement",
  "Family, medical, work, business, and pet arrival tasks",
];


export default function SettlementPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Post-arrival settlement" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Live arrival planner</span>
          <h1>Turn approval into a managed first 90 days.</h1>
          <p className="lede">
            Generate a staged checklist for the period before travel, first 72 hours, first two weeks, and first 90 days. Mandatory local rules still require official country and city confirmation.
          </p>
          <div className="actions">
            <a className="btn primary" href="#settlement-planner-tool">Build arrival plan</a>
            <a className="btn" href="/journey-planner">Open full journey planner</a>
            <a className="btn" href="/timeline">Open timeline</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <h2>Arrival areas</h2>
        <article className="card">
          <div className="badge-row">{settlementTasks.map((item) => <span className="badge" key={item}>{item}</span>)}</div>
        </article>
      </section>

      <section className="section" id="settlement-planner-tool">
        <JourneyPlanner mode="settlement" />
      </section>

      <section className="section">
        <GeneralServiceRequestForm defaultService="settlement" />
      </section>
    </main>
  );
}
