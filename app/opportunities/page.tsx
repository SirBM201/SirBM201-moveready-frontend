import LiveOpportunities from "@/components/LiveOpportunities";

const opportunityGuides = [
  {
    title: "USA Diversity Visa Program",
    href: "/opportunities/usa-dv",
    text: "Prepare safely for DV entry, confirmation-number storage, result checks, scam warnings, and follow-up documents.",
  },
  {
    title: "Canada International Experience Canada",
    href: "/opportunities/canada-iec",
    text: "Track IEC pools, invitation rounds, country eligibility, category fit, deadlines, funds, and insurance readiness.",
  },
  {
    title: "Australia Work and Holiday 462 ballot",
    href: "/opportunities/australia-462-ballot",
    text: "Monitor subclass 462 ballot windows for China, India, and Vietnam first-visa applicants and prepare evidence if selected.",
  },
  {
    title: "UK India Young Professionals Scheme",
    href: "/opportunities/uk-india-young-professionals",
    text: "Track ballot windows, eligibility, savings evidence, selection limits, and application deadlines for eligible Indian citizens.",
  },
  {
    title: "New Zealand quota ballots",
    href: "/opportunities/new-zealand-quota-ballots",
    text: "Monitor Pacific Access Category and Samoan Quota ballot results, family evidence, and residence application readiness.",
  },
  {
    title: "Japan Working Holiday Programme",
    href: "/opportunities/japan-working-holiday",
    text: "Check partner-country eligibility, embassy instructions, quota timing, funds, insurance, and holiday-first purpose rules.",
  },
  {
    title: "Korea Working Holiday Visa",
    href: "/opportunities/korea-working-holiday",
    text: "Prepare for nationality-specific eligibility, quotas, funds, insurance, arrival registration, and working-holiday conditions.",
  },
  {
    title: "Hong Kong Working Holiday Scheme",
    href: "/opportunities/hong-kong-working-holiday",
    text: "Track participating countries, annual quotas, first-come quota risk, funds, insurance, and application-status steps.",
  },
  {
    title: "Ireland Working Holiday Authorisation",
    href: "/opportunities/ireland-working-holiday",
    text: "Confirm citizenship-specific authorisation rules, funds, insurance, arrival registration, and safe timing before travel.",
  },
];

export default function OpportunitiesPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Official ballots and quota opportunities</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/country-checker">Countries</a>
          <a href="/platform">Services</a>
          <a href="/report-preview">Report</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Official-source opportunity monitoring</span>
          <h1>Track visa lotteries, ballots, invitation pools, and quota routes safely.</h1>
          <p className="lede">
            MoveReady lists limited opportunity routes with official links, source confidence, application-window notes, and scam-safe reminders. Use this as a monitoring guide, not a promise of selection or approval.
          </p>
          <div className="actions">
            <a className="btn primary" href="/watchlist?type=opportunity">Create opportunity alert</a>
            <a className="btn" href="/route-checker">Check your route</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <h2>Opportunity route guides</h2>
        <p className="section-intro">Use these guide pages to understand the route before saving alerts or preparing documents.</p>
        <div className="grid">
          {opportunityGuides.map((guide) => (
            <a className="card" href={guide.href} key={guide.href}>
              <h3>{guide.title}</h3>
              <p>{guide.text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <LiveOpportunities />
      </section>
    </main>
  );
}
