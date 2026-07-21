import SiteHeader from "@/components/SiteHeader";
import BeginnerFriendlyGuide from "@/components/BeginnerFriendlyGuide";

const simpleSteps = [
  {
    title: "1. Tell MoveReady what you want",
    text: "Start with your goal, where you live now, and where you want to go. You do not need perfect answers yet.",
    action: "Check my route",
    href: "/route-checker",
  },
  {
    title: "2. Check your passport first",
    text: "Use Passport Index to see your passport baseline before applying for another visa or paying an agent.",
    action: "Check passport",
    href: "/passport-index",
  },
  {
    title: "3. Check the power of visas you already hold",
    text: "Use Visa Power to see whether your Canada, U.S., UK, Schengen, Australia, or Japan visa may unlock extra travel benefits.",
    action: "Check visa power",
    href: "/visa-power",
  },
  {
    title: "4. Compare before you spend money",
    text: "Look at countries and routes side by side before paying for documents, agents, tickets, hotels, or support.",
    action: "Compare routes",
    href: "/compare",
  },
  {
    title: "5. Save one profile",
    text: "Create one clear profile in Account. This keeps your reports, saved routes, alerts, timeline, and support requests together.",
    action: "Open Account",
    href: "/dashboard",
  },
  {
    title: "6. Generate a readiness report",
    text: "Use the report to see your document gaps, funds pressure, risk label, and next actions. It is guidance, not approval.",
    action: "My reports",
    href: "/my-reports",
  },
  {
    title: "7. Watch important changes",
    text: "Create alerts only for routes or opportunities you truly care about, such as openings, closing dates, document changes, or source updates.",
    action: "Create alerts",
    href: "/watchlist",
  },
  {
    title: "8. Ask for support only when needed",
    text: "Request help for document review, translation, insurance, courier, accommodation, pickup, or settlement only after your route is clearer.",
    action: "Request support",
    href: "/services",
  },
];

const plainRules = [
  "MoveReady does not promise visa, admission, job, lottery, ballot, travel entry, or route approval.",
  "Use official sources first before paying money or uploading sensitive documents.",
  "Choose one active profile so the app does not confuse old test profiles with your real plan.",
  "Read the risk label before acting. A high score is not the same as approval.",
  "Passport Index and Visa Power are planning tools only. Airlines and border officers still make their own checks.",
];

const whoNeedsWhat = [
  {
    title: "I do not know where to go",
    text: "Use Decide and Countries first.",
    href: "/decision-center",
  },
  {
    title: "I want to know what my passport can do",
    text: "Use Passport Index to check your passport baseline and travel-access categories.",
    href: "/passport-index",
  },
  {
    title: "I already have a strong visa",
    text: "Use Visa Power to check possible travel benefits before applying for another visa.",
    href: "/visa-power",
  },
  {
    title: "I already know the country",
    text: "Use Check Route, then generate a readiness report.",
    href: "/route-checker",
  },
  {
    title: "I want to track openings",
    text: "Use Alerts to watch route openings, closing dates, and document changes.",
    href: "/watchlist",
  },
  {
    title: "I need practical help",
    text: "Use Services, but only after you understand the route and risk.",
    href: "/services",
  },
];

const nextActions = [
  {
    title: "New user",
    text: "Open Account and save your details once.",
    href: "/dashboard",
  },
  {
    title: "Returning user",
    text: "Open Check Route. It should load your active profile automatically.",
    href: "/route-checker",
  },
  {
    title: "Only checking passport strength",
    text: "Open Passport Index to see your passport baseline first.",
    href: "/passport-index",
  },
  {
    title: "Already have Canada, U.S., UK, Schengen, Australia, or Japan visa",
    text: "Open Visa Power and check what extra destinations may become easier.",
    href: "/visa-power",
  },
  {
    title: "Already generated a report",
    text: "Open Reports to review your risk label and next steps.",
    href: "/my-reports",
  },
  {
    title: "Need updates later",
    text: "Open Alerts and choose only the routes you truly care about.",
    href: "/watchlist",
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
            <a className="btn primary" href="/route-checker">Check my route</a>
            <a className="btn" href="/passport-index">Check passport</a>
            <a className="btn" href="/visa-power">Check visa power</a>
            <a className="btn" href="/dashboard">Open Account</a>
            <a className="btn" href="/decision-center">Help me decide</a>
          </div>
        </div>

        <aside className="workflow-panel">
          <h2>Best simple order</h2>
          <div className="mini-list">
            <div><strong>First</strong><span>Save or load one profile in Account.</span></div>
            <div><strong>Second</strong><span>Check or compare your route.</span></div>
            <div><strong>Third</strong><span>Check what your passport can do by itself.</span></div>
            <div><strong>Fourth</strong><span>Check visas you already hold with Visa Power.</span></div>
            <div><strong>Fifth</strong><span>Generate a readiness report.</span></div>
            <div><strong>Sixth</strong><span>Set alerts or request support only when needed.</span></div>
          </div>
        </aside>
      </section>

      <BeginnerFriendlyGuide
        compact
        title="MoveReady in plain English"
        intro="Use this app like a checklist. It helps you decide, prepare, and avoid unnecessary spending. It does not replace official immigration, embassy, school, airline, or employer instructions."
      />

      <section className="section no-top-pad">
        <div className="section-heading-row">
          <div>
            <p className="overline">What to do next</p>
            <h2>Pick the box that matches you</h2>
            <p className="section-intro">
              This is the fastest way to choose the right page without understanding every feature.
            </p>
          </div>
          <span className="status-dot">Plain language</span>
        </div>
        <div className="grid">
          {nextActions.map((item) => (
            <a className="card" href={item.href} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
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
            <a className="btn" href="/passport-index">Check passport</a>
            <a className="btn" href="/visa-power">Check visa power</a>
            <a className="btn" href="/dashboard">Go to Account</a>
            <a className="btn" href="/trust">Read trust and safety</a>
          </div>
        </div>
      </section>
    </main>
  );
}
