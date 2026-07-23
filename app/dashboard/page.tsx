import AccountEvidenceSummary from "@/components/AccountEvidenceSummary";
import AccountSummary from "@/components/AccountSummary";
import BeginnerFriendlyGuide from "@/components/BeginnerFriendlyGuide";
import ProfileDashboard from "@/components/ProfileDashboard";
import SiteHeader from "@/components/SiteHeader";

const accountAreas = [
  {
    title: "Save your details once",
    detail: "Add your country, target country, reason for moving, timeline, money available, family count, and contact details once.",
    href: "#profile-dashboard",
  },
  {
    title: "Check visa power",
    detail: "Enter visas you already hold and see possible travel benefits, source links, conditions, and safety notes.",
    href: "/visa-power",
  },
  {
    title: "Organize your evidence",
    detail: "Keep private document metadata, build route-specific evidence packs, track expiry, and prepare refusal-repair tasks without uploading raw documents.",
    href: "/evidence-pack",
  },
  {
    title: "Save routes you care about",
    detail: "Keep serious country and route options in one place so you can return later without starting again.",
    href: "/saved-routes",
  },
  {
    title: "Get alerts for changes",
    detail: "Choose the routes you want to watch and review current in-app source alerts from your verified account.",
    href: "/watchlist",
  },
  {
    title: "Make a dated timeline",
    detail: "Turn your relocation idea into dated actions for documents, appointments, payments, results, and follow-up tasks.",
    href: "/timeline",
  },
  {
    title: "Plan application to arrival",
    detail: "Use Study, Journey, and Trip planners for admission, documents, family, appointments, travel, and first-90-days preparation.",
    href: "/journey-plans",
  },
  {
    title: "Read your reports",
    detail: "Open saved readiness reports with risk labels, source status, document gaps, and next steps.",
    href: "/my-reports",
  },
  {
    title: "Review quotes and payments",
    detail: "Request a scope-based quote, review deliverables, exclusions, fees, expiry, and refund terms before accepting or paying.",
    href: "/billing",
  },
  {
    title: "Ask for support",
    detail: "Request expert, document, admission, travel, courier, insurance, or settlement support only when you want help and consent has been captured.",
    href: "/service-requests",
  },
];

const trustControls = [
  "Your private profile, evidence metadata, reports, planning history, commercial quotes, and support requests are not public.",
  "Evidence Center stores metadata and readiness results only; it does not accept raw passports, bank statements, certificates, refusal letters, passwords, OTPs, card details, or private keys.",
  "MoveReady asks for consent before contact, alerts, timeline storage, support requests, quotes, or provider handoff.",
  "Reports, Passport Index, Visa Power, Evidence Center, Study Planner, Journey Planner, and Trip Planner show source status, risk labels, warnings, or generated dates.",
  "Provider approval is separate from public publication; privacy, pricing, refund, handling, and disclosure controls must pass first.",
  "A quote or payment does not promise approval, admission, jobs, lottery selection, booking inventory, provider performance, boarding, refund, or travel entry.",
];

