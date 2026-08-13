const tracks = [
  { title: "IELTS General", language: "English", detail: "Reading, listening, vocabulary, grammar and exam-style practice." },
  { title: "TEF Canada", language: "French", detail: "French foundations, comprehension and immigration-focused exam practice." },
];

const daily = ["Diagnostic & target", "Daily microlearning", "Practice Question Bank", "Mistakes Bank", "Spaced review", "Readiness tracking"];

export default function LanguageCoachPage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/"><strong>Project MoveReady</strong><span>Language & exam coach</span></a>
        <nav className="nav"><a href="/dashboard">Dashboard</a><a href="/jobs">Jobs</a><a href="/routes">Routes</a><a href="/profile">Profile</a></nav>
      </header>

      <section className="hero-band">
        <div className="hero-copy">
          <span className="eyebrow">QUALIFY · LANGUAGE COACH</span>
          <h1>Build the language score your opportunity needs.</h1>
          <p className="lede">Choose English, French, or both. MoveReady can recommend a study balance from your goals, but you remain in control of the final learning plan.</p>
          <div className="button-row"><a className="btn primary" href="#setup">Set up my plan</a><a className="btn" href="#practice">View practice flow</a></div>
        </div>
        <aside className="workflow-panel" id="setup">
          <h2>Learning setup</h2>
          <div className="form-grid">
            <div className="field"><label>Languages</label><select defaultValue="both"><option value="english">English</option><option value="french">French</option><option value="both">English + French</option></select></div>
            <div className="field"><label>When learning both</label><select defaultValue="50/50"><option>50/50</option><option>70/30 English/French</option><option>30/70 English/French</option></select></div>
            <div className="field"><label>Daily target</label><select defaultValue="10"><option value="5">5 minutes</option><option value="10">10 minutes</option><option value="15">15 minutes</option><option value="20">20 minutes</option></select></div>
          </div>
          <p className="muted">No forced French. Recommendations never override your selected language track.</p>
        </aside>
      </section>

      <section className="section" id="practice">
        <span className="eyebrow">LAUNCH TRACKS</span><h2>Focused preparation, not generic language lessons</h2>
        <div className="grid">{tracks.map((track) => <article className="card" key={track.title}><span className="eyebrow">{track.language}</span><h3>{track.title}</h3><p>{track.detail}</p><p className="muted">Practice uses legally permitted official material or original MoveReady exam-style questions.</p></article>)}</div>
      </section>

      <section className="section">
        <span className="eyebrow">ADAPTIVE DAILY LOOP</span><h2>Short sessions that learn from mistakes</h2>
        <div className="grid">{daily.map((item, index) => <article className="card" key={item}><span className="eyebrow">{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><p>{index === 3 ? "Wrong answers return to a personal review bank instead of disappearing." : index === 4 ? "Items return when review is useful, with difficulty adapting as mastery improves." : "A focused part of the qualification loop, designed for repeatable daily progress."}</p></article>)}</div>
      </section>

      <section className="section"><article className="card"><span className="eyebrow">MOMENTUM, NOT PUNISHMENT</span><h2>Missing one day should not erase months of work.</h2><p>MoveReady will track consistency and recovery rather than using a destructive all-or-nothing streak. Delivery architecture can later extend short challenges and weekly reports to push, email and approved messaging channels.</p></article></section>
    </main>
  );
}
