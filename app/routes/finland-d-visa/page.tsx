import LiveRouteDetail from "@/components/LiveRouteDetail";

const facts = [
  {
    title: "D visa purpose",
    text: "Finland's D visa lets eligible applicants travel to Finland immediately after a positive residence permit decision and visa sticker, instead of waiting abroad for the residence permit card.",
  },
  {
    title: "Residence permit first",
    text: "The D visa is tied to a granted or held Finnish residence permit. It does not replace the residence permit and does not shorten residence permit processing time.",
  },
  {
    title: "Eligible routes",
    text: "Migri lists eligible permit categories including specialists, EU Blue Card, start-up entrepreneurs, ICT specialists or managers, management roles, studies, researchers, employed persons, and selected other work-based permits.",
  },
  {
    title: "Fast-track fit",
    text: "Fast-track processing is available for selected first residence permits, including specialists, start-up entrepreneurs, EU Blue Card, ICT specialists or managers, and top or middle management roles.",
  },
  {
    title: "Family members",
    text: "Spouse and children under 18 may apply for a D visa with family-ties residence permit applications when linked to eligible main-applicant routes and submitted as instructed by Migri.",
  },
  {
    title: "Passport handling",
    text: "Applicants usually need to prove identity at a Finnish mission or VFS application centre and leave or present the passport so the D visa sticker can be attached after a positive decision.",
  },
];

const checklist = [
  "Confirm the main residence permit category first",
  "Check whether the chosen permit supports D visa application",
  "Apply online through Enter Finland where available",
  "Prepare passport copy and compliant passport photo",
  "Book identity verification at a Finnish mission or VFS centre",
  "Confirm whether the passport must remain with the mission",
  "Prepare a Finnish address for residence permit card delivery",
  "Check family application linking instructions if dependants apply",
];

export default function FinlandDVisaPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Finland D visa route</span></a>
        <nav className="nav"><a href="/route-checker">Route Checker</a><a href="/saved-routes">Saved Routes</a><a href="/timeline">Timeline</a><a href="/services">Services</a><a href="/sources">Sources</a></nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Official-source route workspace</span>
          <h1>Finland D visa readiness.</h1>
          <p className="lede">A focused workspace for users who may qualify for Finland's D visa through an eligible residence permit route such as start-up entrepreneur, specialist, study, research, or selected work-based permits.</p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Generate readiness report</a>
            <a className="btn" href="/saved-routes">Save route</a>
            <a className="btn" href="/timeline">Build timeline</a>
            <a className="btn" href="/services">Request document support</a>
          </div>
        </div>
      </section>

      <LiveRouteDetail countryCode="FI" routeCode="d-visa" />

      <section className="route-detail-shell">
        <div className="route-detail-layout">
          <aside className="route-detail-side">
            <span className="overline">Source notes</span>
            <h2>Finland D visa pathway</h2>
            <p>Use this route with current Migri and Finnish mission instructions. The D visa is tied to eligible residence permit routes and passport handling rules.</p>
            <div className="badge-row">
              <span className="badge">Finland</span>
              <span className="badge">D visa</span>
              <span className="badge">Residence permit linked</span>
              <span className="badge">Source-backed</span>
            </div>
            <div className="route-metrics">
              <div><strong>D visa length</strong><span>Up to 100 days</span></div>
              <div><strong>Primary rule</strong><span>Requires granted or held residence permit</span></div>
              <div><strong>Public source</strong><span>Finnish Immigration Service</span></div>
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
              <p>The D visa is not a standalone relocation shortcut and does not guarantee residence permit approval. Users should verify the current Migri and Finnish mission instructions before paying fees, submitting passports, booking travel, or making family arrangements.</p>
              <div className="actions">
                <a className="btn primary" href="https://migri.fi/en/d-visa" target="_blank" rel="noreferrer">Migri D visa source</a>
                <a className="btn" href="https://migri.fi/en/fast-track" target="_blank" rel="noreferrer">Migri fast-track source</a>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
