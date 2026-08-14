import SiteHeader from "@/components/SiteHeader";

const checklist = [
  ["Identity & passport", "Required", "Passport validity, identity consistency and any route-specific copy or photo requirements."],
  ["Financial evidence", "Route-specific", "Bank history, proof of funds, sponsor evidence, scholarship/funding letter or business funds where permitted."],
  ["Purpose / qualifying evidence", "Required", "Job offer, admission, business/founder evidence, invitation, relationship proof or other evidence tied to the selected pathway."],
  ["Education & career", "Conditional", "Credentials, transcripts, employment letters, licences, CV or skills evidence when the pathway requires them."],
  ["Civil & family documents", "Conditional", "Birth, marriage, custody, police or dependant evidence where applicable."],
  ["Health / insurance", "Conditional", "Medical examination, travel, student, health or family insurance depending on the authority and pathway."],
  ["Translation / authentication", "Conditional", "Certified translation, notarization, apostille, consular legalization or authentication only where the destination requires it."],
];

const states = [
  ["Missing", "Required evidence has not been provided."],
  ["In progress", "The user is obtaining, translating, authenticating or correcting the document."],
  ["Ready", "The document appears available for the selected requirement, subject to final authority review."],
  ["Expiring", "Validity may become a blocker before submission, travel or decision."],
  ["Needs verification", "The route rule, document format or source is not verified enough for a confident instruction."],
];

export default function DocumentChecklistPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Documents & execution" />
      <section className="section no-top-pad" style={{ paddingTop: 22 }}>
        <div className="result-block featured" style={{ boxShadow: "none" }}>
          <p className="overline">MOVE · Document Readiness</p>
          <h1 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", lineHeight: 1.08, margin: "4px 0 10px" }}>Prepare the evidence for the opportunity you actually selected.</h1>
          <p className="section-intro">A generic document list is only a starting point. V1 should turn the selected job or pathway into a personalized checklist with status, expiry, deadlines and source-aware requirements.</p>
          <div className="actions" style={{ marginTop: 14 }}><a className="btn primary" href="/evidence-pack">Manage my evidence</a><a className="btn" href="/route-checker">Opportunity Finder</a><a className="btn" href="/applications">Application tracker</a></div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="section-heading-row"><div><p className="overline">Status model</p><h2>Every required item needs an actionable state</h2></div><span className="status-dot">Checklist → action</span></div>
        <div className="grid">{states.map(([name, detail]) => <article className="card" key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
      </section>

      <section className="section">
        <div className="section-heading-row"><div><p className="overline">Personalized checklist structure</p><h2>Evidence categories</h2><p className="section-intro">The exact requirement must come from the selected pathway/job context. Required, conditional and optional items should not be presented as if they apply universally.</p></div></div>
        <div className="grid">{checklist.map(([name, level, details]) => <article className="card" key={name}><h3>{name}</h3><p>{details}</p><div className="badge-row"><span className="badge">{level}</span><span className="badge">Route/source aware</span></div></article>)}</div>
      </section>

      <section className="section"><div className="live-workspace"><article className="workflow-panel"><p className="overline">Execution rules</p><h2>Do not make users reconstruct the application.</h2><div className="mini-list"><div><strong>Reuse profile data</strong><span>Known identity, education, career, family and financial facts should prefill requirements where appropriate.</span></div><div><strong>Track expiry</strong><span>Passport, police, medical, language and other time-sensitive evidence should feed deadline monitoring.</span></div><div><strong>Explain transformations</strong><span>When translation, legalization or authentication is required, show what is needed and why.</span></div><div><strong>Preserve provenance</strong><span>Material document rules should retain the official source and checked/updated date.</span></div></div></article><article className="result-panel"><div className="result-block featured"><p className="overline">Next best action</p><h2>One blocker first.</h2><p>When several items are missing, MoveReady should identify the highest-priority mandatory or time-sensitive blocker instead of presenting an undifferentiated wall of tasks.</p><div className="actions"><a className="btn primary" href="/action-center">See next actions</a><a className="btn" href="/timeline">Deadlines</a></div></div></article></div></section>
    </main>
  );
}
