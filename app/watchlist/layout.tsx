import { ReactNode } from "react";

export default function WatchlistLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <aside className="section no-top-pad" aria-label="Alert categories" style={{ paddingTop: 12, paddingBottom: 0 }}>
        <article className="result-block soft" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Alert categories</p>
              <h2>Route monitoring and active-application alerts are separate.</h2>
            </div>
            <span className="status-dot">Verified account</span>
          </div>
          <p>Use this page for route, opportunity, scholarship, country, and service monitoring. Use Application Alerts for deadlines, appointments, evidence requests, source risks, payments, refusals, and decisions connected to a live application case.</p>
          <div className="actions">
            <a className="btn primary" href="/application-alerts">Open application alerts</a>
            <a className="btn" href="/applications">Open Application Center</a>
          </div>
        </article>
      </aside>
      {children}
    </>
  );
}
