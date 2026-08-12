"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import {
  JobApplication,
  JobCompany,
  JobLead,
  JobProfile,
  JobRecruiter,
  ResumeDocument,
  applicationStatuses,
  formatJobDate,
  formValue,
  jobLabel,
  optionalFormValue,
} from "@/lib/jobs";

type ApplicationDraft = { status: string; follow_up_date: string; interview_date: string; notes: string; documents_used: string[] };

const stageLabels: Record<string, string> = {
  saved: "Saved, not applied",
  applied: "Applied",
  interview: "Interview",
  rejected: "Closed / not selected",
  offer: "Offer",
  visa: "Work permit / visa",
};

function applicationStage(value: string) {
  return stageLabels[value] || jobLabel(value);
}

function messageFrom(error: unknown) {
  const apiError = error as ApiError;
  if (apiError?.status === 401) return "Sign in to manage your private job applications.";
  return apiError?.message || "Unable to load your job applications right now.";
}

function draftFor(application?: JobApplication): ApplicationDraft {
  return {
    status: application?.status || "saved",
    follow_up_date: application?.follow_up_date || "",
    interview_date: application?.interview_date ? application.interview_date.slice(0, 16) : "",
    notes: application?.notes || "",
    documents_used: application?.documents_used || [],
  };
}

