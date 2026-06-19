const revenueStreams = [
  {
    title: "Free route discovery",
    status: "Free layer",
    summary: "Country comparison, route comparison, official opportunity browsing, basic readiness guidance, and trust education should remain easy to access.",
    why: "This builds trust and lets users understand the route before paying anyone.",
    action: { label: "Open Decision Center", href: "/decision-center" },
  },
  {
    title: "Paid readiness reports",
    status: "Core paid product",
    summary: "Route-specific reports can package user profile, documents, funds, budget, insurance, risk notes, timeline, and source status.",
    why: "This is the cleanest digital product because it is tied to structured app data and does not require promising approval.",
    action: { label: "Run route checker", href: "/route-checker" },
  },
  {
    title: "Premium alerts and monitoring",
    status: "Subscription candidate",
    summary: "Users can monitor countries, routes, lotteries, ballots, scholarships, and deadlines with opt-in reminders and source-change notices.",
    why: "This creates recurring value without becoming an agent or making immigration promises.",
    action: { label: "Create watchlist", href: "/watchlist" },
  },
  {
    title: "Expert review requests",
    status: "Human-assisted paid layer",
    summary: "Users can request document review, route review, refusal-risk review, scholarship review, business-plan review, or startup-evidence review.",
    why: "This can command higher fees, but must be scoped clearly and handled by screened reviewers.",
    action: { label: "Request service", href: "/services" },
  },
  {
    title: "Trusted service marketplace",
    status: "Commission or referral layer",
    summary: "Courier, legalization, translation, insurance, admission, accommodation, airport pickup, settlement, and local setup providers can be screened and matched.",
    why: "This monetizes practical execution while keeping provider approval and user consent as safety gates.",
    action: { label: "Provider application", href: "/partners/apply" },
  },
  {
    title: "B2B route intelligence",
    status: "Later-stage product",
    summary: "Schools, relocation providers, document companies, travel consultants, and HR teams can use route data, source monitoring, and readiness tools.",
    why: "This should come after the consumer MVP proves route quality, reports, and source-review discipline.",
    action: { label: "Review sources", href: "/sources" },
  },
];

const packageIdeas = [
  {
    name: "Starter Readiness",
    user: "Users still comparing options",
    includes: "Country comparison, route comparison, basic checklist, saved routes, and limited alerts.",
    priceNote: "Free or low-cost entry tier",
  },
  {
    name: "Route Report",
    user: "Users preparing one serious application path",
    includes: "One route-specific readiness report with documents, funds, insurance, budget, risks, and next steps.",
    priceNote: "One-time report payment",
  },
  {
    name: "Active Applicant",
    user: "Users preparing documents over several weeks or months",
    includes: "Reports, watchlist, timeline reminders, document checklist, and priority source-change alerts.",
    priceNote: "Monthly subscription candidate",
  },
  {
    name: "Assisted MoveReady",
    user: "Users who need human support",
    includes: "Expert review plus service matching for documents, legalization, insurance, travel, or settlement.",
    priceNote: "Quote or service-fee model",
  },
];

const paymentRules = [
  "Never sell visa approval, lottery selection, guaranteed admission, guaranteed job, or appointment shortcut.",
  "Separate official government fees from MoveReady service fees.",
  "Show whether a fee is for digital report, expert review, provider service, or monitoring subscription.",
  "Do not collect sensitive-document service payment before scope, provider, handling method, and refund rule are clear.",
  "For lottery and ballot routes, send users to official sources and charge only for readiness, alerts, or document support where appropriate.",
  "Keep payment records connected to the user account, report reference, service request, or watchlist item.",
];

export default function RevenueModelPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Revenue Model</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/decision-center">Decision Center</a>
          <a href="/pricing">Pricing</a>
          <a href="/services">Services</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/trust">Trust</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Commercial design</span>
          <h1>Make money from readiness, not false promises.</h1>
          <p className="lede">
            MoveReady can earn from reports, monitoring, expert review, and trusted services while staying safe: no approval guarantees, no fake shortcuts, no unofficial lottery fees, and no unverified provider handoff.
          </p>
          <div className="actions">
            <a className="btn primary" href="/pricing">Open pricing page</a>
            <a className="btn" href="/services">Request service</a>
            <a className="btn" href="/trust">Review safety rules</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <h2>Revenue streams</h2>
            <p className="section-intro">
              These streams keep the business model connected to real user value while protecting the brand from immigration-agent style promises.
            </p>
          </div>
          <span className="status-dot">Commercial map</span>
        </div>
        <div className="grid">
          {revenueStreams.map((stream) => (
            <article className="card" key={stream.title}>
              <span className="overline">{stream.status}</span>
              <h3>{stream.title}</h3>
              <p>{stream.summary}</p>
              <div className="mini-list">
                <div><strong>Why it fits</strong><span>{stream.why}</span></div>
              </div>
              <div className="actions">
                <a className="btn primary" href={stream.action.href}>{stream.action.label}</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>Package ideas</h2>
            <p className="section-intro">
              These are design-level package names and boundaries. Final pricing can be decided after testing user demand and provider costs.
            </p>
          </div>
          <a className="btn" href="/route-checker">Test report flow</a>
        </div>
        <div className="module-preview-grid">
          {packageIdeas.map((pack) => (
            <article className="module-tile" key={pack.name}>
              <span className="overline">{pack.priceNote}</span>
              <h3>{pack.name}</h3>
              <p>{pack.user}</p>
              <div className="mini-list">
                <div><strong>Includes</strong><span>{pack.includes}</span></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>Payment safety rules</h2>
            <p className="section-intro">
              These rules should shape payment screens, service quotes, refunds, provider matching, and admin review.
            </p>
          </div>
          <a className="btn" href="/sources">Review sources</a>
        </div>
        <div className="mini-list two-col-list">
          {paymentRules.map((rule) => (
            <div key={rule}>
              <strong>{rule}</strong>
              <span>Keep this rule visible before public payment or provider matching is enabled.</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
