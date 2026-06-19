import SiteHeader from "@/components/SiteHeader";
import GeneralServiceRequestForm from "@/components/GeneralServiceRequestForm";

const services = [
  ["Courier", "Passport, certificate, embassy, notarization, and sensitive-document delivery requests."],
  ["Legalization", "Notarization, apostille, attestation, translation, and embassy legalization support."],
  ["Insurance", "Travel, health, student, family, Schengen-style, and work-route insurance requests."],
  ["Expert review", "Route evidence, refusal-risk, proof-of-funds, scholarship, and startup-route review requests."],
  ["Arrival support", "Accommodation, airport pickup, SIM, bank, local registration, and first-arrival settlement support."],
  ["Admission support", "Scholarship, study-abroad, SOP, application, and school-document support."],
];

const handoffRules = [
  {
    title: "Admin review first",
    detail: "Service requests should be reviewed before any provider receives user details or sensitive context.",
  },
  {
    title: "Consent before contact",
    detail: "MoveReady should only contact users or share request context after explicit consent is captured.",
  },
  {
    title: "No shortcut promise",
    detail: "Providers can support preparation and execution, but the page must not imply visa, admission, job, lottery, or ballot approval.",
  },
];

export default function ServicesPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Trusted services" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Account Center: service requests</span>
          <h1>Request practical support without turning MoveReady into a shortcut platform.</h1>
          <p className="lede">
            MoveReady can capture service needs now and route them for admin review. Provider handoff only happens after the relevant partner, source, and consent checks are in place.
          </p>
          <div className="actions">
            <a className="btn primary" href="#request-service">Request a service</a>
            <a className="btn" href="/partners/apply">Apply as provider</a>
            <a className="btn" href="/dashboard">Back to Account Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <p className="overline">Service categories</p>
            <h2>Support areas MoveReady can capture</h2>
            <p className="section-intro">
              In the full account system, service requests should connect to the user profile, saved route, report, and timeline so providers receive only the context the user has agreed to share.
            </p>
          </div>
          <span className="status-dot">Provider screening</span>
        </div>
        <div className="service-strip">
          {services.map(([title, text]) => (
            <article className="service-strip-item" key={title}>
              <span className="overline">Service</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Trusted handoff rules</p>
            <h2>Protect users before provider handoff</h2>
            <p className="section-intro">
              Services can become a strong commercial layer, but trust is the product. Requests should stay private, consent-based, and clearly advisory.
            </p>
          </div>
          <span className="status-dot">Consent required</span>
        </div>
        <div className="grid">
          {handoffRules.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="request-service">
        <GeneralServiceRequestForm />
      </section>
    </main>
  );
}
