import SiteHeader from "@/components/SiteHeader";
import AccountSummary from "@/components/AccountSummary";
import ProfileDashboard from "@/components/ProfileDashboard";

const accountAreas = [
  {
    title: "Create your profile",
    detail: "Add your country, nationality, target country, goal, timeline, funds, family count, and contact details once.",
    href: "#profile-dashboard",
  },
  {
    title: "Save routes to compare later",
    detail: "Keep serious country and route options in one place so you do not lose the choices you are considering.",
    href: "/saved-routes",
  },
  {
    title: "Track important changes",
    detail: "Opt in to watch deadlines, opening windows, requirement changes, and source-review reminders.",
    href: "/watchlist",
  },
  {
    title: "Build your timeline",
    detail: "Turn your relocation idea into dated actions for documents, appointments, payments, results, and follow-up tasks.",
    href: "/timeline",
  },
  {
    title: "Read your reports",
    detail: "Open saved readiness reports with risk labels, source status, document gaps, and next steps.",
    href: "/my-reports",
  },
  {
    title: "Ask for practical support",
    detail: "Request expert review or document support only when you want help and consent has been captured.",
    href: "/service-requests",
  },
];

const trustControls = [
  "Your private profile, reports, and service requests are not public.",
  "MoveReady asks for consent before contact, alerts, or support requests.",
  "Reports show risk labels, source status, and generated date.",
  "MoveReady gives readiness guidance; it does not promise approval, admission, jobs, lottery selection, or ballot success.",
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
    status: "Coming soon",
    title: "Paid account features",
    detail: "Premium reports, refresh history, expert review, and provider handoff will stay behind clear consent and review steps.",
  },
];

export default function DashboardPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="My Account" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Account Center</span>
          <h1>Use one profile for your whole relocation plan.</h1>
          <p className="lede">
            Save your key details once, then use them for route checks, saved routes, watchlist alerts, timelines, readiness reports, and service requests. This keeps MoveReady simple: profile first, then actions.
          </p>
          <div className="actions">
            <a className="btn primary" href="#profile-dashboard">Start with my profile</a>
            <a className="btn" href="/login">Sign in</a>
            <a className="btn" href="/my-reports">My reports</a>
            <a className="btn" href="/saved-routes">Saved routes</a>
            <a className="btn" href="/watchlist">Watchlist</a>
            <a className="btn" href="/service-requests">Service requests</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <p className="overline">Start here</p>
            <h2>What your account connects</h2>
            <p className="section-intro">
              Start with a profile. After that, every saved route, report, alert, timeline event, and service request can stay connected to the same email or phone. Sign in with email when you want a verified account session.
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
        <AccountSummary />
      </section>

      <section className="section">
        <div className="live-workspace">
          <article className="workflow-panel">
            <p className="overline">Simple flow</p>
            <h2>Profile → route → report → alert → support</h2>
            <p className="section-intro">
              MoveReady should feel like a guided workspace, not a collection of separate forms. Use the steps below as the normal path.
            </p>
            <div className="mini-list">
              <div><strong>1. Create or load your profile</strong><span>Add your contact, country, target country, goal, funds, family count, and timeline.</span></div>
              <div><strong>2. Save the route you care about</strong><span>Keep the route or country option so you can return to it later.</span></div>
              <div><strong>3. Generate a readiness report</strong><span>See document gaps, funds pressure, risk flags, and next actions.</span></div>
              <div><strong>4. Create an alert</strong><span>Track important deadlines, route changes, and source-review reminders only when you opt in.</span></div>
              <div><strong>5. Request support when needed</strong><span>Ask for expert or document review after you understand your route and report.</span></div>
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
                <h2>What is available and what is coming</h2>
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
            <h2>Create or retrieve your profile</h2>
            <p className="section-intro">
              Use the same email or phone each time. After saving, you can generate a report, save a route, create a watchlist alert, or request expert review from the profile summary.
            </p>
          </div>
          <span className="status-dot">Contact lookup</span>
        </div>
        <ProfileDashboard />
      </section>
    </main>
  );
}
