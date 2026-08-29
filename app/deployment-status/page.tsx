import DeploymentStatus from "@/components/DeploymentStatus";
import LaunchAcceptanceStatus from "@/components/LaunchAcceptanceStatus";
import SiteHeader from "@/components/SiteHeader";

export default function DeploymentStatusPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Deployment and operations status" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">LQ20 · V1 launch acceptance and production hardening</span>
          <h1>Verify the complete V1 journey, authentication, API connectivity, deployment health, and failure boundaries.</h1>
          <p className="lede">
            Extends B16 · Deployment and operations hardening with a read-only V1 acceptance matrix. This page compares the live frontend and backend fingerprints, expected routes, four scheduled jobs, protected administrator boundary, environment summary, and migration frontier. A repository commit is not treated as a successful deployment until production reports the matching revision.
          </p>
        </div>
      </section>

      <section className="section no-top-pad">
        <LaunchAcceptanceStatus />
        <DeploymentStatus />
      </section>
    </main>
  );
}
