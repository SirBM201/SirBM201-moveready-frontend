const sections = [
  {
    title: "Information we collect",
    text: "MoveReady may collect contact details, current and target country, route interests, budget inputs, document-readiness answers, watchlist choices, service requests, provider applications, and generated report data.",
  },
  {
    title: "How we use information",
    text: "We use submitted information to generate readiness outputs, save routes, retrieve reports, manage watchlists, review service or provider requests, and contact users only where they have requested or consented to follow-up.",
  },
  {
    title: "Service providers",
    text: "Where a user requests courier, insurance, legalization, translation, expert review, admission, accommodation, pickup, or settlement support, relevant details may be reviewed by approved MoveReady staff or screened partners only for the requested workflow.",
  },
  {
    title: "User control",
    text: "Users may request correction, deletion, or review of saved information. Watchlist and alert preferences can be changed or stopped when the account and notification tools are enabled.",
  },
  {
    title: "Sensitive documents",
    text: "MoveReady should not request unnecessary sensitive documents. When document upload or courier workflows are enabled, access, handling, tracking, and retention rules must be reviewed before public use.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Privacy</span></a>
        <nav className="nav"><a href="/safety">Safety</a><a href="/terms">Terms</a><a href="/services">Services</a></nav>
      </header>

      <section className="legal-hero">
        <span className="eyebrow">Privacy notice</span>
        <h1>How MoveReady handles user information.</h1>
        <p className="lede">This notice explains the information MoveReady may collect and how it is used for route readiness, service requests, saved routes, alerts, and reports.</p>
      </section>

      <section className="legal-section">
        {sections.map((section) => (
          <article className="legal-block" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