export default function JobApplicationsWorkspace() {
  const [profile, setProfile] = useState<JobProfile | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [companies, setCompanies] = useState<JobCompany[]>([]);
  const [recruiters, setRecruiters] = useState<JobRecruiter[]>([]);
  const [jobs, setJobs] = useState<JobLead[]>([]);
  const [documents, setDocuments] = useState<ResumeDocument[]>([]);
  const [drafts, setDrafts] = useState<Record<string, ApplicationDraft>>({});
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [signedOut, setSignedOut] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("Opening your application pipeline...");

  async function load(successMessage?: string) {
    setLoading(true);
    setLoadFailed(false);
    try {
      const [profileResponse, applicationResponse, companyResponse, recruiterResponse, jobResponse, documentResponse] = await Promise.all([
        apiJson<{ ok: boolean; profile: JobProfile | null }>("jobs/profile", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; applications: JobApplication[] }>("jobs/applications", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; companies: JobCompany[] }>("jobs/companies", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; recruiters: JobRecruiter[] }>("jobs/recruiters", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; jobs: JobLead[] }>("jobs", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; documents: ResumeDocument[] }>("jobs/resume-vault", { timeoutMs: 20000 }),
      ]);
      const rows = applicationResponse.applications || [];
      setProfile(profileResponse.profile);
      setApplications(rows);
      setCompanies((companyResponse.companies || []).filter((company) => Boolean(company.tracking)));
      setRecruiters(recruiterResponse.recruiters || []);
      setJobs(jobResponse.jobs || []);
      setDocuments(documentResponse.documents || []);
      setDrafts(Object.fromEntries(rows.map((application) => [application.id, draftFor(application)])));
      setNewCountry((current) => current || profileResponse.profile?.primary_country || "");
      setSignedOut(false);
      setMessage(successMessage || (rows.length
        ? `${rows.length} application record${rows.length === 1 ? " is" : "s are"} in your private pipeline.`
        : "Add a saved vacancy or an application you already submitted."));
    } catch (error) {
      const apiError = error as ApiError;
      setApplications([]);
      setSignedOut(apiError?.status === 401);
      setLoadFailed(apiError?.status !== 401);
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
  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId), [jobs, selectedJobId]);
  const documentNames = useMemo(() => Object.fromEntries(documents.map((document) => [document.id, `${document.title} · v${document.version}`])), [documents]);
  const recruiterNames = useMemo(() => Object.fromEntries(recruiters.map((recruiter) => [recruiter.id, recruiter.recruiter_name])), [recruiters]);
  const activeDocuments = useMemo(() => documents.filter((document) => document.is_active), [documents]);
  const hasCoreResume = activeDocuments.some((document) => ["ats_resume", "executive_resume"].includes(document.document_type));
  const followUpsDue = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return applications.filter((application) => application.follow_up_date
      && application.follow_up_date <= today
      && !["rejected", "visa"].includes(application.status));
  }, [applications]);
  const interviews = useMemo(() => applications.filter((application) => application.status === "interview"), [applications]);

  function updateDraft(id: string, field: keyof ApplicationDraft, value: string | string[]) {
    setDrafts((current) => ({ ...current, [id]: { ...(current[id] || draftFor()), [field]: value } }));
  }

  function toggleDocument(applicationId: string, documentId: string, selected: boolean) {
    const current = drafts[applicationId] || draftFor(applications.find((item) => item.id === applicationId));
    const next = selected
      ? Array.from(new Set([...current.documents_used, documentId]))
      : current.documents_used.filter((id) => id !== documentId);
    updateDraft(applicationId, "documents_used", next);
  }

  function chooseSavedJob(jobId: string) {
    const job = jobs.find((item) => item.id === jobId);
    setSelectedJobId(jobId);
    setSelectedCompanyId("");
    setNewCountry(job?.country || profile?.primary_country || "");
  }

  async function createApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSavingId("new");
    setMessage("Adding this opportunity to your private application pipeline...");
    try {
      const response = await apiJson<{ ok: boolean; application: JobApplication; created?: boolean; message?: string }>("jobs/applications", {
        method: "POST",
        body: {
          job_id: optionalFormValue(data, "job_id"),
          company_id: optionalFormValue(data, "company_id"),
          recruiter_id: optionalFormValue(data, "recruiter_id"),
          job_title: optionalFormValue(data, "job_title"),
          company_name: optionalFormValue(data, "company_name"),
          country: formValue(data, "country"),
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
      setSelectedJobId("");
      setSelectedCompanyId("");
      setNewCountry(profile?.primary_country || "");
      setStatusFilter(response.application.status || "");
      await load(response.created === false
        ? response.message || `${response.application.job_title} is already in your pipeline.`
        : `${response.application.job_title} at ${response.application.company_name} was added to your pipeline.`);
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  async function saveApplication(application: JobApplication) {
    const draft = drafts[application.id] || draftFor(application);
    setSavingId(application.id);
    setMessage(`Saving your update for ${application.job_title}...`);
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
      await load(`${application.job_title} was updated to ${applicationStage(draft.status)}.`);
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  if (loading && !applications.length && !signedOut) {
    return <section className="section jobs-section"><article className="jobs-empty jobs-sign-in-card" aria-live="polite"><span className="eyebrow">Applications</span><h1>Opening your private application pipeline...</h1><p>MoveReady is checking vacancies, application stages, documents, interviews, and follow-up dates.</p></article></section>;
  }

  if (signedOut) {
    return <section className="section jobs-section"><article className="jobs-empty jobs-sign-in-card"><span className="eyebrow">Private applications</span><h1>Sign in to track your job applications.</h1><p>Your vacancies, application stages, resume versions, interview dates, follow-ups, and notes stay under your verified account.</p><div className="actions"><a className="btn primary" href="/login?next=/jobs/applications">Sign in with email</a><a className="btn" href="/jobs">Back to Jobs</a></div></article></section>;
  }

  if (loadFailed) {
    return <section className="section jobs-section"><article className="jobs-empty jobs-sign-in-card"><span className="eyebrow">Applications unavailable</span><h1>We could not open your application pipeline.</h1><p>{message} Your saved records have not been changed.</p><div className="actions"><button className="btn primary" type="button" onClick={() => load()} disabled={loading}>{loading ? "Trying again..." : "Try again"}</button><a className="btn" href="/jobs">Back to Jobs</a></div></article></section>;
  }

  return (
    <>
      <section className="jobs-page-heading">
        <div><span className="eyebrow">Applications</span><h1>See the next action for every opportunity.</h1><p className="lede">Save a vacancy before applying, record the exact resume version you used, and move the application through follow-up, interview, offer, and work-permit stages.</p></div>
        <div className="actions"><a className="btn primary" href="#new-job-application">Add opportunity</a><a className="btn" href="/jobs/resume-vault">Application documents</a><button className="btn" type="button" onClick={() => load()} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button></div>
      </section>

      <section className="section jobs-section jobs-workspace-summary">
        <article className="jobs-next-action">
          <div><p className="overline">Recommended next action</p><h2>{!hasCoreResume ? "Add your core resume before applying" : followUpsDue.length ? `Follow up on ${followUpsDue[0].job_title}` : interviews.length ? `Prepare for ${interviews[0].company_name}` : applications.length ? "Record your next genuine opportunity" : "Add your first vacancy or application"}</h2><p>{!hasCoreResume ? "Upload one active ATS or executive resume so each application can record the exact version used." : followUpsDue.length ? `${followUpsDue.length} application follow-up${followUpsDue.length === 1 ? " is" : "s are"} due now.` : interviews.length ? "Use the vacancy and your saved profile to practise truthful, role-specific answers." : "Save the vacancy first if you have not applied, or record it as Applied if you already submitted it."}</p></div>
          {!hasCoreResume ? <a className="btn primary" href="/jobs/resume-vault">Add core resume</a> : followUpsDue.length ? <button className="btn primary" type="button" onClick={() => setStatusFilter(followUpsDue[0].status)}>Show follow-up</button> : interviews.length ? <a className="btn primary" href={`/jobs/interview-preparation?role=${encodeURIComponent(interviews[0].job_title)}&company=${encodeURIComponent(interviews[0].company_name)}`}>Prepare interview</a> : <a className="btn primary" href="#new-job-application">Add opportunity</a>}
        </article>
        <div className="jobs-workspace-counts"><span><strong>{applications.length}</strong> total records</span><span><strong>{applications.filter((item) => item.status === "applied").length}</strong> awaiting response</span><span><strong>{followUpsDue.length}</strong> follow-ups due</span></div>
      </section>

      <section className="jobs-status-tabs" aria-label="Application stage filter">
        <button type="button" className={!statusFilter ? "active" : ""} onClick={() => setStatusFilter("")} aria-pressed={!statusFilter}>All <strong>{applications.length}</strong></button>
        {applicationStatuses.map((status) => <button type="button" className={statusFilter === status ? "active" : ""} onClick={() => setStatusFilter(status)} aria-pressed={statusFilter === status} key={status}>{applicationStage(status)} <strong>{applications.filter((item) => item.status === status).length}</strong></button>)}
      </section>
      <p className="jobs-inline-status" aria-live="polite">{message}</p>

      <section className="jobs-card-grid jobs-application-grid">
        {visible.map((application) => {
          const draft = drafts[application.id] || draftFor(application);
          return (
            <article className="jobs-card jobs-application-card" id={`application-${application.id}`} key={application.id}>
              <div className="panel-heading"><div><p className="overline">{application.company_name}</p><h2>{application.job_title}</h2></div><span className={`badge jobs-application-status ${draft.status}`}>{applicationStage(draft.status)}</span></div>
              <p>{[application.province, application.country].filter(Boolean).join(", ") || "Location not recorded"}</p>
              <div className="jobs-record-facts"><span><small>Date applied</small><strong>{formatJobDate(application.date_applied)}</strong></span><span><small>Next follow-up</small><strong>{formatJobDate(draft.follow_up_date)}</strong></span><span><small>Interview</small><strong>{formatJobDate(draft.interview_date, true)}</strong></span><span><small>Recruiter</small><strong>{recruiterNames[application.recruiter_id || ""] || "Not linked"}</strong></span></div>
              {draft.documents_used.length ? <p className="jobs-document-summary"><strong>Documents recorded:</strong> {draft.documents_used.map((id) => documentNames[id] || "Archived document").join(", ")}</p> : <p className="jobs-form-intro">No resume version is recorded for this opportunity yet.</p>}
              <div className="actions">{application.job_url ? <a className="btn" href={application.job_url} target="_blank" rel="noreferrer">Open vacancy</a> : null}<a className="btn" href={`/jobs/interview-preparation?role=${encodeURIComponent(application.job_title)}&company=${encodeURIComponent(application.company_name)}`}>Prepare interview</a></div>
              <details className="jobs-record-editor">
                <summary>Update application <span>Stage, dates, documents, and notes</span></summary>
                <div className="jobs-record-editor-fields">
                  <div className="form-grid two-col jobs-compact-form"><div className="field"><label htmlFor={`application-status-${application.id}`}>Current stage</label><select id={`application-status-${application.id}`} value={draft.status} onChange={(event) => updateDraft(application.id, "status", event.target.value)}>{applicationStatuses.map((item) => <option value={item} key={item}>{applicationStage(item)}</option>)}</select></div><div className="field"><label htmlFor={`application-follow-up-${application.id}`}>Next follow-up</label><input id={`application-follow-up-${application.id}`} type="date" value={draft.follow_up_date} onChange={(event) => updateDraft(application.id, "follow_up_date", event.target.value)} /></div><div className="field"><label htmlFor={`application-interview-${application.id}`}>Interview date and time</label><input id={`application-interview-${application.id}`} type="datetime-local" value={draft.interview_date} onChange={(event) => updateDraft(application.id, "interview_date", event.target.value)} /></div></div>
                  <fieldset className="jobs-document-checklist"><legend>Documents used</legend>{documents.length ? documents.map((document) => <label key={document.id}><input type="checkbox" checked={draft.documents_used.includes(document.id)} onChange={(event) => toggleDocument(application.id, document.id, event.target.checked)} /><span><strong>{document.title} · v{document.version}</strong><small>{document.is_active ? "Active document" : "Archived version"}</small></span></label>) : <p>No application document has been uploaded yet. <a href="/jobs/resume-vault">Add one first.</a></p>}</fieldset>
                  <div className="field"><label htmlFor={`application-notes-${application.id}`}>Private notes</label><textarea id={`application-notes-${application.id}`} rows={3} value={draft.notes} onChange={(event) => updateDraft(application.id, "notes", event.target.value)} placeholder="Outcome, employer request, follow-up message, or next action." /></div>
                  <button className="btn primary" type="button" onClick={() => saveApplication(application)} disabled={savingId === application.id}>{savingId === application.id ? "Saving..." : "Save application update"}</button>
                </div>
              </details>
            </article>
          );
        })}
        {!visible.length && !loading ? <article className="jobs-empty"><h2>{applications.length ? "No application is in this stage" : "Your application pipeline is empty"}</h2><p>{applications.length ? "Choose another stage or add a new opportunity." : "Add a real vacancy you plan to pursue, or record an application you already submitted."}</p><div className="actions"><a className="btn primary" href="#new-job-application">Add opportunity</a>{applications.length ? <button className="btn" type="button" onClick={() => setStatusFilter("")}>Show all</button> : null}</div></article> : null}
      </section>

      <section className="section jobs-section" id="new-job-application">
        <form className="jobs-form jobs-narrow-form" onSubmit={createApplication}>
          <div className="panel-heading"><div><p className="overline">New opportunity</p><h2>Add a vacancy or application</h2></div><span className="status-dot">Private to your account</span></div>
          <p className="jobs-form-intro">Choose a vacancy already saved in MoveReady, or enter the role and employer yourself. Use “Saved, not applied” until you actually submit.</p>
          <div className="form-grid two-col">
            <div className="field"><label htmlFor="application_job_id">Saved vacancy <span>(optional)</span></label><select id="application_job_id" name="job_id" value={selectedJobId} onChange={(event) => chooseSavedJob(event.target.value)}><option value="">Enter a vacancy manually</option>{jobs.map((job) => <option value={job.id} key={job.id}>{job.job_title} · {job.company_name || "Employer not linked"}</option>)}</select></div>
            <div className="field"><label htmlFor="application_status">Current stage</label><select id="application_status" name="status" defaultValue="saved">{applicationStatuses.map((item) => <option value={item} key={item}>{applicationStage(item)}</option>)}</select><small>Select Applied only after the application has been submitted.</small></div>
            {!selectedJobId ? <div className="field"><label htmlFor="application_job_title">Job title</label><input id="application_job_title" name="job_title" required /></div> : null}
            {!selectedJob?.company_id ? <><div className="field"><label htmlFor="application_company_id">Target company <span>(optional)</span></label><select id="application_company_id" name="company_id" value={selectedCompanyId} onChange={(event) => setSelectedCompanyId(event.target.value)}><option value="">Enter another employer</option>{companies.map((company) => <option value={company.id} key={company.id}>{company.company_name}</option>)}</select></div>{!selectedCompanyId ? <div className="field"><label htmlFor="application_company_name">Employer name</label><input id="application_company_name" name="company_name" required /></div> : null}</> : null}
            <div className="field"><label htmlFor="application_country">Country</label><input id="application_country" name="country" value={newCountry} onChange={(event) => setNewCountry(event.target.value)} placeholder="Target country" required /></div>
            <div className="field"><label htmlFor="application_job_url">Official vacancy link <span>(optional)</span></label><input id="application_job_url" name="job_url" type="url" placeholder="https://..." /></div>
          </div>
          {!hasCoreResume ? <div className="jobs-truth-note"><strong>Resume still needed</strong><p>You can save this opportunity now, but add an active ATS or executive resume before submitting an application. <a href="/jobs/resume-vault">Open application documents.</a></p></div> : null}
          <details className="jobs-form-more">
            <summary>Add dates, recruiter, documents, and notes <span>Optional</span></summary>
            <div className="jobs-form-more-fields">
              <div className="form-grid two-col"><div className="field"><label htmlFor="application_province">Province, state, or region</label><input id="application_province" name="province" /></div><div className="field"><label htmlFor="application_recruiter_id">Recruiter or hiring contact</label><select id="application_recruiter_id" name="recruiter_id" defaultValue=""><option value="">Not linked</option>{recruiters.map((recruiter) => <option value={recruiter.id} key={recruiter.id}>{recruiter.recruiter_name}</option>)}</select></div><div className="field"><label htmlFor="application_date_applied">Date applied</label><input id="application_date_applied" name="date_applied" type="date" /></div><div className="field"><label htmlFor="application_follow_up_date">Next follow-up</label><input id="application_follow_up_date" name="follow_up_date" type="date" /></div></div>
              <fieldset className="jobs-document-checklist"><legend>Documents used</legend>{activeDocuments.length ? activeDocuments.map((document) => <label key={document.id}><input type="checkbox" name="documents_used" value={document.id} /><span><strong>{document.title} · v{document.version}</strong><small>{jobLabel(document.document_type)}</small></span></label>) : <p>No active document is available yet.</p>}</fieldset>
              <div className="field"><label htmlFor="application_notes">Private notes</label><textarea id="application_notes" name="notes" rows={4} placeholder="Why the role fits, submission details, employer request, or next action." /></div>
            </div>
          </details>
          <button className="btn primary" type="submit" disabled={savingId === "new"}>{savingId === "new" ? "Adding..." : "Add to my application pipeline"}</button>
        </form>
      </section>
    </>
  );
}
