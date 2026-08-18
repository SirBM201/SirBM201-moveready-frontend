import type { Metadata } from "next";

import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Mobile and accessibility support",
  description: "How to use MoveReady on a phone, with a keyboard, with screen-reader announcements, and with personal reading preferences.",
};

const supportAreas = [
  {
    title: "Use MoveReady on a phone",
    detail: "The fixed phone navigation keeps FIND, QUALIFY, MOVE, Alerts, and Account available. Open More in the page header for every other workspace.",
  },
  {
    title: "Use a keyboard",
    detail: "Press Tab to move through links, forms, and buttons. A visible focus outline shows your position. Press Escape to close an open More navigation menu.",
  },
  {
    title: "Follow page and result changes",
    detail: "The current page is identified in navigation. Loading, signed-out, empty, error, and completed-result messages are announced without reading the entire page again.",
  },
  {
    title: "Adjust reading preferences",
    detail: "Verified users can choose larger text, higher contrast, reduced motion, and simpler guidance. MoveReady also respects supported device contrast and reduced-motion settings.",
  },
];

export default function AccessibilityPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Mobile and accessibility support" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">B15 · Mobile and accessibility completion</span>
          <h1>Clear actions on a phone, by keyboard, and with assistive technology.</h1>
          <p className="lede">
            MoveReady is a responsive web service. Critical relocation journeys are designed for small screens and include focus, status, error, and reading-preference support.
          </p>
          <div className="actions">
            <a className="btn primary" href="/onboarding">Start guided setup</a>
            <a className="btn" href="/settings#accessibility">Adjust accessibility settings</a>
            <a className="btn" href="/support-center">Ask for support</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" aria-labelledby="access-support-heading">
        <div className="section-heading-row">
          <div>
            <p className="overline">Supported access</p>
            <h2 id="access-support-heading">How the interface helps</h2>
          </div>
          <span className="status-dot">Responsive web</span>
        </div>
        <div className="grid">
          {supportAreas.map((area) => (
            <article className="card" key={area.title}>
              <h3>{area.title}</h3>
              <p>{area.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="access-boundaries-heading">
        <article className="result-block featured">
          <p className="overline">Important boundaries</p>
          <h2 id="access-boundaries-heading">Accessible guidance still needs official verification</h2>
          <div className="mini-list">
            <div><strong>Responsive web, not a native app</strong><span>Use MoveReady in a current phone or desktop browser. No separate iOS or Android app is required for B15.</span></div>
            <div><strong>Guidance, not approval</strong><span>Accessibility support does not change the advisory nature of route, visa, job, financial, or document guidance.</span></div>
            <div><strong>Official sources remain final</strong><span>Verify current rules, dates, fees, and submission instructions with the responsible government or official organization.</span></div>
          </div>
          <div className="actions">
            <a className="btn primary" href="/trust">Review trust rules</a>
            <a className="btn" href="/deployment-status">Check service status</a>
          </div>
        </article>
      </section>
    </main>
  );
}
