import GeneralServiceRequestForm from "@/components/GeneralServiceRequestForm";

const flows = [
  {
    title: "Notarization",
    text: "For documents that need a notary confirmation before use in another process or country.",
  },
  {
    title: "Apostille",
    text: "For documents moving between countries where apostille recognition applies and official instructions confirm it.",
  },
  {
    title: "Embassy legalization",
    text: "For countries or document types that require embassy or consular legalization after local authentication.",
  },
  {
    title: "Translation",
    text: "For certificates, bank evidence, civil documents, and route evidence that must be translated into an accepted language.",
  },
  {
    title: "Ministry authentication",
    text: "For routes requiring foreign affairs, education, justice, or issuing-authority authentication before use abroad.",
  },
  {
    title: "Courier handoff",
    text: "For pickup and delivery steps after provider screening and user consent are confirmed.",
  },
];

export default function LegalizationPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Document legalization</span></a>
        <nav className="nav" aria-label="Main navigation">
          <a href="/">Home</a><a href="/services">Services</a><a href="/courier">Courier</a><a href="/sources">Sources</a><a href="/route-checker">Route Checker</a>
        </nav>
      </header>

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Available: request capture</span>
          <h1>Check whether documents need notarization, apostille, legalization, or translation.</h1>
          <p className="lede">Users can describe the issuing country, receiving country, document type, and route purpose so MoveReady can review the correct handling path before any provider handoff.</p>
        </div>
      </section>

      <section className="section no-top-pad">
        <h2>Common handling paths</h2>
        <p className="section-intro">The right path depends on the document, issuing country, receiving country, destination authority, language, and visa or relocation route.</p>
        <div className="grid">{flows.map((item) => <article className="card" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </section>

      <section className="section" id="request-legalization">
        <GeneralServiceRequestForm defaultService="legalization" />
      </section>
    </main>
  );
}
