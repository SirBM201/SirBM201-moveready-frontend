import SiteHeader from "@/components/SiteHeader";
import BeginnerFriendlyGuide from "@/components/BeginnerFriendlyGuide";
import VisaPowerPlanner from "@/components/VisaPowerPlanner";

const featureBenefits = [
  {
    title: "See hidden travel benefits",
    text: "A user may already hold a strong visa that can reduce or remove visa requirements for selected third countries.",
  },
  {
    title: "Combine passport and visa power",
    text: "The tool checks the user's passport baseline and then adds the extra benefit of Canada, U.S., UK, Schengen, Australia, or Japan visas.",
  },
  {
    title: "Keep the source trail visible",
    text: "Each rule should show the official source, last verified date, confidence level, and important conditions.",
  },
];

const premiumReasons = [
  "Visa-benefit rules change often and need continuous official-source monitoring.",
  "Conditions differ by passport, visa type, validity, multiple-entry status, and whether the visa has been used before.",
  "This feature can later connect to alerts, saved routes, travel planning, service requests, and expert review.",
];

export default function VisaPowerPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Visa Power" />

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Passport index + visa benefits</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                Visa Power & Travel Benefits
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                Enter visas you already hold, then see destinations that may become easier to visit because of those visas. This is a planning guide, not permission to travel.
              </p>
            </div>
            <span className="status-dot">Premium preview</span>
          </div>
          <div className="badge-row" style={{ marginTop: 10 }}>
            <span className="badge">1. Choose passport</span>
            <span className="badge">2. Tick visas held</span>
            <span className="badge">3. Review conditions</span>
            <span className="badge">4. Check official source</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#visa-power-tool">Open tool</a>
            <a className="btn" href="/passport-index">Passport index only</a>
            <a className="btn" href="/route-checker">Check relocation route</a>
            <a className="btn" href="/watchlist">Create alert</a>
          </div>
        </div>
      </section>

      <BeginnerFriendlyGuide
        compact
        title="Use this only for visas you already have"
        intro="Tick a visa only if it is valid now. The result can show possible travel benefits, but you must still check the destination's official rule, airline checks, and border conditions before booking."
      />

      <section className="section no-top-pad" id="visa-power-tool">
        <VisaPowerPlanner />
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Why this matters</p>
            <h2>Users may already have more travel options than they know.</h2>
            <p className="section-intro">
              A Canadian, U.S., UK, Schengen, Australia, or Japan visa can sometimes help a traveller enter another country with no separate visa or a simplified process, subject to current rules and border checks.
            </p>
          </div>
          <span className="status-dot">Source first</span>
        </div>
        <div className="grid">
          {featureBenefits.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <article className="result-block featured">
          <div className="panel-heading">
            <div>
              <p className="overline">Business model</p>
              <h2>This should be a premium MoveReady feature.</h2>
            </div>
            <span className="status-dot">High value</span>
          </div>
          <div className="mini-list">
            {premiumReasons.map((item) => (
              <div key={item}><strong>Reason</strong><span>{item}</span></div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
