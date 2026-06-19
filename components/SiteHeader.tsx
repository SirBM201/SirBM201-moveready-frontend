const publicNavigation = [
  { label: "Home", href: "/" },
  { label: "Decision Center", href: "/decision-center" },
  { label: "Countries", href: "/country-comparison" },
  { label: "Routes", href: "/compare" },
  { label: "Route Checker", href: "/route-checker" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "My Account", href: "/dashboard" },
];

export default function SiteHeader({ sectionLabel = "Global relocation readiness platform" }: { sectionLabel?: string }) {
  return (
    <header className="topbar">
      <a className="brand" href="/">
        <strong>Project MoveReady</strong>
        <span>{sectionLabel}</span>
      </a>
      <nav className="nav" aria-label="Main navigation">
        {publicNavigation.map((item) => (
          <a href={item.href} key={item.href}>{item.label}</a>
        ))}
      </nav>
    </header>
  );
}
