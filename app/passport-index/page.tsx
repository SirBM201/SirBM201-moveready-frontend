import SiteHeader from "@/components/SiteHeader";
import PassportIndexExplorer from "@/components/PassportIndexExplorer";

const benefits = [
  {
    title: "Know your passport baseline",
    text: "See starter visa-free, visa-on-arrival, eVisa, and visa-required categories before choosing a route.",
  },
  {
    title: "Avoid wrong assumptions",
    text: "A passport may be strong for short travel but still need visas or permits for study, work, family, business, or PR routes.",
  },
  {
    title: "Combine with Visa Power",
    text: "After checking your passport, add Canada, U.S., UK, Schengen, Australia, or Japan visas to see extra travel benefits.",
  },
];

export default function PassportIndexPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Passport Index" />

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Passport Index</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                Check what your passport can do before adding visas.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                MoveReady shows a starter passport-strength snapshot, travel-access categories, safety notes, and source status. This is planning guidance only, not permission to travel.
              </p>
            </div>
            <span className="status-dot">Starter feature</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#passport-index-tool">Open passport index</a>
            <a className="btn" href="/visa-power">Check visa power</a>
            <a className="btn" href="/route-checker">Check relocation route</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="passport-index-tool">
        <PassportIndexExplorer />
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">How to use this</p>
            <h2>Passport first, visa power second, route checker third.</h2>
            <p className="section-intro">
              This order helps everyday users understand their baseline travel access, extra benefits from strong visas, and relocation readiness before paying money.
            </p>
          </div>
          <span className="status-dot">Plain language</span>
        </div>
        <div className="grid">
          {benefits.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <article className="result-block soft">
          <p className="overline">Trust notice</p>
          <h2>Do not book travel from this page alone.</h2>
          <p>
            Passport access changes often. Before booking, check the official destination immigration page, embassy page, airline document checker, passport validity, return ticket, funds, accommodation, travel purpose, and personal travel history.
          </p>
        </article>
      </section>
    </main>
  );
}
