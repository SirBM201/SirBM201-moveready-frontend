import DeploymentStatus from "@/components/DeploymentStatus";
import SiteHeader from "@/components/SiteHeader";

export default function DeploymentStatusPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Deployment and operations status" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Production verification</span>
          <h1>See which MoveReady backend revision is actually running.</h1>
          <p className="lede">
            This page checks the live backend build fingerprint, public capability contract, Passport Index schedule, and expected routes. A repository commit is not treated as a successful deployment until production reports the matching revision.
          </p>
        </div>
      </section>

      <section className="section no-top-pad">
        <DeploymentStatus />
      </section>
    </main>
  );
}
