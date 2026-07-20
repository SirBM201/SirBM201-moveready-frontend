import SiteHeader from "@/components/SiteHeader";

const simpleSteps = [
  {
    title: "1. Tell MoveReady what you want",
    text: "Start with your goal, where you live now, and where you want to go. You do not need perfect answers yet.",
    action: "Check my route",
    href: "/route-checker",
  },
  {
    title: "2. Compare before you spend money",
    text: "Look at countries and routes side by side before paying for documents, agents, tickets, hotels, or support.",
    action: "Compare routes",
    href: "/compare",
  },
  {
    title: "3. Save one profile",
    text: "Create one clear profile in My Account. This keeps your reports, saved routes, alerts, timeline, and support requests together.",
    action: "Open My Account",
    href: "/dashboard",
  },
  {
    title: "4. Generate a readiness report",
    text: "Use the report to see your document gaps, funds pressure, risk label, and next actions. It is guidance, not approval.",
    action: "My reports",
    href: "/my-reports",
  },
  {
    title: "5. Watch important changes",
    text: "Create alerts only for routes or opportunities you truly care about, such as openings, closing dates, document changes, or source updates.",
    action: "Open Watchlist",
    href: "/watchlist",
  },
  {
    title: "6. Ask for support only when needed",
    text: "Request help for document review, translation, insurance, courier, accommodation, pickup, or settlement only after your route is clearer.",
    action: "Request support",
    href: "/services",
  },
];

const plainRules = [
  "MoveReady does not promise visa, admission, job, lottery, ballot, or route approval.",
  "Use official sources first before paying money or uploading sensitive documents.",
  "Choose one active profile so the app does not confuse old test profiles with your real plan.",
  "Read the risk label before acting. A high score is not the same as approval.",
];

const whoNeedsWhat = [
  {
    title: "I do not know where to go",
    text: "Use Decision Center and Compare Countries first.",
    href: "/decision-center",
  },
  {
    title: "I already know the country",
    text: "Use Route Checker, then generate a readiness report.",
    href: "/route-checker",
  },
  {
    title: "I want to track openings",
    text: "Use Opportunities and Watchlist alerts.",
    href: "/opportunities",
  },
  {
    title: "I need practical help",
    text: "Use Services, but only after you understand the route and risk.",
    href: "/services",
  },
];

export default function StartPage() {
  return (
    <main className="page-shell">
      <SiteHeader subtitle="Start guide" />

      <section className="hero-band">
        <div className="hero-copy">
          <span className="eyebrow">Start here</span>
          <h1>Use MoveReady one step at a time.</h1>
          <p className="lede">
            This page explains what to do first, what to do next, and what not to treat as guaranteed. It is written for everyday users, not immigration experts.
          </p>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Start with route checker</a>
            <a className="btn" href="/dashboard">Open My Account</a>
            <a className="btn" href="/decision-center">I need help deciding</a>
          </div>
        </div>

        <aside className="workflow-panel">
          <h2>Best simple order</h2>
          <div className="mini-list">
            <div><strong>First</strong><span>Check or compare your route.</span></div>
            <div><strong>Second</strong><span>Save one profile in My Account.</span></div>
            <div><strong>Third</strong><span>Generate a readiness report.</span></div>
            <div><strong>Fourth</strong><span>Set alerts or request support only when needed.</span></div>
          </div>
        </aside>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <p className="overline">Simple steps</p>
            <h2>What to do in MoveReady</h2>
            <p className="section-intro">
              Follow these steps in order. You can come back later and update your profile or report when your plan changes.
            </p>
          </div>
          <span className="status-dot">Beginner friendly</span>
        </div>
        <div className="grid">
          {simpleSteps.map((step) => (
            <a className="card" href={step.href} key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <span className="badge">{step.action}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading-row">
          <div>
            <p className="overline">Choose the right tool</p>
            <h2>Which page should I use?</h2>
          </div>
          <a className="btn" href="/navigation-map">Open navigation map</a>
        </div>
        <div className="grid">
          {whoNeedsWhat.map((item) => (
            <a className="card" href={item.href} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="result-block featured">
          <div className="panel-heading">
            <div>
              <p className="overline">Trust rules</p>
              <h2>Important things to remember</h2>
            </div>
            <span className="status-dot">No shortcuts</span>
          </div>
          <div className="mini-list">
            {plainRules.map((rule) => (
              <div key={rule}><strong>Remember</strong><span>{rule}</span></div>
            ))}
          </div>
          <div className="actions">
            <a className="btn primary" href="/route-checker">Check my route</a>
            <a className="btn" href="/dashboard">Go to My Account</a>
            <a className="btn" href="/trust">Read trust and safety</a>
          </div>
        </div>
      </section>
    </main>
  );
}
