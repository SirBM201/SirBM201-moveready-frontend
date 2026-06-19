import SiteHeader from "@/components/SiteHeader";

const options = [
  {
    name: "Readiness report",
    price: "Request pricing",
    summary: "Route-specific report covering profile summary, documents, funds, budget, risk indicators, source status, and next actions.",
    points: ["Visa, study, startup, work, family, visitor, scholarship, or ballot route", "Saved report reference", "Refresh when route facts change"],
    href: "/route-checker",
  },
  {
    name: "Route monitoring",
    price: "Request pricing",
    summary: "Save routes, opportunities, countries, scholarships, or services and choose alert preferences for important updates.",
    points: ["Application openings", "Closing dates", "Eligibility and source-review changes"],
    href: "/watchlist",
  },
  {
    name: "Trusted service support",
    price: "Quote required",
    summary: "Request human follow-up for courier, legalization, insurance, translation, expert review, admission, accommodation, pickup, or settlement support.",
    points: ["Provider screening before handoff", "Sensitive-document handling rules", "Service-specific quote before payment"],
    href: "/services",
  },
];

export default function PricingPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Pricing and requests" />

      <section className="legal-hero">
        <span className="eyebrow">Launch pricing</span>
        <h1>Start with readiness. Pay only when the service is clear.</h1>
        <p className="lede">MoveReady can support reports, monitoring, and trusted services. Paid handoff should always show scope, provider, price, refund rule, and source status before payment.</p>
      </section>

      <section className="section no-top-pad">
        <div className="grid">
          {options.map((option) => (
            <article className="card" key={option.name}>
              <span className="overline">{option.price}</span>
              <h3>{option.name}</h3>
              <p>{option.summary}</p>
              <div className="mini-list">
                {option.points.map((point) => (
                  <div key={point}><strong>{point}</strong></div>
                ))}
              </div>
              <div className="actions"><a className="btn primary" href={option.href}>Continue</a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <article className="card trust-callout">
          <h3>Payment rule</h3>
          <p>MoveReady should not collect payment for official lottery entry, guaranteed approval, duplicate applications, fake appointment access, or unverified provider work. Service payments should be tied to a clear requested service and handled only after the user confirms scope.</p>
        </article>
      </section>
    </main>
  );
}
