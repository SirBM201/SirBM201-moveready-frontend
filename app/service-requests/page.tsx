import SiteHeader from "@/components/SiteHeader";
import ServiceRequestsLookup from "@/components/ServiceRequestsLookup";

const trustRules = [
  {
    title: "We review first",
    detail: "Your request can be saved immediately, but MoveReady should review it before any provider receives details.",
  },
  {
    title: "You stay in control",
    detail: "MoveReady should only contact you or share your request after consent is captured and stored.",
  },
  {
    title: "No shortcut promise",
    detail: "Support can help you prepare, but it cannot guarantee approval, selection, admission, appointment, or job success.",
  },
];

export default function ServiceRequestsPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Support requests" />

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Support requests</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                Track the help you asked MoveReady for.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                Load your private support requests or create a new one. Support is reviewed first and does not promise approval.
              </p>
            </div>
            <span className="status-dot">Private</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#my-service-requests">Load my requests</a>
            <a className="btn" href="/services#request-service">Create new request</a>
            <a className="btn" href="/dashboard">Back to Account</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="my-service-requests">
        <ServiceRequestsLookup />
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Safety rules</p>
            <h2>Support should stay private and reviewed.</h2>
            <p className="section-intro">
              MoveReady should capture your request, keep it linked to your account, and hold it for review before anyone outside MoveReady receives the details.
            </p>
          </div>
          <span className="status-dot">Consent first</span>
        </div>
        <div className="grid">
          {trustRules.map((rule) => (
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
