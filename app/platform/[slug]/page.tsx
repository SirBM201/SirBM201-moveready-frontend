import { notFound } from "next/navigation";

import ServiceInterestForm from "@/components/ServiceInterestForm";
import { getPlatformModule, platformModules } from "@/lib/platformModules";

const availabilityLabel = {
  available: "Available",
  coming_soon: "Coming soon",
  partner_approval_pending: "Partner approval pending",
};

export function generateStaticParams() {
  return platformModules.map((module) => ({ slug: module.slug }));
}

export default async function PlatformModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = getPlatformModule(slug);

  if (!module) {
    notFound();
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>{module.title}</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/platform">Platform</a>
          <a href="/route-checker">Route Checker</a>
          <a href="/routes/estonia-startup">Estonia Route</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">{availabilityLabel[module.availability]}</span>
          <h1>{module.title}</h1>
          <p className="lede">{module.summary}</p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Use live route checker</a>
            <a className="btn" href="/platform">Back to services</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="platform-detail-grid">
          <article className="detail-section">
            <span className="overline">Launch readiness</span>
            <h3>Current support</h3>
            <p>{module.readiness}</p>
          </article>
          <article className="detail-section">
            <span className="overline">Service scope</span>
            <h3>What this will support</h3>
            <p>{module.launchScope}</p>
          </article>
          <article className="detail-section">
            <span className="overline">Trust standard</span>
            <h3>Source-backed before activation</h3>
            <p>
              This service will only be switched on publicly when the official-source rules, provider checks, user consent, and audit trail are ready.
            </p>
          </article>
        </div>
      </section>

      <section className="section no-top-pad">
        <ServiceInterestForm serviceSlug={module.slug} serviceTitle={module.title} />
      </section>
    </main>
  );
}
