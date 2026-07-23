import AdminApplicationAlerts from "@/components/AdminApplicationAlerts";

export default function AdminApplicationAlertsPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/admin">
          <strong>Project MoveReady</strong>
          <span>Application Alerts Admin</span>
        </a>
        <nav className="nav">
          <a href="/admin">Admin Home</a>
          <a href="/admin#application-cases">Application Cases</a>
          <a href="/application-alerts">User Inbox</a>
          <a href="/applications">Application Center</a>
          <a href="/dashboard">Account</a>
          <a href="/">Home</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Protected application monitoring</span>
          <h1>Review private case alerts and control the unattended daily scan.</h1>
          <p className="lede">
            This workspace is for application deadlines, appointments, evidence requests, source review, payment issues, refusals, and decision follow-up. It does not activate external message delivery.
          </p>
        </div>
      </section>

      <AdminApplicationAlerts />
    </main>
  );
}
