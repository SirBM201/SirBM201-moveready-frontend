import SiteHeader from "@/components/SiteHeader";

const primaryFlows = [
  {
    title: "Start guide",
    href: "/start",
    label: "New users",
    summary: "Explains the safest order: check route, check visa power, save one profile, generate a report, set alerts, then request support only when needed.",
  },
  {
    title: "Decide",
    href: "/decision-center",
    label: "Choose direction",
    summary: "Guides users from country choice to route comparison, readiness checks, alerts, trusted services, and reports.",
  },
  {
    title: "Countries",
    href: "/country-comparison",
    label: "Choose destination",
    summary: "Compare countries by route coverage, opportunity coverage, risk signals, source confidence, and next actions.",
  },
  {
    title: "Visa Power",
    href: "/visa-power",
    label: "Existing visa benefits",
    summary: "Check whether visas the user already holds can unlock easier travel, no separate visa, or simplified entry in selected destinations.",
  },
  {
    title: "Routes",
    href: "/compare",
    label: "Choose route family",
    summary: "Compare startup, D visa, entrepreneur, youth mobility, lottery, ballot, quota, and readiness routes.",
  },
  {
    title: "Check Route",
    href: "/route-checker",
    label: "Create report",
    summary: "Use the active profile to generate practical next steps: documents, funds, risk, budget, insurance, and report actions.",
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
  { title: "Account", href: "/dashboard", text: "Save one active profile and connect reports, saved routes, alerts, timeline, and support requests." },
  { title: "Visa Power", href: "/visa-power", text: "Check existing visa travel benefits, max-stay notes, conditions, source URLs, and confidence labels." },
  { title: "Saved routes", href: "/saved-routes", text: "Save selected countries, routes, opportunities, scholarships, and services for later lookup." },
  { title: "Alerts", href: "/watchlist", text: "Create opt-in alerts for routes, countries, scholarships, services, and official opportunities." },
  { title: "Timeline", href: "/timeline", text: "Track document deadlines, appointments, payment dates, result checks, travel, and arrival steps." },
  { title: "Readiness tools", href: "/readiness", text: "Check name consistency, documents, funds gaps, refusal-risk indicators, and next actions." },
  { title: "Reports", href: "/my-reports", text: "Retrieve previously generated reports by reference, email, phone, or signed-in account." },
];

const supportPages = [
  { title: "Services", href: "/services", text: "Request courier, legalization, translation, insurance, expert review, admission, accommodation, and settlement support." },
  { title: "Support requests", href: "/service-requests", text: "Review private help requests connected to the signed-in account." },
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
  { title: "Admin", href: "/admin", text: "Review submitted requests, saved records, alerts, support requests, and provider applications." },
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
      <SiteHeader sectionLabel="Navigation Map" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Product navigation design</span>
          <h1>Every major MoveReady page in one clear map.</h1>
          <p className="lede">
            This map makes the app easier to supervise: it shows the core decision flow, route pages, user action pages, support pages, and trust/admin pages from one place.
          </p>
          <div className="actions">
            <a className="btn primary" href="/start">Open Start Guide</a>
            <a className="btn" href="/visa-power">Visa Power</a>
            <a className="btn" href="/route-checker">Check Route</a>
            <a className="btn" href="/dashboard">Open Account</a>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="trust-item"><strong>Start</strong><span>Plain guide for first-time users</span></div>
        <div className="trust-item"><strong>Decide</strong><span>Country, route, and visa-power flow</span></div>
        <div className="trust-item"><strong>Act</strong><span>Save, alert, report, timeline, and support</span></div>
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
        intro="These pages turn information into progress: saved decisions, visa-benefit checks, alerts, timeline records, readiness checks, and reports."
        items={actionPages}
      />

      <PageGroup
        title="Service and support pages"
        intro="These pages support monetization and practical execution while keeping provider screening and user consent clear."
        items={supportPages}
      />

      <PageGroup
        title="Trust, source, and admin pages"
        intro="These pages keep the product safe as route content, providers, alerts, travel-benefit rules, and reports grow."
        items={trustAndAdminPages}
      />
    </main>
  );
}
