const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Route checker", href: "/route-checker" },
      { label: "Opportunities", href: "/opportunities" },
      { label: "Watchlist", href: "/watchlist" },
      { label: "Services", href: "/services" },
    ],
  },
  {
    title: "Readiness",
    links: [
      { label: "Saved routes", href: "/saved-routes" },
      { label: "Timeline", href: "/timeline" },
      { label: "Readiness tools", href: "/readiness" },
      { label: "My reports", href: "/my-reports" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Safety rules", href: "/safety" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Provider apply", href: "/partners/apply" },
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
