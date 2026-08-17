import AccountEvidenceSummary from "@/components/AccountEvidenceSummary";
import AccountSummary from "@/components/AccountSummary";
import DashboardCommandCenter from "@/components/DashboardCommandCenter";
import ProfileDashboard from "@/components/ProfileDashboard";
import SiteHeader from "@/components/SiteHeader";

const secondaryWorkspaces = [
  ["Guided setup", "/onboarding", "Complete profile and route foundations in order."],
  ["My Journey", "/my-journey", "Review every recorded stage from profile through settlement."],
  ["Route Checker", "/route-checker", "Verify source status, requirements, funds, and risks."],
  ["Visa Power", "/visa-power", "Check held-visa possibilities with personal-history safety gates."],
  ["Planning tools", "/journey-plans", "Plan study, family, appointments, travel, and settlement."],
  ["Reports", "/my-reports", "Open saved readiness reports and their source warnings."],
  ["Timeline", "/timeline", "Review dated tasks after confirming official deadlines."],
  ["Activity", "/activity", "See private account activity chronologically."],
  ["Settings and privacy", "/settings", "Manage sessions, accessibility, consent, export, and privacy."],
  ["Billing", "/billing", "Review quotes, scope, fees, refund terms, and payment status."],
  ["Support", "/support-center", "Open a controlled support or provider request."],
];

const trustControls = [
  "The command center reads existing private records; it does not create a duplicate dashboard data store.",
  "Document and application workspaces accept metadata only, not raw identity files, full document numbers, passwords, OTPs, card data, or private keys.",
  "A ready status means ready for the next planning check. It never means eligible, approved, hired, admitted, funded, booked, or authorized.",
  "Official sources, deadlines, time zones, fees, appointment channels, and entry conditions still require verification before action.",
  "External messages, payments, provider handoffs, and destructive privacy actions remain behind their own consent and production controls.",
];

export default function DashboardPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="My Account" />

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">B13 · Dashboard orchestration</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                One profile. Seven connected engines. One clear next action.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                Move through FIND, QUALIFY, and MOVE without guessing which workspace to open next. Your private records remain in their original controlled systems.
              </p>
            </div>
            <span className="status-dot">FIND → QUALIFY → MOVE</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#command-center">Show my next action</a>
            <a className="btn" href="/my-journey">Open My Journey</a>
            <a className="btn" href="/login">Sign in</a>
          </div>
        </div>
      </section>

      <DashboardCommandCenter />

      <section className="section no-top-pad" id="account-summary">
        <details className="result-block">
          <summary><strong>View detailed account totals and execution records</strong></summary>
          <p>Open this when you need counts for profiles, routes, evidence, applications, reports, and ranked actions.</p>
          <AccountSummary />
          <AccountEvidenceSummary />
        </details>
      </section>

      <section className="section no-top-pad">
        <details className="result-block">
          <summary><strong>Open secondary tools and account controls</strong></summary>
          <p>These tools remain available without competing with your next best action.</p>
          <div className="grid">
            {secondaryWorkspaces.map(([title, href, detail]) => (
              <a className="card" href={href} key={title}>
                <h3>{title}</h3>
                <p>{detail}</p>
              </a>
            ))}
          </div>
        </details>
      </section>

      <section className="section no-top-pad">
        <details className="result-block soft">
          <summary><strong>Read privacy, source, and decision boundaries</strong></summary>
          <div className="mini-list">
            {trustControls.map((control) => (
              <div key={control}><strong>Trust rule</strong><span>{control}</span></div>
            ))}
          </div>
        </details>
      </section>

      <section className="section" id="profile-dashboard">
        <div className="section-heading-row">
          <div>
            <p className="overline">Shared profile foundation</p>
            <h2>Save the facts every engine should use</h2>
            <p className="section-intro">
              Keep country, nationality, target, goal, timeline, family, and available-funds context in one verified account. Unknown facts remain needs assessment.
            </p>
          </div>
          <span className="status-dot">Verified account</span>
        </div>
        <ProfileDashboard />
      </section>
    </main>
  );
}
