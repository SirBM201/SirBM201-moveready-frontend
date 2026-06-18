const trustSections = [
  {
    title: "Source-backed route information",
    status: "Required",
    summary: "Sensitive route guidance should show official-source context, last verified date, review due date, and confidence level when available.",
  },
  {
    title: "No approval guarantees",
    status: "Required",
    summary: "MoveReady can help users prepare and monitor routes, but it must not promise visa approval, lottery selection, scholarship awards, or appointment access.",
  },
  {
    title: "Official links for ballots and lotteries",
    status: "Required",
    summary: "Users should be directed to official government portals for free or official ballot submissions. MoveReady can support readiness, reminders, and scam warnings.",
  },
  {
    title: "Opt-in notifications",
    status: "Required",
    summary: "Email, WhatsApp, phone, Telegram, and in-app alert requests must be based on user consent and the route or opportunity selected by the user.",
  },
  {
    title: "Partner screening before handoff",
    status: "Required",
    summary: "Courier, insurance, legalization, translation, accommodation, admission, and settlement providers should be reviewed before public listing or user handoff.",
  },
  {
    title: "Sensitive document handling",
    status: "Required",
    summary: "Passport, certificate, notarization, apostille, and legalization support should be treated as premium trusted services with tracking, insurance, and clear responsibility boundaries.",
  },
];

const userRules = [
  "Use official government websites for final submission and payment instructions.",
  "Do not pay anyone who promises visa approval, lottery selection, scholarship awards, or guaranteed appointments.",
  "Check names, passport validity, document dates, translations, and proof-of-funds evidence before submission.",
  "Keep confirmation numbers for lotteries, ballots, appointments, and report references.",
  "Request human review when a refusal, family case, business route, or sensitive document shipment is involved.",
];

export default function TrustPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Trust center</span>
        </a>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/safety">Safety</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Trust and compliance</span>
          <h1>MoveReady should help users prepare without creating false confidence.</h1>
          <p className="lede">
            The platform is built around reviewed sources, clear status labels, user consent, partner screening, and honest risk language.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Use route checker</a>
            <a className="btn" href="/opportunities">View opportunities</a>
            <a className="btn" href="/partners/apply">Provider apply</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <h2>Platform Rules</h2>
            <p className="section-intro">These rules apply to public pages, reports, service requests, provider screening, and admin review.</p>
          </div>
          <span className="status-dot">Launch standard</span>
        </div>
        <div className="module-preview-grid">
          {trustSections.map((item) => (
            <article className="module-tile" key={item.title}>
              <div className="badge-row"><span className="badge module-status available">{item.status}</span></div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>User Safety Checklist</h2>
        <p className="section-intro">This copy can be reused in route reports, opportunity pages, and service request confirmations.</p>
        <div className="mini-list">
          {userRules.map((rule) => (
            <div key={rule}>
              <strong>{rule}</strong>
              <span>MoveReady can help organize the step, but the official route owner remains the final authority.</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
