import GeneralServiceRequestForm from "@/components/GeneralServiceRequestForm";
import JourneyPlanner from "@/components/JourneyPlanner";
import SiteHeader from "@/components/SiteHeader";


const flows = [
  {
    title: "Notarization",
    text: "Confirm whether the notary must certify a signature, copy, affidavit, translation, or another fact.",
  },
  {
    title: "Apostille",
    text: "Use this path only when the competent authority and receiving institution confirm that apostille recognition applies.",
  },
  {
    title: "Embassy legalization",
    text: "Confirm whether local authentication must be completed before consular or embassy legalization.",
  },
  {
    title: "Translation",
    text: "Check accepted language, translator qualification, certification wording, stamps, and document-binding requirements.",
  },
  {
    title: "Ministry authentication",
    text: "Confirm the correct foreign affairs, education, justice, or issuing authority and the order of processing.",
  },
  {
    title: "Courier handoff",
    text: "Use tracked and insured handling only after provider screening, custody, return, and user-consent rules are confirmed.",
  },
];


export default function LegalizationPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Document legalization" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Live document-path planner</span>
          <h1>Organize notarization, apostille, legalization, authentication, and translation steps.</h1>
          <p className="lede">
            Enter the issuing country, receiving country, document type, purpose, confirmed authority instructions, and deadline. MoveReady will organize the path without guessing which legal process applies.
          </p>
          <div className="actions">
            <a className="btn primary" href="#legalization-planner">Build document path</a>
            <a className="btn" href="/journey-planner">Open full journey planner</a>
            <a className="btn" href="/courier">Courier support</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <h2>Common handling paths</h2>
        <p className="section-intro">
          The correct sequence depends on the document, issuing country, receiving country, destination authority, language, and route purpose.
        </p>
        <div className="grid">{flows.map((item) => <article className="card" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </section>

      <section className="section" id="legalization-planner">
        <JourneyPlanner mode="legalization" />
      </section>

      <section className="section" id="request-legalization">
        <GeneralServiceRequestForm defaultService="legalization" />
      </section>
    </main>
  );
}
