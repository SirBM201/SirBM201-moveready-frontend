"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import {
  JobProfileDraft,
  emptyJobProfileDraft,
  founderJobProfileDraft,
  jobProfileToDraft,
  parseJobProfileList,
  workAuthorizationChoices,
} from "@/lib/jobProfile";
import { JobProfile, jobLabel } from "@/lib/jobs";

const steps = [
  { title: "Your experience", short: "Experience" },
  { title: "Your job goal", short: "Job goal" },
  { title: "Skills and work status", short: "Skills" },
  { title: "Review and save", short: "Review" },
];

function errorMessage(error: unknown) {
  const apiError = error as ApiError;
  if (apiError?.status === 401) return "Sign in with your email code before creating a private job profile.";
  return apiError?.message || "MoveReady could not load your job profile right now.";
}

function summaryValue(value: string, fallback = "Not added") {
  return value.trim() || fallback;
}

export default function JobSetupWorkspace() {
  const [draft, setDraft] = useState<JobProfileDraft>(() => emptyJobProfileDraft());
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const [saved, setSaved] = useState(false);
  const [existingProfile, setExistingProfile] = useState(false);
  const [message, setMessage] = useState("Loading your private job setup...");

  useEffect(() => {
    async function load() {
      try {
        const response = await apiJson<{ ok: boolean; profile: JobProfile | null }>("jobs/profile", { timeoutMs: 20000 });
        const useFounderTemplate = typeof window !== "undefined"
          && new URLSearchParams(window.location.search).get("template") === "founder-pet-manufacturing";
        if (response.profile) {
          setDraft(jobProfileToDraft(response.profile));
          setExistingProfile(true);
          setMessage("Your current answers are loaded. Review them step by step and save any changes.");
        } else if (useFounderTemplate) {
          setDraft(founderJobProfileDraft());
          setMessage("Your approved founder template is loaded for review. Nothing is saved until you confirm the final step.");
        } else {
          setMessage("Start with your real work experience. You can go back and change any answer before saving.");
        }
      } catch (error) {
        const apiError = error as ApiError;
        setSignedOut(apiError?.status === 401);
        setMessage(errorMessage(error));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const parsedRoles = useMemo(() => parseJobProfileList(draft.target_roles), [draft.target_roles]);
  const parsedSkills = useMemo(() => parseJobProfileList(draft.skills), [draft.skills]);
  const parsedLocations = useMemo(() => parseJobProfileList(draft.preferred_provinces), [draft.preferred_provinces]);
  const authorization = workAuthorizationChoices.find((choice) => choice.value === draft.work_authorization_status);

  function update(field: keyof JobProfileDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function validate(targetStep = step) {
    if (targetStep === 0) {
      if (!draft.headline.trim()) return "Add a professional headline, such as Production Supervisor or Care Assistant.";
      if (draft.years_experience === "" || Number.isNaN(Number(draft.years_experience))) return "Add your number of years of experience.";
      const years = Number(draft.years_experience);
      if (years < 0 || years > 60) return "Years of experience must be between 0 and 60.";
    }
    if (targetStep === 1) {
      if (!parsedRoles.length) return "Add at least one job title you want to find.";
      if (!draft.primary_country.trim()) return "Add the main country where you want to work.";
    }
    if (targetStep === 2) {
      if (!parsedSkills.length) return "Add at least one real skill. This helps MoveReady explain job matches.";
      if (!draft.work_authorization_status) return "Choose the work-permission answer that best describes your situation.";
    }
    return "";
  }

  function goNext() {
    const problem = validate();
    if (problem) {
      setMessage(problem);
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
    setMessage("Good. Continue with the next short step.");
    document.querySelector(".jobs-setup-shell")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
    setMessage("Review or change your answers, then continue.");
  }

  function openCompletedStep(index: number) {
    if (index <= step) {
      setStep(index);
      setMessage("Review or change this step, then continue.");
    }
  }

  async function save() {
    for (let index = 0; index < 3; index += 1) {
      const problem = validate(index);
      if (problem) {
        setStep(index);
        setMessage(problem);
        return;
      }
    }
    setSaving(true);
    setMessage("Saving your private job profile...");
    try {
      const response = await apiJson<{ ok: boolean; profile: JobProfile }>("jobs/profile", {
        method: "PATCH",
        body: {
          display_name: draft.display_name,
          headline: draft.headline,
          years_experience: Number(draft.years_experience),
          education_level: draft.education_level,
          current_employer: draft.current_employer,
          previous_employer: draft.previous_employer,
          target_roles: parsedRoles,
          skills: parsedSkills,
          primary_country: draft.primary_country,
          later_countries: parseJobProfileList(draft.later_countries),
          preferred_provinces: parsedLocations,
          work_authorization_status: draft.work_authorization_status,
          is_active: true,
        },
        timeoutMs: 20000,
      });
      setDraft(jobProfileToDraft(response.profile));
      setExistingProfile(true);
      setSaved(true);
      setMessage("Your job profile is ready. MoveReady can now explain job matches using your own facts.");
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <section className="section jobs-section"><article className="jobs-empty"><h1>Preparing your job setup...</h1><p>{message}</p></article></section>;
  }

  if (signedOut) {
    return (
      <section className="section jobs-section">
        <article className="jobs-empty jobs-sign-in-card">
          <span className="eyebrow">Private job profile</span>
          <h1>Sign in before you begin.</h1>
          <p>Your work history, target roles, skills, and work status belong only to your verified account.</p>
          <div className="actions"><a className="btn primary" href="/login?next=/jobs/setup">Sign in with email</a><a className="btn" href="/jobs">Back to Jobs</a></div>
        </article>
      </section>
    );
  }

  if (saved) {
    return (
      <section className="section jobs-section jobs-setup-complete">
        <article className="jobs-empty">
          <span className="eyebrow">Setup complete</span>
          <h1>Your job search is ready to use.</h1>
          <p>Next, choose target employers or record a real vacancy. Your matching results will use the facts you just confirmed.</p>
          <div className="actions"><a className="btn primary" href="/jobs/companies">Choose target companies</a><a className="btn" href="/jobs">Open Jobs Dashboard</a><button className="btn" type="button" onClick={() => setSaved(false)}>Edit my answers</button></div>
        </article>
      </section>
    );
  }

  return (
    <>
      <section className="jobs-page-heading">
        <div>
          <span className="eyebrow">Guided job setup</span>
          <h1>Tell MoveReady what kind of work you want.</h1>
          <p className="lede">Four short steps create a private profile for job matching. Use only facts you can support with your CV, certificates, or work history.</p>
        </div>
        <div className="actions"><a className="btn" href="/jobs">Leave setup</a></div>
      </section>

      <section className="section jobs-section jobs-setup-shell">
        <div className="jobs-setup-status-row">
          <div><p className="overline">Step {step + 1} of {steps.length}</p><h2>{steps[step].title}</h2></div>
          <span className="status-dot">{existingProfile ? "Updating profile" : "New profile"}</span>
        </div>
        <nav className="jobs-setup-progress" aria-label="Job setup steps">
          {steps.map((item, index) => (
            <button className={index === step ? "active" : index < step ? "complete" : ""} type="button" onClick={() => openCompletedStep(index)} disabled={index > step} aria-current={index === step ? "step" : undefined} key={item.short}>
              <span>{index < step ? "✓" : index + 1}</span>{item.short}
            </button>
          ))}
        </nav>
        <p className="jobs-inline-message" aria-live="polite">{message}</p>

        <div className="jobs-setup-card">
          {step === 0 ? (
            <div className="jobs-setup-fields">
              <div className="jobs-step-intro"><h3>Start with your real work background.</h3><p>This information helps MoveReady avoid recommending roles that do not fit your experience or qualification.</p></div>
              <div className="form-grid two-col">
                <div className="field"><label htmlFor="setup_display_name">Name you want shown <span>(optional)</span></label><input id="setup_display_name" value={draft.display_name} onChange={(event) => update("display_name", event.target.value)} autoComplete="name" placeholder="Your name" /></div>
                <div className="field"><label htmlFor="setup_headline">Professional headline</label><input id="setup_headline" value={draft.headline} onChange={(event) => update("headline", event.target.value)} placeholder="Example: Production Supervisor" required /><small>Use the title that best describes the work you can prove.</small></div>
                <div className="field"><label htmlFor="setup_years">Years of experience</label><input id="setup_years" type="number" inputMode="numeric" min="0" max="60" value={draft.years_experience} onChange={(event) => update("years_experience", event.target.value)} placeholder="Example: 8" required /></div>
                <div className="field"><label htmlFor="setup_education">Highest relevant qualification <span>(optional)</span></label><input id="setup_education" value={draft.education_level} onChange={(event) => update("education_level", event.target.value)} placeholder="Example: OND Mechanical Engineering" /></div>
                <div className="field"><label htmlFor="setup_current_employer">Current or most recent employer <span>(optional)</span></label><input id="setup_current_employer" value={draft.current_employer} onChange={(event) => update("current_employer", event.target.value)} placeholder="Company name" /></div>
                <div className="field"><label htmlFor="setup_previous_employer">Previous employer <span>(optional)</span></label><input id="setup_previous_employer" value={draft.previous_employer} onChange={(event) => update("previous_employer", event.target.value)} placeholder="Company name" /></div>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="jobs-setup-fields">
              <div className="jobs-step-intro"><h3>Choose the work and destination you want.</h3><p>You can start with one role and one country. Add more only when they are genuinely part of your plan.</p></div>
              <div className="field"><label htmlFor="setup_roles">Job titles you want</label><textarea id="setup_roles" rows={5} value={draft.target_roles} onChange={(event) => update("target_roles", event.target.value)} placeholder={"Production Supervisor\nInjection Moulding Technician"} required /><small>Write one job title per line. Add the title employers are likely to advertise.</small></div>
              <div className="form-grid two-col">
                <div className="field"><label htmlFor="setup_country">Main target country</label><input id="setup_country" value={draft.primary_country} onChange={(event) => update("primary_country", event.target.value)} placeholder="Example: Canada" required /></div>
                <div className="field"><label htmlFor="setup_locations">Preferred provinces, states, or regions <span>(optional)</span></label><textarea id="setup_locations" rows={4} value={draft.preferred_provinces} onChange={(event) => update("preferred_provinces", event.target.value)} placeholder={"Ontario\nManitoba"} /><small>Leave blank if you are open to any location.</small></div>
              </div>
              <div className="field"><label htmlFor="setup_later_countries">Countries to consider later <span>(optional)</span></label><textarea id="setup_later_countries" rows={3} value={draft.later_countries} onChange={(event) => update("later_countries", event.target.value)} placeholder={"Germany\nAustralia"} /></div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="jobs-setup-fields">
              <div className="jobs-step-intro"><h3>Add skills you can demonstrate.</h3><p>Matching is clearer when you use specific skills, machines, tools, licences, or work processes instead of general claims.</p></div>
              <div className="field"><label htmlFor="setup_skills">Your strongest job skills</label><textarea id="setup_skills" rows={7} value={draft.skills} onChange={(event) => update("skills", event.target.value)} placeholder={"Production planning\nHusky injection moulding\nProcess troubleshooting"} required /><small>Write one skill per line. Use only skills you can discuss confidently in an interview.</small></div>
              <fieldset className="jobs-authorization-choices">
                <legend>What is your current right to work in {draft.primary_country || "your target country"}?</legend>
                {workAuthorizationChoices.map((choice) => (
                  <label className={draft.work_authorization_status === choice.value ? "selected" : ""} key={choice.value}>
                    <input type="radio" name="work_authorization_status" value={choice.value} checked={draft.work_authorization_status === choice.value} onChange={(event) => update("work_authorization_status", event.target.value)} />
                    <span><strong>{choice.label}</strong><small>{choice.help}</small></span>
                  </label>
                ))}
              </fieldset>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="jobs-setup-fields">
              <div className="jobs-step-intro"><h3>Check your answers before saving.</h3><p>These facts will guide job scores, resume preparation, and future interview support. They do not prove visa sponsorship or guarantee employment.</p></div>
              <div className="jobs-review-grid">
                <article><span>Professional profile</span><strong>{summaryValue(draft.headline)}</strong><p>{draft.years_experience} years of experience · {summaryValue(draft.education_level)}</p><button type="button" onClick={() => setStep(0)}>Edit experience</button></article>
                <article><span>Target work</span><strong>{parsedRoles.join(", ")}</strong><p>{summaryValue(draft.primary_country)}{parsedLocations.length ? ` · ${parsedLocations.join(", ")}` : " · Open to locations"}</p><button type="button" onClick={() => setStep(1)}>Edit job goal</button></article>
                <article><span>Matching skills</span><strong>{parsedSkills.slice(0, 5).join(", ")}{parsedSkills.length > 5 ? ` +${parsedSkills.length - 5} more` : ""}</strong><p>MoveReady will show reasons for each starter match score.</p><button type="button" onClick={() => setStep(2)}>Edit skills</button></article>
                <article><span>Work status</span><strong>{authorization?.label || jobLabel(draft.work_authorization_status)}</strong><p>{authorization?.help || "Review your route before applying."}</p><button type="button" onClick={() => setStep(2)}>Edit work status</button></article>
              </div>
              <div className="jobs-truth-note"><strong>Before you save</strong><p>Confirm that the experience, qualification, employers, roles, and skills above are truthful. MoveReady will not convert a diploma into a degree or mark sponsorship as confirmed without current evidence.</p></div>
            </div>
          ) : null}

          <div className="jobs-setup-actions">
            <button className="btn" type="button" onClick={goBack} disabled={step === 0 || saving}>Back</button>
            {step < steps.length - 1 ? <button className="btn primary" type="button" onClick={goNext}>Continue</button> : <button className="btn primary" type="button" onClick={save} disabled={saving}>{saving ? "Saving..." : existingProfile ? "Save profile changes" : "Save and start job search"}</button>}
          </div>
        </div>
      </section>
    </>
  );
}
