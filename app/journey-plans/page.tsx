import JourneyPlansLookup from "@/components/JourneyPlansLookup";
import SiteHeader from "@/components/SiteHeader";


const privacyRules = [
  {
    title: "Verified account only",
    text: "Journey plans are loaded from the signed-in email that was attached server-side when the plan was generated.",
  },
  {
    title: "Anonymous runs stay anonymous",
    text: "A plan generated without a verified account cannot be recovered by guessing an email later.",
  },
  {
    title: "Guidance remains advisory",
    text: "Saved plans organize tasks and risks but do not replace current official rules or professional advice where required.",
  },
];


export default function JourneyPlansPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="My Journey Plans" />

      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <div className="panel-heading">
            <div>
              <p className="overline">Private account history</p>
              <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>
                Return to document, family, appointment, and settlement plans.
              </h1>
              <p className="section-intro" style={{ marginBottom: 0 }}>
                Load planning runs connected to your verified account, review the warnings, and continue into timeline, route checking, or optional support.
              </p>
            </div>
            <span className="status-dot">Private</span>
          </div>
          <div className="actions" style={{ marginTop: 14 }}>
            <a className="btn primary" href="#journey-plan-history">Load my plans</a>
            <a className="btn" href="/journey-planner">Create new plan</a>
            <a className="btn" href="/dashboard">Back to Account</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="journey-plan-history">
        <JourneyPlansLookup />
      </section>

      <section className="section">
        <div className="grid">
          {privacyRules.map((rule) => (
            <article className="card" key={rule.title}>
              <h3>{rule.title}</h3>
              <p>{rule.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
