const rules = [
  {
    title: "No lottery or ballot promises",
    text: "MoveReady can help users track official lottery, ballot, pool, quota, and cap routes. It must not promise selection, improve random chances, submit duplicate entries, or encourage users to pay anyone who claims guaranteed success.",
  },
  {
    title: "Official submission channels",
    text: "Where a route has an official government or authorized submission portal, users should be directed to that source. MoveReady should help users prepare correctly, not replace official submission rules.",
  },
  {
    title: "Sensitive documents",
    text: "Passport, certificate, bank, identity, family, and business documents should be requested only when necessary. Courier, notarization, apostille, legalization, and translation workflows require screened providers and clear handling rules.",
  },
  {
    title: "Alerts require opt-in",
    text: "WhatsApp, Telegram, email, phone, and in-app notifications should be sent only after clear user opt-in and only for saved routes, opportunities, services, or deadlines selected by the user.",
  },
  {
    title: "High-risk cases",
    text: "Refusals, protection claims, legal deadlines, inadmissibility concerns, and complex immigration cases should be marked for qualified expert or legal review instead of being treated as simple self-service workflows.",
  },
  {
    title: "Scam prevention",
    text: "MoveReady should warn users against fake job offers, fake appointments, fake scholarship requests, duplicate DV entries, unofficial payment demands, and providers claiming guaranteed visa approval.",
  },
];

export default function SafetyPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Safety rules</span></a>
        <nav className="nav"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/opportunities">Opportunities</a></nav>
      </header>

      <section className="legal-hero">
        <span className="eyebrow">Trust and safety</span>
        <h1>MoveReady should protect users before it sells services.</h1>
        <p className="lede">These rules keep the platform professional when handling visas, ballots, documents, alerts, service providers, and sensitive relocation decisions.</p>
      </section>

      <section className="legal-section">
        {rules.map((section) => (
          <article className="legal-block" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
