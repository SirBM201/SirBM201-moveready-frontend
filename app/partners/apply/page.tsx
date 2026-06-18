import PartnerApplicationForm from "@/components/PartnerApplicationForm";

const providerAreas = [
  "Courier and document delivery",
  "Insurance",
  "Notarization, apostille, attestation, and legalization",
  "Translation",
  "Expert or consultant review",
  "Admission and scholarship support",
  "Accommodation and airport pickup",
  "Post-arrival settlement support",
];

export default function PartnerApplicationPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Partner application</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/platform">Services</a>
          <a href="/opportunities">Opportunities</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/route-checker">Route Checker</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Partner approval pending</span>
          <h1>Apply to support MoveReady users.</h1>
          <p className="lede">
            Providers can apply for review across document delivery, insurance, legalization, translation, expert review, admission support, accommodation, airport pickup, and settlement services.
          </p>
          <div className="badge-row">
            {providerAreas.map((area) => <span className="badge" key={area}>{area}</span>)}
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <PartnerApplicationForm />
      </section>
    </main>
  );
}
