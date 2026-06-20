import SiteHeader from "@/components/SiteHeader";
import ServiceRequestsLookup from "@/components/ServiceRequestsLookup";

const trustRules = [
  {
    title: "Admin review first",
    detail: "A request can be saved immediately, but provider handoff should wait until an admin confirms the user need, route context, and request quality.",
  },
  {
    title: "Consent before contact",
    detail: "MoveReady should only contact the user or share request context after explicit consent is captured and stored.",
  },
  {
    title: "No shortcut promise",
    detail: "Service providers can support preparation and execution, but MoveReady must not imply approval, selection, admission, or job success.",
  },
];

export default function ServiceRequestsPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Service requests" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Account Center: service requests</span>
          <h1>Track trusted-support requests without turning MoveReady into a shortcut platform.</h1>
          <p className="lede">
            My Service Requests connects user support needs to the verified account, while keeping provider handoff private, consent-based, and subject to admin review.
          </p>
          <div className="actions">
            <a className="btn primary" href="#my-service-requests">Load my requests</a>
            <a className="btn" href="/services#request-service">Create new request</a>
            <a className="btn" href="/dashboard">Back to Account Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <p className="overline">Handoff controls</p>
            <h2>Trusted support should stay private and reviewed.</h2>
            <p className="section-intro">
              Service requests become commercially useful only when they protect the user. The MVP should capture requests, keep them linked to the account, and hold them for review before any provider receives context.
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

      <section className="section" id="my-service-requests">
        <ServiceRequestsLookup />
      </section>
    </main>
  );
}
