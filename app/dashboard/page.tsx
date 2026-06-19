import SiteHeader from "@/components/SiteHeader";
import ProfileDashboard from "@/components/ProfileDashboard";

export default function DashboardPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="User dashboard" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Available now: profile saving</span>
          <h1>Build one relocation profile for reports, alerts, routes, and timelines.</h1>
          <p className="lede">
            Save the user context once, then use it to generate readiness reports, save routes, create timeline events, request watchlist alerts, request services, and keep follow-up information consistent across MoveReady.
          </p>
          <div className="actions">
            <a className="btn primary" href="/timeline">Open timeline</a>
            <a className="btn" href="/saved-routes">Saved routes</a>
            <a className="btn" href="/services">Request service</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <ProfileDashboard />
      </section>
    </main>
  );
}
