import AdminCommercialQuotes from "@/components/AdminCommercialQuotes";
import AdminOperationsStatus from "@/components/AdminOperationsStatus";
import AdminOpportunities from "@/components/AdminOpportunities";
import AdminPartnerApplications from "@/components/AdminPartnerApplications";
import AdminProviderPublication from "@/components/AdminProviderPublication";
import AdminReadinessChecks from "@/components/AdminReadinessChecks";
import AdminReviewConsole from "@/components/AdminReviewConsole";
import AdminSavedRoutes from "@/components/AdminSavedRoutes";
import AdminServiceHandoffs from "@/components/AdminServiceHandoffs";
import AdminServiceRequests from "@/components/AdminServiceRequests";
import AdminTimelineEvents from "@/components/AdminTimelineEvents";
import AdminUserProfiles from "@/components/AdminUserProfiles";
import AdminWatchlistSubscriptions from "@/components/AdminWatchlistSubscriptions";

const adminModules = [
  ["Operations status", "Check configuration, account login, core schemas, provider publication, quotes, payment audit, handoffs, support cases, and controlled external integrations.", "#operations-status"],
  ["Review queue", "Unified workload for service requests, quotes, handoffs, complaints, refunds, disputes, high-risk reports, providers, profiles, saved routes, timelines, and alerts.", "#review-queue"],
  ["Commercial quotes", "Issue scope-controlled quotes, separate service and platform fees, record refund terms, and verify payments without promising outcomes.", "#commercial-quotes"],
  ["Provider handoffs and cases", "Prepare consent-based provider handoffs and manage complaints, refunds, disputes, privacy issues, provider issues, and technical cases.", "#service-handoffs"],
  ["Provider publication", "Keep application approval separate from public listing. Record privacy, pricing, refund, handling, affiliate, and handoff controls.", "#provider-publication"],
  ["User profiles", "Review saved relocation profiles, contact preferences, goals, funds, family count, readiness score, and follow-up status.", "#user-profiles"],
  ["Official opportunity routes", "Review lottery, ballot, invitation-pool, quota, and country-cap records before public monitoring and alerts rely on them.", "#opportunity-routes"],
  ["Saved routes", "Review routes, countries, opportunities, scholarships, and services users saved for later follow-up.", "#saved-routes"],
  ["Timeline events", "Review application tasks, deadlines, appointments, payments, result checks, travel dates, and follow-up steps.", "#timeline-events"],
  ["Partner applications", "Screen providers for courier, insurance, legalization, translation, expert review, admission, travel booking, accommodation, transport, pickup, telecom, and settlement workflows.", "#partner-applications"],
  ["Provider directory", "Check the public provider directory surface after publication controls pass.", "/providers"],
  ["Service requests", "Review user interest for alerts, travel, courier, insurance, legalization, documents, admission, and expert support.", "#service-requests"],
  ["Watchlist subscriptions", "Review opt-in monitoring requests for routes, opportunities, scholarships, countries, and services.", "#watchlist-subscriptions"],
  ["Readiness checks", "Inspect saved name, document, funds, refusal-risk, study, journey, and trip checks.", "#readiness-checks"],
  ["Reports", "Inspect generated reports, delivery status, refreshes, and stale-report warnings.", "/admin/reports"],
  ["Sources", "Add trusted source links, reliability level, owner organization, and review context.", "/admin/reviews"],
  ["Routes", "Create and approve country-specific route versions after source review.", "/admin/reviews"],
  ["Launch checks", "Review public readiness, trust, source, safety, provider, quote, payment, handoff, account-login, and support surfaces before launch.", "/launch-readiness"],
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
          <a href="#operations-status">Operations</a>
          <a href="#review-queue">Queue</a>
          <a href="#commercial-quotes">Quotes</a>
          <a href="#service-handoffs">Handoffs & Cases</a>
          <a href="#provider-publication">Provider Controls</a>
          <a href="/admin/reports">Reports</a>
          <a href="/admin/reviews">Reviews</a>
          <a href="#opportunity-routes">Opportunities</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/providers">Providers</a>
          <a href="/platform">Platform</a>
          <a href="/billing">Billing</a>
          <a href="/support-center">Support Center</a>
          <a href="/">Home</a>
        </nav>
      </header>
      <section className="section">
        <h2>Admin workspace</h2>
        <p className="section-intro">Admin tools protect the trust system: production diagnostics, account login, profiles, official opportunities, saved routes, timelines, partner screening, public publication, service requests, commercial quotes, payment records, consent-based handoffs, private support cases, watchlists, sources, route versions, review tasks, readiness checks, and report freshness.</p>
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
      <div id="operations-status"><AdminOperationsStatus /></div>
      <div id="review-queue"><AdminReviewConsole /></div>
      <div id="commercial-quotes"><AdminCommercialQuotes /></div>
      <div id="service-handoffs"><AdminServiceHandoffs /></div>
      <div id="provider-publication"><AdminProviderPublication /></div>
      <div id="user-profiles"><AdminUserProfiles /></div>
      <div id="opportunity-routes"><AdminOpportunities /></div>
      <div id="saved-routes"><AdminSavedRoutes /></div>
      <div id="timeline-events"><AdminTimelineEvents /></div>
      <div id="partner-applications"><AdminPartnerApplications /></div>
      <div id="service-requests"><AdminServiceRequests /></div>
      <div id="watchlist-subscriptions"><AdminWatchlistSubscriptions /></div>
      <div id="readiness-checks"><AdminReadinessChecks /></div>
    </main>
  );
}
