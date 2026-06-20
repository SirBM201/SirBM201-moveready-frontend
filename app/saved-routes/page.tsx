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
    detail: "A saved route can later become a watchlist item for opening dates, deadline windows, or rule changes.",
  },
];

export default function SavedRoutesPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Saved routes" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Account Center: saved decisions</span>
          <h1>Keep the routes and opportunities worth revisiting.</h1>
          <p className="lede">
            Saved Routes turns browsing into a proper relocation workspace. Signed-in users can load saved routes from their verified account, and email or phone lookup remains available for quick retrieval.
          </p>
          <div className="actions">
            <a className="btn primary" href="/compare">Compare routes</a>
            <a className="btn" href="/country-comparison">Compare countries</a>
            <a className="btn" href="/dashboard">Back to Account Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <p className="overline">Why saving matters</p>
            <h2>Saved routes are the bridge between planning and action</h2>
            <p className="section-intro">
              A saved route should eventually connect to reports, timeline steps, watchlist alerts, and provider requests. Verified account loading now makes those records easier to return to without retyping contact details.
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

      <section className="section">
        <SavedRoutesManager />
      </section>
    </main>
  );
}
