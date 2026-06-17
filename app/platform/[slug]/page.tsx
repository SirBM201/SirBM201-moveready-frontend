import { notFound } from "next/navigation";

import { getPlatformModule, platformModules } from "@/lib/platformModules";

const statusLabel = {
  live: "Live now",
  planned: "Planned",
  partner_pending: "Partner pending",
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
          <span className="eyebrow">{module.phase} - {statusLabel[module.status]}</span>
          <h1>{module.title}</h1>
          <p className="lede">{module.summary}</p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Use live route checker</a>
            <a className="btn" href="/platform">Back to platform map</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="platform-detail-grid">
          <article className="detail-section">
            <span className="overline">Available now</span>
            <h3>Current behavior</h3>
            <p>{module.now}</p>
          </article>
          <article className="detail-section">
            <span className="overline">Later activation</span>
            <h3>Future scope</h3>
            <p>{module.later}</p>
          </article>
          <article className="detail-section">
            <span className="overline">Safety rule</span>
            <h3>No false availability</h3>
            <p>
              This module should stay clearly marked as planned until its database tables, admin review flow, provider integration, user opt-in, and audit logging are ready.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
