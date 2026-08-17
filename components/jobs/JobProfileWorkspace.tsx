"use client";

import { FormEvent, useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import {
  JobProfileDraft as ProfileDraft,
  emptyJobProfileDraft,
  internationalTargetsFromDraft,
  jobProfileToDraft as toDraft,
  parseJobProfileList as textList,
  searchScopeChoices,
  usesInternationalSearch,
  workAuthorizationChoices,
} from "@/lib/jobProfile";
import { JobProfile, JobSearchContract, jobLabel } from "@/lib/jobs";

function messageFrom(error: unknown) {
  const apiError = error as ApiError;
  if (apiError?.status === 401) return "Sign in to edit your private job-search profile.";
  return apiError?.message || "Unable to load the job-search profile.";
}

export default function JobProfileWorkspace() {
  const [profile, setProfile] = useState<JobProfile | null>(null);
  const [searchContract, setSearchContract] = useState<JobSearchContract | null>(null);
  const [draft, setDraft] = useState<ProfileDraft>(() => emptyJobProfileDraft());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("Loading your job-search profile...");

  async function load() {
    setLoading(true);
    try {
      const response = await apiJson<{ ok: boolean; profile: JobProfile | null; search_contract: JobSearchContract }>("jobs/profile", { timeoutMs: 20000 });
      setProfile(response.profile);
      setSearchContract(response.search_contract);
      setDraft(toDraft(response.profile));
      setMessage(response.profile ? "Your matching profile is ready to review." : "No job-search profile exists yet. Complete the short guided setup to begin.");
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  function update(field: keyof ProfileDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.current_country.trim()) {
      setMessage("Add the country where you currently live or work.");
      return;
    }
    if (usesInternationalSearch(draft.search_scope) && !internationalTargetsFromDraft(draft).length) {
      setMessage("Add at least one foreign target country that is different from your current country.");
      return;
    }
    setSaving(true);
    setMessage("Saving the job-search profile...");
    try {
      const response = await apiJson<{ ok: boolean; profile: JobProfile; search_contract: JobSearchContract }>("jobs/profile", {
        method: "PATCH",
        body: {
          display_name: draft.display_name,
          headline: draft.headline,
          years_experience: draft.years_experience === "" ? undefined : Number(draft.years_experience),
          education_level: draft.education_level,
          current_employer: draft.current_employer,
          previous_employer: draft.previous_employer,
          target_roles: textList(draft.target_roles),
          skills: textList(draft.skills),
          career_facts: textList(draft.career_facts),
          primary_country: draft.primary_country,
          later_countries: textList(draft.later_countries),
          preferred_provinces: textList(draft.preferred_provinces),
          work_authorization_status: draft.work_authorization_status,
          search_scope: draft.search_scope,
          current_country: draft.current_country,
          work_authorized_countries: textList(draft.work_authorized_countries),
          is_active: true,
        },
        timeoutMs: 20000,
      });
      const savedProfile = response.profile;
      setProfile(savedProfile);
      setSearchContract(response.search_contract);
      setDraft(toDraft(savedProfile));
      setMessage("Job-search profile saved atomically. Local and international leads now use the countries and work rights you confirmed.");
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="jobs-page-heading">
        <div><span className="eyebrow">Job profile</span><h1>Choose where you want MoveReady to search.</h1><p className="lede">Search locally, internationally, or both. Local vacancies stay focused on career fit; international vacancies add work-authorization, sponsorship and relocation viability before MoveReady recommends an application.</p></div>
        <div className="actions"><a className="btn" href="/jobs">Jobs Dashboard</a><a className="btn" href="/jobs/companies">Target companies</a><button className="btn" type="button" onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button></div>
      </section>
      <p className="jobs-inline-status" aria-live="polite">{message}</p>

      {!profile && !loading ? <section className="section jobs-section"><article className="jobs-empty"><h2>Create your job-search profile</h2><p>Use the guided setup to add your own experience, target roles, current country, destinations, real skills, and right-to-work position. Nothing is copied from another user.</p><a className="btn primary" href="/jobs/setup">Start guided setup</a></article></section> : null}

      {profile ? (
        <section className="section jobs-section jobs-two-column">
          <form className="jobs-form" onSubmit={save}>
            <div className="panel-heading"><div><p className="overline">Search scope</p><h2>Local, international, or both</h2></div><span className="status-dot">Private</span></div>
            <fieldset className="jobs-scope-choices">
              <legend>Where should MoveReady search?</legend>
              {searchScopeChoices.map((choice) => <label className={draft.search_scope === choice.value ? "selected" : ""} key={choice.value}><input type="radio" name="search_scope" value={choice.value} checked={draft.search_scope === choice.value} onChange={() => update("search_scope", choice.value)} /><span><strong>{choice.label}</strong><small>{choice.help}</small></span></label>)}
            </fieldset>
            <div className="form-grid two-col">
              <div className="field"><label htmlFor="profile_current_country">Country where you currently live or work</label><input id="profile_current_country" value={draft.current_country} onChange={(event) => update("current_country", event.target.value)} placeholder="Example: Kuwait" autoComplete="country-name" required /><small>This sets the local search area. It does not prove nationality or work rights.</small></div>
              <div className="field"><label htmlFor="profile_authorized_countries">Countries where you already have a legal right to work</label><textarea id="profile_authorized_countries" rows={4} value={draft.work_authorized_countries} onChange={(event) => update("work_authorized_countries", event.target.value)} placeholder="One country per line" /><small>Leave blank if unsure. MoveReady will require verification rather than infer authorization.</small></div>
            </div>
            <div className="jobs-truth-note"><strong>Search contract</strong><p>{searchContract?.truth_note || "Work authorization is user-reported and vacancy sponsorship is source-derived; neither guarantees employment or immigration approval."}</p></div>
            <div className="panel-heading"><div><p className="overline">Matching facts</p><h2>Professional profile</h2></div></div>
            <div className="form-grid two-col">
              <div className="field"><label htmlFor="profile_display_name">Display name</label><input id="profile_display_name" value={draft.display_name} onChange={(event) => update("display_name", event.target.value)} /></div>
              <div className="field"><label htmlFor="profile_headline">Professional headline</label><input id="profile_headline" value={draft.headline} onChange={(event) => update("headline", event.target.value)} required /></div>
              <div className="field"><label htmlFor="profile_years">Years of experience</label><input id="profile_years" type="number" min="0" max="60" value={draft.years_experience} onChange={(event) => update("years_experience", event.target.value)} /></div>
              <div className="field"><label htmlFor="profile_education">Education</label><input id="profile_education" value={draft.education_level} onChange={(event) => update("education_level", event.target.value)} /></div>
              <div className="field"><label htmlFor="profile_current_employer">Current employer</label><input id="profile_current_employer" value={draft.current_employer} onChange={(event) => update("current_employer", event.target.value)} /></div>
              <div className="field"><label htmlFor="profile_previous_employer">Previous employer</label><input id="profile_previous_employer" value={draft.previous_employer} onChange={(event) => update("previous_employer", event.target.value)} /></div>
              {usesInternationalSearch(draft.search_scope) ? <><div className="field"><label htmlFor="profile_primary_country">Main foreign target country</label><input id="profile_primary_country" value={draft.primary_country} onChange={(event) => update("primary_country", event.target.value)} required /></div><div className="field"><label htmlFor="profile_authorization">Work permission for the main foreign target</label><select id="profile_authorization" value={draft.work_authorization_status} onChange={(event) => update("work_authorization_status", event.target.value)}>{workAuthorizationChoices.map((choice) => <option value={choice.value} key={choice.value}>{choice.label}</option>)}</select></div></> : null}
            </div>
            <div className="field"><label htmlFor="profile_roles">Target roles, one per line</label><textarea id="profile_roles" rows={6} value={draft.target_roles} onChange={(event) => update("target_roles", event.target.value)} /></div>
            <div className="field"><label htmlFor="profile_skills">Skills and machine knowledge, one per line</label><textarea id="profile_skills" rows={8} value={draft.skills} onChange={(event) => update("skills", event.target.value)} /></div>
            <div className="field"><label htmlFor="profile_career_facts">Verified career achievements, one per line</label><textarea id="profile_career_facts" rows={8} value={draft.career_facts} onChange={(event) => update("career_facts", event.target.value)} placeholder="Reduced a documented process delay by 15%." /><small>Use only facts you can defend in an interview. MoveReady may reorder or rewrite them for a vacancy, but it will not invent achievements.</small></div>
            <div className="form-grid two-col"><div className="field"><label htmlFor="profile_provinces">Preferred provinces/regions, one per line</label><textarea id="profile_provinces" rows={5} value={draft.preferred_provinces} onChange={(event) => update("preferred_provinces", event.target.value)} /></div>{usesInternationalSearch(draft.search_scope) ? <div className="field"><label htmlFor="profile_later_countries">Other foreign target countries, one per line</label><textarea id="profile_later_countries" rows={5} value={draft.later_countries} onChange={(event) => update("later_countries", event.target.value)} /></div> : null}</div>
            <button className="btn primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save job profile"}</button>
          </form>

          <aside className="jobs-pipeline-panel"><p className="overline">Current search contract</p><h2>{searchContract?.ready ? `${jobLabel(searchContract.search_scope)} search is ready` : "Search area needs attention"}</h2><div className="jobs-contract-facts"><span><small>Current country</small><strong>{searchContract?.current_country || "Not recorded"}</strong></span><span><small>Countries in scope</small><strong>{searchContract?.target_countries.join(", ") || "Not ready"}</strong></span><span><small>Work rights reported</small><strong>{searchContract?.work_authorized_countries.join(", ") || "None confirmed"}</strong></span></div><ul className="jobs-reasons"><li><strong>Local:</strong> career fit stays separate from a work-rights check.</li><li><strong>International:</strong> sponsorship and relocation evidence affect viability, not career fit.</li><li><strong>Both:</strong> local and foreign vacancies use the correct rule for their country.</li><li>Unknown employer support remains unknown until a current source says otherwise.</li></ul><a className="btn" href="/jobs">Review matching results</a></aside>
        </section>
      ) : null}
    </>
  );
}
