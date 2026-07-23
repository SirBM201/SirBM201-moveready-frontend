import BillingWorkspace from "@/components/BillingWorkspace";
import SiteHeader from "@/components/SiteHeader";

const billingRules = [
  {
    title: "Scope before money",
    detail: "The quote must identify the exact service, deliverables, exclusions, provider, service amount, MoveReady fee, total, validity period, and refund terms.",
  },
  {
    title: "Acceptance is not payment",
    detail: "A user can accept a quote without money being collected. Checkout remains a separate, controlled action.",
  },
  {
    title: "No outcome guarantee",
    detail: "A quote or payment cannot guarantee visa, admission, scholarship, employment, booking inventory, boarding, entry, selection, approval, refund, or provider performance.",
  },
];

export default function BillingPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Quotes and payments" />

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Commercial transparency</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                See the full scope and terms before paying.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                Request a service-specific quote, review it from your verified account, accept or decline it, and use a payment link only after checkout is explicitly enabled.
              </p>
            </div>
            <span className="status-dot">Consent and scope first</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#billing-workspace">Open billing workspace</a>
            <a className="btn" href="/pricing">Pricing overview</a>
            <a className="btn" href="/service-requests">Support requests</a>
            <a className="btn" href="/dashboard">Back to Account</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="billing-workspace">
        <BillingWorkspace />
      </section>

      <section className="section">
        <div className="grid">
          {billingRules.map((rule) => (
            <article className="card" key={rule.title}>
              <h3>{rule.title}</h3>
              <p>{rule.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
