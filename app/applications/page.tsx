import ApplicationCaseWorkspace from "@/components/ApplicationCaseWorkspace";
import SiteHeader from "@/components/SiteHeader";

const controls = [
  {
    title: "One case, one auditable history",
    text: "Connect the route, authority, evidence pack, appointment, submission, deadline, fee, payment status, additional-document request, and decision under one private case reference.",
  },
  {
    title: "Masked references only",
    text: "Use a short masked hint such as the last four characters. Do not store a full authority, passport, permit, payment, bank, or identity reference.",
  },
  {
    title: "Official source and deadline first",
    text: "Every active case should retain the current official tracking or instruction source. Generated reminders do not replace the authority’s exact time zone, channel, or deadline.",
  },
  {
    title: "Decision truthfulness",
    text: "Approved, refused, withdrawn, expired, and closed cases require a decision or closure date and a factual result summary. Refusal is not approval, and denied admission is not a successful visit.",
  },
];

export default function ApplicationsPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Private Application Center" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Verified account case manager</span>
          <h1>Track a real application from research to decision in one private workspace.</h1>
          <p className="lede">
            Link route, evidence, appointment, submission, deadlines, fees, source status, additional-document requests, communications, and the final decision without uploading raw authority correspondence.
          </p>
          <div className="actions">
            <a className="btn primary" href="#application-workspace">Open Application Center</a>
            <a className="btn" href="/evidence-pack">Evidence Center</a>
            <a className="btn" href="/timeline">Timeline</a>
            <a className="btn" href="/dashboard">Account Center</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad" id="application-workspace">
        <ApplicationCaseWorkspace />
      </section>

      <section className="section">
        <div className="grid">
          {controls.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
