import ServiceHandoffWorkspace from "@/components/ServiceHandoffWorkspace";
import SiteHeader from "@/components/SiteHeader";

const supportRules = [
  {
    title: "Exact-field consent",
    detail: "MoveReady must name the provider and list every field before sharing. Consent does not cover unlisted data, documents, or unrelated providers.",
  },
  {
    title: "Delivery must be auditable",
    detail: "Admin must retain the delivery channel and reference before a handoff is marked shared.",
  },
  {
    title: "Private resolution path",
    detail: "Complaints, refunds, payment disputes, provider issues, privacy concerns, service quality, and technical cases stay inside the verified account workflow.",
  },
];

export default function SupportCenterPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Private Support Center" />

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Consent, handoff, and resolution</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                Control what MoveReady shares and track problems privately.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                Review pending provider handoffs, authorize only the exact listed fields, decline unwanted handoffs, and open private cases for complaints, refunds, disputes, privacy, provider, service-quality, or technical issues.
              </p>
            </div>
            <span className="status-dot">Verified account only</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#support-workspace">Open Support Center</a>
            <a className="btn" href="/billing">Quotes and payments</a>
            <a className="btn" href="/service-requests">Support requests</a>
            <a className="btn" href="/dashboard">Back to Account</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="support-workspace">
        <ServiceHandoffWorkspace />
      </section>

      <section className="section">
        <div className="grid">
          {supportRules.map((rule) => (
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
