import SiteHeader from "@/components/SiteHeader";
import GeneralServiceRequestForm from "@/components/GeneralServiceRequestForm";

const services = [
  ["Courier", "Help moving passports, certificates, embassy files, notarized papers, and other sensitive documents."],
  ["Legalization", "Help with notarization, apostille, attestation, translation, embassy legalization, and document checks."],
  ["Insurance", "Help finding travel, health, student, family, Schengen-style, or work-route insurance options."],
  ["Expert review", "Help checking route evidence, refusal risk, proof of funds, scholarships, startup route evidence, or report gaps."],
  ["Arrival support", "Help with accommodation, airport pickup, SIM, bank setup, local registration, and first-arrival settlement."],
  ["Admission support", "Help with scholarships, study-abroad applications, SOPs, school documents, and application planning."],
];

const handoffRules = [
  {
    title: "MoveReady checks first",
    detail: "Your request should be reviewed before any provider receives your details or route context.",
  },
  {
    title: "You must agree first",
    detail: "MoveReady should only contact you or share request context after consent is captured.",
  },
  {
    title: "Support is not approval",
    detail: "Support can help you prepare, but it cannot guarantee visa, admission, job, lottery, ballot, appointment, or route approval.",
  },
];

export default function ServicesPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Services" />

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Optional support</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                Ask for practical help when your route is clearer.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                Save a support request and keep it connected to your account. This is preparation help only, not a promise of approval.
              </p>
            </div>
            <span className="status-dot">Consent first</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#request-service">Request support</a>
            <a className="btn" href="/service-requests">My support requests</a>
            <a className="btn" href="/dashboard">Back to Account</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="request-service">
        <GeneralServiceRequestForm />
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Support areas</p>
            <h2>What kind of help can I ask for?</h2>
            <p className="section-intro">
              Choose the support area that matches your need. Share only what is necessary. MoveReady should review requests before any provider receives details.
            </p>
          </div>
          <span className="status-dot">Private first</span>
        </div>
        <div className="service-strip">
          {services.map(([title, text]) => (
            <article className="service-strip-item" key={title}>
              <span className="overline">Support</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Safety rules</p>
            <h2>Before anyone helps, protect the user first.</h2>
            <p className="section-intro">
              Support should stay private, consent-based, reviewed, and clearly advisory.
            </p>
          </div>
          <span className="status-dot">No shortcut</span>
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
    </main>
  );
}
