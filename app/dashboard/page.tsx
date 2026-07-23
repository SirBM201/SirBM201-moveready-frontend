import AccountEvidenceSummary from "@/components/AccountEvidenceSummary";
import AccountSummary from "@/components/AccountSummary";
import BeginnerFriendlyGuide from "@/components/BeginnerFriendlyGuide";
import ProfileDashboard from "@/components/ProfileDashboard";
import SiteHeader from "@/components/SiteHeader";

const accountAreas = [
  {
    title: "Finish guided setup",
    detail: "Move through profile, route, evidence, application, and alert foundations in the correct order.",
    href: "/onboarding",
  },
  {
    title: "Save your details once",
    detail: "Add your country, target country, goal, timeline, available money, family count, and contact details once.",
    href: "#profile-dashboard",
  },
  {
    title: "Check and save routes",
    detail: "Compare serious options, review official-source status, run readiness checks, and retain the routes you may pursue.",
    href: "/route-checker",
  },
  {
    title: "Check passport and visa power",
    detail: "Review passport access and possible benefits from visas you already hold, subject to destination conditions and personal-history safety gates.",
    href: "/visa-power",
  },
  {
    title: "Organize your evidence",
    detail: "Keep private document metadata, build route-specific evidence packs, track expiry, and prepare refusal-repair tasks without uploading raw documents.",
    href: "/evidence-pack",
  },
  {
    title: "Track a real application",
    detail: "Connect the route, authority, evidence pack, appointment, deadline, fee, source status, events, and final decision in one private case.",
    href: "/applications",
  },
  {
    title: "Review application alerts",
    detail: "See private deadline, appointment, document-request, source, payment, refusal, and post-decision alerts.",
    href: "/application-alerts",
  },
  {
    title: "Make a dated timeline",
    detail: "Turn your relocation plan into dated actions for documents, appointments, payments, results, travel, and settlement.",
    href: "/timeline",
  },
  {
    title: "Plan application to arrival",
    detail: "Use Study, Journey, and Trip planners for admission, documents, family, appointments, travel, and first-90-days preparation.",
    href: "/journey-plans",
  },
  {
    title: "Read your reports",
    detail: "Open saved readiness reports with risk labels, source status, document gaps, and next actions.",
    href: "/my-reports",
  },
  {
    title: "Review all account activity",
    detail: "See profiles, routes, evidence, applications, alerts, reports, quotes, handoffs, support, timelines, and privacy requests chronologically.",
    href: "/activity",
  },
  {
    title: "Control settings and privacy",
    detail: "Manage localization, accessibility, notification consent, active sessions, data export, and reviewed privacy requests.",
    href: "/settings",
  },
  {
    title: "Review quotes and payments",
    detail: "Check scope, deliverables, exclusions, separated fees, expiry, refund terms, and verified payment status before proceeding.",
    href: "/billing",
  },
  {
    title: "Ask for support",
    detail: "Request expert, document, admission, travel, courier, insurance, provider, privacy, refund, or settlement support with explicit consent.",
    href: "/support-center",
  },
];

const trustControls = [
  "Your profile, evidence metadata, application cases, alerts, activity, reports, planning history, quotes, privacy requests, and support records are private account data.",
  "Evidence Center and Application Center reject raw passports, statements, certificates, refusal letters, full reference numbers, passwords, OTPs, card details, and private keys.",
  "MoveReady records separate consent for storage, contact, alerts, external channels, timeline tasks, quotes, provider handoffs, marketing, and privacy requests.",
  "Reports, Passport Index, Visa Power, Evidence Center, Application Center, planners, and alerts show source status, risk labels, warnings, generated dates, or review requirements.",
  "A saved email or WhatsApp preference does not activate delivery until provider credentials, templates, opt-in, unsubscribe, audit, and production tests pass.",
  "Provider approval is separate from public publication, quote issuance, payment, handoff, and service completion.",
  "A quote, payment, report, readiness score, or application record does not promise approval, admission, employment, booking inventory, boarding, entry, provider performance, or refund.",
];

const featureStatus = [
  {
    status: "Available after migration 027",
    title: "Evidence inventory and evidence packs",
    detail: "Store document metadata, calculate expiry and completeness, organize route-specific requirements, and prepare refusal-repair tasks.",
  },
  {
    status: "Available after migration 028",
    title: "Application Case Manager",
    detail: "Track real application stages, deadlines, fees, official sources, evidence links, events, additional-document requests, and decisions.",
  },
  {
    status: "Available after migration 029",
    title: "Private application alerts",
    detail: "Generate and review deduplicated in-app alerts for deadlines, appointments, source status, payments, refusals, and post-decision tasks.",
  },
  {
    status: "Available after migration 030",
    title: "Guided setup, activity, settings, security, and privacy",
    detail: "Save onboarding progress, accessibility and notification choices, review sessions, export account data, and submit reviewed privacy requests.",
  },
  {
    status: "Available now",
    title: "Passport Index, Visa Power, and planners",
    detail: "Use passport access, held-visa checks, route readiness, study, journey, trip, legalization, family, appointment, and settlement tools with safety gates.",
  },
  {
    status: "Controlled rollout",
    title: "Checkout, external notifications, and provider execution",
    detail: "Payment links, email, WhatsApp, push delivery, booking execution, courier handling, and provider fulfillment remain disabled until their separate controls pass.",
  },
];

