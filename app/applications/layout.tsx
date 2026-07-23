import { ReactNode } from "react";

export default function ApplicationsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <aside className="section no-top-pad" aria-label="Application monitoring shortcuts" style={{ paddingTop: 12, paddingBottom: 0 }}>
        <article className="result-block soft" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Application monitoring</p>
              <h2>Private daily alerts are available for verified application cases.</h2>
            </div>
            <span className="status-dot">In-app only</span>
          </div>
          <p>Review deadlines, appointments, additional-document requests, source risks, payments, refusals, and decision follow-up. Official notices remain controlling.</p>
          <div className="actions">
            <a className="btn primary" href="/application-alerts">Open application alerts</a>
            <a className="btn" href="/timeline">Open timeline</a>
            <a className="btn" href="/evidence-pack">Open evidence</a>
          </div>
        </article>
      </aside>
      {children}
    </>
  );
}
