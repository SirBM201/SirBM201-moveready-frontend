import SiteHeader from "@/components/SiteHeader";

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
    summary: "Document support should have clear tracking, responsibility boundaries, and user consent before any handoff.",
  },
];

const userRules = [
  "Use official government websites for final submission and payment instructions.",
  "Do not pay anyone who promises visa approval, lottery selection, scholarship awards, or guaranteed appointments.",
  "Check names, passport validity, document dates, translations, and proof-of-funds evidence before submission.",
  "Keep confirmation numbers for lotteries, ballots, appointments, and report references.",
  "Request human review when a refusal, family case, business route, or sensitive document shipment is involved.",
];

const reportRules = [
  {
    title: "Reports are advisory",
    detail: "A readiness report is a planning guide. It should not be treated as legal advice, admission advice, visa approval, or proof that a route will succeed.",
  },
  {
    title: "Dates matter",
    detail: "Users should refresh reports when rules, fees, deadlines, or personal circumstances change.",
  },
  {
    title: "Risk labels stay visible",
    detail: "Risk level, source status, generated date, and route context should remain visible on saved and printed reports.",
  },
];

export default function TrustPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Trust center" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Trust and compliance</span>
          <h1>MoveReady helps users prepare without creating false confidence.</h1>
          <p className="lede">
            The platform is built around reviewed sources, clear status labels, user consent, partner screening, and honest risk language.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Use route checker</a>
            <a className="btn" href="/opportunities">View opportunities</a>
            <a className="btn" href="/services">Request support</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <p className="overline">Platform rules</p>
            <h2>Trust rules that guide every page</h2>
            <p className="section-intro">These rules apply to public pages, reports, service requests, provider screening, and review workflows.</p>
          </div>
          <span className="status-dot">Required</span>
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
        <div className="section-heading-row">
          <div>
            <p className="overline">Readiness reports</p>
            <h2>How users should read reports</h2>
            <p className="section-intro">Reports should help users organize the next action, not make them overconfident.</p>
          </div>
          <span className="status-dot">Advisory</span>
        </div>
        <div className="grid">
          {reportRules.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>User safety checklist</h2>
        <p className="section-intro">Use these checks before paying, booking, uploading sensitive documents, or submitting applications.</p>
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
