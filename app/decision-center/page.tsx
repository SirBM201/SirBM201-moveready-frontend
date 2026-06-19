const decisionStages = [
  {
    step: "1",
    title: "Choose the destination direction",
    summary: "Start by comparing countries before spending money on documents, agents, or applications.",
    primary: { label: "Compare countries", href: "/country-comparison" },
    secondary: { label: "Open country checker", href: "/country-checker" },
    signals: ["Country fit", "Route coverage", "Opportunity coverage", "Source confidence"],
  },
  {
    step: "2",
    title: "Shortlist the right route family",
    summary: "Compare startup, work, study, family, lottery, ballot, quota, and youth-mobility paths side-by-side.",
    primary: { label: "Compare routes", href: "/compare" },
    secondary: { label: "Plan route expansion", href: "/route-expansion" },
    signals: ["Route category", "Risk label", "Best use", "Monitor notes"],
  },
  {
    step: "3",
    title: "Check readiness before action",
    summary: "Turn a route into practical readiness: documents, funds, insurance, timeline, refusal risk, and next steps.",
    primary: { label: "Run route checker", href: "/route-checker" },
    secondary: { label: "Use readiness tools", href: "/readiness" },
    signals: ["Document gaps", "Funds pressure", "Insurance", "Timeline"],
  },
  {
    step: "4",
    title: "Save, monitor, and act safely",
    summary: "Save the route, create opt-in alerts, request trusted support, and keep reports for later lookup.",
    primary: { label: "Create watchlist", href: "/watchlist" },
    secondary: { label: "Request service", href: "/services" },
    signals: ["Saved route", "Alert preference", "Service request", "Report lookup"],
  },
];

const userTypes = [
  {
    title: "Founder or business applicant",
    text: "Best path through the app: country comparison → route comparison → startup/evidence route → readiness report → service support.",
    links: [
      { label: "Estonia startup", href: "/routes/estonia-startup" },
      { label: "Portugal entrepreneur", href: "/routes/portugal-entrepreneur" },
      { label: "Startup evidence", href: "/startup-evidence" },
    ],
  },
  {
    title: "Student or scholarship seeker",
    text: "Best path through the app: scholarship search → document checklist → funds readiness → timeline → alerts.",
    links: [
      { label: "Scholarships", href: "/scholarships" },
      { label: "Document checklist", href: "/document-checklist" },
      { label: "Budget calculator", href: "/budget-calculator" },
    ],
  },
  {
    title: "Lottery, ballot, or quota seeker",
    text: "Best path through the app: official opportunity page → scam-safe source review → watchlist alert → document readiness.",
    links: [
      { label: "Opportunities", href: "/opportunities" },
      { label: "Watchlist", href: "/watchlist" },
      { label: "Sources", href: "/sources" },
    ],
  },
  {
    title: "Family relocation planner",
    text: "Best path through the app: family planner → documents → funds → settlement support → timeline.",
    links: [
      { label: "Family planner", href: "/family-planner" },
      { label: "Timeline", href: "/timeline" },
      { label: "Settlement", href: "/settlement" },
    ],
  },
];

const safetyRules = [
  "No visa, lottery, ballot, admission, or job approval guarantee.",
  "Official-source guidance must show confidence, risk, and freshness where possible.",
  "Paid support should be requested only after the user understands the route and readiness gaps.",
  "Sensitive document services stay controlled through provider screening and user consent.",
  "Alerts are opt-in only and should point users back to official sources before action.",
  "Admin/source review should happen before route facts are treated as public guidance.",
];

const launchPriorities = [
  { title: "Navigation polish", text: "Make Decision Center, Compare, Countries, Routes, Readiness, Services, Sources, and Admin easy to reach from core pages." },
  { title: "Account layer", text: "Add login so saved routes, reports, watchlists, timeline events, and service requests belong to a real user." },
  { title: "Admin review", text: "Give source and provider review a proper admin surface before public growth becomes too wide." },
  { title: "Payment readiness", text: "Prepare paid reports, expert review, service requests, and premium alerts after the free MVP flow is stable." },
];

export default function DecisionCenterPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Decision Center</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/workspace">Workspace</a>
          <a href="/country-comparison">Countries</a>
          <a href="/compare">Compare</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/services">Services</a>
          <a href="/sources">Sources</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Guided relocation decision flow</span>
          <h1>Move from confusion to a safe next action.</h1>
          <p className="lede">
            The Decision Center shows how a user should move through MoveReady: compare countries, shortlist routes, check readiness, save alerts, request help, and keep reports without relying on promises or unverified advice.
          </p>
          <div className="actions">
            <a className="btn primary" href="/country-comparison">Start with countries</a>
            <a className="btn" href="/route-checker">Run route checker</a>
            <a className="btn" href="/services">Request trusted support</a>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="trust-item"><strong>1</strong><span>Compare countries</span></div>
        <div className="trust-item"><strong>2</strong><span>Compare route families</span></div>
        <div className="trust-item"><strong>3</strong><span>Check readiness gaps</span></div>
        <div className="trust-item"><strong>4</strong><span>Save, alert, and act</span></div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <h2>Core decision journey</h2>
            <p className="section-intro">
              This journey should guide the app design. Every feature should help the user make a safer relocation decision or prepare better evidence.
            </p>
          </div>
          <span className="status-dot">Design direction</span>
        </div>
        <div className="grid">
          {decisionStages.map((stage) => (
            <article className="card" key={stage.step}>
              <span className="eyebrow">Step {stage.step}</span>
              <h3>{stage.title}</h3>
              <p>{stage.summary}</p>
              <div className="badge-row">
                {stage.signals.map((signal) => <span className="badge" key={signal}>{signal}</span>)}
              </div>
              <div className="actions">
                <a className="btn primary" href={stage.primary.href}>{stage.primary.label}</a>
                <a className="btn" href={stage.secondary.href}>{stage.secondary.label}</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>User paths</h2>
            <p className="section-intro">
              The app should not feel like many disconnected pages. Each user type needs a clear path through the same platform.
            </p>
          </div>
          <a className="btn" href="/workspace">Open full workspace</a>
        </div>
        <div className="module-preview-grid">
          {userTypes.map((item) => (
            <article className="module-tile" key={item.title}>
              <span className="overline">User path</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="actions">
                {item.links.map((link) => <a className="btn" href={link.href} key={link.href}>{link.label}</a>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>Safety rules that shape the design</h2>
            <p className="section-intro">
              These rules keep the product trusted as we add more countries, opportunities, services, and paid features.
            </p>
          </div>
          <a className="btn" href="/trust">Review trust center</a>
        </div>
        <div className="grid">
          {safetyRules.map((rule) => (
            <article className="card" key={rule}>
              <h3>{rule}</h3>
              <p>Keep this visible in route pages, reports, alerts, services, and admin review.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>Next design priorities</h2>
            <p className="section-intro">
              These are the remaining design layers before the app feels commercially ready, not just technically available.
            </p>
          </div>
          <span className="status-dot">Next build queue</span>
        </div>
        <div className="mini-list two-col-list">
          {launchPriorities.map((item) => (
            <div key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
