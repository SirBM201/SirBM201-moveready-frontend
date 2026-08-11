"use client";

import { FormEvent, useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import { JobProfile, jobLabel } from "@/lib/jobs";

type ProfileDraft = {
  display_name: string;
  headline: string;
  years_experience: string;
  education_level: string;
  current_employer: string;
  previous_employer: string;
  target_roles: string;
  skills: string;
  primary_country: string;
  later_countries: string;
  preferred_provinces: string;
  work_authorization_status: string;
};

const emptyDraft: ProfileDraft = {
  display_name: "",
  headline: "",
  years_experience: "",
  education_level: "",
  current_employer: "",
  previous_employer: "",
  target_roles: "",
  skills: "",
  primary_country: "Canada",
  later_countries: "",
  preferred_provinces: "",
  work_authorization_status: "requires_sponsorship",
};

const authorizationStatuses = [
  "citizen",
  "permanent_resident",
  "open_permit",
  "employer_specific_permit",
  "requires_sponsorship",
  "not_recorded",
];

function listText(value?: string[]) {
  return (value || []).join("\n");
}

function textList(value: string) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toDraft(profile: JobProfile | null): ProfileDraft {
  if (!profile) return emptyDraft;
  return {
    display_name: profile.display_name || "",
    headline: profile.headline || "",
    years_experience: profile.years_experience === undefined ? "" : String(profile.years_experience),
    education_level: profile.education_level || "",
    current_employer: profile.current_employer || "",
    previous_employer: profile.previous_employer || "",
    target_roles: listText(profile.target_roles),
    skills: listText(profile.skills),
    primary_country: profile.primary_country || "Canada",
    later_countries: listText(profile.later_countries),
    preferred_provinces: listText(profile.preferred_provinces),
    work_authorization_status: profile.work_authorization_status || "not_recorded",
  };
}

function messageFrom(error: unknown) {
  const apiError = error as ApiError;
  if (apiError?.status === 401) return "Sign in to edit your private job-search profile.";
  return apiError?.message || "Unable to load the job-search profile.";
}

export default function JobProfileWorkspace() {
  const [profile, setProfile] = useState<JobProfile | null>(null);
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("Loading your job-search profile...");

  async function load() {
    setLoading(true);
    try {
      const response = await apiJson<{ ok: boolean; profile: JobProfile | null }>("jobs/profile", { timeoutMs: 20000 });
      setProfile(response.profile);
      setDraft(toDraft(response.profile));
      setMessage(response.profile
        ? "Your matching profile is ready to review."
        : "No job-search profile exists yet. Load the approved founder profile to begin.");
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function update(field: keyof ProfileDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function bootstrap() {
    setSaving(true);
    setMessage("Loading the approved Canadian PET manufacturing profile and Tier-1 targets...");
    try {
      const response = await apiJson<{ ok: boolean; message: string; target_companies_added: number }>("jobs/profile/bootstrap", {
        method: "POST",
        body: {},
        timeoutMs: 30000,
      });
      setMessage(`${response.message} ${response.target_companies_added} target companies added.`);
      await load();
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSaving(false);
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("Saving the job-search profile...");
    try {
      const response = await apiJson<{ ok: boolean; profile: JobProfile }>("jobs/profile", {
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
          primary_country: draft.primary_country,
          later_countries: textList(draft.later_countries),
          preferred_provinces: textList(draft.preferred_provinces),
          work_authorization_status: draft.work_authorization_status,
          is_active: true,
        },
        timeoutMs: 20000,
      });
      setProfile(response.profile);
      setDraft(toDraft(response.profile));
      setMessage("Job-search profile saved. New job leads will use these facts for transparent matching.");
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="jobs-page-heading">
        <div><span className="eyebrow">Job profile</span><h1>Control the facts used for job matching.</h1><p className="lede">Keep your target roles, machine skills, experience, locations, education, and work-authorization position accurate. MoveReady never upgrades an OND to a degree or assumes sponsorship.</p></div>
        <div className="actions"><a className="btn" href="/jobs">Jobs Dashboard</a><a className="btn" href="/jobs/companies">Target companies</a><button className="btn" type="button" onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button></div>
      </section>
      <p className="jobs-inline-status" aria-live="polite">{message}</p>

      {!profile && !loading ? (
        <section className="section jobs-section">
          <article className="jobs-empty">
            <h2>Activate your approved founder profile</h2>
            <p>This loads the truthful Canadian manufacturing baseline: nearly 20 years of experience, OND Mechanical Engineering Technology, Genoa Plastic Industries, Sonnex Packaging, approved role families, machine skills, and Tier-1 companies.</p>
            <button className="btn primary" type="button" onClick={bootstrap} disabled={saving}>{saving ? "Setting up..." : "Set up my Canadian search"}</button>
          </article>
        </section>
      ) : null}

      {profile ? (
        <section className="section jobs-section jobs-two-column">
          <form className="jobs-form" onSubmit={save}>
            <div className="panel-heading"><div><p className="overline">Matching facts</p><h2>Edit job profile</h2></div><span className="status-dot">Private</span></div>
            <div className="form-grid two-col">
              <div className="field"><label htmlFor="profile_display_name">Display name</label><input id="profile_display_name" value={draft.display_name} onChange={(event) => update("display_name", event.target.value)} /></div>
              <div className="field"><label htmlFor="profile_headline">Professional headline</label><input id="profile_headline" value={draft.headline} onChange={(event) => update("headline", event.target.value)} required /></div>
              <div className="field"><label htmlFor="profile_years">Years of experience</label><input id="profile_years" type="number" min="0" max="60" value={draft.years_experience} onChange={(event) => update("years_experience", event.target.value)} /></div>
              <div className="field"><label htmlFor="profile_education">Education</label><input id="profile_education" value={draft.education_level} onChange={(event) => update("education_level", event.target.value)} /></div>
              <div className="field"><label htmlFor="profile_current_employer">Current employer</label><input id="profile_current_employer" value={draft.current_employer} onChange={(event) => update("current_employer", event.target.value)} /></div>
              <div className="field"><label htmlFor="profile_previous_employer">Previous employer</label><input id="profile_previous_employer" value={draft.previous_employer} onChange={(event) => update("previous_employer", event.target.value)} /></div>
              <div className="field"><label htmlFor="profile_primary_country">Primary country</label><input id="profile_primary_country" value={draft.primary_country} onChange={(event) => update("primary_country", event.target.value)} required /></div>
              <div className="field"><label htmlFor="profile_authorization">Work authorization</label><select id="profile_authorization" value={draft.work_authorization_status} onChange={(event) => update("work_authorization_status", event.target.value)}>{authorizationStatuses.map((status) => <option value={status} key={status}>{jobLabel(status)}</option>)}</select></div>
            </div>
            <div className="field"><label htmlFor="profile_roles">Target roles, one per line</label><textarea id="profile_roles" rows={6} value={draft.target_roles} onChange={(event) => update("target_roles", event.target.value)} /></div>
            <div className="field"><label htmlFor="profile_skills">Skills and machine knowledge, one per line</label><textarea id="profile_skills" rows={8} value={draft.skills} onChange={(event) => update("skills", event.target.value)} /></div>
            <div className="form-grid two-col">
              <div className="field"><label htmlFor="profile_provinces">Preferred provinces, one per line</label><textarea id="profile_provinces" rows={5} value={draft.preferred_provinces} onChange={(event) => update("preferred_provinces", event.target.value)} /></div>
              <div className="field"><label htmlFor="profile_later_countries">Later countries, one per line</label><textarea id="profile_later_countries" rows={5} value={draft.later_countries} onChange={(event) => update("later_countries", event.target.value)} /></div>
            </div>
            <button className="btn primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save job profile"}</button>
          </form>

          <aside className="jobs-pipeline-panel">
            <p className="overline">Truth and matching boundary</p>
            <h2>What this profile controls</h2>
            <ul className="jobs-reasons">
              <li>Role, skill, country, province, experience, and sponsorship match reasons.</li>
              <li>Transparent starter scores for vacancies you record.</li>
              <li>The professional facts used by future resume and interview tools.</li>
              <li>No automatic claim that an employer sponsors visas or has a current LMIA.</li>
              <li>No degree title unless you genuinely hold that qualification.</li>
            </ul>
            <a className="btn" href="/jobs">Review matching results</a>
          </aside>
        </section>
      ) : null}
    </>
  );
}
