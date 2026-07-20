const publicNavigation = [
  { label: "Home", href: "/" },
  { label: "Start Here", href: "/start" },
  { label: "Decision Center", href: "/decision-center" },
  { label: "Countries", href: "/country-comparison" },
  { label: "Routes", href: "/compare" },
  { label: "Route Checker", href: "/route-checker" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "My Account", href: "/dashboard" },
];

type SiteHeaderProps = {
  sectionLabel?: string;
  subtitle?: string;
};

export default function SiteHeader({ sectionLabel = "Global relocation readiness platform", subtitle }: SiteHeaderProps) {
  const label = subtitle || sectionLabel;

  return (
    <header className="topbar">
      <a className="brand" href="/">
        <strong>Project MoveReady</strong>
        <span>{label}</span>
      </a>
      <nav className="nav" aria-label="Main navigation">
        {publicNavigation.map((item) => (
          <a href={item.href} key={item.href}>{item.label}</a>
        ))}
      </nav>
    </header>
  );
}
