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
    title: "Save routes you care about",
    detail: "Keep serious country and route options in one place so you can return later without starting again.",
    href: "/saved-routes",
  },
  {
    title: "Get alerts for changes",
    detail: "Choose the routes you want to watch. MoveReady stores your alert preference and keeps it advisory.",
    href: "/watchlist",
  },
  {
    title: "Make a dated timeline",
    detail: "Turn your relocation idea into dated actions for documents, appointments, payments, results, and follow-up tasks.",
    href: "/timeline",
  },
  {
    title: "Plan application to arrival",
    detail: "Use Journey Planner for legalization, family relocation, appointment preparation, and the first 90 days after arrival.",
    href: "/journey-plans",
  },
  {
    title: "Read your reports",
    detail: "Open saved readiness reports with risk labels, source status, document gaps, and next steps.",
    href: "/my-reports",
  },
  {
    title: "Ask for support",
    detail: "Request expert or document review only when you want help and consent has been captured.",
    href: "/service-requests",
  },
];


const trustControls = [
  "Your private profile, reports, journey plans, and support requests are not public.",
  "MoveReady asks for consent before contact, alerts, timeline storage, or support requests.",
  "Reports, Passport Index, Visa Power, and Journey Planner show source status, risk labels, warnings, or generated dates.",
  "MoveReady gives readiness guidance; it does not promise approval, admission, jobs, lottery selection, ballot success, appointments, or travel entry.",
];


const nextFeatures = [
  {
    status: "Available now",
    title: "Email or phone lookup",
    detail: "You can save and retrieve your profile, routes, alerts, timelines, reports, and requests with the same contact details.",
  },
  {
    status: "Available now",
    title: "Email sign in",
    detail: "Use email login to connect account records on the same device and reduce repeated lookups.",
  },
  {
    status: "Available now",
    title: "Passport Index and Visa Power",
    detail: "Use the provider-backed passport overview, destination details, and existing visas to check possible travel benefits with safety gates.",
  },
  {
    status: "Available now",
    title: "Journey Planner history",
    detail: "Run document, family, appointment, and settlement planners while signed in, then return to the stored plans from your account.",
  },
  {
    status: "Controlled rollout",
    title: "Paid account and partner features",
    detail: "Premium monitoring, expert review, provider handoff, messaging, and partner quotes remain behind clear consent, screening, and operational setup.",
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
                Save your details once. Then use the same verified account for route checks, Passport Index, Visa Power, reports, saved routes, alerts, timeline actions, journey plans, and support.
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
            <a className="btn" href="/journey-plans">Journey plans</a>
            <a className="btn" href="/my-reports">Reports</a>
            <a className="btn" href="/login">Sign in</a>
          </div>
        </div>
      </section>

      <BeginnerFriendlyGuide
        compact
        title="Use your account without confusion"
        intro="Start by keeping only one active profile. That profile should feed route checks, passport and visa checks, reports, alerts, saved routes, journey plans, timeline, and support requests."
      />

      <section className="section no-top-pad" id="account-summary">
        <AccountSummary />
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Start here</p>
            <h2>What your account connects</h2>
            <p className="section-intro">
              Start with a profile. After that, saved routes, reports, alerts, timeline events, journey plans, visa-benefit checks, and support requests can stay connected to the same verified email.
            </p>
          </div>
          <span className="status-dot">Available now</span>
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
            <h2>Profile → route → passport → visa power → report → plan → alert → support</h2>
            <p className="section-intro">
              MoveReady should feel like a guided workspace, not a collection of separate forms. Use the steps below as the normal path.
            </p>
            <div className="mini-list">
              <div><strong>1. Save or load your profile</strong><span>Add your contact, country, target country, goal, money available, family count, and timeline.</span></div>
              <div><strong>2. Check the route you care about</strong><span>Use your active profile to see whether the route looks sensible before spending money.</span></div>
              <div><strong>3. Check your passport</strong><span>Use Passport Index to understand your passport baseline and open destination-specific rules.</span></div>
              <div><strong>4. Check visas you already hold</strong><span>Use Visa Power when a Canada, U.S., UK, Schengen, Australia, or Japan visa may create extra travel options.</span></div>
              <div><strong>5. Generate a readiness report</strong><span>See document gaps, funds pressure, risk flags, and next actions.</span></div>
              <div><strong>6. Build the execution plan</strong><span>Use Journey Planner for document legalization, family members, appointments, and post-arrival settlement.</span></div>
              <div><strong>7. Create alerts and timeline actions</strong><span>Track dates, source changes, deadlines, and reminders only when you opt in.</span></div>
              <div><strong>8. Ask for support when needed</strong><span>Request expert, document, insurance, courier, admission, or settlement review after you understand the route and plan.</span></div>
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
              Use the same verified email. After saving, you can check a route, passport, Visa Power, generate a report, save a route, create an alert, build a journey plan, add timeline events, or request support.
            </p>
          </div>
          <span className="status-dot">Verified account</span>
        </div>
        <ProfileDashboard />
      </section>
    </main>
  );
}
