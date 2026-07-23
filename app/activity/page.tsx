import AccountActivityFeed from "@/components/AccountActivityFeed";
import SiteHeader from "@/components/SiteHeader";

export default function ActivityPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Private Account Activity" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Verified account history</span>
          <h1>See how your relocation plan has changed across MoveReady.</h1>
          <p className="lede">
            Review account-owned profiles, saved routes, evidence metadata, application cases, alerts, reports, timelines, quotes, handoffs, support cases, and privacy requests without exposing raw documents or security credentials.
          </p>
          <div className="actions">
            <a className="btn primary" href="#activity-feed">Open activity feed</a>
            <a className="btn" href="/applications">Applications</a>
            <a className="btn" href="/settings">Settings</a>
            <a className="btn" href="/dashboard">Account Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="activity-feed">
        <AccountActivityFeed />
      </section>
    </main>
  );
}
