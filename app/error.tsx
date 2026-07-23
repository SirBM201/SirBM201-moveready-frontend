"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("MoveReady page error", error);
  }, [error]);

  return (
    <main className="global-error-shell">
      <section className="global-error-card" role="alert">
        <p className="overline">This page could not finish loading</p>
        <h1>Your saved account data has not been changed by this screen error.</h1>
        <p>Retry the page first. When a protected feature depends on a migration, deployment, account session, or external provider, it will remain unavailable rather than inventing a successful result.</p>
        {error.digest && <p><strong>Reference:</strong> {error.digest}</p>}
        <div className="actions">
          <button className="btn primary" type="button" onClick={reset}>Try again</button>
          <a className="btn" href="/dashboard">Account Center</a>
          <a className="btn" href="/deployment-status">Deployment status</a>
          <a className="btn" href="/support-center">Support</a>
        </div>
      </section>
    </main>
  );
}
