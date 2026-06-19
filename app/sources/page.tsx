import SourceReadinessPanel from "@/components/SourceReadinessPanel";

const sourceControls = [
  {
    title: "Official source registry",
    text: "Each sensitive route should point to a government, embassy, immigration authority, official partner, or verified institution source before it is used for guidance.",
  },
  {
    title: "Last verified date",
    text: "Country routes, lottery windows, D visa rules, document rules, and funds guidance should show when the source was last checked.",
  },
  {
    title: "Review due date",
    text: "Time-sensitive routes should have a next review date so stale information can be refreshed before users rely on it.",
  },
  {
    title: "Change handling",
    text: "When a rule changes, old route facts should stay in the audit trail while new answers use the latest approved version.",
  },
  {
    title: "Risk labels",
    text: "MoveReady should use honest labels such as low, medium, or high risk instead of promising approval, selection, or faster decisions.",
  },
  {
    title: "Admin approval",
    text: "New sources, route facts, provider claims, and service handoffs should be reviewed before they become visible or actionable for users.",
  },
];

const sensitiveAreas = [
  "Visa and residence route rules",
  "Official ballots, lotteries, invitation pools, and quota windows",
  "Proof-of-funds requirements",
  "Document legalization, apostille, attestation, and translation notes",
  "Insurance requirements",
  "Passport and sensitive-document courier requests",
  "Scholarship deadlines and eligibility",
  "Provider applications and service handoffs",
];

export default function SourcesPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Source review</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/country-comparison">Countries</a>
          <a href="/compare">Compare</a>
          <a href="/trust">Trust</a>
          <a href="/launch-readiness">Launch Readiness</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/opportunities">Opportunities</a>
          <a href="/admin/reviews">Admin Reviews</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Source-backed guidance</span>
          <h1>Show users what is verified, what changed, and what needs review.</h1>
          <p className="lede">
            MoveReady treats official sources as the source of truth. AI and reports explain approved data; they do not replace government, embassy, institution, or provider instructions.
          </p>
          <div className="actions">
            <a className="btn primary" href="/admin/reviews">Open admin review queue</a>
            <a className="btn" href="/trust">View trust rules</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <SourceReadinessPanel />
      </section>

      <section className="section">
        <h2>Source controls</h2>
        <p className="section-intro">
          These controls are the difference between a generic travel chatbot and a serious relocation readiness platform.
        </p>
        <div className="grid">
          {sourceControls.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Sensitive areas</h2>
        <p className="section-intro">
          These topics should never be presented as final unless the underlying source record is current enough for the route and country.
        </p>
        <article className="card">
          <div className="badge-row">
            {sensitiveAreas.map((item) => <span className="badge" key={item}>{item}</span>)}
          </div>
        </article>
      </section>
    </main>
  );
}
