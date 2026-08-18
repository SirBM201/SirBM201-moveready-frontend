import DeploymentStatus from "@/components/DeploymentStatus";
import SiteHeader from "@/components/SiteHeader";

export default function DeploymentStatusPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Deployment and operations status" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">B16 · Deployment and operations hardening</span>
          <h1>Verify the Vercel, Railway, Supabase, schedule, and admin-boundary contracts.</h1>
          <p className="lede">
            This page compares the live frontend and backend fingerprints, expected routes, four scheduled jobs, protected administrator boundary, environment summary, and migration frontier. A repository commit is not treated as a successful deployment until production reports the matching revision.
          </p>
        </div>
      </section>

      <section className="section no-top-pad">
        <DeploymentStatus />
      </section>
    </main>
  );
}
