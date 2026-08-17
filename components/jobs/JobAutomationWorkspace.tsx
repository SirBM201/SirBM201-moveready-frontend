"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import {
  JobApplication,
  JobApplicationAssistance,
  JobAutomationAlert,
  JobDocumentDraft,
  JobLead,
  JobProfile,
  JobSearchContract,
  JobWatch,
  ResumeDocument,
  formatJobDate,
  jobLabel,
} from "@/lib/jobs";

type AutomationOverview = {
  ok: boolean;
  profile: JobProfile | null;
  search_contract: JobSearchContract;
  watches: JobWatch[];
  jobs: JobLead[];
  alerts: JobAutomationAlert[];
  drafts: JobDocumentDraft[];
  documents: ResumeDocument[];
  applications: JobApplication[];
  assistance: JobApplicationAssistance[];
  counts: {
    active_watches: number;
    open_jobs: number;
    unread_alerts: number;
    approved_drafts: number;
    ready_applications: number;
  };
  capabilities: {
    source_policy: string;
    email_alert_delivery: string;
    automatic_submission: boolean;
    scheduled_scan_endpoint_ready: boolean;
  };
};

type Confirmations = {
  facts_verified: boolean;
  no_invented_claims: boolean;
  contact_details_checked: boolean;
  work_authorization_checked: boolean;
};

const emptyConfirmations: Confirmations = {
  facts_verified: false,
  no_invented_claims: false,
  contact_details_checked: false,
  work_authorization_checked: false,
};

function messageFrom(error: unknown, fallback = "Unable to open job automation right now.") {
  const apiError = error as ApiError;
  if (apiError?.status === 401) return "Sign in to open your private vacancy monitors and application drafts.";
  const hint = apiError?.data?.hint;
  return [apiError?.message || fallback, typeof hint === "string" ? hint : ""].filter(Boolean).join(" ");
}

function statusTone(status?: string) {
  if (["completed", "approved", "ready", "submission_confirmed", "open"].includes(status || "")) return "complete";
  if (["failed", "closed", "not_submitted"].includes(status || "")) return "warning";
  return "active";
}

function priorityExplanation(job: JobLead) {
  if (job.application_priority === "out_of_scope") return "Outside selected scope";
  if (job.application_priority === "not_recommended") return "Do not prioritize";
  if (job.application_priority === "verify_authorization") return "Verify work rights first";
  if (job.application_priority === "profile_incomplete") return "Complete search setup";
  if (job.application_priority === "recommended") return "Recommended to review";
  return "Consider after review";
}

function scopeExplanation(job: JobLead) {
  if (job.search_scope_classification === "local" || job.search_scope_classification === "international") return jobLabel(job.search_scope_classification);
  return "Location not classified";
}

