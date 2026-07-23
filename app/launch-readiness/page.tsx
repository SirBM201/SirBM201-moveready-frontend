import SiteHeader from "@/components/SiteHeader";

const launchChecks = [
  {
    area: "Routes",
    status: "Code available",
    title: "Core route guidance",
    text: "Country, route, route detail, checklist, budget, report, Estonia startup, and Finland D visa surfaces exist. Country-specific facts must still remain source-reviewed and freshness-controlled.",
  },
  {
    area: "Readiness",
    status: "Available after schema check",
    title: "Document, funds, refusal, study, journey, and trip tools",
    text: "Name consistency, document readiness, proof-of-funds, refusal risk, Study Planner, Journey Planner, and Trip Planner are implemented. Saved history depends on the required Supabase migrations.",
  },
  {
    area: "Accounts",
    status: "Controlled rollout",
    title: "Verified email login",
    text: "OTP sessions, expiry, attempt limits, resend cooldown, per-email limits, per-IP limits, and private account aggregation are implemented. Public login remains disabled until the backend reports a verified email provider.",
  },
  {
    area: "Monitoring",
    status: "In-app available",
    title: "Watchlist and saved routes",
    text: "Users can save routes and opt into monitoring preferences. External email and WhatsApp delivery remain disabled until approved credentials, templates, consent, and delivery audit are active.",
  },
  {
    area: "Opportunities",
    status: "Source review required",
    title: "Official ballots and quota routes",
    text: "The opportunity page can track lotteries, youth-mobility ballots, invitation pools, and quota windows. Deadlines and eligibility must be refreshed from official sources before promotion or alerts.",
  },
  {
    area: "Services",
    status: "Request capture available",
    title: "Private service requests",
    text: "Users can request courier, legalization, insurance, expert review, admission, accommodation, airport pickup, travel, transport, and settlement support without presenting an unapproved provider as trusted.",
  },
  {
    area: "Quotes",
    status: "Controlled rollout",
    title: "Scope before payment",
    text: "Private quote requests, separated service and platform fees, deliverables, exclusions, expiry, refund terms, and explicit acceptance are implemented. Migrations 023, 024, and 026 must pass before operational use.",
  },
  {
    area: "Payments",
    status: "Disabled by default",
    title: "Controlled checkout",
    text: "Checkout links remain unavailable while PAYMENT_LINKS_ENABLED is false. Payment activation requires approved provider identity, amount verification, references, reconciliation, refunds, disputes, and a production payment test.",
  },
  {
    area: "Providers",
    status: "Screening required",
    title: "Provider applications and publication",
    text: "Providers can apply, but approval does not create a public listing. Privacy, pricing, refund, sensitive-document handling, affiliate disclosure, and explicit publication checks must pass first.",
  },
  {
    area: "Handoffs",
    status: "Consent controlled",
    title: "Exact-field provider execution",
    text: "A provider handoff requires an accepted quote, approved provider, exact-field user consent, and delivery evidence. Admin cannot directly bypass consent-confirmed or shared states.",
  },
  {
    area: "Support",
    status: "Verified account only",
    title: "Complaints, refunds, disputes, and privacy cases",
    text: "Private cases are implemented for complaints, refunds, payment disputes, provider issues, privacy issues, service quality, and technical support. Terminal decisions require a written resolution and timestamp.",
  },
  {
    area: "Trust",
    status: "Available",
    title: "Source and safety rules",
    text: "Trust, safety, privacy, terms, source-review, affiliate-disclosure, and no-guarantee messaging are available as public controls.",
  },
  {
    area: "Admin",
    status: "Protected",
    title: "Operations and review workspace",
    text: "Admin tools cover protected operations diagnostics, reports, queues, profiles, saved routes, timelines, providers, quotes, payments, handoffs, support cases, watchlists, and readiness checks.",
  },
];

const deploymentChecks = [
  "Apply all Supabase migrations in numerical order, including migrations 023 through 026 for publication, quotes, RLS, handoffs, cases, and database invariants.",
  "Run the migration 026 preflight and repair every returned unsafe record before applying the invariant constraints.",
  "Confirm Railway ENV_MODE and FLASK_ENV are production, AUTH_OTP_DEV_MODE is false, and no development OTP appears in an API response.",
  "Configure a verified Resend or SMTP sender before enabling EMAIL_OTP_DELIVERY_ENABLED.",
  "Keep PAYMENT_LINKS_ENABLED false until payment, refund, dispute, reconciliation, and production-test controls pass.",
  "Confirm the protected operations endpoint reports auth_login_codes, user_sessions, provider_publication, commercial_quotes, payment_events, service_handoffs, handoff_events, and support_cases as ready.",
  "Run test-auth-release.ps1, test-billing-release.ps1, test-handoff-release.ps1, and the study, trip, journey, Passport Index, and Visa Power smoke tests.",
  "Confirm Railway backend health and route endpoints after deployment completes.",
  "Confirm Vercel frontend has the latest successful production deployment and points to the active backend URL.",
  "Test one verified-account flow: login, profile, route check, report, saved route, watchlist, timeline, quote, handoff consent, and private support case.",
  "Review public pages for false guarantees, hidden official-fee claims, undisclosed affiliate relationships, or unapproved provider language.",
];

export default function LaunchReadinessPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Launch readiness" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Launch control</span>
          <h1>Confirm what is active before public promotion.</h1>
          <p className="lede">
            Code availability is not the same as production activation. This page separates implemented workflows from migrations, credentials, source review, provider approval, payment controls, and live delivery tests.
          </p>
          <div className="actions">
            <a className="btn primary" href="/admin#operations-status">Run protected operations check</a>
            <a className="btn" href="/login">Check login readiness</a>
            <a className="btn" href="/support-center">Review Support Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <h2>Product and operational readiness</h2>
        <p className="section-intro">
          A module should be called available only when its code, deployment, schema, credentials, source review, provider controls, and operational process all pass.
        </p>
        <div className="module-ledger">
          {launchChecks.map((item) => (
            <article className="module-row" key={item.title}>
              <div>
                <span className="overline">{item.area}</span>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </div>
              <div className="module-row-meta">
                <span className="badge">{item.status}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Deployment and activation checks</h2>
        <p className="section-intro">
          Complete these checks after backend and frontend deployments settle and before public promotion.
        </p>
        <article className="card">
          <div className="mini-list">
            {deploymentChecks.map((item, index) => <div key={item}><strong>{index + 1}</strong><span>{item}</span></div>)}
          </div>
        </article>
      </section>
    </main>
  );
}
