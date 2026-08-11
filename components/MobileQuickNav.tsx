const mobileLinks = [
  { label: "Dashboard", href: "/dashboard", icon: "⌂" },
  { label: "Countries", href: "/country-comparison", icon: "◎" },
  { label: "Routes", href: "/compare", icon: "↗" },
  { label: "Jobs", href: "/jobs", icon: "▣" },
  { label: "Profile", href: "/dashboard#profiles", icon: "●" },
];

export default function MobileQuickNav() {
  return (
    <nav className="mobile-quick-nav" aria-label="Mobile quick navigation">
      {mobileLinks.map((item) => (
        <a href={item.href} key={item.href}>
          <span aria-hidden="true">{item.icon}</span>
          <strong>{item.label}</strong>
        </a>
      ))}
    </nav>
  );
}