export default function JobAutomationWorkspace() {
  const [overview, setOverview] = useState<AutomationOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [signedOut, setSignedOut] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("Opening your official-source vacancy monitors...");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [draftText, setDraftText] = useState<Record<string, string>>({});
  const [confirmations, setConfirmations] = useState<Record<string, Confirmations>>({});
  const [submissionConfirmed, setSubmissionConfirmed] = useState(false);
  const [submissionReference, setSubmissionReference] = useState("");
  const [submissionNote, setSubmissionNote] = useState("");

  async function load(successMessage?: string) {
    setLoading(true);
    setLoadFailed(false);
    try {
      const response = await apiJson<AutomationOverview>("jobs/automation/overview", { timeoutMs: 30000 });
      setOverview(response);
      setSignedOut(false);
      setDraftText((current) => ({
        ...current,
        ...Object.fromEntries((response.drafts || []).map((draft) => [draft.id, draft.content])),
      }));
      setConfirmations((current) => ({
        ...current,
        ...Object.fromEntries((response.drafts || []).map((draft) => [draft.id, {
          ...emptyConfirmations,
          ...(draft.user_confirmations || {}),
        }])),
      }));
      const activeResume = response.documents.find((document) => document.is_active && ["ats_resume", "executive_resume"].includes(document.document_type));
      setSelectedResumeId((current) => current || activeResume?.id || "");
      if (!selectedJobId) {
        let queryJob = "";
        try {
          queryJob = new URLSearchParams(window.location.search).get("job") || "";
        } catch {
          queryJob = "";
        }
        setSelectedJobId(queryJob || response.assistance[0]?.job_id || "");
      }
      setMessage(successMessage || (response.watches.length
        ? "Your monitors, vacancy alerts, and controlled application packs are ready."
        : "Create monitors from your target employers, then run your first official-source scan."));
    } catch (error) {
      const apiError = error as ApiError;
      setOverview(null);
      setSignedOut(apiError?.status === 401);
      setLoadFailed(apiError?.status !== 401);
      setMessage(messageFrom(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedJob = useMemo(() => overview?.jobs.find((job) => job.id === selectedJobId), [overview?.jobs, selectedJobId]);
  const selectedDrafts = useMemo(() => overview?.drafts.filter((draft) => draft.job_id === selectedJobId) || [], [overview?.drafts, selectedJobId]);
  const selectedAssistance = useMemo(() => overview?.assistance.find((item) => item.job_id === selectedJobId), [overview?.assistance, selectedJobId]);
  const selectedApplication = useMemo(() => overview?.applications.find((item) => item.id === selectedAssistance?.application_id), [overview?.applications, selectedAssistance]);
  const activeResumes = useMemo(() => overview?.documents.filter((document) => document.is_active && ["ats_resume", "executive_resume"].includes(document.document_type)) || [], [overview?.documents]);

  async function bootstrapWatches() {
    setBusy("bootstrap");
    setMessage("Creating monitors from the official career pages of your selected employers...");
    try {
      const response = await apiJson<{ created: number; updated: number; skipped: number; message: string }>("jobs/automation/watches/bootstrap", {
        method: "POST",
        body: {},
        timeoutMs: 30000,
      });
      await load(`${response.message} ${response.created} created, ${response.updated} refreshed, ${response.skipped} skipped.`);
    } catch (error) {
      setMessage(messageFrom(error, "Unable to create employer monitors."));
    } finally {
      setBusy("");
    }
  }

  async function scanAll() {
    setBusy("scan-all");
    setMessage("Checking up to ten official employer sources. This can take a minute...");
    try {
      const response = await apiJson<{ status: string; successful_count: number; watch_count: number; results: Array<{ new_count?: number; changed_count?: number; alert_count?: number }> }>("jobs/automation/scan", {
        method: "POST",
        body: {},
        timeoutMs: 120000,
      });
      const totals = response.results.reduce((sum, item) => ({
        jobs: sum.jobs + Number(item.new_count || 0),
        changes: sum.changes + Number(item.changed_count || 0),
        alerts: sum.alerts + Number(item.alert_count || 0),
      }), { jobs: 0, changes: 0, alerts: 0 });
      await load(`Scan ${response.status}: ${response.successful_count} of ${response.watch_count} sources checked, ${totals.jobs} new vacancies, ${totals.changes} changes, and ${totals.alerts} new alerts.`);
    } catch (error) {
      await load(messageFrom(error, "The official-source scan could not finish."));
    } finally {
      setBusy("");
    }
  }

  async function scanWatch(watch: JobWatch) {
    setBusy(`scan-${watch.id}`);
    setMessage(`Checking ${watch.watch_name}...`);
    try {
      const response = await apiJson<{ scan: { discovered_count: number; new_count: number; changed_count: number; alert_count: number } }>(`jobs/automation/watches/${watch.id}/scan`, {
        method: "POST",
        body: {},
        timeoutMs: 60000,
      });
      await load(`${watch.watch_name}: ${response.scan.discovered_count} matching listings found, ${response.scan.new_count} new, ${response.scan.changed_count} changed, and ${response.scan.alert_count} alerts created.`);
    } catch (error) {
      await load(messageFrom(error, `Unable to check ${watch.watch_name}.`));
    } finally {
      setBusy("");
    }
  }

  async function toggleWatch(watch: JobWatch) {
    setBusy(`watch-${watch.id}`);
    try {
      await apiJson(`jobs/automation/watches/${watch.id}`, {
        method: "PATCH",
        body: { is_active: !watch.is_active },
        timeoutMs: 15000,
      });
      await load(`${watch.watch_name} was ${watch.is_active ? "paused" : "activated"}.`);
    } catch (error) {
      setMessage(messageFrom(error, "Unable to update this monitor."));
    } finally {
      setBusy("");
    }
  }

  async function updateAlert(alert: JobAutomationAlert, status: "read" | "dismissed") {
    setBusy(`alert-${alert.id}`);
    try {
      await apiJson(`jobs/automation/alerts/${alert.id}`, { method: "PATCH", body: { status }, timeoutMs: 15000 });
      await load(status === "read" ? "Alert marked as read." : "Alert dismissed.");
    } catch (error) {
      setMessage(messageFrom(error, "Unable to update this alert."));
    } finally {
      setBusy("");
    }
  }

  async function prepareJob(job: JobLead) {
    setBusy(`prepare-${job.id}`);
    setSelectedJobId(job.id);
    setMessage(`Preparing a controlled application workspace for ${job.job_title}...`);
    try {
      await apiJson(`jobs/automation/jobs/${job.id}/prepare`, { method: "POST", body: {}, timeoutMs: 20000 });
      await load(`${job.job_title} is saved in Applications. Choose a base resume to prepare the truthful draft pack.`);
      window.setTimeout(() => document.getElementById("application-pack")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    } catch (error) {
      setMessage(messageFrom(error, "Unable to prepare this opportunity."));
    } finally {
      setBusy("");
    }
  }

  async function generateDocuments() {
    if (!selectedJob || !selectedResumeId) {
      setMessage("Choose an active base resume before generating the application pack.");
      return;
    }
    setBusy("generate");
    setMessage("Reading your selected private resume and preparing truthful editable drafts...");
    try {
      await apiJson(`jobs/automation/jobs/${selectedJob.id}/documents`, {
        method: "POST",
        body: { source_resume_asset_id: selectedResumeId },
        timeoutMs: 60000,
      });
      await load("Tailored resume and cover-letter drafts are ready. Edit every instruction and verify every claim before approval.");
    } catch (error) {
      setMessage(messageFrom(error, "Unable to prepare the application documents."));
    } finally {
      setBusy("");
    }
  }

  function updateConfirmation(draftId: string, key: keyof Confirmations, checked: boolean) {
    setConfirmations((current) => ({
      ...current,
      [draftId]: { ...(current[draftId] || emptyConfirmations), [key]: checked },
    }));
  }

  async function saveDraft(draft: JobDocumentDraft, status: "reviewed" | "approved") {
    setBusy(`draft-${draft.id}`);
    setMessage(`${status === "approved" ? "Checking approval gates for" : "Saving"} ${draft.title}...`);
    try {
      await apiJson(`jobs/automation/documents/${draft.id}`, {
        method: "PATCH",
        body: {
          content: draftText[draft.id] || draft.content,
          user_confirmations: confirmations[draft.id] || emptyConfirmations,
          status,
        },
        timeoutMs: 20000,
      });
      await load(status === "approved"
        ? `${draft.title} is approved. Any later edit will return it to review.`
        : `${draft.title} was saved as reviewed; complete the truth confirmations when it is final.`);
    } catch (error) {
      setMessage(messageFrom(error, "Unable to save this application draft."));
    } finally {
      setBusy("");
    }
  }

  async function exportDraft(draft: JobDocumentDraft) {
    setBusy(`export-${draft.id}`);
    try {
      await apiJson(`jobs/automation/documents/${draft.id}`, {
        method: "PATCH",
        body: { status: "exported" },
        timeoutMs: 15000,
      });
      const blob = new Blob([draftText[draft.id] || draft.content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${draft.draft_type}-${selectedJob?.job_title || "application"}.txt`.replace(/[^a-z0-9.-]+/gi, "-").toLowerCase();
      anchor.click();
      URL.revokeObjectURL(url);
      await load(`${draft.title} was exported as a text file.`);
    } catch (error) {
      setMessage(messageFrom(error, "Unable to export this draft."));
    } finally {
      setBusy("");
    }
  }

  async function openOfficialSite() {
    if (!selectedAssistance) return;
    setBusy("handoff");
    try {
      const response = await apiJson<{ official_url: string; safety_note: string }>(`jobs/automation/applications/${selectedAssistance.application_id}/handoff`, {
        method: "POST",
        body: {},
        timeoutMs: 20000,
      });
      window.open(response.official_url, "_blank", "noopener,noreferrer");
      await load("Official employer page opened. Complete it yourself, then return here to record the real outcome.");
    } catch (error) {
      setMessage(messageFrom(error, "The application is not ready for employer-page handoff."));
    } finally {
      setBusy("");
    }
  }

  async function confirmOutcome(outcome: "submitted" | "not_submitted") {
    if (!selectedAssistance) return;
    setBusy(`confirm-${outcome}`);
    try {
      await apiJson(`jobs/automation/applications/${selectedAssistance.application_id}/confirm`, {
        method: "POST",
        body: {
          outcome,
          i_confirm_submitted: outcome === "submitted" ? submissionConfirmed : false,
          submission_reference_hint: submissionReference,
          notes: submissionNote,
        },
        timeoutMs: 20000,
      });
      await load(outcome === "submitted"
        ? "Application recorded as genuinely submitted and moved to Applied."
        : "Application recorded as not submitted; it remains available for another attempt.");
    } catch (error) {
      setMessage(messageFrom(error, "Unable to record the application outcome."));
    } finally {
      setBusy("");
    }
  }

  if (loading && !overview && !signedOut) {
    return <section className="section jobs-section"><article className="jobs-empty jobs-sign-in-card" aria-live="polite"><span className="eyebrow">Controlled job automation</span><h1>Opening your vacancy monitors...</h1><p>MoveReady is checking private alerts, official-source vacancies, application drafts, and handoff readiness.</p></article></section>;
  }

  if (signedOut) {
    return <section className="section jobs-section"><article className="jobs-empty jobs-sign-in-card"><span className="eyebrow">Private job automation</span><h1>Sign in to monitor vacancies and prepare applications.</h1><p>Your monitored employers, generated drafts, approvals, and submission confirmations stay under your verified account.</p><div className="actions"><a className="btn primary" href="/login?next=/jobs/automation">Sign in with email</a><a className="btn" href="/jobs">Back to Jobs</a></div></article></section>;
  }

  if (loadFailed || !overview) {
    return <section className="section jobs-section"><article className="jobs-empty jobs-sign-in-card"><span className="eyebrow">Automation unavailable</span><h1>We could not open the automated job-search flow.</h1><p>{message} Your existing profile, resume, and applications were not changed.</p><div className="actions"><button className="btn primary" type="button" onClick={() => load()} disabled={loading}>{loading ? "Trying again..." : "Try again"}</button><a className="btn" href="/jobs">Back to Jobs</a></div></article></section>;
  }

  const steps = [
    { label: "Official monitors", complete: overview.counts.active_watches > 0 },
    { label: "Vacancies found", complete: overview.counts.open_jobs > 0 },
    { label: "Draft pack", complete: selectedDrafts.length >= 2 },
    { label: "Truth approval", complete: selectedDrafts.length >= 2 && selectedDrafts.every((draft) => ["approved", "exported"].includes(draft.status)) },
    { label: "Employer handoff", complete: selectedAssistance?.status === "submission_confirmed" },
  ];
  const searchContract = overview.search_contract;
  const scopeReady = Boolean(overview.profile && searchContract?.ready);

  return (
    <>
      <section className="jobs-page-heading">
        <div><span className="eyebrow">Controlled job automation</span><h1>Discover, prepare, approve, and apply—one safe step at a time.</h1><p className="lede">MoveReady checks official employer sources, alerts you to relevant changes, prepares editable drafts from your own evidence, and opens the employer page only when you approve the pack.</p></div>
        <div className="actions"><button className="btn primary" type="button" onClick={scanAll} disabled={busy !== "" || !overview.counts.active_watches || !scopeReady}>{busy === "scan-all" ? "Scanning..." : "Scan official sources now"}</button><a className="btn" href="/jobs/profile">Search profile</a><button className="btn" type="button" onClick={() => load()} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button></div>
      </section>

      <div className="jobs-safety-strip"><strong>No automatic submission:</strong><span>MoveReady never fills declarations, accepts legal terms, sends an application, or claims success without your explicit confirmation.</span></div>
      <p className="jobs-inline-status" aria-live="polite">{message}</p>

      <section className={`section jobs-section jobs-scope-contract ${scopeReady ? "ready" : "attention"}`}>
        <div><p className="overline">Intentional search area</p><h2>{scopeReady ? `${jobLabel(searchContract.search_scope)} search is active` : "Complete your search area before scanning"}</h2><p>{searchContract?.truth_note || "Work rights are user-reported and employer support requires source evidence."}</p></div>
        <div className="jobs-contract-facts"><span><small>Current country</small><strong>{searchContract?.current_country || "Not recorded"}</strong></span><span><small>Countries in scope</small><strong>{searchContract?.target_countries.join(", ") || "Not ready"}</strong></span><span><small>Work rights reported</small><strong>{searchContract?.work_authorized_countries.join(", ") || "None confirmed"}</strong></span></div>
        {!scopeReady ? <a className="btn primary" href="/jobs/setup">Complete search setup</a> : <a className="btn" href="/jobs/profile">Edit search area</a>}
      </section>

      <section className="section jobs-section jobs-automation-progress">
        <div className="panel-heading"><div><p className="overline">Your assisted flow</p><h2>Five controlled stages</h2></div><span className="status-dot">{steps.filter((step) => step.complete).length} of 5 ready</span></div>
        <ol className="jobs-automation-steps">{steps.map((step, index) => <li className={step.complete ? "complete" : ""} key={step.label}><span>{step.complete ? "✓" : index + 1}</span><strong>{step.label}</strong></li>)}</ol>
        {!overview.profile?.career_facts?.length ? <div className="jobs-truth-note"><strong>Add verified career achievements before final approval</strong><p>Drafts can use evidence extracted from a text-based resume, but your own verified facts make the result stronger and easier to defend. <a href="/jobs/profile">Add career facts.</a></p></div> : null}
      </section>

      <section className="section jobs-section">
        <div className="section-heading-row"><div><p className="overline">1. Vacancy monitoring</p><h2>Official employer sources only</h2><p>Build monitors from target companies inside your selected countries. Supported public ATS pages are allowed; arbitrary job-board or social-media scraping is not.</p></div><div className="actions"><button className="btn primary" type="button" onClick={bootstrapWatches} disabled={busy !== "" || !scopeReady}>{busy === "bootstrap" ? "Creating..." : overview.watches.length ? "Refresh target monitors" : "Create target monitors"}</button><a className="btn" href="/jobs/companies">Target companies</a></div></div>
        <div className="jobs-monitor-grid">
          {overview.watches.map((watch) => <article className="jobs-monitor-card" key={watch.id}><div className="panel-heading"><div><p className="overline">{watch.company_name || "Target employer"}</p><h3>{watch.watch_name}</h3></div><span className={`status-dot ${statusTone(watch.last_scan_status)}`}>{jobLabel(watch.last_scan_status)}</span></div><p>{watch.keywords?.slice(0, 4).join(" · ") || "Profile roles and skills"}</p><div className="jobs-record-facts"><span><small>Last scan</small><strong>{formatJobDate(watch.last_scan_at, true)}</strong></span><span><small>Listings</small><strong>{watch.last_result_count || 0}</strong></span><span><small>Cadence</small><strong>{jobLabel(watch.cadence)}</strong></span></div>{watch.last_error ? <p className="jobs-warning-copy">Latest check failed safely: {watch.last_error}</p> : null}<div className="actions"><button className="btn primary" type="button" onClick={() => scanWatch(watch)} disabled={busy !== "" || !watch.is_active || !scopeReady}>{busy === `scan-${watch.id}` ? "Checking..." : "Check now"}</button><button className="btn" type="button" onClick={() => toggleWatch(watch)} disabled={busy !== ""}>{watch.is_active ? "Pause" : "Activate"}</button><a className="btn" href={watch.source_url} target="_blank" rel="noreferrer">Official source</a></div></article>)}
          {!overview.watches.length ? <article className="jobs-empty"><h3>No vacancy monitor exists yet</h3><p>{scopeReady ? "Choose target employers first, then create monitors from their recorded official career pages." : "Complete your intentional country scope before creating target monitors."}</p><div className="actions"><button className="btn primary" type="button" onClick={bootstrapWatches} disabled={!scopeReady}>Create target monitors</button>{scopeReady ? <a className="btn" href="/jobs/companies">Choose employers</a> : <a className="btn" href="/jobs/setup">Complete search setup</a>}</div></article> : null}
        </div>
      </section>

      <section className="section jobs-section jobs-two-column jobs-automation-alerts">
        <div>
          <div className="panel-heading"><div><p className="overline">2. Private alerts</p><h2>New matches and source changes</h2></div><span className="status-dot">{overview.counts.unread_alerts} unread</span></div>
          <div className="jobs-alert-list">{overview.alerts.slice(0, 12).map((alert) => <article className={alert.status === "unread" ? "unread" : ""} key={alert.id}><div><span className={`badge ${alert.severity}`}>{jobLabel(alert.alert_type)}</span><h3>{alert.title}</h3><p>{alert.summary}</p><small>{formatJobDate(alert.created_at, true)} · {jobLabel(alert.delivery_status)}</small></div><div className="actions">{alert.job_id ? <button className="btn primary" type="button" onClick={() => setSelectedJobId(alert.job_id || "")}>Open match</button> : null}{alert.source_url ? <a className="btn" href={alert.source_url} target="_blank" rel="noreferrer">Source</a> : null}{alert.status === "unread" ? <button className="btn" type="button" onClick={() => updateAlert(alert, "read")} disabled={busy !== ""}>Mark read</button> : null}<button className="btn" type="button" onClick={() => updateAlert(alert, "dismissed")} disabled={busy !== ""}>Dismiss</button></div></article>)}{!overview.alerts.length ? <article className="jobs-empty"><h3>No vacancy alert yet</h3><p>Run a source scan. MoveReady creates alerts only for new matches, meaningful listing changes, closures, reopenings, or source failures.</p></article> : null}</div>
        </div>
        <aside className="jobs-pipeline-panel"><p className="overline">Alert delivery</p><h2>In-app alerts are active.</h2><ul className="jobs-reasons"><li>New matches use your recorded roles, skills, country, province, and experience.</li><li>Changed listings tell you to revisit an earlier draft.</li><li>A vacancy is marked closed only after two complete structured-source misses.</li><li>Email delivery: {jobLabel(overview.capabilities.email_alert_delivery)}.</li><li>Background scheduling endpoint: {overview.capabilities.scheduled_scan_endpoint_ready ? "Ready for protected scheduler" : "Not ready"}.</li></ul></aside>
      </section>

      <section className="section jobs-section">
        <div className="section-heading-row"><div><p className="overline">3. Discovered vacancies</p><h2>Choose a genuine opportunity</h2><p>Scores are transparent planning aids, not employment predictions. Always confirm requirements, closing dates, location, and sponsorship wording on the official page.</p></div><span className="status-dot">{overview.counts.open_jobs} open</span></div>
        <div className="jobs-card-grid jobs-automation-job-grid">{overview.jobs.map((job) => <article className={`jobs-card${selectedJobId === job.id ? " selected" : ""}`} key={job.id}><div className="panel-heading"><div><p className="overline">{job.company_name || "Employer"}</p><h3>{job.job_title}</h3></div><span className="jobs-score">{job.match_score || 0}% match</span></div><p>{[job.city, job.province, job.country].filter(Boolean).join(", ") || "Location not recorded"}</p><div className="badge-row"><span className="badge">{scopeExplanation(job)}</span><span className="badge">Viability {job.application_viability_score ?? job.application_priority_score ?? 0}%</span><span className="badge">{priorityExplanation(job)}</span></div><ul className="jobs-reasons">{(job.application_priority_reasons || job.viability_reasons || []).slice(0, 2).map((reason) => <li key={reason}><strong>{reason}</strong></li>)}{(job.match_reasons || []).slice(0, 2).map((reason) => <li key={reason}>{reason}</li>)}</ul><div className="jobs-record-facts"><span><small>First seen</small><strong>{formatJobDate(job.first_seen_at)}</strong></span><span><small>Source status</small><strong>{jobLabel(job.status)}</strong></span></div><div className="actions"><button className="btn primary" type="button" onClick={() => prepareJob(job)} disabled={busy !== "" || job.application_priority === "out_of_scope" || job.application_priority === "profile_incomplete"}>{busy === `prepare-${job.id}` ? "Preparing..." : job.application_priority === "out_of_scope" ? "Outside selected scope" : job.application_priority === "verify_authorization" ? "Prepare for work-rights review" : "Prepare application"}</button>{job.job_url ? <a className="btn" href={job.job_url} target="_blank" rel="noreferrer">Review vacancy</a> : null}</div></article>)}{!overview.jobs.length ? <article className="jobs-empty"><h3>No matching vacancy has been discovered yet</h3><p>Create monitors and scan the recorded official employer sources. You can continue using manual vacancies in Applications while monitors run.</p></article> : null}</div>
      </section>

      <section className="section jobs-section" id="application-pack">
        <div className="section-heading-row"><div><p className="overline">4. Truthful application pack</p><h2>{selectedJob ? `${selectedJob.job_title} at ${selectedJob.company_name || "the employer"}` : "Choose a vacancy above"}</h2><p>MoveReady reads the selected private resume, then creates editable text drafts using only the saved profile and resume evidence.</p></div>{selectedJob?.job_url ? <a className="btn" href={selectedJob.job_url} target="_blank" rel="noreferrer">Recheck official vacancy</a> : null}</div>
        {!selectedJob ? <article className="jobs-empty"><h3>No vacancy selected</h3><p>Choose “Prepare application” on a discovered vacancy to start this stage.</p></article> : <>
          <div className="jobs-pack-controls"><div className="field"><label htmlFor="automation_base_resume">Base resume</label><select id="automation_base_resume" value={selectedResumeId} onChange={(event) => setSelectedResumeId(event.target.value)}><option value="">Choose an active resume</option>{activeResumes.map((document) => <option value={document.id} key={document.id}>{document.title} · v{document.version}</option>)}</select><small>PDF must contain selectable text; scanned images cannot be read safely.</small></div><button className="btn primary" type="button" onClick={generateDocuments} disabled={busy !== "" || !selectedResumeId}>{busy === "generate" ? "Preparing drafts..." : selectedDrafts.length ? "Regenerate from base resume" : "Generate truthful drafts"}</button>{!activeResumes.length ? <a className="btn" href="/jobs/resume-vault">Upload a resume</a> : null}</div>
          <div className="jobs-draft-grid">{selectedDrafts.map((draft) => { const checked = confirmations[draft.id] || emptyConfirmations; return <article className="jobs-draft-card" key={draft.id}><div className="panel-heading"><div><p className="overline">{jobLabel(draft.draft_type)}</p><h3>{draft.title}</h3></div><span className={`status-dot ${statusTone(draft.status)}`}>{jobLabel(draft.status)}</span></div>{draft.warnings?.length ? <details className="jobs-form-more"><summary>Review warnings <span>{draft.warnings.length}</span></summary><ul className="jobs-reasons">{draft.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></details> : null}<div className="field"><label htmlFor={`draft-${draft.id}`}>Editable draft text</label><textarea id={`draft-${draft.id}`} rows={24} value={draftText[draft.id] ?? draft.content} onChange={(event) => setDraftText((current) => ({ ...current, [draft.id]: event.target.value }))} /><small>Remove every bracketed instruction and add exact contact details, roles, dates, and facts before approval.</small></div><fieldset className="jobs-confirmation-list"><legend>Your required truth check</legend><label><input type="checkbox" checked={checked.facts_verified} onChange={(event) => updateConfirmation(draft.id, "facts_verified", event.target.checked)} /><span>Every experience and achievement is accurate.</span></label><label><input type="checkbox" checked={checked.no_invented_claims} onChange={(event) => updateConfirmation(draft.id, "no_invented_claims", event.target.checked)} /><span>No skill, qualification, result, or duty was invented.</span></label><label><input type="checkbox" checked={checked.contact_details_checked} onChange={(event) => updateConfirmation(draft.id, "contact_details_checked", event.target.checked)} /><span>Contact details, employers, roles, and dates are complete.</span></label><label><input type="checkbox" checked={checked.work_authorization_checked} onChange={(event) => updateConfirmation(draft.id, "work_authorization_checked", event.target.checked)} /><span>Location and work-authorization wording are honest.</span></label></fieldset><div className="actions"><button className="btn" type="button" onClick={() => saveDraft(draft, "reviewed")} disabled={busy !== ""}>{busy === `draft-${draft.id}` ? "Saving..." : "Save reviewed draft"}</button><button className="btn primary" type="button" onClick={() => saveDraft(draft, "approved")} disabled={busy !== ""}>Approve after checks</button>{["approved", "exported"].includes(draft.status) ? <button className="btn" type="button" onClick={() => exportDraft(draft)} disabled={busy !== ""}>Export TXT</button> : null}</div></article>; })}{!selectedDrafts.length ? <article className="jobs-empty"><h3>No application draft yet</h3><p>Choose an active base resume, then generate the two-document pack.</p></article> : null}</div>
        </>}
      </section>

      <section className="section jobs-section jobs-two-column">
        <div className="jobs-pipeline-panel"><div className="panel-heading"><div><p className="overline">5. Controlled application assistance</p><h2>Open the employer page only when ready</h2></div><span className={`status-dot ${statusTone(selectedAssistance?.status)}`}>{jobLabel(selectedAssistance?.status, "Not prepared")}</span></div>{selectedAssistance?.readiness?.checks?.length ? <ul className="jobs-readiness-list">{selectedAssistance.readiness.checks.map((check) => <li className={check.passed ? "complete" : ""} key={check.code}><span>{check.passed ? "✓" : "!"}</span><strong>{check.label}</strong></li>)}</ul> : <p>Prepare a discovered vacancy to calculate the application readiness checks.</p>}<button className="btn primary full" type="button" onClick={openOfficialSite} disabled={busy !== "" || !selectedAssistance?.readiness?.ready}>{busy === "handoff" ? "Opening..." : "Open official employer application"}</button><p className="jobs-form-intro">{selectedAssistance?.readiness?.safety_note || "No employer form is opened until the vacancy and both documents pass the readiness checks."}</p></div>
        <div className="jobs-form"><div className="panel-heading"><div><p className="overline">Record the real outcome</p><h2>Did you actually submit?</h2></div><span className="status-dot">User confirmation only</span></div><p className="jobs-form-intro">Return here after using the employer site. MoveReady changes the application to Applied only when you explicitly confirm submission.</p><label className="jobs-submission-confirm"><input type="checkbox" checked={submissionConfirmed} onChange={(event) => setSubmissionConfirmed(event.target.checked)} /><span>I confirm that I personally completed and submitted the employer application.</span></label><div className="field"><label htmlFor="submission_reference">Short reference hint <span>(optional)</span></label><input id="submission_reference" maxLength={80} value={submissionReference} onChange={(event) => setSubmissionReference(event.target.value)} placeholder="Last 4 characters or a short safe hint" /><small>Do not store a password, full sensitive reference, identity number, or payment detail.</small></div><div className="field"><label htmlFor="submission_note">Private outcome note <span>(optional)</span></label><textarea id="submission_note" rows={4} value={submissionNote} onChange={(event) => setSubmissionNote(event.target.value)} placeholder="Confirmation page seen, follow-up date, or reason the submission could not finish." /></div><div className="actions"><button className="btn primary" type="button" onClick={() => confirmOutcome("submitted")} disabled={busy !== "" || !selectedApplication || !submissionConfirmed}>{busy === "confirm-submitted" ? "Recording..." : "Confirm submitted"}</button><button className="btn" type="button" onClick={() => confirmOutcome("not_submitted")} disabled={busy !== "" || !selectedApplication}>{busy === "confirm-not_submitted" ? "Recording..." : "Record not submitted"}</button></div></div>
      </section>
    </>
  );
}
