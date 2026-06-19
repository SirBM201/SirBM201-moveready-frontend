const routeFamilies = [
  {
    title: "Startup and founder routes",
    examples: "Estonia startup founder, Finland start-up entrepreneur, Portugal Startup Visa, other innovation routes",
    review: "Official route owner, founder eligibility, company stage, committee/endorsement process, residence/visa sequence, family rules, funds, insurance, and appeal/refusal notes.",
    next: "/routes/estonia-startup",
  },
  {
    title: "D visa and residence-permit travel routes",
    examples: "Finland D visa, long-stay visa routes, residence permit travel after approval",
    review: "Whether the visa is standalone or linked to a residence decision, passport sticker process, family inclusion, processing times, appointment rules, and local mission requirements.",
    next: "/routes/finland-d-visa",
  },
  {
    title: "Official lotteries, ballots, and quotas",
    examples: "USA DV, UK IYPS, Australia 462 ballot, New Zealand PAC/SQ, Canada IEC pools",
    review: "Official entry window, result-check process, eligible citizenship, duplicate-entry rules, quota/cap, official fee, and scam warnings.",
    next: "/opportunities",
  },
  {
    title: "Study and scholarship routes",
    examples: "Student visa, scholarship intake, admission readiness, family/student insurance",
    review: "Admission source, scholarship deadline, proof-of-funds, language test, sponsor evidence, dependant rules, insurance, and post-arrival registration.",
    next: "/scholarships",
  },
  {
    title: "Work and skilled routes",
    examples: "Skilled worker, seasonal work, working holiday, employer-sponsored routes",
    review: "Eligible citizenship, job offer rules, labour-market requirement, age/education rule, funds, insurance, employer compliance, and fraud warnings.",
    next: "/opportunities/japan-working-holiday",
  },
  {
    title: "Family and settlement routes",
    examples: "Spouse, child, dependant, post-arrival registration, accommodation and school planning",
    review: "Relationship evidence, financial sponsor, accommodation, school/health insurance, translations, document legalization, and arrival timeline.",
    next: "/timeline",
  },
];

const buildSteps = [
  "Create country route shell",
  "Attach official source record",
  "Add active route version",
  "Add facts, documents, budget, and insurance notes",
  "Assign source confidence and review due date",
  "Expose public page only after review",
  "Connect save route, alert, timeline, service request, and report actions",
];

export default function RouteExpansionPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Route expansion</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/compare">Compare</a>
          <a href="/country-comparison">Countries</a>
          <a href="/sources">Sources</a>
          <a href="/admin/reviews">Admin Reviews</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Controlled route growth</span>
          <h1>Add routes without weakening source trust.</h1>
          <p className="lede">
            MoveReady should expand route-by-route, but each new route must keep the same evidence structure: official source, review date, route version, facts, documents, budget, insurance, alerts, saved routes, and reports.
          </p>
          <div className="actions">
            <a className="btn primary" href="/sources">Review sources</a>
            <a className="btn" href="/country-comparison">Compare countries</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <h2>Route expansion families</h2>
        <p className="section-intro">Use this workspace to decide which route family should be expanded next and which evidence must be reviewed before it becomes public guidance.</p>
        <div className="grid">
          {routeFamilies.map((family) => (
            <article className="card" key={family.title}>
              <span className="overline">Route family</span>
              <h3>{family.title}</h3>
              <p>{family.examples}</p>
              <div className="mini-list">
                <div><strong>Review before publishing</strong><span>{family.review}</span></div>
              </div>
              <div className="actions">
                <a className="btn primary" href={family.next}>Open related page</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Expansion checklist</h2>
        <div className="mini-list">
          {buildSteps.map((step, index) => (
            <div key={step}>
              <strong>{index + 1}. {step}</strong>
              <span>Complete this step before the route is treated as reliable for user-facing reports.</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
