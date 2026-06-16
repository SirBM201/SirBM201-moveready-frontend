import RouteReadinessForm from "@/components/RouteReadinessForm";

const routeOptions = [
  { title: "Study", fit: "Admission, scholarship, tuition, proof of funds, insurance", risk: "Medium" },
  { title: "Startup", fit: "Founder role, innovation, traction, funds, relocation intent", risk: "Medium" },
  { title: "Work", fit: "Job offer, employer sponsorship, qualifications, salary threshold", risk: "High" },
  { title: "Family", fit: "Relationship evidence, sponsor status, income, housing", risk: "High" },
  { title: "Visit", fit: "Purpose, ties to residence country, travel funds, return plan", risk: "Medium" },
  { title: "Digital nomad", fit: "Remote income, clients, insurance, accommodation, tax exposure", risk: "Medium" },
];

export default function RouteCheckerPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Route checker</span></a>
        <nav className="nav"><a href="/">Home</a><a href="/document-checklist">Documents</a><a href="/budget-calculator">Budget</a><a href="/report-preview">Report</a></nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Live MVP workflow</span>
          <h1>Find the most realistic pathway before spending money.</h1>
          <p className="lede">Enter a basic profile and generate a starter checklist, budget estimate, and readiness report from the backend.</p>
        </div>
      </section>

      <section className="section no-top-pad">
        <RouteReadinessForm />
      </section>

      <section className="section">
        <h2>Route categories</h2>
        <p className="section-intro">These starter categories will be connected to approved country-specific route versions and source snapshots as the admin review system grows.</p>
        <div className="grid">
          {routeOptions.map((route) => (
            <article className="card" key={route.title}>
              <h3>{route.title}</h3>
              <p>{route.fit}</p>
              <div className="badge-row"><span className="badge">Risk: {route.risk}</span><span className="badge">Needs source review</span></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
