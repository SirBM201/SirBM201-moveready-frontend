"use client";

import { FormEvent, useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import {
  JobCompany,
  JobAction,
  JobLead,
  JobRecruiter,
  JobsSummary,
  formatJobDate,
  formValue,
  jobLabel,
  optionalFormValue,
} from "@/lib/jobs";

const emptyCounts: JobsSummary["counts"] = {
  recommended_jobs: 0,
  target_companies: 0,
  recruiters: 0,
  applications: 0,
  resume_documents: 0,
  follow_ups_due: 0,
};

function errorMessage(error: unknown, fallback: string) {
  const apiError = error as ApiError;
  if (apiError?.status === 401) return "Sign in to open your private Jobs workspace.";
  return apiError?.message || fallback;
}

function actionDueLabel(action: JobAction) {
  const days = action.days_until_due;
  if (days === undefined) return formatJobDate(action.due_at);
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
  if (days === 0) return "Due today";
  return `Due in ${days} day${days === 1 ? "" : "s"}`;
}

export default function JobsDashboard() {
  const [summary, setSummary] = useState<JobsSummary | null>(null);
  const [companies, setCompanies] = useState<JobCompany[]>([]);
  const [recruiters, setRecruiters] = useState<JobRecruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("Loading your private job-search command center...");

  async function load() {
    setLoading(true);
    try {
      const [summaryResponse, companyResponse, recruiterResponse] = await Promise.all([
        apiJson<JobsSummary & { ok: boolean }>("jobs/summary", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; companies: JobCompany[] }>("jobs/companies", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; recruiters: JobRecruiter[] }>("jobs/recruiters", { timeoutMs: 20000 }),
      ]);
      setSummary(summaryResponse);
      setCompanies(companyResponse.companies || []);
      setRecruiters(recruiterResponse.recruiters || []);
      setMessage(summaryResponse.profile
        ? "Your Canadian manufacturing search is ready for execution."
        : "Create your approved Canadian PET manufacturing search profile to activate target companies and matching.");
    } catch (error) {
      setSummary(null);
      setMessage(errorMessage(error, "Unable to load the Jobs workspace."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function bootstrap() {
    setSaving(true);
    setMessage("Creating your Canadian plastics-manufacturing search profile and Tier-1 targets...");
    try {
      const response = await apiJson<{ ok: boolean; target_companies_added: number; message: string }>("jobs/profile/bootstrap", {
        method: "POST",
        body: {},
        timeoutMs: 30000,
      });
      setMessage(`${response.message} ${response.target_companies_added} target companies added.`);
      await load();
    } catch (error) {
      setMessage(errorMessage(error, "Unable to create the founder search profile."));
    } finally {
      setSaving(false);
    }
  }

  async function addJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSaving(true);
    setMessage("Saving and scoring this job lead...");
    try {
      const response = await apiJson<{ ok: boolean; job: JobLead }>("jobs", {
        method: "POST",
        body: {
          job_title: formValue(data, "job_title"),
          company_id: optionalFormValue(data, "company_id"),
          recruiter_id: optionalFormValue(data, "recruiter_id"),
          country: formValue(data, "country") || "Canada",
          province: optionalFormValue(data, "province"),
          city: optionalFormValue(data, "city"),
          job_url: optionalFormValue(data, "job_url"),
          source_name: optionalFormValue(data, "source_name"),
          skills: formValue(data, "skills"),
          description_summary: optionalFormValue(data, "description_summary"),
          visa_sponsorship_status: formValue(data, "visa_sponsorship_status") || "unknown",
          status: "open",
        },
        timeoutMs: 20000,
      });
      form.reset();
      setMessage(`${response.job.job_title} saved with a ${response.job.match_score || 0}% starter match score.`);
      await load();
    } catch (error) {
      setMessage(errorMessage(error, "Unable to save the job lead."));
    } finally {
      setSaving(false);
    }
  }

  async function saveApplication(job: JobLead) {
    if (!job.company_id || !job.company_name) {
      setMessage("Add the employer to this job lead before moving it into Applications.");
      return;
    }
    setSaving(true);
    try {
      const response = await apiJson<{ ok: boolean; created?: boolean; message?: string }>("jobs/applications", {
        method: "POST",
        body: { job_id: job.id, company_id: job.company_id, recruiter_id: job.recruiter_id, status: "saved" },
        timeoutMs: 20000,
      });
      setMessage(response.created === false
        ? response.message || `${job.job_title} is already in Applications.`
        : `${job.job_title} moved into Applications as Saved.`);
      await load();
    } catch (error) {
      setMessage(errorMessage(error, "Unable to create the application record."));
    } finally {
      setSaving(false);
    }
  }

  const counts = summary?.counts || emptyCounts;
  const profile = summary?.profile;

  return (
    <>
      <section className="jobs-hero">
        <div>
          <span className="eyebrow">Founder-first execution</span>
          <h1>Turn job research into a controlled relocation pipeline.</h1>
          <p className="lede">Target Canadian plastics manufacturers, record verified vacancies, prepare the right resume, track every application, and keep follow-ups visible.</p>
          <div className="actions">
            {!profile ? <button className="btn primary" type="button" onClick={bootstrap} disabled={saving || loading}>Set up my Canadian search</button> : null}
            <a className="btn primary" href="/jobs/companies">Open target companies</a>
            <a className="btn" href="/jobs/resume-vault">Open Resume Vault</a>
            <button className="btn" type="button" onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button>
          </div>
          <p className="form-status" aria-live="polite">{message}</p>
        </div>
        <aside className="jobs-profile-card">
          <p className="overline">Active job profile</p>
          <h2>{profile?.headline || "Canadian PET manufacturing profile not activated"}</h2>
          {profile ? (
            <>
              <div className="jobs-profile-facts">
                <span><strong>{profile.years_experience || 0} years</strong>Experience</span>
                <span><strong>{profile.primary_country || "Canada"}</strong>Primary country</span>
                <span><strong>{profile.education_level || "Not recorded"}</strong>Education</span>
              </div>
              <p>{profile.current_employer || "Current employer not recorded"} · Previously {profile.previous_employer || "not recorded"}</p>
              <div className="badge-row">{(profile.target_roles || []).slice(0, 4).map((role) => <span className="badge" key={role}>{role}</span>)}</div>
            </>
          ) : <p>Use the approved founder profile to load your experience, role families, target countries, and Tier‑1 companies without overstating your qualification.</p>}
        </aside>
      </section>

      <section className="jobs-metric-grid" aria-label="Job search pipeline totals">
        <a href="/jobs" className="jobs-metric"><strong>{counts.recommended_jobs}</strong><span>Job leads</span></a>
        <a href="/jobs/companies" className="jobs-metric"><strong>{counts.target_companies}</strong><span>Target companies</span></a>
        <a href="/jobs/recruiters" className="jobs-metric"><strong>{counts.recruiters}</strong><span>Recruiters</span></a>
        <a href="/jobs/applications" className="jobs-metric"><strong>{counts.applications}</strong><span>Applications</span></a>
        <a href="/jobs/resume-vault" className="jobs-metric"><strong>{counts.resume_documents}</strong><span>Resume files</span></a>
        <a href="#jobs-action-center" className={`jobs-metric ${counts.follow_ups_due ? "attention" : ""}`}><strong>{counts.follow_ups_due}</strong><span>Actions due</span></a>
      </section>

      <section className="section jobs-section">
        <div className="section-heading-row">
          <div><p className="overline">Recommended jobs</p><h2>Your recorded opportunities, ranked against your profile</h2><p className="section-intro">MoveReady uses transparent role, skill, location, experience, and sponsorship signals. It does not predict hiring or visa approval.</p></div>
          <span className="status-dot">{summary?.recommended_jobs?.length || 0} active leads</span>
        </div>
        <div className="jobs-card-grid">
          {(summary?.recommended_jobs || []).map((job) => (
            <article className="jobs-card" key={job.id}>
              <div className="panel-heading">
                <div><p className="overline">{job.company_name || "Employer not linked"}</p><h3>{job.job_title}</h3></div>
                <span className="jobs-score">{job.match_score || 0}%</span>
              </div>
              <p>{[job.city, job.province, job.country].filter(Boolean).join(", ") || "Location not recorded"}</p>
              <div className="badge-row"><span className="badge">{jobLabel(job.status)}</span><span className="badge">Sponsor: {jobLabel(job.visa_sponsorship_status)}</span>{job.expires_at ? <span className="badge">Closes {formatJobDate(job.expires_at)}</span> : null}</div>
              <ul className="jobs-reasons">{(job.match_reasons || []).slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}</ul>
              <div className="actions">{job.job_url ? <a className="btn" href={job.job_url} target="_blank" rel="noreferrer">Open vacancy</a> : null}<button className="btn primary" type="button" onClick={() => saveApplication(job)} disabled={saving || !job.company_id}>Save application</button></div>
            </article>
          ))}
          {!summary?.recommended_jobs?.length ? <article className="jobs-empty"><h3>No job leads recorded yet</h3><p>Add a real vacancy below. MoveReady will score it against your active job profile and keep the original link.</p></article> : null}
        </div>
      </section>

      <section className="section jobs-section jobs-two-column">
        <form className="jobs-form" onSubmit={addJob}>
          <div className="panel-heading"><div><p className="overline">Capture a vacancy</p><h2>Add a real job lead</h2></div><span className="status-dot">Private</span></div>
          <div className="form-grid two-col">
            <div className="field"><label htmlFor="job_title">Job title</label><input id="job_title" name="job_title" placeholder="Production Supervisor" required /></div>
            <div className="field"><label htmlFor="job_company">Company</label><select id="job_company" name="company_id" defaultValue=""><option value="">Select a target company</option>{companies.map((company) => <option value={company.id} key={company.id}>{company.company_name}</option>)}</select></div>
            <div className="field"><label htmlFor="job_recruiter">Recruiter</label><select id="job_recruiter" name="recruiter_id" defaultValue=""><option value="">Not linked</option>{recruiters.map((recruiter) => <option value={recruiter.id} key={recruiter.id}>{recruiter.recruiter_name}</option>)}</select></div>
            <div className="field"><label htmlFor="job_country">Country</label><input id="job_country" name="country" defaultValue="Canada" required /></div>
            <div className="field"><label htmlFor="job_province">Province</label><input id="job_province" name="province" placeholder="Ontario" /></div>
            <div className="field"><label htmlFor="job_city">City</label><input id="job_city" name="city" placeholder="Brampton" /></div>
            <div className="field"><label htmlFor="job_url">Vacancy URL</label><input id="job_url" name="job_url" type="url" placeholder="https://company.example/jobs/..." /></div>
            <div className="field"><label htmlFor="job_source">Source</label><input id="job_source" name="source_name" placeholder="Official career page" /></div>
            <div className="field"><label htmlFor="job_sponsorship">Sponsorship evidence</label><select id="job_sponsorship" name="visa_sponsorship_status" defaultValue="unknown"><option value="unknown">Unknown</option><option value="not_verified">Not verified</option><option value="possible">Possible</option><option value="confirmed">Confirmed on vacancy</option><option value="not_available">Not available</option></select></div>
            <div className="field"><label htmlFor="job_skills">Skills, comma separated</label><input id="job_skills" name="skills" placeholder="PET preforms, Husky, troubleshooting" /></div>
          </div>
          <div className="field"><label htmlFor="job_summary">Short vacancy summary</label><textarea id="job_summary" name="description_summary" rows={4} placeholder="Record the requirements that matter for matching and application preparation." /></div>
          <button className="btn primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save and score job"}</button>
        </form>

        <aside className="jobs-pipeline-panel" id="jobs-action-center">
          <div className="panel-heading"><div><p className="overline">Application pipeline</p><h2>Status at a glance</h2></div><span className="status-dot">Live</span></div>
          <div className="jobs-pipeline-list">{Object.entries(summary?.applications_by_status || {}).map(([status, count]) => <a href={`/jobs/applications?status=${status}`} key={status}><span>{jobLabel(status)}</span><strong>{count}</strong></a>)}</div>
          <div className="panel-heading"><h3>Priority work queue</h3><span className="status-dot">{summary?.action_counts?.overdue || 0} overdue</span></div>
          {(summary?.action_items || []).map((item) => <a className="jobs-follow-up" href={item.href} key={`${item.kind}-${item.id}`}><strong>{jobLabel(item.priority)} · {item.title}</strong><span>{item.summary} · {actionDueLabel(item)}</span></a>)}
          {!summary?.action_items?.length ? <p>No recruiter or application follow-up is due in the next 14 days.</p> : null}
          <a className="text-link" href="/action-center">Open the full MoveReady Action Center</a>
        </aside>
      </section>

      <section className="jobs-safety-strip"><strong>Evidence boundary</strong><span>{summary?.privacy_note || "Sponsorship, LMIA history, salary, and vacancy status remain unverified until linked to a current source."}</span></section>
    </>
  );
}
