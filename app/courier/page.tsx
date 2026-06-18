import GeneralServiceRequestForm from "@/components/GeneralServiceRequestForm";

const courierUseCases = [
  "Passport submission or collection support where allowed",
  "Certificates and academic documents",
  "Embassy or visa centre document delivery",
  "Notarization, apostille, attestation, or legalization pickup",
  "Nigeria-Gulf, Gulf-Nigeria, and international document movement requests",
  "Tracking, insurance option, handling note, and deadline capture",
];

export default function CourierPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Document courier</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a><a href="/services">Services</a><a href="/legalization">Legalization</a><a href="/trust">Trust</a><a href="/partners/apply">Provider Apply</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Partner approval pending</span>
          <h1>Passport and sensitive-document courier requests.</h1>
          <p className="lede">Capture document movement needs with enough detail for admin review before any provider handoff. This keeps sensitive documents treated as a premium trusted service.</p>
        </div>
      </section>

      <section className="section no-top-pad">
        <h2>Courier request scope</h2>
        <p className="section-intro">MoveReady should collect enough context to assess route, destination, timing, and handling risk before connecting a user to a courier partner.</p>
        <article className="card"><div className="badge-row">{courierUseCases.map((item) => <span className="badge" key={item}>{item}</span>)}</div></article>
      </section>

      <section className="section" id="request-courier">
        <GeneralServiceRequestForm defaultService="courier" />
      </section>
    </main>
  );
}
