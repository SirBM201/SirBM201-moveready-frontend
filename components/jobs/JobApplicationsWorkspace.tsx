"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import {
  JobApplication,
  JobCompany,
  JobLead,
  JobRecruiter,
  ResumeDocument,
  applicationStatuses,
  formatJobDate,
  formValue,
  jobLabel,
  optionalFormValue,
} from "@/lib/jobs";

type ApplicationDraft = { status: string; follow_up_date: string; interview_date: string; notes: string; documents_used: string[] };

function messageFrom(error: unknown) {
  const apiError = error as ApiError;
  if (apiError?.status === 401) return "Sign in to manage your private job applications.";
  return apiError?.message || "Unable to load applications.";
}

function selectedValues(select: HTMLSelectElement) {
  return Array.from(select.selectedOptions).map((option) => option.value);
}

export default function JobApplicationsWorkspace() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [companies, setCompanies] = useState<JobCompany[]>([]);
  const [recruiters, setRecruiters] = useState<JobRecruiter[]>([]);
  const [jobs, setJobs] = useState<JobLead[]>([]);
  const [documents, setDocuments] = useState<ResumeDocument[]>([]);
  const [drafts, setDrafts] = useState<Record<string, ApplicationDraft>>({});
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("Loading your application pipeline...");

  async function load() {
    setLoading(true);
    try {
      const [applicationResponse, companyResponse, recruiterResponse, jobResponse, documentResponse] = await Promise.all([
        apiJson<{ ok: boolean; applications: JobApplication[] }>("jobs/applications", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; companies: JobCompany[] }>("jobs/companies", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; recruiters: JobRecruiter[] }>("jobs/recruiters", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; jobs: JobLead[] }>("jobs", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; documents: ResumeDocument[] }>("jobs/resume-vault", { timeoutMs: 20000 }),
      ]);
      const rows = applicationResponse.applications || [];
      setApplications(rows);
      setCompanies(companyResponse.companies || []);
      setRecruiters(recruiterResponse.recruiters || []);
      setJobs(jobResponse.jobs || []);
      setDocuments(documentResponse.documents || []);
      setDrafts(Object.fromEntries(rows.map((application) => [application.id, {
        status: application.status || "saved",
        follow_up_date: application.follow_up_date || "",
        interview_date: application.interview_date ? application.interview_date.slice(0, 16) : "",
        notes: application.notes || "",
        documents_used: application.documents_used || [],
      }])));
      setMessage(`${rows.length} application records loaded.`);
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    try {
      setStatusFilter(new URLSearchParams(window.location.search).get("status") || "");
    } catch {
      // Use the default filter.
    }
    void load();
  }, []);

  const visible = useMemo(() => statusFilter ? applications.filter((item) => item.status === statusFilter) : applications, [applications, statusFilter]);
  const companyNames = Object.fromEntries(companies.map((company) => [company.id, company.company_name]));
  const documentNames = Object.fromEntries(documents.map((document) => [document.id, document.title]));

  function updateDraft(id: string, field: keyof ApplicationDraft, value: string | string[]) {
    setDrafts((current) => ({ ...current, [id]: { ...(current[id] || { status: "saved", follow_up_date: "", interview_date: "", notes: "", documents_used: [] }), [field]: value } }));
  }

  async function createApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSavingId("new");
    try {
      const response = await apiJson<{ ok: boolean; application: JobApplication }>("jobs/applications", {
        method: "POST",
        body: {
          job_id: optionalFormValue(data, "job_id"),
          company_id: optionalFormValue(data, "company_id"),
          recruiter_id: optionalFormValue(data, "recruiter_id"),
          job_title: optionalFormValue(data, "job_title"),
          company_name: optionalFormValue(data, "company_name"),
          country: formValue(data, "country") || "Canada",
          province: optionalFormValue(data, "province"),
          job_url: optionalFormValue(data, "job_url"),
          status: formValue(data, "status") || "saved",
          date_applied: optionalFormValue(data, "date_applied"),
          follow_up_date: optionalFormValue(data, "follow_up_date"),
          documents_used: data.getAll("documents_used").map(String),
          notes: optionalFormValue(data, "notes"),
        },
        timeoutMs: 20000,
      });
      form.reset();
      setMessage(`${response.application.job_title} at ${response.application.company_name} added to Applications.`);
      await load();
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  async function saveApplication(application: JobApplication) {
    const draft = drafts[application.id];
    setSavingId(application.id);
    try {
      await apiJson(`jobs/applications/${application.id}`, {
        method: "PATCH",
        body: {
          status: draft.status,
          follow_up_date: draft.follow_up_date || null,
          interview_date: draft.interview_date || null,
          notes: draft.notes,
          documents_used: draft.documents_used,
        },
        timeoutMs: 15000,
      });
      setMessage(`${application.job_title} updated to ${jobLabel(draft.status)}.`);
      await load();
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  return (
    <>
      <section className="jobs-page-heading">
        <div><span className="eyebrow">Application tracker</span><h1>Know exactly where every job application stands.</h1><p className="lede">Move opportunities from Saved through Applied, Interview, Offer, and Visa while keeping follow-up dates, recruiter links, notes, and the exact resume version used.</p></div>
        <div className="actions"><a className="btn primary" href="#new-job-application">Add application</a><a className="btn" href="/jobs/resume-vault">Resume Vault</a><button className="btn" type="button" onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button></div>
      </section>

      <section className="jobs-status-tabs" aria-label="Application status filter">
        <button type="button" className={!statusFilter ? "active" : ""} onClick={() => setStatusFilter("")}>All <strong>{applications.length}</strong></button>
        {applicationStatuses.map((status) => <button type="button" className={statusFilter === status ? "active" : ""} onClick={() => setStatusFilter(status)} key={status}>{jobLabel(status)} <strong>{applications.filter((item) => item.status === status).length}</strong></button>)}
      </section>
      <p className="jobs-inline-status" aria-live="polite">{message}</p>

      <section className="jobs-card-grid jobs-application-grid">
        {visible.map((application) => {
          const draft = drafts[application.id] || { status: application.status, follow_up_date: "", interview_date: "", notes: "", documents_used: [] };
          return (
            <article className="jobs-card" key={application.id}>
              <div className="panel-heading"><div><p className="overline">{application.company_name}</p><h2>{application.job_title}</h2></div><span className={`badge jobs-application-status ${draft.status}`}>{jobLabel(draft.status)}</span></div>
              <p>{[application.province, application.country].filter(Boolean).join(", ")} · Applied: {formatJobDate(application.date_applied)}</p>
              <div className="form-grid two-col jobs-compact-form">
                <div className="field"><label htmlFor={`application-status-${application.id}`}>Status</label><select id={`application-status-${application.id}`} value={draft.status} onChange={(event) => updateDraft(application.id, "status", event.target.value)}>{applicationStatuses.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
                <div className="field"><label htmlFor={`application-follow-up-${application.id}`}>Follow-up date</label><input id={`application-follow-up-${application.id}`} type="date" value={draft.follow_up_date} onChange={(event) => updateDraft(application.id, "follow_up_date", event.target.value)} /></div>
                <div className="field"><label htmlFor={`application-interview-${application.id}`}>Interview date</label><input id={`application-interview-${application.id}`} type="datetime-local" value={draft.interview_date} onChange={(event) => updateDraft(application.id, "interview_date", event.target.value)} /></div>
                <div className="field"><label htmlFor={`application-docs-${application.id}`}>Documents used</label><select id={`application-docs-${application.id}`} multiple value={draft.documents_used} onChange={(event) => updateDraft(application.id, "documents_used", selectedValues(event.currentTarget))}>{documents.map((document) => <option value={document.id} key={document.id}>{document.title} · v{document.version}</option>)}</select></div>
              </div>
              <div className="field"><label htmlFor={`application-notes-${application.id}`}>Private notes</label><textarea id={`application-notes-${application.id}`} rows={3} value={draft.notes} onChange={(event) => updateDraft(application.id, "notes", event.target.value)} /></div>
              {draft.documents_used.length ? <p className="jobs-document-summary">Used: {draft.documents_used.map((id) => documentNames[id] || "Document").join(", ")}</p> : null}
              <div className="actions"><button className="btn primary" type="button" onClick={() => saveApplication(application)} disabled={savingId === application.id}>{savingId === application.id ? "Saving..." : "Save application"}</button>{application.job_url ? <a className="btn" href={application.job_url} target="_blank" rel="noreferrer">Open vacancy</a> : null}<a className="btn" href={`/jobs/interview-preparation?role=${encodeURIComponent(application.job_title)}&company=${encodeURIComponent(application.company_name)}`}>Prepare interview</a></div>
            </article>
          );
        })}
        {!visible.length && !loading ? <article className="jobs-empty"><h3>No application in this stage</h3><p>Add a real application below or choose another status.</p></article> : null}
      </section>

      <section className="section jobs-section" id="new-job-application">
        <form className="jobs-form jobs-narrow-form" onSubmit={createApplication}>
          <div className="panel-heading"><div><p className="overline">New record</p><h2>Add a job application</h2></div><span className="status-dot">Private</span></div>
          <div className="form-grid two-col">
            <div className="field"><label htmlFor="application_job_id">Saved job lead</label><select id="application_job_id" name="job_id" defaultValue=""><option value="">Enter manually</option>{jobs.map((job) => <option value={job.id} key={job.id}>{job.job_title} · {job.company_name || "Unlinked"}</option>)}</select></div>
            <div className="field"><label htmlFor="application_company_id">Target company</label><select id="application_company_id" name="company_id" defaultValue=""><option value="">Enter manually</option>{companies.map((company) => <option value={company.id} key={company.id}>{company.company_name}</option>)}</select></div>
            <div className="field"><label htmlFor="application_job_title">Job title</label><input id="application_job_title" name="job_title" placeholder="Required for a manual record" /></div>
            <div className="field"><label htmlFor="application_company_name">Company name</label><input id="application_company_name" name="company_name" placeholder="Required if no company is selected" /></div>
            <div className="field"><label htmlFor="application_recruiter_id">Recruiter</label><select id="application_recruiter_id" name="recruiter_id" defaultValue=""><option value="">Not linked</option>{recruiters.map((recruiter) => <option value={recruiter.id} key={recruiter.id}>{recruiter.recruiter_name}</option>)}</select></div>
            <div className="field"><label htmlFor="application_status">Status</label><select id="application_status" name="status" defaultValue="saved">{applicationStatuses.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
            <div className="field"><label htmlFor="application_country">Country</label><input id="application_country" name="country" defaultValue="Canada" /></div>
            <div className="field"><label htmlFor="application_province">Province</label><input id="application_province" name="province" /></div>
            <div className="field"><label htmlFor="application_job_url">Vacancy URL</label><input id="application_job_url" name="job_url" type="url" /></div>
            <div className="field"><label htmlFor="application_date_applied">Date applied</label><input id="application_date_applied" name="date_applied" type="date" /></div>
            <div className="field"><label htmlFor="application_follow_up_date">Follow-up date</label><input id="application_follow_up_date" name="follow_up_date" type="date" /></div>
            <div className="field"><label htmlFor="application_documents">Documents used</label><select id="application_documents" name="documents_used" multiple>{documents.map((document) => <option value={document.id} key={document.id}>{document.title} · v{document.version}</option>)}</select></div>
          </div>
          <div className="field"><label htmlFor="application_notes">Private notes</label><textarea id="application_notes" name="notes" rows={4} /></div>
          <button className="btn primary" type="submit" disabled={savingId === "new"}>{savingId === "new" ? "Adding..." : "Add application"}</button>
        </form>
      </section>
    </>
  );
}
