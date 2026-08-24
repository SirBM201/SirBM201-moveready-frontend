"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import { ResumeDocument, formatFileSize, formatJobDate } from "@/lib/jobs";

type DocumentGuide = {
  label: string;
  description: string;
  emptyMessage: string;
};

const documentGuides: Record<string, DocumentGuide> = {
  ats_resume: {
    label: "ATS resume",
    description: "A simple, keyword-friendly resume for online applications and employer career pages.",
    emptyMessage: "Start here for most job applications.",
  },
  executive_resume: {
    label: "Executive resume",
    description: "A leadership-focused resume for senior, supervisory, or management roles.",
    emptyMessage: "Add this only when the role needs a more senior presentation.",
  },
  cover_letter: {
    label: "Cover letter",
    description: "A letter tailored to a specific role and employer. Keep separate versions when the message changes.",
    emptyMessage: "Add one when a vacancy asks for it or a tailored introduction will help.",
  },
  manufacturing_portfolio: {
    label: "Manufacturing portfolio",
    description: "Optional evidence of production, machinery, process, or improvement work for manufacturing roles.",
    emptyMessage: "Skip this if your work does not need a manufacturing portfolio.",
  },
};

const documentDisplayOrder = ["ats_resume", "executive_resume", "cover_letter", "manufacturing_portfolio"];

function guideFor(type: string) {
  return documentGuides[type] || {
    label: type.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
    description: "A private document for your job applications.",
    emptyMessage: "Add this document when it supports a real application.",
  };
}

function messageFrom(error: unknown) {
  const apiError = error as ApiError;
  if (apiError?.status === 401) return "Sign in to open your private application documents.";
  return apiError?.message || "Unable to load your application documents right now.";
}

