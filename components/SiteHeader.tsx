const publicNavigation = [
  { label: "Home", href: "/", title: "Home page" },
  { label: "Start", href: "/start", title: "Start here if you are new" },
  { label: "Decide", href: "/decision-center", title: "Choose your direction" },
  { label: "Countries", href: "/country-comparison", title: "Compare countries" },
  { label: "Passport", href: "/passport-index", title: "Check what your passport can do" },
  { label: "Visa Power", href: "/visa-power", title: "Check travel benefits from visas you already hold" },
  { label: "Routes", href: "/compare", title: "Compare relocation routes" },
  { label: "Check Route", href: "/route-checker", title: "Check your route and generate a report" },
  { label: "Study", href: "/study-planner", title: "Plan admission and study visa preparation" },
  { label: "Trip", href: "/trip-planner", title: "Check trip readiness before comparing bookings" },
  { label: "Planner", href: "/journey-planner", title: "Plan documents, family, appointments, and settlement" },
  { label: "Alerts", href: "/watchlist", title: "Create and review route alerts" },
  { label: "Services", href: "/services", title: "Request trusted support" },
  { label: "Prices", href: "/pricing", title: "Pricing overview" },
  { label: "Quotes", href: "/billing", title: "Request and review commercial quotes and payment status" },
  { label: "Support", href: "/support-center", title: "Review provider handoffs and open private support cases" },
  { label: "Account", href: "/dashboard", title: "My Account" },
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
          <a href={item.href} key={item.href} title={item.title}>{item.label}</a>
        ))}
      </nav>
    </header>
  );
}
