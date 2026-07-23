import GeneralServiceRequestForm from "@/components/GeneralServiceRequestForm";
import JourneyPlanner from "@/components/JourneyPlanner";
import SiteHeader from "@/components/SiteHeader";


const familyAreas = [
  "Spouse eligibility and relationship evidence",
  "Child documents, birth certificates, custody, and school records",
  "Extra proof-of-funds pressure by family size",
  "Family health or travel insurance requirements",
  "Accommodation size and arrival planning",
  "School, childcare, local registration, and settlement tasks",
];


export default function FamilyPlannerPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Family relocation planner" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Live household planner</span>
          <h1>Plan relocation around the full household, not only the main applicant.</h1>
          <p className="lede">
            Create a member-level checklist for spouse, children, other dependants, funds, insurance, accommodation, school, consent, medical needs, travel, and arrival.
          </p>
          <div className="actions">
            <a className="btn primary" href="#family-planner-tool">Build family plan</a>
            <a className="btn" href="/journey-planner">Open full journey planner</a>
            <a className="btn" href="/route-checker">Check route</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <h2>Family readiness areas</h2>
        <article className="card">
          <div className="badge-row">{familyAreas.map((item) => <span className="badge" key={item}>{item}</span>)}</div>
        </article>
      </section>

      <section className="section" id="family-planner-tool">
        <JourneyPlanner mode="family" />
      </section>

      <section className="section">
        <GeneralServiceRequestForm defaultService="settlement" />
      </section>
    </main>
  );
}