export default function ResumeVaultWorkspace() {
  const [documents, setDocuments] = useState<ResumeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedOut, setSignedOut] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [uploadType, setUploadType] = useState("ats_resume");
  const [message, setMessage] = useState("Opening your private application documents...");

  async function load(successMessage?: string) {
    setLoading(true);
    setLoadFailed(false);
    try {
      const response = await apiJson<{ ok: boolean; documents: ResumeDocument[] }>("jobs/resume-vault", { timeoutMs: 20000 });
      const rows = response.documents || [];
      setDocuments(rows);
      setSignedOut(false);
      setMessage(successMessage || (rows.length
        ? `${rows.length} private document version${rows.length === 1 ? " is" : "s are"} stored in your account.`
        : "Add your ATS resume first, or choose another document that supports a real application."));
    } catch (error) {
      const apiError = error as ApiError;
      setDocuments([]);
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

  const grouped = useMemo(() => Object.fromEntries(
    documentDisplayOrder.map((type) => [type, documents.filter((document) => document.document_type === type)]),
  ), [documents]);

  const activeDocuments = useMemo(() => documents.filter((document) => document.is_active), [documents]);
  const activeTypes = useMemo(() => new Set(activeDocuments.map((document) => document.document_type)), [activeDocuments]);

  const hasCoreResume = activeTypes.has("ats_resume") || activeTypes.has("executive_resume");
  const recommendedType = hasCoreResume ? "" : "ats_resume";
  const recommendedGuide = recommendedType ? guideFor(recommendedType) : null;

  function startUpload(type: string) {
    setUploadType(type);
    window.setTimeout(() => {
      document.getElementById("upload-resume")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("file") as File | null;
    if (!file?.size) {
      setMessage("Choose a PDF, DOCX, or TXT file first.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("This file is larger than 5 MB. Choose a smaller file and try again.");
      return;
    }
    setSavingId("upload");
    setMessage(`Uploading your ${guideFor(uploadType).label.toLowerCase()} to private storage...`);
    try {
      const response = await apiJson<{ ok: boolean; document: ResumeDocument }>("jobs/resume-vault", {
        method: "POST",
        body: data,
        timeoutMs: 45000,
      });
      form.reset();
      await load(`${response.document.title} version ${response.document.version} was uploaded successfully.`);
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  async function download(item: ResumeDocument) {
    setSavingId(item.id);
    try {
      const response = await apiJson<{ ok: boolean; download_url: string }>(`jobs/resume-vault/${item.id}/download`, { timeoutMs: 15000 });
      window.open(response.download_url, "_blank", "noopener,noreferrer");
      setMessage(`Opened a private download for ${item.title}. The link expires after two minutes.`);
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  async function toggleActive(item: ResumeDocument) {
    setSavingId(item.id);
    try {
      await apiJson(`jobs/resume-vault/${item.id}`, {
        method: "PATCH",
        body: { is_active: !item.is_active },
        timeoutMs: 15000,
      });
      const action = item.is_active ? "archived" : "made active";
      await load(`${item.title} was ${action}.`);
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  if (loading && !documents.length && !signedOut) {
    return (
      <section className="section jobs-section">
        <article className="jobs-empty jobs-sign-in-card" aria-live="polite">
          <span className="eyebrow">Application documents</span>
          <h1>Opening your private files...</h1>
          <p>MoveReady is checking the resume and cover-letter versions saved under your account.</p>
        </article>
      </section>
    );
  }

  if (signedOut) {
    return (
      <section className="section jobs-section">
        <article className="jobs-empty jobs-sign-in-card">
          <span className="eyebrow">Private application documents</span>
          <h1>Sign in to store and manage your resume.</h1>
          <p>Your files, document versions, and private notes stay under your verified MoveReady account.</p>
          <div className="actions"><a className="btn primary" href="/login?next=/jobs/resume-vault">Sign in with email</a><a className="btn" href="/jobs">Back to Jobs</a></div>
        </article>
      </section>
    );
  }

  if (loadFailed) {
    return (
      <section className="section jobs-section">
        <article className="jobs-empty jobs-sign-in-card">
          <span className="eyebrow">Documents unavailable</span>
          <h1>We could not open your application documents.</h1>
          <p>{message} Your saved files have not been changed.</p>
          <div className="actions"><button className="btn primary" type="button" onClick={() => load()} disabled={loading}>{loading ? "Trying again..." : "Try again"}</button><a className="btn" href="/jobs">Back to Jobs</a></div>
        </article>
      </section>
    );
  }

  return (
    <>
      <section className="jobs-page-heading">
        <div><span className="eyebrow">Application documents</span><h1>Keep the right resume ready for each application.</h1><p className="lede">Store private resume, cover-letter, and portfolio versions in one place. MoveReady records which version is active so you can select it when tracking an application.</p></div>
        <div className="actions"><a className="btn primary" href="/jobs/career-studio">Open Career Studio</a><button className="btn" type="button" onClick={() => startUpload(recommendedType || "ats_resume")}>Upload an existing document</button><a className="btn" href="/jobs">Jobs Dashboard</a><button className="btn" type="button" onClick={() => load()} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button></div>
      </section>

      <div className="jobs-safety-strip">
        <strong>Private job files only:</strong>
        <span>Upload resume, cover-letter, or supported portfolio files. Do not upload passports, identity documents, certificates, or bank records here.</span>
      </div>

      <section className="section jobs-section jobs-vault-summary">
        <article className="jobs-next-action">
          <div>
            <p className="overline">Recommended next action</p>
            <h2>{recommendedGuide ? `Add your ${recommendedGuide.label}` : "Your resume step is ready"}</h2>
            <p>{recommendedGuide ? recommendedGuide.emptyMessage : "Continue to applications. Add a cover letter or portfolio only when a real vacancy or target role needs one."}</p>
          </div>
          {recommendedGuide ? <button className="btn primary" type="button" onClick={() => startUpload(recommendedType)}>Choose this document</button> : <a className="btn primary" href="/jobs/applications">Open applications</a>}
        </article>
        <div className="jobs-progress-summary jobs-vault-progress">
          <strong>{activeDocuments.length} active file{activeDocuments.length === 1 ? "" : "s"}</strong>
          <span>Across {activeTypes.size} document categor{activeTypes.size === 1 ? "y" : "ies"}.</span>
          <span>Archived versions remain available below.</span>
        </div>
      </section>

      <p className="jobs-inline-status" aria-live="polite">{message}</p>

      <section className="jobs-vault-grid" aria-label="Stored application documents">
        {documentDisplayOrder.map((type) => {
          const items = grouped[type] || [];
          const guide = guideFor(type);
          const current = items.find((item) => item.is_active) || items[0];
          return (
            <article className={`jobs-vault-category${activeTypes.has(type) ? " has-active-document" : ""}`} key={type}>
              <div className="panel-heading"><div><p className="overline">{type === "ats_resume" ? "Best starting point" : "Document category"}</p><h2>{guide.label}</h2></div><span className="status-dot">{activeTypes.has(type) ? "Active file" : "Not added"}</span></div>
              <p>{guide.description}</p>
              {current ? <div className="jobs-document-summary"><strong>Current: {current.title}</strong><span>Version {current.version} · {formatJobDate(current.updated_at)}</span></div> : <div className="jobs-vault-empty-copy"><strong>{guide.emptyMessage}</strong><button className="btn" type="button" onClick={() => startUpload(type)}>Choose this type</button></div>}
              <div className="jobs-vault-list">
                {items.map((item) => (
                  <div key={item.id} className={!item.is_active ? "inactive" : ""}>
                    <span><strong>{item.title}</strong><small>{item.original_file_name} · {formatFileSize(item.size_bytes)} · version {item.version}</small><small>{item.is_active ? "Active for future applications" : "Archived version"}</small></span>
                    <span className="actions"><button className="btn" type="button" onClick={() => download(item)} disabled={savingId === item.id}>Download</button><button className="btn" type="button" onClick={() => toggleActive(item)} disabled={savingId === item.id}>{item.is_active ? "Archive" : "Make active"}</button></span>
                  </div>
                ))}
              </div>
              {items.length ? <button className="btn jobs-vault-new-version" type="button" onClick={() => startUpload(type)}>Upload newer version</button> : null}
            </article>
          );
        })}
      </section>

      <section className="section jobs-section jobs-two-column" id="upload-resume">
        <form className="jobs-form" onSubmit={upload}>
          <div className="panel-heading"><div><p className="overline">Private upload</p><h2>Add an application document</h2></div><span className="status-dot">5 MB maximum</span></div>
          <p className="jobs-form-intro">Choose the document purpose and file. MoveReady will create the next version number automatically.</p>
          <div className="field"><label htmlFor="vault_document_type">What are you uploading?</label><select id="vault_document_type" name="document_type" value={uploadType} onChange={(event) => setUploadType(event.target.value)}>{documentDisplayOrder.map((type) => <option value={type} key={type}>{guideFor(type).label}</option>)}</select><small>{guideFor(uploadType).description}</small></div>
          <div className="field"><label htmlFor="vault_file">Choose a PDF, DOCX, or TXT file</label><input id="vault_file" name="file" type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" required /><small>Maximum file size: 5 MB.</small></div>
          <details className="jobs-form-more">
            <summary>Add a custom title or note <span>Optional</span></summary>
            <div className="jobs-form-more-fields">
              <div className="field"><label htmlFor="vault_title">Document title</label><input id="vault_title" name="title" placeholder="Production Supervisor resume for Canada" /><small>Leave blank and MoveReady will name the version for you.</small></div>
              <div className="field"><label htmlFor="vault_notes">Private version note</label><textarea id="vault_notes" name="notes" rows={3} placeholder="Target role, important changes, or where this version should be used." /></div>
            </div>
          </details>
          <button className="btn primary" type="submit" disabled={savingId === "upload"}>{savingId === "upload" ? "Uploading..." : "Upload to my private documents"}</button>
        </form>
        <aside className="jobs-pipeline-panel">
          <p className="overline">How this works</p>
          <h2>Your files stay separate from public job information.</h2>
          <ul className="jobs-reasons">
            <li>Only your verified account can list these files.</li>
            <li>Each upload gets a version number so an older application can still identify the document you used.</li>
            <li>Downloads use a temporary private link that expires after two minutes.</li>
            <li>Archive an old version to keep it visually separate from the files you currently use.</li>
          </ul>
          <a className="btn" href="/jobs/applications">Continue to applications</a>
        </aside>
      </section>
    </>
  );
}
