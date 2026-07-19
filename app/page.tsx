import SiteHeader from "@/components/SiteHeader";
import { platformModules } from "@/lib/platformModules";

const quickStart = [
  {
    title: "1. Check your route",
    href: "/route-checker",
    text: "Enter your goal, current country, target country, funds, timeline, and family count to get a starter readiness view.",
  },
  {
    title: "2. Compare options",
    href: "/compare",
    text: "Compare route families before spending money on documents, applications, bookings, or support providers.",
  },
  {
    title: "3. Save what matters",
    href: "/dashboard",
    text: "Create a profile, save routes, generate reports, track alerts, and keep your timeline in one account workspace.",
  },
];

const publicTools = [
  {
    title: "Decision Center",
    href: "/decision-center",
    text: "Choose what to do next when you are not sure whether to study, work, start a business, apply for an opportunity, or wait.",
  },
  {
    title: "Compare countries",
    href: "/country-comparison",
    text: "Review country fit, route coverage, risk signals, source confidence, and next steps side by side.",
  },
  {
    title: "Compare routes",
    href: "/compare",
    text: "Compare startup, study, work, family, visitor, scholarship, digital-nomad, and opportunity pathways.",
  },
  {
    title: "Route checker",
    href: "/route-checker",
    text: "Generate a starter readiness result before committing time, money, or sensitive documents.",
  },
  {
    title: "Opportunities",
    href: "/opportunities",
    text: "Track official ballots, quota routes, scholarships, and application windows with source-safety notes.",
  },
  {
    title: "Services",
    href: "/services",
    text: "Request document review, courier, legalization, insurance, translation, accommodation, pickup, or settlement support.",
  },
  {
    title: "My Account",
    href: "/dashboard",
    text: "Keep your profile, saved routes, watchlist alerts, timeline, reports, and service requests connected.",
  },
  {
    title: "My reports",
    href: "/my-reports",
    text: "Find readiness reports by signed-in account, report reference, email, or phone.",
  },
  {
    title: "Trust and safety",
    href: "/trust",
    text: "Understand the advisory limits, source-first approach, privacy controls, and consent rules.",
  },
];

const trustItems = [
  { value: "Source-first", label: "Guidance stays tied to official route data" },
  { value: "Transparent", label: "Reports show risk and source status" },
  { value: "Consent-first", label: "Alerts and support requests require opt-in" },
  { value: "No guarantees", label: "MoveReady never promises approval or selection" },
];

const availabilityLabel = {
  available: "Available",
  coming_soon: "Coming soon",
  partner_approval_pending: "Partner approval pending",
};

export default function Home() {
  const previewModules = platformModules.slice(0, 6);

  return (
    <main className="page-shell">
      <SiteHeader />

      <section className="hero-band" id="checker">
        <div className="hero-copy">
          <span className="eyebrow">Relocation readiness workspace</span>
          <h1>Choose your route, then get ready properly.</h1>
          <p className="lede">
            MoveReady helps you compare relocation pathways, understand document and funds pressure, create a practical timeline, monitor important changes, and request trusted support when you need it.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Start route checker</a>
            <a className="btn" href="/dashboard">Open My Account</a>
            <a className="btn" href="/compare">Compare routes</a>
            <a className="btn" href="/country-comparison">Compare countries</a>
            <a className="btn" href="/services">Request support</a>
          </div>
        </div>

        <aside className="workflow-panel" aria-label="MoveReady quick start">
          <h2>How to use MoveReady</h2>
          <div className="mini-list">
            <div><strong>Start with your route</strong><span>Use the route checker or compare pages to understand realistic options.</span></div>
            <div><strong>Save your profile</strong><span>Use My Account so reports, saved routes, alerts, and service requests stay connected.</span></div>
            <div><strong>Act from the report</strong><span>Follow document, funds, timeline, and risk actions before spending money.</span></div>
          </div>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Generate starter plan</a>
            <a className="btn" href="/start">Open start guide</a>
          </div>
        </aside>
      </section>

      <section className="trust-strip" id="trust">
        {trustItems.map((item) => (
          <div className="trust-item" key={item.value}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="section no-top-pad" id="quick-start">
        <div className="section-heading-row">
          <div>
            <p className="overline">Start here</p>
            <h2>Three steps for every user</h2>
            <p className="section-intro">
              The app is designed to keep users from jumping straight into payments, bookings, or service requests without first understanding route fit, risk, documents, funds, and timing.
            </p>
          </div>
          <span className="status-dot">Guided flow</span>
        </div>
        <div className="grid">
          {quickStart.map((route) => (
            <a className="card" href={route.href} key={route.title}>
              <h3>{route.title}</h3>
              <p>{route.text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="tools">
        <h2>Main tools</h2>
        <p className="section-intro">
          Start with the tools below. They guide a user from route discovery to account records, reports, alerts, timelines, and support requests.
        </p>
        <div className="grid">
          {publicTools.map((route) => (
            <a className="card" href={route.href} key={route.title}>
              <h3>{route.title}</h3>
              <p>{route.text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="platform-map">
        <div className="section-heading-row">
          <div>
            <h2>MoveReady service areas</h2>
            <p className="section-intro">
              Service areas are grouped so users can move from route choice to alerts, documents, funds, trusted support, and settlement inside one clear platform.
            </p>
          </div>
          <div className="actions">
            <a className="btn primary" href="/services">Request support</a>
            <a className="btn" href="/dashboard">My Account</a>
          </div>
        </div>
        <div className="module-preview-grid">
          {previewModules.map((module) => (
            <a className="module-tile" href={module.href} key={module.slug}>
              <span className="overline">{module.category}</span>
              <h3>{module.title}</h3>
              <p>{module.summary}</p>
              <span className={`badge module-status ${module.availability}`}>{availabilityLabel[module.availability]}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="report">
        <h2>What a readiness report gives you</h2>
        <p className="section-intro">
          Each report should preserve the route context, risk level, source status, document gaps, funds pressure, and next actions used when the report was generated.
        </p>
        <article className="card">
          <h3>Typical report sections</h3>
          <div className="badge-row">
            <span className="badge">Route summary</span>
            <span className="badge">Eligibility notes</span>
            <span className="badge">Document checklist</span>
            <span className="badge">Proof of funds</span>
            <span className="badge">Budget estimate</span>
            <span className="badge">Insurance notes</span>
            <span className="badge">Timeline events</span>
            <span className="badge">Service requests</span>
            <span className="badge">Source freshness</span>
          </div>
        </article>
      </section>
    </main>
  );
}
