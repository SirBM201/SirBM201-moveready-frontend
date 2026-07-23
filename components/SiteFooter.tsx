const footerGroups = [
  {
    title: "Plan",
    links: [
      { label: "Start Guide", href: "/start" },
      { label: "Guided Setup", href: "/onboarding" },
      { label: "Decision Center", href: "/decision-center" },
      { label: "Countries", href: "/country-comparison" },
      { label: "Routes", href: "/compare" },
      { label: "Route Checker", href: "/route-checker" },
    ],
  },
  {
    title: "Prepare",
    links: [
      { label: "Passport Index", href: "/passport-index" },
      { label: "Visa Power", href: "/visa-power" },
      { label: "Evidence Center", href: "/evidence-pack" },
      { label: "Study Planner", href: "/study-planner" },
      { label: "Journey Planner", href: "/journey-planner" },
      { label: "Trip Planner", href: "/trip-planner" },
    ],
  },
  {
    title: "Track",
    links: [
      { label: "Action Center", href: "/action-center" },
      { label: "Applications", href: "/applications" },
      { label: "Application Alerts", href: "/application-alerts" },
      { label: "General Alerts", href: "/watchlist" },
      { label: "Timeline", href: "/timeline" },
      { label: "Activity History", href: "/activity" },
      { label: "My Reports", href: "/my-reports" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Account", href: "/dashboard" },
      { label: "Settings and Privacy", href: "/settings" },
      { label: "Quotes and Billing", href: "/billing" },
      { label: "Support Center", href: "/support-center" },
      { label: "Services", href: "/services" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Trust", href: "/trust" },
      { label: "Source Health", href: "/source-health" },
      { label: "Sources", href: "/sources" },
      { label: "Safety", href: "/safety" },
      { label: "Privacy", href: "/privacy" },
      { label: "Data Deletion", href: "/data-deletion" },
      { label: "Provider Application", href: "/partners/apply" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Global relocation readiness platform</span>
        </a>
        <p>
          MoveReady provides source-backed readiness support. It is not a government authority, embassy, legal representative, travel-entry approval service, or visa approval guarantee service.
        </p>
      </div>

      <div className="footer-links">
        {footerGroups.map((group) => (
          <nav aria-label={group.title} key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map((link) => (
              <a href={link.href} key={link.href}>{link.label}</a>
            ))}
          </nav>
        ))}
      </div>
    </footer>
  );
}
