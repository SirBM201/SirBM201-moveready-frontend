const routeFacts = [
  {
    title: "Pool-based opportunity",
    text: "International Experience Canada uses pools and rounds of invitations. Eligible users submit a profile and wait for an Invitation to Apply before applying for a work permit.",
  },
  {
    title: "Three IEC categories",
    text: "IEC can include Working Holiday, Young Professionals, and International Co-op pools, depending on the user's citizenship and bilateral youth mobility arrangement.",
  },
  {
    title: "Country-specific chances",
    text: "Available spots, invitation chances, and dates are country or territory specific. Users should monitor their citizenship country, not only Canada generally.",
  },
  {
    title: "Profile timing",
    text: "A profile can be submitted during the open season, but users should check final-round notices and country-specific pool status before relying on availability.",
  },
  {
    title: "Invitation response",
    text: "If invited, the user must respond and submit a complete work permit application through the official process within the required deadline.",
  },
  {
    title: "No guaranteed invitation",
    text: "Being in a pool is not approval and does not guarantee an invitation. MoveReady should treat it as a monitored opportunity, not an approval promise.",
  },
];

const readinessItems = [
  "Confirm eligible citizenship and age band for the selected IEC category.",
  "Choose the right pool: Working Holiday, Young Professionals, or International Co-op.",
  "Prepare passport, identity, contact, education, work, and police-certificate evidence where required.",
  "Track country-specific available spots, rounds, and final-round notices.",
  "Set a watchlist alert for invitation rounds, closing notices, and document changes.",
  "Prepare funds, insurance, arrival plan, and employer or internship evidence where relevant.",
];

const sourceLinks = [
  {
    label: "Canada IEC overview",
    href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec.html",
  },
  {
    label: "Create your IEC profile",
    href: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec/become-candidate.html",
  },
  {
    label: "IEC rounds of invitations",
    href: "https://ircc.canada.ca/english/work/iec/selections.asp",
  },
];

export default function CanadaIecRoutePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Canada IEC route</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/compare">Compare</a>
          <a href="/opportunities">Opportunities</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/saved-routes">Saved Routes</a>
          <a href="/route-checker">Route Checker</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Official invitation-pool route</span>
          <h1>Canada IEC invitation pool pathway.</h1>
          <p className="lede">A focused workspace for users tracking International Experience Canada pools, invitation rounds, available spots, eligibility, documents, funds, insurance, and arrival readiness.</p>
          <div className="actions">
            <a className="btn primary" href="/watchlist?type=opportunity&code=CA-IEC&title=Canada%20IEC%20invitation%20pool">Create IEC alert</a>
            <a className="btn" href="/saved-routes?country=CA&route=iec">Save route</a>
            <a className="btn" href="/compare">Compare routes</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <article className="card">
          <div className="panel-heading">
            <div>
              <span className="overline">Route status</span>
              <h2>Canada IEC monitoring route</h2>
            </div>
            <span className="badge">Available</span>
          </div>
          <p>Use this workspace to prepare profile evidence and monitor country-specific invitation rounds. Database-backed route facts can be added later without changing this page.</p>
          <div className="badge-row">
            <span className="badge">Invitation pool</span>
            <span className="badge">Watchlist ready</span>
            <span className="badge">No guarantee claims</span>
          </div>
        </article>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>IEC readiness notes</h2>
            <p className="section-intro">MoveReady should handle IEC as a monitored pool route with country-specific alerts and no invitation guarantee.</p>
          </div>
          <div className="badge-row">
            <span className="badge">Canada</span>
            <span className="badge">Invitation pool</span>
            <span className="badge">Watchlist ready</span>
          </div>
        </div>
        <div className="grid">
          {routeFacts.map((fact) => (
            <article className="card" key={fact.title}>
              <h3>{fact.title}</h3>
              <p>{fact.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Readiness checklist</h2>
        <div className="grid">
          {readinessItems.map((item) => (
            <article className="card" key={item}>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <article className="card">
          <h2>Safety rule</h2>
          <p>MoveReady should never tell a user that IEC pool entry guarantees an invitation or work permit. The product should help users check eligibility, prepare evidence, monitor country-specific rounds, and act only through official channels.</p>
          <div className="actions">
            {sourceLinks.map((source) => (
              <a className="btn" href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label}</a>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