export default function DashboardPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="My Account" />

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Account Center</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                Use one verified account from first comparison to post-arrival follow-up.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                Save your profile once, verify routes and sources, organize evidence, track real applications and alerts, review reports and timelines, control privacy, and request paid or provider-supported help only when ready.
              </p>
            </div>
            <span className="status-dot">Guided and private</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="/onboarding">Continue guided setup</a>
            <a className="btn" href="#account-summary">Account summary</a>
            <a className="btn" href="/applications">Applications</a>
            <a className="btn" href="/application-alerts">App alerts</a>
            <a className="btn" href="/activity">Activity</a>
            <a className="btn" href="/settings">Settings</a>
            <a className="btn" href="/login">Sign in</a>
          </div>
        </div>
      </section>

      <BeginnerFriendlyGuide
        compact
        title="Use your account without confusion"
        intro="Follow the guided sequence: profile, route, passport and visa power, evidence, report, execution plan, real application, alerts, timeline, quote, provider handoff, and post-arrival follow-up."
      />

      <section className="section no-top-pad" id="account-summary">
        <AccountSummary />
        <AccountEvidenceSummary />
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Connected workspaces</p>
            <h2>Everything your verified account connects</h2>
            <p className="section-intro">
              Account-owned data stays connected to the same verified email while each feature keeps its own privacy, consent, source, payment, and provider boundaries.
            </p>
          </div>
          <span className="status-dot">Migrations 027–030 complete the private workflow</span>
        </div>

        <div className="grid">
          {accountAreas.map((area) => (
            <a className="card" href={area.href} key={area.title}>
              <h3>{area.title}</h3>
              <p>{area.detail}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="live-workspace">
          <article className="workflow-panel">
            <p className="overline">Normal user journey</p>
            <h2>Profile → route → evidence → report → application → alert → decision → settlement</h2>
            <p className="section-intro">
              MoveReady is a controlled journey, not a collection of unrelated forms.
            </p>
            <div className="mini-list">
              <div><strong>1. Save or load one profile</strong><span>Record country, goal, budget, family, timeline, and contact preferences.</span></div>
              <div><strong>2. Compare and verify a route</strong><span>Check official sources, confidence, review dates, eligibility, funds, documents, and risks before spending.</span></div>
              <div><strong>3. Check passport and held visas</strong><span>Review access and possible benefits with destination conditions and personal-history safety gates.</span></div>
              <div><strong>4. Build an evidence pack</strong><span>Track metadata, expiry, translation, legalization, missing items, and refusal-repair tasks without raw uploads.</span></div>
              <div><strong>5. Generate and review a report</strong><span>See source status, funds pressure, evidence gaps, risk flags, and next actions.</span></div>
              <div><strong>6. Build the execution plan</strong><span>Use Study, Journey, Trip, appointment, family, legalization, and settlement tools.</span></div>
              <div><strong>7. Open an Application Case</strong><span>Only when a real application begins, track authority, dates, fees, source, events, requests, and decisions.</span></div>
              <div><strong>8. Review alerts and timeline tasks</strong><span>Act on deadlines and changes only after confirming the competent authority, time zone, channel, and current instruction.</span></div>
              <div><strong>9. Request a quote or provider handoff</strong><span>Review exact scope, separated fees, refund terms, provider readiness, consented fields, and fulfillment status.</span></div>
              <div><strong>10. Track decision and arrival</strong><span>Record the factual result, then plan travel, registrations, housing, insurance, school, tax, work, and first-90-days tasks.</span></div>
            </div>
          </article>

          <article className="result-panel">
            <div className="result-stack">
              <div className="result-block featured">
                <p className="overline">Trust controls</p>
                <h2>MoveReady remains advisory, source-backed, private, and consent-first.</h2>
                <div className="mini-list">
                  {trustControls.map((control) => (
                    <div key={control}><strong>Rule</strong><span>{control}</span></div>
                  ))}
                </div>
              </div>

              <div className="result-block">
                <p className="overline">Feature status</p>
                <h2>Implemented account layers and controlled integrations</h2>
                <div className="mini-list">
                  {featureStatus.map((item) => (
                    <div key={item.title}>
                      <strong>{item.status}: {item.title}</strong>
                      <span>{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section" id="profile-dashboard">
        <div className="section-heading-row">
          <div>
            <p className="overline">Your relocation profile</p>
            <h2>Save your details or load your active profile</h2>
            <p className="section-intro">
              Use the same verified email. After saving, continue through routes, passport access, Visa Power, evidence, reports, applications, alerts, plans, timeline events, quotes, provider handoffs, support, activity, settings, and privacy controls.
            </p>
          </div>
          <span className="status-dot">Verified account</span>
        </div>
        <ProfileDashboard />
      </section>
    </main>
  );
}
