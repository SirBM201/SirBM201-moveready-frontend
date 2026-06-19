import styles from "./compare.module.css";

const routes = [
  {
    name: "Country comparison workspace",
    country: "Multiple countries",
    category: "Decision support",
    status: "Available",
    risk: "Route-specific",
    strength: "Best first step when a user is still choosing between countries before committing to one visa path.",
    watch: "Route availability, risk label, source confidence, saved countries, country alerts, and readiness next steps.",
    actions: [
      { label: "Compare countries", href: "/country-comparison" },
      { label: "Open countries", href: "/country-checker" },
    ],
  },
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
    name: "Portugal entrepreneur and independent work pathway",
    country: "Portugal",
    category: "Business / independent work",
    status: "Available",
    risk: "Medium",
    strength: "Useful for founders and independent professionals preparing residency visa evidence, financial means, insurance, and post-arrival residence permit steps.",
    watch: "Consular instructions, entrepreneur evidence, independent work evidence, document legalization, insurance, and AIMA follow-up steps.",
    actions: [
      { label: "Open route", href: "/routes/portugal-entrepreneur" },
      { label: "Save route", href: "/saved-routes?country=PT&route=entrepreneur-independent-work" },
      { label: "Create alert", href: "/watchlist?type=route&code=PT-entrepreneur-independent-work&title=Portugal%20entrepreneur%20and%20independent%20work%20pathway" },
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
    name: "Canada International Experience Canada",
    country: "Canada",
    category: "Invitation pool / youth mobility",
    status: "Available",
    risk: "Country-specific",
    strength: "Useful for eligible citizens tracking Working Holiday, Young Professionals, or International Co-op pools and invitation rounds.",
    watch: "Country-specific spots, invitation rounds, final-round notices, eligibility, documents, funds, insurance, and arrival planning.",
    actions: [
      { label: "Open route", href: "/routes/canada-iec" },
      { label: "Save route", href: "/saved-routes?country=CA&route=iec" },
      { label: "Create alert", href: "/watchlist?type=opportunity&code=CA-IEC&title=Canada%20International%20Experience%20Canada" },
    ],
  },
  {
    name: "Japan Working Holiday Programme",
    country: "Japan",
    category: "Youth mobility / annual quota",
    status: "Available",
    risk: "Country-specific",
    strength: "Useful for eligible partner-country nationals planning a holiday-first stay in Japan with incidental work rights.",
    watch: "Partner-country eligibility, embassy instructions, quota timing, funds, insurance, and purpose rules.",
    actions: [
      { label: "Open guide", href: "/opportunities/japan-working-holiday" },
      { label: "Create alert", href: "/watchlist?type=opportunity&code=JP-WH&title=Japan%20Working%20Holiday%20Programme" },
    ],
  },
  {
    name: "Korea Working Holiday Visa",
    country: "South Korea",
    category: "Youth mobility / annual quota",
    status: "Available",
    risk: "Country-specific",
    strength: "Useful for eligible partner-country nationals planning a temporary holiday stay with limited work rights in Korea.",
    watch: "Nationality eligibility, quota, application location, funds, insurance, and arrival registration.",
    actions: [
      { label: "Open guide", href: "/opportunities/korea-working-holiday" },
      { label: "Create alert", href: "/watchlist?type=opportunity&code=KR-WH&title=Korea%20Working%20Holiday%20Visa" },
    ],
  },
  {
    name: "Hong Kong Working Holiday Scheme",
    country: "Hong Kong",
    category: "Youth mobility / first-come quota",
    status: "Available",
    risk: "Quota-sensitive",
    strength: "Useful for eligible participating-country nationals where annual quota availability and application timing matter.",
    watch: "Participating countries, annual quota, first-come processing, funds, insurance, and temporary work limits.",
    actions: [
      { label: "Open guide", href: "/opportunities/hong-kong-working-holiday" },
      { label: "Create alert", href: "/watchlist?type=opportunity&code=HK-WHS&title=Hong%20Kong%20Working%20Holiday%20Scheme" },
    ],
  },
  {
    name: "Ireland Working Holiday Authorisation",
    country: "Ireland",
    category: "Youth mobility / authorisation",
    status: "Available",
    risk: "Country-specific",
    strength: "Useful for eligible partner-country nationals who need citizenship-specific authorisation rules and arrival planning.",
    watch: "Eligibility country, age range, funds, insurance, application channel, and arrival registration.",
    actions: [
      { label: "Open guide", href: "/opportunities/ireland-working-holiday" },
      { label: "Create alert", href: "/watchlist?type=opportunity&code=IE-WHA&title=Ireland%20Working%20Holiday%20Authorisation" },
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
  ["Decision support", "Compare countries and route families before spending money."],
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
          <a href="/country-comparison">Countries</a>
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
            Use MoveReady to compare countries, startup routes, D visa pathways, entrepreneur routes, lottery/ballot opportunities, youth mobility routes, and readiness tools before spending money on documents, appointments, travel, or service providers.
          </p>
          <div className="actions">
            <a className="btn primary" href="/country-comparison">Compare countries</a>
            <a className="btn" href="/route-checker">Generate readiness report</a>
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
                  <a className={action.label.includes("Open") || action.label.includes("Run") || action.label.includes("Compare") ? "btn primary" : "btn"} href={action.href} key={action.href}>{action.label}</a>
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