const nextFeatures = [
  {
    status: "Available after migration 027",
    title: "Evidence inventory and evidence packs",
    detail: "Store document metadata, calculate expiry and completeness, organize route-specific requirements, and prepare refusal-repair tasks under the verified account.",
  },
  {
    status: "Available now",
    title: "Verified account workspace",
    detail: "Save and retrieve profiles, routes, alerts, timelines, reports, plans, support requests, and commercial quotes under the same email account.",
  },
  {
    status: "Available now",
    title: "Passport Index and Visa Power",
    detail: "Use the provider-backed passport overview, destination details, and existing visas to check possible travel benefits with safety gates.",
  },
  {
    status: "Available now",
    title: "Study, Journey, and Trip planning history",
    detail: "Run admission, document, family, appointment, settlement, and trip-readiness planners while signed in, then return to the stored plans.",
  },
  {
    status: "Available now",
    title: "Commercial quote review",
    detail: "Request and review scope, deliverables, exclusions, service amount, platform fee, total, expiry, and refund terms from a verified account.",
  },
  {
    status: "Controlled rollout",
    title: "Checkout and external provider delivery",
    detail: "Payment links, external messaging, and provider execution remain disabled until credentials, approved links, verification, refund handling, and operational controls are ready.",
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
                Use one profile for your whole relocation plan.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                Save your details once. Then use the same verified account for route checks, Passport Index, Visa Power, evidence packs, reports, saved routes, alerts, timelines, planning history, support requests, and commercial quotes.
              </p>
            </div>
            <span className="status-dot">Profile first</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#account-summary">View account summary</a>
            <a className="btn" href="#profile-dashboard">Save my details</a>
            <a className="btn" href="/route-checker">Check route</a>
            <a className="btn" href="/passport-index">Passport</a>
            <a className="btn" href="/visa-power">Visa Power</a>
            <a className="btn" href="/evidence-pack">Evidence</a>
            <a className="btn" href="/journey-plans">Plans</a>
            <a className="btn" href="/my-reports">Reports</a>
            <a className="btn" href="/billing">Quotes</a>
            <a className="btn" href="/login">Sign in</a>
          </div>
        </div>
      </section>

      <BeginnerFriendlyGuide
        compact
        title="Use your account without confusion"
        intro="Start by keeping only one active profile. That profile should feed route checks, passport and visa checks, evidence packs, reports, alerts, saved routes, planning history, timeline, support requests, and quotes."
      />

      <section className="section no-top-pad" id="account-summary">
        <AccountSummary />
        <AccountEvidenceSummary />
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Start here</p>
            <h2>What your account connects</h2>
            <p className="section-intro">
              Start with a profile. After that, evidence metadata, saved routes, reports, alerts, timeline events, planning runs, visa-benefit checks, support requests, and quotes can stay connected to the same verified email.
            </p>
          </div>
          <span className="status-dot">Controlled account workspace</span>
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
            <p className="overline">Simple flow</p>
            <h2>Profile → route → passport → visa power → evidence → report → plan → alert → quote → support</h2>
            <p className="section-intro">
              MoveReady should feel like a guided workspace, not a collection of separate forms. Use the steps below as the normal path.
            </p>
            <div className="mini-list">
              <div><strong>1. Save or load your profile</strong><span>Add your contact, country, target country, goal, money available, family count, and timeline.</span></div>
              <div><strong>2. Check the route you care about</strong><span>Use your active profile to see whether the route looks sensible before spending money.</span></div>
              <div><strong>3. Check your passport and held visas</strong><span>Use Passport Index and Visa Power for destination rules, existing-visa benefits, and personal-history safety gates.</span></div>
              <div><strong>4. Build your evidence pack</strong><span>Record document metadata, expiry, translation, legalization, missing items, and refusal-repair tasks without uploading raw documents.</span></div>
              <div><strong>5. Generate a readiness report</strong><span>See document gaps, funds pressure, risk flags, source status, and next actions.</span></div>
              <div><strong>6. Build the execution plan</strong><span>Use Study, Journey, and Trip planners for admission, documents, family, appointments, travel, and post-arrival preparation.</span></div>
              <div><strong>7. Create alerts and timeline actions</strong><span>Track dates, source changes, deadlines, and reminders only when you opt in.</span></div>
              <div><strong>8. Request and review a quote</strong><span>Check scope, deliverables, exclusions, provider, service amount, platform fee, total, expiry, and refund terms before accepting.</span></div>
              <div><strong>9. Pay or ask for support only when ready</strong><span>Checkout remains separate from acceptance and is available only after an approved payment process is enabled.</span></div>
            </div>
          </article>

          <article className="result-panel">
            <div className="result-stack">
              <div className="result-block featured">
                <p className="overline">Trust controls</p>
                <h2>MoveReady stays advisory, transparent, and consent-first.</h2>
                <div className="mini-list">
                  {trustControls.map((control) => (
                    <div key={control}><strong>Rule</strong><span>{control}</span></div>
                  ))}
                </div>
              </div>

              <div className="result-block">
                <p className="overline">Account features</p>
                <h2>What is available and what remains controlled</h2>
                <div className="mini-list">
                  {nextFeatures.map((item) => (
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
            <h2>Save your details or load your saved profile</h2>
            <p className="section-intro">
              Use the same verified email. After saving, you can check routes, passport access, Visa Power, organize evidence, generate reports, save routes, create alerts, build plans, add timeline events, request support, or review issued quotes.
            </p>
          </div>
          <span className="status-dot">Verified account</span>
        </div>
        <ProfileDashboard />
      </section>
    </main>
  );
}
