import AccountEvidenceSummary from "@/components/AccountEvidenceSummary";
import AccountSummary from "@/components/AccountSummary";
import ProfileDashboard from "@/components/ProfileDashboard";
import SiteHeader from "@/components/SiteHeader";

const pillars = [
  { title: "FIND", detail: "Discover realistic pathways and local or international jobs instead of guessing which programme you need.", links: [["Opportunity & Route Finder", "/route-checker"], ["Local + international jobs", "/jobs"], ["Passport & Visa Power", "/visa-power"]] },
  { title: "QUALIFY", detail: "Close the gaps between where you are today and the opportunity you want.", links: [["Language Coach", "/language-coach"], ["Career profile & job matching", "/jobs"], ["Readiness reports", "/my-reports"]] },
  { title: "MOVE", detail: "Turn a viable pathway into documents, money targets, deadlines and a controlled application.", links: [["Evidence & documents", "/evidence-pack"], ["Financial readiness", "/readiness-tools"], ["Applications", "/applications"], ["Timeline", "/timeline"]] },
];

const lifecycle = [
  ["FIND", "Opportunity Finder, pathways, jobs, country comparison and Passport/Visa Power."],
  ["QUALIFY", "Skills, CV, language preparation, eligibility gaps and personalized readiness actions."],
  ["MOVE", "Requirements, funds, evidence, deadlines, application cases and execution plans."],
  ["SETTLE", "Arrival, housing, registrations, family, insurance and first-90-days preparation."],
  ["GROW", "Career progression, certifications, salary improvement and renewal planning."],
  ["FIND AGAIN", "Keep MoveReady useful after relocation by finding a better local role or a new global opportunity."],
];

const trustControls = [
  "MoveReady is advisory: eligibility scores, job matches and readiness indicators do not guarantee a visa, admission, employment or entry.",
  "International job priority must consider work authorization and employer sponsorship evidence; a high skills match alone is not enough.",
  "Official-source status and rule dates should be checked before users spend money or submit an application.",
  "Private account data, evidence metadata, application cases and learning progress stay separated from public reference content.",
  "Language practice uses MoveReady-original or legally permitted official material, not leaked or recalled live exam dumps.",
];

export default function DashboardPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="My MoveReady" />
      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <p className="overline">Global Opportunity & Mobility Platform</p>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 50px)", lineHeight: 1.05, margin: "6px 0 12px" }}>Find the opportunity. Qualify for it. Make the move.</h1>
          <p className="section-intro">MoveReady connects jobs, legitimate relocation pathways, language preparation, financial and document readiness, applications and post-arrival growth in one continuing journey.</p>
          <div className="actions" style={{ marginTop: 16 }}>
            <a className="btn primary" href="/route-checker">Find opportunities</a>
            <a className="btn" href="/jobs">Find jobs</a>
            <a className="btn" href="/language-coach">Language Coach</a>
            <a className="btn" href="/my-journey">My Journey</a>
            <a className="btn" href="/action-center">Next actions</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row"><div><p className="overline">Launch V1</p><h2>FIND → QUALIFY → MOVE</h2><p className="section-intro">Start from your goal. You do not need to know an immigration programme name before MoveReady can help.</p></div><span className="status-dot">Three launch pillars</span></div>
        <div className="grid">
          {pillars.map((pillar) => <article className="card" key={pillar.title}><p className="overline">{pillar.title}</p><h3>{pillar.title}</h3><p>{pillar.detail}</p><div className="actions">{pillar.links.map(([label, href]) => <a className="btn" href={href} key={href}>{label}</a>)}</div></article>)}
        </div>
      </section>

      <section className="section">
        <div className="live-workspace">
          <article className="workflow-panel"><p className="overline">Core product loop</p><h2>FIND → QUALIFY → MOVE → SETTLE → GROW → FIND AGAIN</h2><p className="section-intro">Relocation success should not end the relationship. MoveReady remains useful for settlement, career growth and the next opportunity.</p><div className="mini-list">{lifecycle.map(([stage, detail]) => <div key={stage}><strong>{stage}</strong><span>{detail}</span></div>)}</div></article>
          <article className="result-panel"><div className="result-block featured"><p className="overline">Reality and trust controls</p><h2>Prefer realistic opportunities over impressive-looking but unusable matches.</h2><div className="mini-list">{trustControls.map((rule) => <div key={rule}><strong>Rule</strong><span>{rule}</span></div>)}</div></div></article>
        </div>
      </section>

      <section className="section" id="account-summary"><div className="section-heading-row"><div><p className="overline">Your control centre</p><h2>One profile, connected execution</h2><p className="section-intro">Review saved account activity and evidence before continuing into the next action.</p></div></div><AccountSummary /><AccountEvidenceSummary /></section>

      <section className="section" id="profile-dashboard"><div className="section-heading-row"><div><p className="overline">Unified profile</p><h2>Save the information MoveReady needs to personalize opportunities</h2><p className="section-intro">Your profile should ultimately connect nationality/passport, current residence and authorization, education, work history, skills, languages, finances, family circumstances, target countries, relocation preferences and career goals.</p></div><span className="status-dot">Reuse, do not re-enter</span></div><ProfileDashboard /></section>

      <section className="section"><div className="section-heading-row"><div><p className="overline">Execution workspaces</p><h2>Continue where you need to act</h2></div></div><div className="grid">
        <a className="card" href="/onboarding"><h3>Guided setup</h3><p>Complete the minimum profile and account foundations.</p></a>
        <a className="card" href="/evidence-pack"><h3>Documents & evidence</h3><p>Track document metadata, expiry, translation, legalization and missing requirements.</p></a>
        <a className="card" href="/applications"><h3>Application tracker</h3><p>Track a real immigration, study or other supported application from submission to decision.</p></a>
        <a className="card" href="/application-alerts"><h3>Alerts & deadlines</h3><p>Review application deadlines, appointments, document requests and other actionable alerts.</p></a>
        <a className="card" href="/journey-plans"><h3>Relocation planning</h3><p>Plan study, family, travel, arrival and settlement execution without delaying launch-critical work.</p></a>
        <a className="card" href="/support-center"><h3>Support</h3><p>Request controlled expert or provider help where available.</p></a>
      </div></section>
    </main>
  );
}
