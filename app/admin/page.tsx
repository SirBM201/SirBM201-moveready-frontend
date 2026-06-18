import AdminPartnerApplications from "@/components/AdminPartnerApplications";
import AdminReadinessChecks from "@/components/AdminReadinessChecks";
import AdminSavedRoutes from "@/components/AdminSavedRoutes";
import AdminServiceRequests from "@/components/AdminServiceRequests";
import AdminTimelineEvents from "@/components/AdminTimelineEvents";
import AdminUserProfiles from "@/components/AdminUserProfiles";
import AdminWatchlistSubscriptions from "@/components/AdminWatchlistSubscriptions";

const adminModules = [
  ["User profiles", "Review saved relocation profiles, contact preferences, goals, funds, family count, readiness score, and follow-up status.", "#user-profiles"],
  ["Saved routes", "Review routes, countries, opportunities, scholarships, and services users saved for later follow-up.", "#saved-routes"],
  ["Timeline events", "Review application tasks, deadlines, appointments, payments, result checks, travel dates, and follow-up steps.", "#timeline-events"],
  ["Partner applications", "Screen providers for courier, insurance, legalization, translation, expert review, admission, accommodation, airport pickup, and settlement workflows.", "#partner-applications"],
  ["Provider directory", "Check the public provider directory surface before approved partner listings are published.", "/providers"],
  ["Service requests", "Review user interest for alerts, courier, insurance, legalization, documents, and expert support.", "#service-requests"],
  ["Watchlist subscriptions", "Review opt-in monitoring requests for routes, opportunities, scholarships, countries, and services.", "#watchlist-subscriptions"],
  ["Readiness checks", "Inspect saved name, document, funds, and refusal-risk checks.", "#readiness-checks"],
  ["Reports", "Inspect generated reports, delivery status, refreshes, and stale-report warnings.", "/admin/reports"],
  ["Sources", "Add trusted source links, reliability level, owner organization, and review context.", "/admin/reviews"],
  ["Routes", "Create and approve country-specific route versions after source review.", "/admin/reviews"],
  ["Launch checks", "Review public readiness, trust, source, and safety surfaces before launch.", "/launch-readiness"],
];

export default function AdminPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <strong>Project MoveReady</strong>
          <span>Admin</span>
        </a>
        <nav className="nav">
          <a href="/admin/reports">Reports</a>
          <a href="/admin/reviews">Reviews</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/saved-routes">Saved Routes</a>
          <a href="/timeline">Timeline</a>
          <a href="/providers">Providers</a>
          <a href="/partners/apply">Partner Apply</a>
          <a href="/platform">Platform</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/readiness">Readiness</a>
          <a href="/">Home</a>
        </nav>
      </header>
      <section className="section">
        <h2>Admin workspace</h2>
        <p className="section-intro">Admin tools protect the trust system: profiles, saved routes, timelines, partner applications, user requests, watchlists, sources, snapshots, route versions, review tasks, readiness checks, and report freshness.</p>
        <div className="grid">
          {adminModules.map(([title, text, href]) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
              <a className="text-link" href={href}>Open</a>
            </article>
          ))}
        </div>
      </section>
      <div id="user-profiles"><AdminUserProfiles /></div>
      <div id="saved-routes"><AdminSavedRoutes /></div>
      <div id="timeline-events"><AdminTimelineEvents /></div>
      <div id="partner-applications"><AdminPartnerApplications /></div>
      <div id="service-requests"><AdminServiceRequests /></div>
      <div id="watchlist-subscriptions"><AdminWatchlistSubscriptions /></div>
      <div id="readiness-checks"><AdminReadinessChecks /></div>
    </main>
  );
}
