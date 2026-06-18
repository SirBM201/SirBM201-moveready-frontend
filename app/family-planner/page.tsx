import GeneralServiceRequestForm from "@/components/GeneralServiceRequestForm";

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
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Family relocation</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a><a href="/route-checker">Route Checker</a><a href="/readiness">Readiness</a><a href="/timeline">Timeline</a><a href="/services">Services</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Available: family readiness capture</span>
          <h1>Plan relocation around the full household, not only the main applicant.</h1>
          <p className="lede">MoveReady should account for spouse, children, extra documents, funds, insurance, accommodation, school, and arrival tasks from the start.</p>
        </div>
      </section>

      <section className="section no-top-pad">
        <h2>Family readiness areas</h2>
        <article className="card"><div className="badge-row">{familyAreas.map((item) => <span className="badge" key={item}>{item}</span>)}</div></article>
      </section>

      <section className="section">
        <GeneralServiceRequestForm defaultService="settlement" />
      </section>
    </main>
  );
}
