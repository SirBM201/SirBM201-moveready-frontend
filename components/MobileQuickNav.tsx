"use client";

import { usePathname } from "next/navigation";

const mobileLinks = [
  { label: "Find", href: "/find", icon: "◎" },
  { label: "Qualify", href: "/qualify", icon: "✓" },
  { label: "Move", href: "/move", icon: "→" },
  { label: "Alerts", href: "/alerts", icon: "!" },
  { label: "Account", href: "/dashboard", icon: "●" },
];

export default function MobileQuickNav() {
  const pathname = usePathname();
  return (
    <nav className="mobile-quick-nav" aria-label="Phone journey navigation">
      {mobileLinks.map((item) => (
        <a
          href={item.href}
          key={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
        >
          <span aria-hidden="true">{item.icon}</span>
          <strong>{item.label}</strong>
        </a>
      ))}
    </nav>
  );
}
