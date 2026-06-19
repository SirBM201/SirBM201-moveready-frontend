import styles from "./compare.module.css";

const routes = [
  {
    name: "Estonia startup founder pathway",
    country: "Estonia",
    category: "Startup / founder",
    status: "Available",
    risk: "Medium",
    strength: "Strong fit for scalable technology startup founders preparing Startup Committee evidence.",
    watch: "Startup Committee changes, D visa rules, financial means, document legalization, insurance.",
    actions: [
      { label: "Open route", href: "/routes/estonia-startup" },
      { label: "Save route", href: "/saved-routes?country=EE&route=startup-founder" },
      { label: "Create alert", href: "/watchlist?type=route&code=EE-startup-founder&title=Estonia%20startup%20founder%20pathway" },
    ],
  },
  {
    name: "Finland D visa / fast-track pathway",
    country: "Finland",
    category: "Fast-track / residence permit travel",
    status: "Available",
    risk: "Medium",
    strength: "Useful after eligible residence-permit approval where D visa travel is connected to approved permit routes.",
    watch: "Fast-track eligibility, residence-permit decision timing, D visa instructions, family evidence.",
    actions: [
      { label: "Open route", href: "/routes/finland-d-visa" },
      { label: "Save route", href: "/saved-routes?country=FI&route=d-visa" },
      { label: "Create alert", href: "/watchlist?type=route&code=FI-d-visa&title=Finland%20D%20visa%20fast-track%20pathway" },
    ],
  },
  {
    name: "Official ballots and quota opportunities",
    country: "Multiple countries",
    category: "Lottery / ballot / quota",
    status: "Available",
    risk: "Variable",
    strength: "Good for users who want official lottery, ballot, country-cap, and invitation-pool monitoring.",
    watch: "Open dates, closing dates, eligibility changes, result-check periods, scam warnings.",
    actions: [
      { label: "Open opportunities", href: "/opportunities" },
      { label: "Create alert", href: "/watchlist?type=opportunity&code=official-opportunities&title=Official%20ballots%20and%20quota%20opportunities" },
    ],
  },
  {
    name: "Document and funds readiness",
    country: "All target countries",
    category: "Readiness tools",
    status: "Available",
    risk: "User-specific",
    strength: "Best before applying, booking appointments, paying agents, or submitting high-risk applications.",
    watch: "Document expiry, name mismatch, proof-of-funds shortfall, previous refusal risk.",
    actions: [
      { label: "Run checks", href: "/readiness" },
      { label: "Save timeline", href: "/timeline" },
    ],
  },
];

const scoreRows = [
  ["Decision support", "Compare route fit before spending money."],
  ["Preparation", "Move from interest to documents, funds, timeline, reports, and services."],
  ["Monitoring", "Save routes and create opt-in alerts for date/rule changes."],
  ["Execution", "Request courier, legalization, insurance, expert review, and settlement support."],
];

export default function ComparePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Compare routes</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/opportunities">Opportunities</a>
          <a href="/readiness">Readiness</a>
          <a href="/saved-routes">Saved Routes</a>
          <a href="/services">Services</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Route comparison</span>
          <h1>Compare before you commit.</h1>
          <p className="lede">
            Use MoveReady to compare startup routes, D visa pathways, lottery/ballot opportunities, and readiness tools before spending money on documents, appointments, travel, or service providers.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Generate readiness report</a>
            <a className="btn" href="/saved-routes">Save a route</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <h2>Comparison map</h2>
        <p className="section-intro">These are the first route families in the launch surface. Each card points to a next action instead of leaving users with only information.</p>
        <div className={styles.compareGrid}>
          {routes.map((route) => (
            <article className="card" key={route.name}>
              <div className="panel-heading">
                <div>
                  <span className="overline">{route.country}</span>
                  <h3>{route.name}</h3>
                </div>
                <span className="badge">{route.status}</span>
              </div>
              <div className="badge-row">
                <span className="badge">{route.category}</span>
                <span className="badge">Risk: {route.risk}</span>
              </div>
              <div className="mini-list">
                <div><strong>Best use</strong><span>{route.strength}</span></div>
                <div><strong>Monitor</strong><span>{route.watch}</span></div>
              </div>
              <div className="actions">
                {route.actions.map((action) => (
                  <a className={action.label.includes("Open") || action.label.includes("Run") ? "btn primary" : "btn"} href={action.href} key={action.href}>{action.label}</a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>How MoveReady ranks route readiness</h2>
        <div className="grid">
          {scoreRows.map(([title, text]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
