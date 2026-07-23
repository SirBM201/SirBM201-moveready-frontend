import AdminPrivacyRequests from "@/components/AdminPrivacyRequests";

export default function AdminPrivacyRequestsPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/admin">
          <strong>Project MoveReady</strong>
          <span>Privacy Operations</span>
        </a>
        <nav className="nav" aria-label="Admin navigation">
          <a href="/admin">Admin</a>
          <a href="/admin/application-alerts">Application Alerts</a>
          <a href="/admin/reports">Reports</a>
          <a href="/settings">User Privacy Center</a>
          <a href="/">Home</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Protected administrator workflow</span>
          <h1>Review privacy requests without treating submission as automatic authorization.</h1>
          <p className="lede">
            Access, correction, restriction, consent withdrawal, and account deletion require identity reverification, scope review, retention checks, completion evidence, and an auditable response.
          </p>
        </div>
      </section>

      <section className="section no-top-pad">
        <AdminPrivacyRequests />
      </section>
    </main>
  );
}
