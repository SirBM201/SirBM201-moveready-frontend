import SiteHeader from "@/components/SiteHeader";
import SmartAlertsCenter from "@/components/SmartAlertsCenter";

const boundaries = [
  ["One ranked inbox", "Jobs, applications, document expiry, verified changes, optional language reminders, and evidence refresh signals use one deduplicated view."],
  ["Preferences suppress noise", "Category switches, critical-only mode, and bounded day thresholds decide what appears without deleting the underlying record."],
  ["Official instructions control", "Every reminder is planning support. Current authority, employer, school, exam-provider, passport, visa, deadline, fee, and application instructions remain controlling."],
];

export default function AlertsPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Smart Alerts" />

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">B14 · Smart alerts and critical monitoring</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                See the change that needs action—without alert noise.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                MoveReady consolidates existing private records and reviewed watch sources. It ranks critical work first, keeps language reminders optional, and never turns a planning signal into an official decision.
              </p>
            </div>
            <span className="status-dot">In-app only</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#smart-alert-center">Open smart alerts</a>
            <a className="btn" href="/watchlist">Create or manage watches</a>
            <a className="btn" href="/application-alerts">Application alerts</a>
            <a className="btn" href="/dashboard">Dashboard</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="smart-alert-center">
        <SmartAlertsCenter />
      </section>

      <section className="section no-top-pad">
        <div className="grid">
          {boundaries.map(([title, detail]) => <article className="card" key={title}><h3>{title}</h3><p>{detail}</p></article>)}
        </div>
      </section>
    </main>
  );
}
