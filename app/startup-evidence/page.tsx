import GeneralServiceRequestForm from "@/components/GeneralServiceRequestForm";

const evidenceSections = [
  {
    title: "Founder profile",
    text: "Role, background, ownership, commitment, technical or business capability, and relocation reason.",
  },
  {
    title: "Startup summary",
    text: "Problem, solution, target users, product status, business model, market size, and growth logic.",
  },
  {
    title: "MVP and traction",
    text: "Demo, product screenshots, users, revenue, pilots, letters of intent, waitlist, partnerships, or technical evidence.",
  },
  {
    title: "Country fit",
    text: "Why the target country supports the business, customers, market access, team, funding, or regulatory position.",
  },
  {
    title: "Financial readiness",
    text: "Founder funds, company funding, runway, first-arrival costs, family budget, and source-of-funds notes.",
  },
  {
    title: "Submission checklist",
    text: "Documents, forms, links, deadlines, review status, risk notes, and next actions before application.",
  },
];

export default function StartupEvidencePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Startup evidence pack</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a><a href="/routes/estonia-startup">Estonia Route</a><a href="/routes/finland-d-visa">Finland Route</a><a href="/readiness">Readiness</a><a href="/services">Services</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Founder route support</span>
          <h1>Prepare startup route evidence before submitting.</h1>
          <p className="lede">MoveReady can help founders organize the evidence pack needed for startup, founder, D visa, residence, and business-route readiness without promising approval.</p>
          <div className="actions">
            <a className="btn primary" href="#request-review">Request evidence review</a>
            <a className="btn" href="/readiness">Run readiness checks</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <h2>Evidence pack sections</h2>
        <p className="section-intro">The output should be practical: what is ready, what is weak, what needs proof, and what should be checked against the official route instructions.</p>
        <div className="grid">{evidenceSections.map((item) => <article className="card" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </section>

      <section className="section" id="request-review">
        <GeneralServiceRequestForm defaultService="expert_review" />
      </section>
    </main>
  );
}
