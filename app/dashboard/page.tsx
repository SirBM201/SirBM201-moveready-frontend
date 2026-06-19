import SiteHeader from "@/components/SiteHeader";
import ProfileDashboard from "@/components/ProfileDashboard";

const accountAreas = [
  {
    title: "Relocation profile",
    detail: "Store the user context once so country comparisons, route checks, reports, alerts, and service requests can reuse the same facts.",
    href: "#profile-dashboard",
  },
  {
    title: "Saved routes",
    detail: "Keep serious destination and visa route options in one place for later comparison and follow-up.",
    href: "/saved-routes",
  },
  {
    title: "Watchlist alerts",
    detail: "Let users opt in to monitor route changes, deadlines, opening windows, and source-review updates.",
    href: "/watchlist",
  },
  {
    title: "Timeline",
    detail: "Turn relocation ideas into dated steps, document reminders, and next actions.",
    href: "/timeline",
  },
  {
    title: "My reports",
    detail: "Connect generated readiness reports to the same user identity, including source version, risk labels, and generated date.",
    href: "/my-reports",
  },
  {
    title: "Service requests",
    detail: "Only hand users to trusted providers after consent, screening, and clear request context.",
    href: "/services",
  },
];

const trustControls = [
  "Never expose documents or service requests publicly.",
  "Require consent before contacting a user or sending alerts.",
  "Keep report source version, risk label, and generated date visible.",
  "Do not imply visa, admission, lottery, ballot, or job approval.",
];

const buildPhases = [
  {
    phase: "Phase 1",
    title: "Contact-based identity",
    detail: "Use email or phone lookup so the MVP can already connect profiles, saved routes, alerts, and requests.",
  },
  {
    phase: "Phase 2",
    title: "Email OTP login",
    detail: "Verify users before joining saved routes, reports, alerts, timelines, and service requests into one account.",
  },
  {
    phase: "Phase 3",
    title: "Paid account features",
    detail: "Add paid reports, premium monitoring, expert review, provider handoff, and report refresh history.",
  },
];

export default function DashboardPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="My Account" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Account Center design layer</span>
          <h1>One profile should power every MoveReady action.</h1>
          <p className="lede">
            The Account Center connects the user profile with saved routes, watchlist alerts, timelines, readiness reports, and service requests so MoveReady feels like one trusted relocation workspace instead of separate tools.
          </p>
          <div className="actions">
            <a className="btn primary" href="#profile-dashboard">Create or load profile</a>
            <a className="btn" href="/login">Sign in</a>
            <a className="btn" href="/my-reports">My reports</a>
            <a className="btn" href="/saved-routes">Saved routes</a>
            <a className="btn" href="/watchlist">Watchlist</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <p className="overline">Account map</p>
            <h2>What the account connects</h2>
            <p className="section-intro">
              Phase 1 can work with email or phone lookup. Later, email OTP login can verify identity and safely join every user-owned MoveReady record into one account history.
            </p>
          </div>
          <span className="status-dot">MVP identity layer</span>
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
            <p className="overline">User journey</p>
            <h2>Profile → route → report → alert → service</h2>
            <p className="section-intro">
              A user should not repeat the same details on every page. The saved profile becomes the base record for comparing routes, generating readiness reports, watching changes, and requesting trusted support.
            </p>
            <div className="mini-list">
              <div><strong>1. Profile</strong><span>Current country, nationality, target country, family, funds, goal, timeline, and consent.</span></div>
              <div><strong>2. Route</strong><span>Saved route or country option selected from comparison, route checker, or opportunity pages.</span></div>
              <div><strong>3. Report</strong><span>Readiness output with risk label, source confidence, version, and generated date.</span></div>
              <div><strong>4. Alert</strong><span>Opt-in monitoring for deadlines, application windows, policy changes, and source-review due dates.</span></div>
              <div><strong>5. Service</strong><span>Consent-based handoff to a screened provider only when the user asks for help.</span></div>
            </div>
          </article>

          <article className="result-panel">
            <div className="result-stack">
              <div className="result-block featured">
                <p className="overline">Trust controls</p>
                <h2>Keep MoveReady advisory, transparent, and consent-first.</h2>
                <div className="mini-list">
                  {trustControls.map((control) => (
                    <div key={control}><strong>Control</strong><span>{control}</span></div>
                  ))}
                </div>
              </div>

              <div className="result-block">
                <p className="overline">Build phases</p>
                <h2>Account identity roadmap</h2>
                <div className="mini-list">
                  {buildPhases.map((item) => (
                    <div key={item.phase}>
                      <strong>{item.phase}: {item.title}</strong>
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
            <p className="overline">Available now</p>
            <h2>Create or retrieve a relocation profile</h2>
            <p className="section-intro">
              This is the current working identity layer: save a profile with email or phone, then use it as the foundation for readiness reports, saved routes, watchlist alerts, timelines, and service requests.
            </p>
          </div>
          <span className="status-dot">Contact lookup</span>
        </div>
        <ProfileDashboard />
      </section>
    </main>
  );
}
