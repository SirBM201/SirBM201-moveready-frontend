"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const technicalQuestions = [
  "Walk me through your safe startup procedure for a PET preform line after a shutdown or mould change.",
  "How do you separate a process problem from a hot-runner, heater, cooling, material, or machine problem?",
  "Which production and quality signals do you monitor during a shift, and when do you escalate?",
  "Describe your experience with Husky, SIPA, Netstal, Ferromatik, Demark, and Sacmi equipment without overstating tasks handled by maintenance.",
  "How do PET water-grade, CSD, hot-fill, and limited rPET processing requirements change your checks?",
];

const leadershipQuestions = [
  "Tell me about a recurring production delay you diagnosed and reduced.",
  "How do you train a new operator and confirm the person can run safely without close supervision?",
  "Describe a time production pressure conflicted with safety or quality. What did you do?",
  "How do you hand over machine condition, downtime, quality risks, and priorities to the next shift?",
  "What would your operators and maintenance colleagues say about your leadership style?",
];

const canadaQuestions = [
  "Why are you targeting this company and this Canadian location?",
  "What work authorization do you currently hold, and what employer support would you require?",
  "How will your Kuwait and Nigeria manufacturing experience transfer to Canadian safety, quality, and documentation expectations?",
  "Which job title best reflects your experience and OND qualification without relying on a degree-only engineering title?",
];

const storyBank = [
  { title: "Startup improvement", evidence: "Sonnex: reduced the usual machine startup portion from about four hours to about two hours, with resin loading, preheating, and startup coordinated into a six-to-seven-hour total preparation window." },
  { title: "Production scale", evidence: "Sonnex: responsibility across 11 injection machines in an operation producing about 65 tonnes of preforms per day." },
  { title: "Team leadership", evidence: "Sonnex: shift responsibility included eight operators, two assistant shift leads, and a large labour team; describe the reporting structure precisely." },
  { title: "Current technical scope", evidence: "Genoa: PET preform and cap production across Husky, SIPA, Netstal, Ferromatik, and Demark machines, plus training new operators." },
];

export default function InterviewPreparationWorkspace() {
  const [role, setRole] = useState("Production Supervisor");
  const [company, setCompany] = useState("");
  const [focus, setFocus] = useState("balanced");
  const [prepared, setPrepared] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setRole(params.get("role") || "Production Supervisor");
      setCompany(params.get("company") || "");
    } catch {
      // Keep defaults.
    }
  }, []);

  const questions = useMemo(() => {
    if (focus === "technical") return [...technicalQuestions, ...leadershipQuestions.slice(0, 2), ...canadaQuestions];
    if (focus === "leadership") return [...leadershipQuestions, ...technicalQuestions.slice(0, 2), ...canadaQuestions];
    return [...technicalQuestions.slice(0, 4), ...leadershipQuestions.slice(0, 4), ...canadaQuestions];
  }, [focus]);

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPrepared(true);
    setChecked({});
  }

  return (
    <>
      <section className="jobs-page-heading">
        <div><span className="eyebrow">Interview preparation</span><h1>Prepare truthful, evidence-backed answers before the call.</h1><p className="lede">Use your real PET manufacturing experience, leadership examples, and machine knowledge. The Sprint 1 coach is a structured practice workspace; it does not generate invented achievements.</p></div>
        <div className="actions"><a className="btn" href="/jobs/applications">Back to applications</a><a className="btn" href="/jobs/resume-vault">Check resume version</a></div>
      </section>

      <section className="section jobs-section jobs-two-column">
        <form className="jobs-form" onSubmit={prepare}>
          <div className="panel-heading"><div><p className="overline">Practice setup</p><h2>Create an interview session</h2></div><span className="status-dot">No AI claims</span></div>
          <div className="field"><label htmlFor="interview_role">Target role</label><input id="interview_role" value={role} onChange={(event) => setRole(event.target.value)} required /></div>
          <div className="field"><label htmlFor="interview_company">Company</label><input id="interview_company" value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Target employer" /></div>
          <div className="field"><label htmlFor="interview_focus">Practice focus</label><select id="interview_focus" value={focus} onChange={(event) => setFocus(event.target.value)}><option value="balanced">Balanced</option><option value="technical">Technical and troubleshooting</option><option value="leadership">Shift leadership</option></select></div>
          <button className="btn primary" type="submit">Build practice session</button>
        </form>

        <aside className="jobs-pipeline-panel">
          <p className="overline">Positioning guardrails</p><h2>Your strongest accurate positioning</h2>
          <ul className="jobs-reasons">
            <li>Lead with nearly 20 years in plastics manufacturing and recent PET injection production leadership.</li>
            <li>Use Production Supervisor, Shift Supervisor, Injection Moulding Lead, or Process Technician where the duties match.</li>
            <li>State OND in Mechanical Engineering Technology accurately; do not describe it as a bachelor’s degree.</li>
            <li>Separate operating and troubleshooting experience from detailed hot-runner or maintenance work handled by specialist teams.</li>
            <li>Answer work-authorization questions directly: employer support is currently required.</li>
          </ul>
        </aside>
      </section>

      {prepared ? (
        <>
          <section className="section jobs-section">
            <div className="section-heading-row"><div><p className="overline">Practice session</p><h2>{role}{company ? ` · ${company}` : ""}</h2><p className="section-intro">Answer aloud using Situation, Task, Action, Result. Mark a question only after the answer is specific, truthful, and under two minutes.</p></div><span className="status-dot">{Object.values(checked).filter(Boolean).length}/{questions.length} rehearsed</span></div>
            <div className="jobs-question-list">
              {questions.map((question, index) => {
                const key = `${index}-${question}`;
                return <label className={checked[key] ? "checked" : ""} key={key}><input type="checkbox" checked={Boolean(checked[key])} onChange={(event) => setChecked((current) => ({ ...current, [key]: event.target.checked }))} /><span><strong>Question {index + 1}</strong>{question}</span></label>;
              })}
            </div>
          </section>

          <section className="section jobs-section">
            <div className="section-heading-row"><div><p className="overline">Evidence bank</p><h2>Four real stories to prepare</h2><p className="section-intro">Confirm each number and scope before using it. Keep current Genoa responsibilities separate from earlier Sonnex scale.</p></div></div>
            <div className="jobs-card-grid">{storyBank.map((story) => <article className="jobs-card" key={story.title}><h3>{story.title}</h3><p>{story.evidence}</p><div className="field"><label htmlFor={`story-${story.title}`}>Your two-minute STAR answer</label><textarea id={`story-${story.title}`} rows={6} placeholder="Situation → Task → Action → Result → What you learned" /></div></article>)}</div>
          </section>
        </>
      ) : (
        <section className="section jobs-section"><article className="jobs-empty"><h2>Your practice session is ready to configure</h2><p>Confirm the role, company, and focus above, then build the session.</p></article></section>
      )}
    </>
  );
}
