export default function NotFound() {
  return (
    <main className="global-not-found-shell">
      <section className="global-not-found-card">
        <p className="overline">Page not found</p>
        <h1>This MoveReady route does not exist or has moved.</h1>
        <p>Use the guided setup or Account Center instead of guessing another URL. Private records are available only through their verified-account workspaces.</p>
        <div className="actions">
          <a className="btn primary" href="/onboarding">Guided setup</a>
          <a className="btn" href="/dashboard">Account Center</a>
          <a className="btn" href="/platform">Platform modules</a>
          <a className="btn" href="/">Home</a>
        </div>
      </section>
    </main>
  );
}
