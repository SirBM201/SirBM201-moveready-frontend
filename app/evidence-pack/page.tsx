import EvidencePackWorkspace from "@/components/EvidencePackWorkspace";
import SiteHeader from "@/components/SiteHeader";

const boundaries = [
  {
    title: "Metadata, not document files",
    text: "Record document type, owner, status, dates, translation, legalization, and expiry. Do not upload passport scans, bank statements, certificates, refusal letters, or full document numbers.",
  },
  {
    title: "Official checklist controls",
    text: "The generated pack is a readiness organizer. Current government, embassy, visa-centre, school, employer, licensing-body, or programme instructions remain the controlling requirement.",
  },
  {
    title: "Refusal repair, not approval prediction",
    text: "The refusal-repair tool separates refusals, denied admission, cancellation, revocation, and possible bans. It does not predict approval or replace qualified legal advice.",
  },
];

export default function EvidencePackPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Private Evidence Center" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Verified account workspace</span>
          <h1>Organize evidence, expiry risk, and refusal repair without uploading raw documents.</h1>
          <p className="lede">
            Build a private document inventory, generate a route-based evidence pack, and prepare a structured response to a refusal or denied-admission event.
          </p>
          <div className="actions">
            <a className="btn primary" href="#evidence-workspace">Open Evidence Center</a>
            <a className="btn" href="/source-health">Check source freshness</a>
            <a className="btn" href="/dashboard">Back to Account</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="evidence-workspace">
        <EvidencePackWorkspace />
      </section>

      <section className="section">
        <div className="grid">
          {boundaries.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
