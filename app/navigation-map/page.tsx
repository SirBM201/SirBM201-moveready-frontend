const primaryFlows = [
  {
    title: "Decision Center",
    href: "/decision-center",
    label: "Best starting point",
    summary: "Guides users from country choice to route comparison, readiness checks, watchlist alerts, trusted services, and reports.",
  },
  {
    title: "Country comparison",
    href: "/country-comparison",
    label: "Choose destination",
    summary: "Compare countries by route coverage, opportunity coverage, risk signals, source confidence, and next actions.",
  },
  {
    title: "Route comparison",
    href: "/compare",
    label: "Choose route family",
    summary: "Compare startup, D visa, entrepreneur, youth mobility, lottery, ballot, quota, and readiness routes.",
  },
  {
    title: "Route checker",
    href: "/route-checker",
    label: "Check readiness",
    summary: "Generate practical next steps from user route inputs: documents, funds, risk, budget, insurance, and report actions.",
  },
];

const routePages = [
  { title: "Estonia startup route", href: "/routes/estonia-startup", text: "Founder/startup evidence, committee readiness, D visa planning, funds, documents, and insurance." },
  { title: "Finland D visa route", href: "/routes/finland-d-visa", text: "Fast-track/D visa readiness connected to eligible residence permit routes and family planning." },
  { title: "Portugal entrepreneur route", href: "/routes/portugal-entrepreneur", text: "Entrepreneur and independent-work readiness: evidence, funds, legalization, insurance, and arrival steps." },
  { title: "Canada IEC route", href: "/routes/canada-iec", text: "Youth mobility pools, invitation rounds, country-specific spots, documents, funds, and insurance." },
  { title: "Route expansion", href: "/route-expansion", text: "Internal-facing design workspace for deciding which route families should be added next." },
];

const actionPages = [
  { title: "Saved routes", href: "/saved-routes", text: "Save selected countries, visa routes, opportunities, scholarships, and services for later lookup." },
  { title: "Watchlist and alerts", href: "/watchlist", text: "Create opt-in alerts for routes, countries, scholarships, services, and official opportunities." },
  { title: "Timeline", href: "/timeline", text: "Track document deadlines, appointments, payment dates, result checks, travel, and arrival steps." },
  { title: "Readiness tools", href: "/readiness", text: "Check name consistency, documents, funds gaps, refusal-risk indicators, and next actions." },
  { title: "Reports", href: "/report-preview", text: "Preview route-specific readiness reports with risk notes, sources, and action steps." },
  { title: "My reports", href: "/my-reports", text: "Retrieve previously generated reports by reference, email, or phone." },
];

const supportPages = [
  { title: "Trusted services", href: "/services", text: "Request courier, legalization, translation, insurance, expert review, admission, accommodation, and settlement support." },
  { title: "Courier requests", href: "/courier", text: "Capture sensitive-document courier needs for passports, certificates, embassy files, and legalization documents." },
  { title: "Legalization", href: "/legalization", text: "Plan notarization, apostille, attestation, embassy legalization, authentication, and translation support." },
  { title: "Family planner", href: "/family-planner", text: "Prepare spouse/children documents, funds, school, accommodation, and arrival tasks." },
  { title: "Settlement", href: "/settlement", text: "Plan pickup, accommodation, SIM, bank, registration, insurance, school, and local setup." },
  { title: "Provider application", href: "/partners/apply", text: "Let service providers apply for screening before they are trusted or listed publicly." },
];

const trustAndAdminPages = [
  { title: "Trust center", href: "/trust", text: "Explains source-first guidance, no approval guarantees, user consent, and sensitive-document controls." },
  { title: "Sources", href: "/sources", text: "Review official sources, freshness, source confidence, review timing, and route versioning controls." },
  { title: "Launch readiness", href: "/launch-readiness", text: "Check product surfaces, deployment checks, provider boundaries, and public safety controls." },
  { title: "Workspace", href: "/workspace", text: "Main operating page for testing all active product areas and admin surfaces." },
  { title: "Admin", href: "/admin", text: "Review submitted requests, saved records, watchlists, service requests, and provider applications." },
];

function PageGroup({ title, intro, items }: { title: string; intro: string; items: { title: string; href: string; text?: string; summary?: string; label?: string }[] }) {
  return (
    <section className="section">
      <div className="section-heading-row">
        <div>
          <h2>{title}</h2>
          <p className="section-intro">{intro}</p>
        </div>
        <span className="status-dot">{items.length} pages</span>
      </div>
      <div className="module-preview-grid">
        {items.map((item) => (
          <a className="module-tile" href={item.href} key={item.href}>
            {item.label ? <span className="overline">{item.label}</span> : null}
            <h3>{item.title}</h3>
            <p>{item.summary || item.text}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function NavigationMapPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Navigation Map</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/decision-center">Decision Center</a>
          <a href="/workspace">Workspace</a>
          <a href="/country-comparison">Countries</a>
          <a href="/compare">Compare</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/services">Services</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Product navigation design</span>
          <h1>Every major MoveReady page in one clear map.</h1>
          <p className="lede">
            This map makes the design easier to supervise: it shows the core decision flow, route pages, user action pages, service-support pages, and trust/admin pages from one place.
          </p>
          <div className="actions">
            <a className="btn primary" href="/decision-center">Open Decision Center</a>
            <a className="btn" href="/workspace">Open Workspace</a>
            <a className="btn" href="/country-comparison">Compare countries</a>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="trust-item"><strong>Core</strong><span>Decision, country, route, and readiness flow</span></div>
        <div className="trust-item"><strong>Routes</strong><span>Country and route-family detail pages</span></div>
        <div className="trust-item"><strong>Actions</strong><span>Save, alert, report, timeline, and tools</span></div>
        <div className="trust-item"><strong>Trust</strong><span>Sources, admin, launch, and safety controls</span></div>
      </section>

      <PageGroup
        title="Primary user flow"
        intro="These pages should be the most visible part of the app because they guide users from confusion to a safe next action."
        items={primaryFlows}
      />

      <PageGroup
        title="Route and country pages"
        intro="These pages hold route-specific guidance and expansion planning for startup, work, entrepreneur, youth mobility, and official opportunity paths."
        items={routePages}
      />

      <PageGroup
        title="User action pages"
        intro="These pages turn information into progress: saved decisions, alerts, timeline records, readiness checks, and reports."
        items={actionPages}
      />

      <PageGroup
        title="Service and support pages"
        intro="These pages support monetization and practical execution while keeping provider screening and user consent clear."
        items={supportPages}
      />

      <PageGroup
        title="Trust, source, and admin pages"
        intro="These pages keep the product safe as route content, providers, alerts, and reports grow."
        items={trustAndAdminPages}
      />
    </main>
  );
}
