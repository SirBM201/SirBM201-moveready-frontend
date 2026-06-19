const publicNavigation = [
  {
    label: "Home",
    href: "/",
    purpose: "Landing page and first explanation of what MoveReady does.",
  },
  {
    label: "Decision Center",
    href: "/decision-center",
    purpose: "Best guided starting point for users who do not know which country or route to choose.",
  },
  {
    label: "Countries",
    href: "/country-comparison",
    purpose: "Compare destination countries by route coverage, opportunity coverage, risk, and source confidence.",
  },
  {
    label: "Routes",
    href: "/compare",
    purpose: "Compare startup, D visa, entrepreneur, study, work, family, lottery, ballot, quota, and youth-mobility route families.",
  },
  {
    label: "Route Checker",
    href: "/route-checker",
    purpose: "Turn a selected route into documents, budget, funds, insurance, risks, and next actions.",
  },
  {
    label: "Opportunities",
    href: "/opportunities",
    purpose: "Browse official lotteries, ballots, quotas, youth-mobility openings, and scholarship-style opportunities safely.",
  },
  {
    label: "Services",
    href: "/services",
    purpose: "Request trusted support for courier, legalization, insurance, expert review, admission, accommodation, and settlement.",
  },
  {
    label: "Pricing",
    href: "/pricing",
    purpose: "Explain report, monitoring, and service-request pricing without promising approval.",
  },
  {
    label: "My Account",
    href: "/dashboard",
    purpose: "User area for saved routes, reports, watchlists, timeline events, and service requests after login is ready.",
  },
];

const secondaryFooterLinks = [
  { label: "Trust", href: "/trust", purpose: "Public trust and safety rules." },
  { label: "Sources", href: "/sources", purpose: "Source confidence, freshness, and official-source review." },
  { label: "Safety", href: "/safety", purpose: "No guarantees, no fake shortcuts, no unsafe provider handoff." },
  { label: "Provider application", href: "/partners/apply", purpose: "Allow service providers to apply for screening." },
  { label: "My reports", href: "/my-reports", purpose: "Retrieve saved reports by reference, email, or phone." },
];

const groupedUserMenu = [
  {
    group: "Plan",
    items: ["Decision Center", "Countries", "Routes", "Route Checker"],
    note: "This is the main user journey from confusion to route readiness.",
  },
  {
    group: "Track",
    items: ["Saved Routes", "Watchlist", "Timeline", "My Reports"],
    note: "These pages become stronger after login/account is added.",
  },
  {
    group: "Get Help",
    items: ["Services", "Courier", "Legalization", "Family Planner", "Settlement"],
    note: "These pages create practical service requests and future revenue.",
  },
  {
    group: "Trust",
    items: ["Trust", "Sources", "Safety", "Pricing"],
    note: "These keep the brand credible and reduce scam-agent perception.",
  },
];

const internalOnlyPages = [
  {
    label: "Workspace",
    href: "/workspace",
    reason: "Good for development and full product testing, but too broad for normal users.",
  },
  {
    label: "Navigation Map",
    href: "/navigation-map",
    reason: "Useful for supervision and design review, not needed in public main navigation.",
  },
  {
    label: "Final Navigation",
    href: "/final-navigation",
    reason: "This page is a planning/control page for menu decisions.",
  },
  {
    label: "Revenue Model",
    href: "/revenue-model",
    reason: "Business planning page; public users should see Pricing, not internal revenue strategy.",
  },
  {
    label: "Route Expansion",
    href: "/route-expansion",
    reason: "Admin/source-growth planning page for deciding which routes to add next.",
  },
  {
    label: "Launch Readiness",
    href: "/launch-readiness",
    reason: "Internal pre-launch control page.",
  },
  {
    label: "Admin",
    href: "/admin",
    reason: "Admin-only operations, not public navigation.",
  },
];

const routeDetailPolicy = [
  "Route detail pages should not all appear in the main menu.",
  "Important route pages should be reachable through Countries, Routes, Opportunities, and Decision Center.",
  "Examples like Estonia, Finland, Portugal, and Canada can be featured on the homepage only while they are priority launch routes.",
  "As route count grows, route pages should be discovered through filters and search instead of top navigation.",
];

