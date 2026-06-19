import ApprovedProviderDirectory from "@/components/ApprovedProviderDirectory";

const providerCategories = [
  ["Courier and document delivery", "Passport, certificate, embassy, notarization, and legalization logistics."],
  ["Notarization and legalization", "Notary, apostille, attestation, embassy legalization, and certified translation support."],
  ["Insurance partners", "Travel, health, student, family, Schengen-style, and work-route insurance support."],
  ["Expert review", "Route evidence, refusal-risk, proof-of-funds, startup, scholarship, and document review."],
  ["Admission and scholarship support", "Study route, school application, scholarship, SOP, and education document support."],
  ["Settlement support", "Airport pickup, accommodation, local registration, bank, SIM, school, and first-arrival support."],
];

const approvalRules = [
  "Provider identity and contact details reviewed",
  "Service coverage and country scope confirmed",
  "Sensitive-document handling process documented",
  "Pricing, refund, complaint, and privacy process reviewed",
  "Public listing approved by MoveReady admin",
];

export default function ProvidersPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Provider directory</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/courier">Courier</a>
          <a href="/legalization">Legalization</a>
          <a href="/partners/apply">Provider Apply</a>
          <a href="/trust">Trust</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Partner approval pending</span>
          <h1>Approved providers will appear here after screening.</h1>
          <p className="lede">
            MoveReady can receive user service requests now. Public provider listings stay controlled until provider checks, service scope, pricing, privacy, and sensitive-document handling are reviewed.
          </p>
          <div className="actions">
            <a className="btn primary" href="/services">Request a service</a>
            <a className="btn" href="/partners/apply">Apply as provider</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <h2>Approved Providers</h2>
            <p className="section-intro">Only admin-approved providers are listed publicly. Pending applications stay private.</p>
          </div>
          <span className="status-dot">Approved only</span>
        </div>
        <ApprovedProviderDirectory />
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>Provider Categories</h2>
            <p className="section-intro">These are the partner categories MoveReady can support as the network is screened.</p>
          </div>
          <span className="status-dot">Screening required</span>
        </div>
        <div className="module-preview-grid">
          {providerCategories.map(([title, summary]) => (
            <article className="module-tile" key={title}>
              <span className="overline">Provider category</span>
              <h3>{title}</h3>
              <p>{summary}</p>
              <div className="badge-row"><span className="badge module-status partner_approval_pending">Partner approval pending</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Approval Rules</h2>
        <p className="section-intro">No provider should be listed publicly or receive user handoff before these checks are complete.</p>
        <div className="mini-list">
          {approvalRules.map((rule) => (
            <div key={rule}>
              <strong>{rule}</strong>
              <span>Admin review keeps execution services separated from source-backed guidance until trust checks pass.</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
