import SiteHeader from "@/components/SiteHeader";
import SourceHealthPanel from "@/components/SourceHealthPanel";

const rules = [
  {
    title: "Freshness is not a guarantee",
    text: "A recently checked source can still change after review. Users should open the official source before paying, applying, booking, or travelling.",
  },
  {
    title: "Route versions are reviewed separately",
    text: "Updating a source does not automatically approve a route version, report, deadline, fee, or provider statement. Those records remain under review controls.",
  },
  {
    title: "Unavailable evidence fails closed",
    text: "When current official verification is missing, MoveReady should show review required or controlled rollout instead of presenting the rule as confirmed.",
  },
];

export default function SourceHealthPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Source Health" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Source-first trust layer</span>
          <h1>See whether MoveReady’s official sources and route versions are current or due for review.</h1>
          <p className="lede">
            This page reports review freshness, source confidence, and overdue checks. It does not claim that a route is approved or that every external rule is unchanged.
          </p>
          <div className="actions">
            <a className="btn primary" href="#source-health-panel">Open source health</a>
            <a className="btn" href="/sources">Official sources</a>
            <a className="btn" href="/evidence-pack">Evidence Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="source-health-panel">
        <SourceHealthPanel />
      </section>

      <section className="section">
        <div className="grid">
          {rules.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
