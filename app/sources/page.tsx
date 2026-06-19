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

const opportunitySources = [
  {
    route: "USA Diversity Visa Program",
    owner: "U.S. Department of State",
    review: "Before registration opens, before result-check opens, and when annual instructions change.",
    risk: "Scam warnings, duplicate-entry rule, confirmation-number storage, and official submission only.",
  },
  {
    route: "Canada International Experience Canada",
    owner: "Immigration, Refugees and Citizenship Canada",
    review: "Weekly during open seasons where invitation numbers, spots, and chances are updated.",
    risk: "Pool entry is not approval; invitation deadlines and country-specific pools must be monitored.",
  },
  {
    route: "Australia Work and Holiday 462 ballot",
    owner: "Australian Department of Home Affairs",
    review: "When program-year caps, ballot windows, or country-cap statuses change.",
    risk: "Selection only permits application; subclass 462 eligibility and visa grant remain separate.",
  },
  {
    route: "UK India Young Professionals Scheme",
    owner: "GOV.UK",
    review: "Before each ballot round and when savings, age, qualification, or application rules change.",
    risk: "Ballot selection is not visa approval; eligible Indian citizenship and savings evidence matter.",
  },
  {
    route: "New Zealand quota ballots",
    owner: "Immigration New Zealand",
    review: "When ballot registration, results, invitation, job-offer, or residence requirements change.",
    risk: "Ballot draw is not final residence approval; registration numbers and official invitation steps matter.",
  },
  {
    route: "Japan, Korea, Hong Kong, and Ireland working holiday routes",
    owner: "Government immigration or foreign-affairs source for each route",
    review: "Before any route is marked open, and when quotas, age limits, funds, insurance, or embassy instructions change.",
    risk: "Country-specific eligibility, holiday-first purpose, quota limits, and arrival obligations must be clear.",
  },
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
        <h2>Opportunity source matrix</h2>
        <p className="section-intro">
          Official opportunity routes need stricter checks because users are vulnerable to fake lottery, ballot, job, and guarantee claims.
        </p>
        <div className="mini-list">
          {opportunitySources.map((item) => (
            <div key={item.route}>
              <strong>{item.route}</strong>
              <span><b>Owner:</b> {item.owner}</span>
              <span><b>Review trigger:</b> {item.review}</span>
              <span><b>Risk control:</b> {item.risk}</span>
            </div>
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