const implementationSteps = [
  {
    title: "Shorten top navigation",
    text: "Replace crowded menus with Home, Decision Center, Countries, Routes, Route Checker, Opportunities, Services, Pricing, and My Account.",
  },
  {
    title: "Move internal pages away from public menu",
    text: "Keep Workspace, Navigation Map, Revenue Model, Route Expansion, Launch Readiness, and Admin accessible only through internal/admin paths.",
  },
  {
    title: "Use footer for trust links",
    text: "Put Trust, Sources, Safety, Provider Application, and My Reports in footer or secondary menu.",
  },
  {
    title: "Group action pages after login",
    text: "Saved Routes, Watchlist, Timeline, and My Reports should sit inside My Account once account/login is ready.",
  },
  {
    title: "Keep route pages searchable",
    text: "Do not add every country route to the header. Route pages should live behind comparison, country, and opportunity tools.",
  },
];

export default function FinalNavigationPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Final Navigation</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/decision-center">Decision Center</a>
          <a href="/country-comparison">Countries</a>
          <a href="/compare">Routes</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/services">Services</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Clean public menu plan</span>
          <h1>Keep the app powerful, but make the menu simple.</h1>
          <p className="lede">
            MoveReady can have many pages behind the scenes, but public users should see one clean journey: decide, compare, check readiness, track updates, and request help.
          </p>
          <div className="actions">
            <a className="btn primary" href="/decision-center">Open Decision Center</a>
            <a className="btn" href="/navigation-map">View full page map</a>
            <a className="btn" href="/workspace">Open workspace</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <h2>Recommended public top navigation</h2>
            <p className="section-intro">
              This is the menu normal users should see. It is short enough to understand and broad enough to cover the whole product.
            </p>
          </div>
          <span className="status-dot">9 main links</span>
        </div>
        <div className="module-preview-grid">
          {publicNavigation.map((item) => (
            <a className="module-tile" href={item.href} key={item.label}>
              <span className="overline">Public menu</span>
              <h3>{item.label}</h3>
              <p>{item.purpose}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>Secondary/footer links</h2>
            <p className="section-intro">
              These pages are important, but they do not need to compete with the main user journey in the top header.
            </p>
          </div>
          <span className="status-dot">Footer / secondary</span>
        </div>
        <div className="grid">
          {secondaryFooterLinks.map((item) => (
            <a className="card" href={item.href} key={item.label}>
              <h3>{item.label}</h3>
              <p>{item.purpose}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>Grouped user menu after login</h2>
            <p className="section-intro">
              When account/login is added, these groups can become the sidebar or dashboard structure.
            </p>
          </div>
          <a className="btn" href="/dashboard">Dashboard</a>
        </div>
        <div className="grid">
          {groupedUserMenu.map((group) => (
            <article className="card" key={group.group}>
              <span className="overline">{group.group}</span>
              <h3>{group.items.join(" · ")}</h3>
              <p>{group.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>Internal/admin pages</h2>
            <p className="section-intro">
              These should remain available for you and admins, but they should not crowd the public navigation.
            </p>
          </div>
          <span className="status-dot">Hide from public header</span>
        </div>
        <div className="module-preview-grid">
          {internalOnlyPages.map((item) => (
            <a className="module-tile" href={item.href} key={item.label}>
              <span className="overline">Internal</span>
              <h3>{item.label}</h3>
              <p>{item.reason}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>Route detail page policy</h2>
            <p className="section-intro">
              This prevents the app from becoming crowded as more countries and routes are added.
            </p>
          </div>
          <a className="btn" href="/compare">Compare routes</a>
        </div>
        <div className="mini-list two-col-list">
          {routeDetailPolicy.map((rule) => (
            <div key={rule}>
              <strong>{rule}</strong>
              <span>Use this rule when deciding whether a route deserves a top-menu link.</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <h2>Implementation steps</h2>
            <p className="section-intro">
              These are the exact next design tasks before the public navigation is considered clean.
            </p>
          </div>
          <span className="status-dot">Next batch</span>
        </div>
        <div className="mini-list two-col-list">
          {implementationSteps.map((step) => (
            <div key={step.title}>
              <strong>{step.title}</strong>
              <span>{step.text}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
