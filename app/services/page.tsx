import GeneralServiceRequestForm from "@/components/GeneralServiceRequestForm";

const services = [
  ["Courier", "Passport, certificate, embassy, notarization, and sensitive-document delivery requests."],
  ["Legalization", "Notarization, apostille, attestation, translation, and embassy legalization support."],
  ["Insurance", "Travel, health, student, family, Schengen-style, and work-route insurance requests."],
  ["Expert review", "Route evidence, refusal-risk, proof-of-funds, scholarship, and startup-route review requests."],
  ["Arrival support", "Accommodation, airport pickup, SIM, bank, local registration, and first-arrival settlement support."],
  ["Admission support", "Scholarship, study-abroad, SOP, application, and school-document support."],
];

export default function ServicesPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Trusted services</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/platform">Platform</a>
          <a href="/opportunities">Opportunities</a>
          <a href="/saved-routes">Saved Routes</a>
          <a href="/timeline">Timeline</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/partners/apply">Provider Apply</a>
          <a href="/route-checker">Route Checker</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Trusted service requests</span>
          <h1>Request practical support for documents, travel readiness, and relocation execution.</h1>
          <p className="lede">
            MoveReady can capture service needs now and route them for admin review. Provider handoff only happens after the relevant partner, source, and consent checks are in place.
          </p>
          <div className="actions">
            <a className="btn primary" href="#request-service">Request a service</a>
            <a className="btn" href="/partners/apply">Apply as provider</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
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

      <section className="section no-top-pad" id="request-service">
        <GeneralServiceRequestForm />
      </section>
    </main>
  );
}
