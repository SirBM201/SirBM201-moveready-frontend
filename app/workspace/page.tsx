import SiteHeader from "@/components/SiteHeader";

const workflows = [
  {
    title: "Start guide",
    status: "Available",
    href: "/start",
    summary: "Plain-language order for users who do not know where to begin.",
  },
  {
    title: "Account profile",
    status: "Available",
    href: "/dashboard",
    summary: "Save one active profile and connect reports, saved routes, alerts, timeline, Visa Power checks, and support requests.",
  },
  {
    title: "Route readiness",
    status: "Available",
    href: "/route-checker",
    summary: "Generate checklist, budget estimate, risk label, and readiness report from route inputs.",
  },
  {
    title: "Passport Index",
    status: "Available",
    href: "/passport-index",
    summary: "Check passport-only travel access categories, validity notes, renewal notes, and source status.",
  },
  {
    title: "Visa Power",
    status: "Available",
    href: "/visa-power",
    summary: "Check whether valid existing visas may create extra third-country travel benefits, subject to official rules.",
  },
  {
    title: "Route comparison",
    status: "Available",
    href: "/compare",
    summary: "Compare Estonia startup, Finland D visa, Portugal entrepreneur, official opportunities, and readiness routes before committing.",
  },
  {
    title: "Country comparison",
    status: "Available",
    href: "/country-checker",
    summary: "Review supported countries, route records, opportunity coverage, risk signals, and source confidence.",
  },
  {
    title: "Estonia startup route",
    status: "Available",
    href: "/routes/estonia-startup",
    summary: "Open the Estonia founder route workspace with facts, documents, budget, and report action.",
  },
  {
    title: "Finland D visa route",
    status: "Available",
    href: "/routes/finland-d-visa",
    summary: "Use the Migri-backed D visa route page with live database detail after source records are active.",
  },
  {
    title: "Portugal entrepreneur route",
    status: "Available",
    href: "/routes/portugal-entrepreneur",
    summary: "Prepare Portugal independent-work, entrepreneur, business evidence, funds, document, and insurance readiness.",
  },
  {
    title: "Startup evidence pack",
    status: "Available",
    href: "/startup-evidence",
    summary: "Organize founder profile, startup proof, traction, country fit, funds, and submission-readiness review.",
  },
  {
    title: "Official opportunities",
    status: "Available",
    href: "/opportunities",
    summary: "Track lottery, ballot, and invitation-pool opportunities with scam-safe guidance.",
  },
  {
    title: "Watchlist alerts",
    status: "Available",
    href: "/watchlist",
    summary: "Save opt-in alert requests for routes, opportunities, scholarships, countries, and services.",
  },
  {
    title: "Saved routes",
    status: "Available",
    href: "/saved-routes",
    summary: "Save route decisions and retrieve them by email or phone.",
  },
  {
    title: "Application timeline",
    status: "Available",
    href: "/timeline",
    summary: "Store document, appointment, application, payment, travel, and arrival reminders.",
  },
  {
    title: "Trusted services",
    status: "Available",
    href: "/services",
    summary: "Capture requests for courier, documents, insurance, translation, accommodation, and settlement help.",
  },
  {
    title: "Courier requests",
    status: "Available",
    href: "/courier",
    summary: "Capture passport, certificate, embassy, notarization, legalization, and sensitive-document courier needs.",
  },
  {
    title: "Document legalization",
    status: "Available",
    href: "/legalization",
    summary: "Capture notarization, apostille, attestation, embassy legalization, authentication, and translation needs.",
  },
  {
    title: "Family planner",
    status: "Available",
    href: "/family-planner",
    summary: "Plan spouse, children, extra documents, extra funds, school, accommodation, and arrival tasks.",
  },
  {
    title: "Settlement support",
    status: "Available",
    href: "/settlement",
    summary: "Capture airport pickup, accommodation, SIM, bank, registration, insurance, school, and local setup requests.",
  },
  {
    title: "Provider directory",
    status: "Partner approval pending",
    href: "/providers",
    summary: "Keep public provider listing controlled until screening and approval are complete.",
  },
  {
    title: "Provider applications",
    status: "Available",
    href: "/partners/apply",
    summary: "Let couriers, insurers, reviewers, translators, and relocation providers apply for review.",
  },
  {
    title: "My reports",
    status: "Available",
    href: "/my-reports",
    summary: "Retrieve saved readiness reports by reference, email, or phone.",
  },
  {
    title: "Source review",
    status: "Available",
    href: "/sources",
    summary: "Review source-backed guidance, last verified dates, risk labels, and route versioning controls.",
  },
  {
    title: "Launch readiness",
    status: "Available",
    href: "/launch-readiness",
    summary: "Check product surfaces, deployment checks, provider boundaries, and public safety rules.",
  },
  {
    title: "Admin review",
    status: "Available",
    href: "/admin",
    summary: "Review submitted requests, saved records, readiness checks, watchlists, and provider applications.",
  },
];

const controls = [
  "Reviewed source data before sensitive route claims",
  "No approval guarantees or success promises",
  "Contact only after user consent",
  "Provider review before public handoff",
  "Official links for lottery and ballot submissions",
  "Passport and Visa Power results marked as advisory",
  "Report and saved-route records preserved for lookup",
];

export default function WorkspacePage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Workspace" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Launch workspace</span>
          <h1>Operate the full MoveReady product from one place.</h1>
          <p className="lede">
            This page links the active user flows, admin surfaces, trust controls, and route pages without exposing internal roadmap language.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Start route check</a>
            <a className="btn" href="/passport-index">Passport Index</a>
            <a className="btn" href="/visa-power">Visa Power</a>
            <a className="btn" href="/compare">Compare routes</a>
            <a className="btn" href="/watchlist">Create watchlist</a>
            <a className="btn" href="/services">Request service</a>
            <a className="btn" href="/admin">Open admin</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <h2>Product Areas</h2>
            <p className="section-intro">Each area is accessible for launch testing. Partner handoffs and external API delivery remain controlled by review and approval.</p>
          </div>
          <span className="status-dot">Ready for testing</span>
        </div>
        <div className="module-preview-grid">
          {workflows.map((item) => (
            <a className="module-tile" href={item.href} key={item.title}>
              <div className="badge-row">
                <span className="badge module-status available">{item.status}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>Safety Controls</h2>
            <p className="section-intro">These controls should remain visible across policy, service, and admin decisions.</p>
          </div>
          <a className="btn" href="/safety">Safety page</a>
        </div>
        <div className="grid">
          {controls.map((item) => (
            <article className="card" key={item}>
              <h3>{item}</h3>
              <p>Keep this behavior consistent before adding more country routes or approved service partners.</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
