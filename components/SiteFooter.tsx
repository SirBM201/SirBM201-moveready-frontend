const footerGroups = [
  {
    title: "Plan",
    links: [
      { label: "Decision Center", href: "/decision-center" },
      { label: "Countries", href: "/country-comparison" },
      { label: "Routes", href: "/compare" },
      { label: "Route Checker", href: "/route-checker" },
    ],
  },
  {
    title: "Act",
    links: [
      { label: "Opportunities", href: "/opportunities" },
      { label: "Services", href: "/services" },
      { label: "Pricing", href: "/pricing" },
      { label: "My Account", href: "/dashboard" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Trust", href: "/trust" },
      { label: "Sources", href: "/sources" },
      { label: "Safety", href: "/safety" },
      { label: "Provider Application", href: "/partners/apply" },
      { label: "My Reports", href: "/my-reports" },
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
          MoveReady provides source-backed readiness support. It is not a government authority, embassy, legal representative, or approval guarantee service.
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
