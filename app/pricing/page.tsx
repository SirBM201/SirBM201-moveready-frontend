import SiteHeader from "@/components/SiteHeader";

const options = [
  {
    name: "Readiness report",
    price: "Scope-based quote",
    summary: "Route-specific report covering profile summary, documents, funds, budget, risk indicators, source status, and next actions.",
    points: ["Visa, study, startup, work, family, visitor, scholarship, ballot, or trip route", "Saved report reference", "Refresh when route facts change"],
    href: "/billing?service=readiness_report",
  },
  {
    name: "Expert, document, or admission review",
    price: "Scope-based quote",
    summary: "Manual review for route evidence, refusals, funds, startup evidence, study applications, statements, scholarships, or document gaps.",
    points: ["Clear deliverables and exclusions", "Named provider where a partner is involved", "Refund terms shown before payment"],
    href: "/billing?service=expert_review",
  },
  {
    name: "Travel and relocation support",
    price: "Quote required",
    summary: "Request reviewed support for booking, courier, legalization, insurance, accommodation, transport, airport pickup, or settlement.",
    points: ["Provider screening before handoff", "Affiliate disclosure where commission may apply", "Service and platform fees shown separately"],
    href: "/billing?service=travel_booking",
  },
  {
    name: "Route monitoring",
    price: "Current in-app alerts available",
    summary: "Save routes, opportunities, countries, scholarships, or services and review source-backed alert updates in your verified account.",
    points: ["Application openings", "Closing dates", "Eligibility and source-review changes"],
    href: "/watchlist",
  },
];

export default function PricingPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Pricing and requests" />

      <section className="legal-hero">
        <span className="eyebrow">Launch pricing</span>
        <h1>Start with readiness. Review the full quote before paying.</h1>
        <p className="lede">
          MoveReady uses scope-based quotes for paid reports, reviews, and practical support. The user should see the service, provider, deliverables, exclusions, price, platform fee, expiry, and refund rule before payment.
        </p>
        <div className="actions">
          <a className="btn primary" href="/billing">Open quotes and payments</a>
          <a className="btn" href="/services">Request practical support</a>
        </div>
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
          <p>
            MoveReady does not collect payment for official lottery entry, guaranteed approval, duplicate applications, fake appointment access, unverified provider work, or undisclosed affiliate links. Acceptance of a quote is not payment. Checkout remains disabled until an approved payment process and link are configured.
          </p>
        </article>
      </section>
    </main>
  );
}
