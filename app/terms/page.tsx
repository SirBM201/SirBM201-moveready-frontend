const terms = [
  {
    title: "Readiness support only",
    text: "MoveReady helps users prepare, compare, save, monitor, and organize relocation or travel pathways. It does not replace official government instructions, legal advice, embassy decisions, or licensed immigration representation.",
  },
  {
    title: "No approval guarantee",
    text: "MoveReady does not guarantee visa approval, lottery or ballot selection, scholarship awards, appointment availability, courier outcome, insurance acceptance, admission, employment, residence, or settlement results.",
  },
  {
    title: "Official sources come first",
    text: "Users remain responsible for checking official government, embassy, university, insurer, courier, and provider sources before submitting applications, paying fees, booking travel, or sending documents.",
  },
  {
    title: "Providers and partners",
    text: "Third-party providers are independent. MoveReady may screen providers before listing or handoff, but users should review provider terms, prices, timelines, refund rules, and identity before using any paid service.",
  },
  {
    title: "Paid services",
    text: "Before paid reports, reviews, courier, insurance, legalization, or partner services are activated, MoveReady should publish clear pricing, refund, cancellation, and dispute-handling rules.",
  },
];

export default function TermsPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Terms</span></a>
        <nav className="nav"><a href="/privacy">Privacy</a><a href="/safety">Safety</a><a href="/route-checker">Route Checker</a></nav>
      </header>

      <section className="legal-hero">
        <span className="eyebrow">Terms of use</span>
        <h1>Use MoveReady as a readiness tool, not an approval guarantee.</h1>
        <p className="lede">These terms set clear boundaries for information, reports, alerts, service requests, provider handoff, and future paid features.</p>
      </section>

      <section className="legal-section">
        {terms.map((section) => (
          <article className="legal-block" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
