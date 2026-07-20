import SiteHeader from "@/components/SiteHeader";
import SavedRoutesManager from "@/components/SavedRoutesManager";

const savedRouteUses = [
  {
    title: "Compare again later",
    detail: "Keep serious countries, routes, scholarships, opportunities, and service ideas instead of starting from zero each visit.",
  },
  {
    title: "Connect to reports",
    detail: "Saved routes should become the route context for readiness reports and future report refreshes.",
  },
  {
    title: "Create alerts",
    detail: "A saved route can later become an alert item for opening dates, deadline windows, or rule changes.",
  },
];

export default function SavedRoutesPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Saved routes" />

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Saved routes</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                Keep routes worth revisiting.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                Save serious routes, load them later, generate reports, create alerts, or archive old route ideas.
              </p>
            </div>
            <span className="status-dot">Account linked</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#saved-route-manager">Load saved routes</a>
            <a className="btn" href="/compare">Compare routes</a>
            <a className="btn" href="/route-checker">Check route</a>
            <a className="btn" href="/dashboard">Back to Account</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="saved-route-manager">
        <SavedRoutesManager />
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Why saving matters</p>
            <h2>Saved routes are the bridge between planning and action</h2>
            <p className="section-intro">
              A saved route should eventually connect to reports, timeline steps, alerts, and support requests. Verified account loading now makes those records easier to return to without retyping contact details.
            </p>
          </div>
          <span className="status-dot">Verified + lookup</span>
        </div>
        <div className="grid">
          {savedRouteUses.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
