"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import { JobProfile, jobLabel } from "@/lib/jobs";

type PracticeFocus = "balanced" | "technical" | "leadership";

type StoryGuide = {
  title: string;
  prompt: string;
  reminder: string;
};

function messageFrom(error: unknown) {
  const apiError = error as ApiError;
  if (apiError?.status === 401) return "Sign in to prepare interviews from your private job profile.";
  return apiError?.message || "Unable to load your interview profile right now.";
}

function uniqueQuestions(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function shortRequirement(value: string) {
  const cleaned = value.trim().replace(/^[-•*\d.)\s]+/, "");
  return cleaned.length > 180 ? `${cleaned.slice(0, 177)}...` : cleaned;
}

export default function InterviewPreparationWorkspace() {
  const [profile, setProfile] = useState<JobProfile | null>(null);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [focus, setFocus] = useState<PracticeFocus>("balanced");
  const [prepared, setPrepared] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [storyAnswers, setStoryAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [signedOut, setSignedOut] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [message, setMessage] = useState("Opening your interview profile...");

  async function load() {
    setLoading(true);
    setLoadFailed(false);
    try {
      let requestedRole = "";
      let requestedCompany = "";
      try {
        const params = new URLSearchParams(window.location.search);
        requestedRole = params.get("role") || "";
        requestedCompany = params.get("company") || "";
      } catch {
        // Use profile defaults.
      }
      const response = await apiJson<{ ok: boolean; profile: JobProfile | null }>("jobs/profile", { timeoutMs: 20000 });
      const nextProfile = response.profile;
      setProfile(nextProfile);
      setRole(requestedRole || nextProfile?.target_roles?.[0] || nextProfile?.headline || "");
      setCompany(requestedCompany);
      setSignedOut(false);
      setMessage(nextProfile
        ? "Your saved job facts are ready. Add vacancy requirements for more specific practice questions."
        : "Complete your job-search profile before building an interview session.");
    } catch (error) {
      const apiError = error as ApiError;
      setProfile(null);
      setSignedOut(apiError?.status === 401);
      setLoadFailed(apiError?.status !== 401);
      setMessage(messageFrom(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const requirements = useMemo(() => uniqueQuestions(
    requirementsText.split(/\n|;/).map(shortRequirement),
  ).slice(0, 6), [requirementsText]);

  const questions = useMemo(() => {
    if (!profile) return [];
    const targetRole = role || profile.headline || "this role";
    const targetCompany = company || "this employer";
    const skills = (profile.skills || []).slice(0, focus === "technical" ? 7 : 4);
    const locations = profile.preferred_provinces || [];
    const destination = profile.primary_country || "your target country";

    const openingQuestions = [
      `Tell me about yourself and the experience most relevant to ${targetRole}.`,
      `Why are you interested in ${targetRole} at ${targetCompany}?`,
      `Which part of your work history best proves that you can succeed in ${targetRole}?`,
      "Describe one result you can support with a number, record, or clear before-and-after comparison.",
    ];
    const skillQuestions = skills.map((skill) => `Walk me through a real task where you used ${skill}. What did you do, what problem did you solve, and what result can you support?`);
    const requirementQuestions = requirements.map((requirement) => `The vacancy mentions “${requirement}”. Which part of your real experience is relevant, and what evidence can you give?`);
    const leadershipQuestions = [
      "Tell me about a difficult problem you handled at work. What was your responsibility, action, and result?",
      "Describe a time you had to protect safety, quality, a customer, or a colleague despite pressure to move faster.",
      "Give an example of how you trained, supported, or influenced another person at work.",
      "How do you organize priorities, communicate a handover, and escalate a risk you cannot safely resolve alone?",
    ];
    const destinationQuestions = [
      `Why are you targeting work in ${destination}${locations.length ? `, especially ${locations.slice(0, 3).join(", ")}` : ""}?`,
      `What is your current right to work in ${destination}, and what employer support would you need?`,
    ];
    const profileQuestions = [
      profile.education_level ? `How has your ${profile.education_level} prepared you for ${targetRole}, and where has practical experience been more important?` : "",
      profile.current_employer ? `What have you learned at ${profile.current_employer} that is directly useful for ${targetCompany}?` : "",
      profile.previous_employer ? `How did your work at ${profile.previous_employer} add to the experience you use today?` : "",
    ];

    if (focus === "technical") return uniqueQuestions([...openingQuestions.slice(0, 3), ...requirementQuestions, ...skillQuestions, ...destinationQuestions, ...profileQuestions]).slice(0, 16);
    if (focus === "leadership") return uniqueQuestions([...openingQuestions, ...requirementQuestions, ...leadershipQuestions, ...destinationQuestions, ...profileQuestions]).slice(0, 16);
    return uniqueQuestions([...openingQuestions, ...requirementQuestions, ...skillQuestions.slice(0, 3), ...leadershipQuestions.slice(0, 3), ...destinationQuestions, ...profileQuestions]).slice(0, 16);
  }, [company, focus, profile, requirements, role]);

  const storyBank = useMemo<StoryGuide[]>(() => {
    const employers = [profile?.current_employer, profile?.previous_employer].filter(Boolean).join(" or ");
    const skillExamples = (profile?.skills || []).slice(0, 3).join(", ");
    return [
      { title: "Strongest measurable result", prompt: `Choose one genuine result${employers ? ` from ${employers}` : " from your work history"}. Explain the starting point, your action, and the final result.`, reminder: "Use only a number or comparison you can explain and defend." },
      { title: "Difficult problem solved", prompt: `Choose a real problem related to ${skillExamples || role || "your work"}. Explain how you identified the cause, what you did, and when you involved someone else.`, reminder: "Separate your own work from tasks handled by teammates or specialists." },
      { title: "Safety, quality, or responsibility", prompt: "Choose a time you protected a person, customer, process, product, or standard even when there was pressure to continue.", reminder: "State the risk, decision, communication, and outcome without exaggeration." },
      { title: "Teamwork or leadership", prompt: "Choose a time you trained, supported, coordinated, or influenced someone to achieve a better work outcome.", reminder: "Describe the team structure and your authority accurately." },
    ];
  }, [profile, role]);

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPrepared(true);
    setChecked({});
    setMessage(`${questions.length} practice questions are ready. Answer aloud with facts from your real work history.`);
    window.setTimeout(() => document.getElementById("practice-session")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  if (loading && !profile && !signedOut) {
    return <section className="section jobs-section"><article className="jobs-empty jobs-sign-in-card" aria-live="polite"><span className="eyebrow">Interview preparation</span><h1>Opening your saved job facts...</h1><p>MoveReady is preparing a practice session from your profile and target vacancy.</p></article></section>;
  }

  if (signedOut) {
    return <section className="section jobs-section"><article className="jobs-empty jobs-sign-in-card"><span className="eyebrow">Private interview preparation</span><h1>Sign in to prepare from your job profile.</h1><p>Your experience, skills, qualification, work status, and practice notes stay under your verified MoveReady account.</p><div className="actions"><a className="btn primary" href="/login?next=/jobs/interview-preparation">Sign in with email</a><a className="btn" href="/jobs">Back to Jobs</a></div></article></section>;
  }

  if (loadFailed) {
    return <section className="section jobs-section"><article className="jobs-empty jobs-sign-in-card"><span className="eyebrow">Interview preparation unavailable</span><h1>We could not open your job profile.</h1><p>{message} Your saved information has not been changed.</p><div className="actions"><button className="btn primary" type="button" onClick={load} disabled={loading}>{loading ? "Trying again..." : "Try again"}</button><a className="btn" href="/jobs/applications">Back to applications</a></div></article></section>;
  }

  if (!profile) {
    return <section className="section jobs-section"><article className="jobs-empty jobs-sign-in-card"><span className="eyebrow">Job profile required</span><h1>Complete your job profile before interview practice.</h1><p>MoveReady needs your own role, skills, experience, destination, qualification, and work status so it does not copy another person’s questions or invent facts.</p><div className="actions"><a className="btn primary" href="/jobs/setup">Complete guided setup</a><a className="btn" href="/jobs/applications">Back to applications</a></div></article></section>;
  }

  return (
    <>
      <section className="jobs-page-heading">
        <div><span className="eyebrow">Interview preparation</span><h1>Practise answers built around your real profile and vacancy.</h1><p className="lede">MoveReady turns the role, employer, vacancy requirements, and facts you saved into question prompts. It does not write achievements, technical claims, or work history for you.</p></div>
        <div className="actions"><a className="btn" href="/jobs/applications">Back to applications</a><a className="btn" href="/jobs/profile">Check profile facts</a></div>
      </section>

      <div className="jobs-safety-strip"><strong>Truth boundary:</strong><span>Use only experience, results, qualifications, and work-permission facts you can support. Treat generated questions as practice prompts, not suggested answers.</span></div>

      <p className="jobs-inline-status" aria-live="polite">{message}</p>

      <section className="section jobs-section jobs-two-column">
        <form className="jobs-form" onSubmit={prepare}>
          <div className="panel-heading"><div><p className="overline">Practice setup</p><h2>Create a role-specific session</h2></div><span className="status-dot">No invented claims</span></div>
          <div className="form-grid two-col"><div className="field"><label htmlFor="interview_role">Target role</label><input id="interview_role" value={role} onChange={(event) => { setRole(event.target.value); setPrepared(false); }} required /></div><div className="field"><label htmlFor="interview_company">Employer</label><input id="interview_company" value={company} onChange={(event) => { setCompany(event.target.value); setPrepared(false); }} placeholder="Target employer" /></div></div>
          <div className="field"><label htmlFor="interview_requirements">Important vacancy duties or requirements <span>(optional)</span></label><textarea id="interview_requirements" rows={6} value={requirementsText} onChange={(event) => { setRequirementsText(event.target.value); setPrepared(false); }} placeholder={"Paste three to six important points, one per line.\nExample: Supervise daily production and meet quality targets"} /><small>Copy only the most important duties or requirements. MoveReady will turn each point into a practice question.</small></div>
          <div className="field"><label htmlFor="interview_focus">Practice focus</label><select id="interview_focus" value={focus} onChange={(event) => { setFocus(event.target.value as PracticeFocus); setPrepared(false); }}><option value="balanced">Balanced interview</option><option value="technical">Skills and technical work</option><option value="leadership">Leadership and behaviour</option></select></div>
          <button className="btn primary" type="submit">Build my practice session</button>
        </form>

        <aside className="jobs-pipeline-panel jobs-interview-profile">
          <p className="overline">Facts MoveReady will use</p><h2>{profile.headline}</h2>
          <div className="jobs-record-facts"><span><small>Experience</small><strong>{profile.years_experience === undefined ? "Not recorded" : `${profile.years_experience} years`}</strong></span><span><small>Qualification</small><strong>{profile.education_level || "Not recorded"}</strong></span><span><small>Destination</small><strong>{profile.primary_country || "Not recorded"}</strong></span><span><small>Work status</small><strong>{jobLabel(profile.work_authorization_status)}</strong></span></div>
          <p className="jobs-form-intro">Strongest saved skills</p>
          <div className="jobs-skill-chips">{(profile.skills || []).slice(0, 8).map((skill) => <span key={skill}>{skill}</span>)}{!profile.skills?.length ? <span>No skills recorded</span> : null}</div>
          <p>Wrong or incomplete? Correct the profile before relying on these questions.</p>
          <a className="btn" href="/jobs/profile">Edit profile facts</a>
        </aside>
      </section>

      {prepared ? (
        <>
          <section className="section jobs-section" id="practice-session">
            <div className="section-heading-row"><div><p className="overline">Practice session</p><h2>{role}{company ? ` · ${company}` : ""}</h2><p className="section-intro">Answer aloud using Situation, Task, Action, Result. Mark a question only after your answer is specific, truthful, and under two minutes.</p></div><span className="status-dot">{Object.values(checked).filter(Boolean).length}/{questions.length} rehearsed</span></div>
            <div className="jobs-question-list">
              {questions.map((question, index) => {
                const key = `${index}-${question}`;
                return <label className={checked[key] ? "checked" : ""} key={key}><input type="checkbox" checked={Boolean(checked[key])} onChange={(event) => setChecked((current) => ({ ...current, [key]: event.target.checked }))} /><span><strong>Question {index + 1}</strong>{question}</span></label>;
              })}
            </div>
          </section>

          <section className="section jobs-section">
            <div className="section-heading-row"><div><p className="overline">Your evidence bank</p><h2>Prepare four stories you can defend</h2><p className="section-intro">MoveReady supplies the structure only. You supply the truthful event, numbers, actions, people involved, and result.</p></div></div>
            <div className="jobs-card-grid jobs-story-grid">{storyBank.map((story) => <article className="jobs-card" key={story.title}><h3>{story.title}</h3><p>{story.prompt}</p><div className="jobs-truth-note"><strong>Check before using</strong><p>{story.reminder}</p></div><div className="field"><label htmlFor={`story-${story.title}`}>Your two-minute STAR notes</label><textarea id={`story-${story.title}`} rows={7} value={storyAnswers[story.title] || ""} onChange={(event) => setStoryAnswers((current) => ({ ...current, [story.title]: event.target.value }))} placeholder="Situation → Task → Action → Result → What you learned" /></div></article>)}</div>
          </section>
        </>
      ) : (
        <section className="section jobs-section"><article className="jobs-empty"><h2>Build the session when the role is correct</h2><p>Confirm the target role and employer. Add key vacancy requirements when available, then choose the focus and build your questions.</p></article></section>
      )}
    </>
  );
}
