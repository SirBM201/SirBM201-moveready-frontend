import SiteHeader from "@/components/SiteHeader";
import { platformModules } from "@/lib/platformModules";


const availabilityLabel = {
  available: "Available",
  coming_soon: "Coming soon",
  partner_approval_pending: "Partner approval pending",
};


export default function PlatformPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Platform services" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">MoveReady services</span>
          <h1>Visa, relocation, documents, alerts, planning, and trusted services in one place.</h1>
          <p className="lede">
            MoveReady brings route intelligence, Passport Index, Visa Power, official opportunity monitoring, readiness checks, legalization, family planning, appointments, settlement, alerts, insurance, courier interest, and provider screening into one source-backed platform.
          </p>
          <div className="actions">
            <a className="btn primary" href="/journey-planner">Open Journey Planner</a>
            <a className="btn" href="/route-checker">Check relocation route</a>
            <a className="btn" href="/readiness">Use readiness tools</a>
            <a className="btn" href="/services">Request trusted service</a>
            <a className="btn" href="/watchlist">Create watchlist alert</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="module-ledger">
          {platformModules.map((module) => (
            <a className="module-row" href={module.href} key={module.slug}>
              <div>
                <span className="overline">{module.category}</span>
                <h2>{module.title}</h2>
                <p>{module.summary}</p>
                <p className="form-status">{module.readiness}</p>
              </div>
              <div className="module-row-meta">
                <span className={`badge module-status ${module.availability}`}>{availabilityLabel[module.availability]}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
