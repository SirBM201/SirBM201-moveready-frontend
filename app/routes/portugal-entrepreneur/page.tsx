import LiveRouteDetail from "@/components/LiveRouteDetail";

const facts = [
  {
    title: "Residency visa category",
    text: "Portugal's national visa guidance lists a residency visa route for independent work purposes or entrepreneurs.",
  },
  {
    title: "Independent professional activity",
    text: "Applicants should be ready to evidence a service contract or written service proposal, and professional competence evidence where the activity requires it.",
  },
  {
    title: "Entrepreneur evidence",
    text: "Founder applicants should prepare evidence of investment activity, available financial means in Portugal, and clear intention to invest in Portuguese territory.",
  },
  {
    title: "Startup Visa distinction",
    text: "Startup Visa applicants should verify whether an IAPMEI declaration and certified incubator contract are required for their specific route.",
  },
  {
    title: "Residence permit step",
    text: "Portugal's residency visa is valid for a limited initial period and is used before applying for a residence permit with AIMA after arrival.",
  },
  {
    title: "Document legalization",
    text: "Criminal record and foreign public documents may need apostille or legalization, depending on issuing country and document type.",
  },
];

const checklist = [
  "Confirm whether the route is independent work, entrepreneur, or Startup Visa",
  "Prepare passport and national visa application form",
  "Prepare service contract, written proposal, investment evidence, or Startup Visa evidence",
  "Prepare proof of financial resources and funds source explanation",
  "Prepare criminal record certificate with apostille or legalization where required",
  "Prepare travel or health insurance evidence",
  "Check consular post, VFS, and e-Visa instructions for the country of application",
  "Plan AIMA residence permit step after visa issue and arrival",
];

export default function PortugalEntrepreneurPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Portugal entrepreneur route</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/compare">Compare</a>
          <a href="/country-comparison">Countries</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/saved-routes">Saved Routes</a>
          <a href="/services">Services</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Official-source route workspace</span>
          <h1>Portugal entrepreneur and independent work readiness.</h1>
          <p className="lede">A focused route workspace for founders, independent professionals, and startup applicants preparing Portugal residency visa evidence, funds, insurance, document legalization, and post-arrival residence permit steps.</p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Generate readiness report</a>
            <a className="btn" href="/saved-routes?country=PT&route=entrepreneur-independent-work">Save route</a>
            <a className="btn" href="/watchlist?type=route&code=PT-entrepreneur-independent-work&title=Portugal%20entrepreneur%20and%20independent%20work%20route">Create alert</a>
            <a className="btn" href="/services">Request document support</a>
          </div>
        </div>
      </section>

      <LiveRouteDetail countryCode="PT" routeCode="entrepreneur-independent-work" />

      <section className="route-detail-shell">
        <div className="route-detail-layout">
          <aside className="route-detail-side">
            <span className="overline">Source notes</span>
            <h2>Portugal business route fit</h2>
            <p>Use this route for early readiness only. Final application evidence must follow the current consular post, e-Visa, VFS, AIMA, and Portuguese Ministry of Foreign Affairs instructions.</p>
            <div className="badge-row">
              <span className="badge">Portugal</span>
              <span className="badge">Entrepreneur</span>
              <span className="badge">Independent work</span>
              <span className="badge">Source-backed</span>
            </div>
            <div className="route-metrics">
              <div><strong>Route type</strong><span>Residency visa</span></div>
              <div><strong>Core risk</strong><span>Evidence quality and funds source</span></div>
              <div><strong>Public source</strong><span>Portugal Ministry of Foreign Affairs visa portal</span></div>
            </div>
          </aside>

          <div className="route-detail-main">
            <section className="detail-section">
              <h3>Public source notes</h3>
              <div className="mini-list">
                {facts.map((fact) => (
                  <div key={fact.title}><strong>{fact.title}</strong><span>{fact.text}</span></div>
                ))}
              </div>
            </section>

            <section className="detail-section">
              <h3>Readiness checklist</h3>
              <div className="badge-row">
                {checklist.map((item) => <span className="badge" key={item}>{item}</span>)}
              </div>
            </section>

            <section className="detail-section">
              <h3>Safety note</h3>
              <p>This page does not guarantee eligibility, visa issue, residence permit approval, appointment availability, or acceptance of any business evidence. Users should verify current source pages before paying providers, submitting documents, or booking travel.</p>
              <div className="actions">
                <a className="btn primary" href="https://vistos.mne.gov.pt/en/national-visas/necessary-documentation/residency" target="_blank" rel="noreferrer">Portugal residency visa documents</a>
                <a className="btn" href="https://vistos.mne.gov.pt/en/national-visas/general-information/type-of-visa" target="_blank" rel="noreferrer">Portugal national visa types</a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
