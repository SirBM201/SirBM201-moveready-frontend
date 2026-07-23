const mobileLinks = [
  { label: "Home", href: "/", icon: "⌂" },
  { label: "Actions", href: "/action-center", icon: "✓" },
  { label: "Applications", href: "/applications", icon: "A" },
  { label: "Alerts", href: "/application-alerts", icon: "!" },
  { label: "Account", href: "/dashboard", icon: "●" },
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
