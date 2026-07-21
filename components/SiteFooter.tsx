const footerGroups = [
  {
    title: "Plan",
    links: [
      { label: "Start Guide", href: "/start" },
      { label: "Decision Center", href: "/decision-center" },
      { label: "Countries", href: "/country-comparison" },
      { label: "Routes", href: "/compare" },
      { label: "Route Checker", href: "/route-checker" },
    ],
  },
  {
    title: "Travel Tools",
    links: [
      { label: "Passport Index", href: "/passport-index" },
      { label: "Visa Power", href: "/visa-power" },
      { label: "Opportunities", href: "/opportunities" },
      { label: "Alerts", href: "/watchlist" },
      { label: "My Reports", href: "/my-reports" },
    ],
  },
  {
    title: "Act",
    links: [
      { label: "Services", href: "/services" },
      { label: "Pricing", href: "/pricing" },
      { label: "My Account", href: "/dashboard" },
      { label: "Support Requests", href: "/service-requests" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Trust", href: "/trust" },
      { label: "Sources", href: "/sources" },
      { label: "Safety", href: "/safety" },
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
