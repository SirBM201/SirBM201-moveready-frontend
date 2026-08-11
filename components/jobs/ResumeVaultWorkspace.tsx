"use client";

import { FormEvent, useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import { ResumeDocument, documentTypes, formatFileSize, formatJobDate, jobLabel } from "@/lib/jobs";

function messageFrom(error: unknown) {
  const apiError = error as ApiError;
  if (apiError?.status === 401) return "Sign in to open your private Resume Vault.";
  return apiError?.message || "Unable to load Resume Vault.";
}

export default function ResumeVaultWorkspace() {
  const [documents, setDocuments] = useState<ResumeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("Loading private resume files...");

  async function load() {
    setLoading(true);
    try {
      const response = await apiJson<{ ok: boolean; documents: ResumeDocument[] }>("jobs/resume-vault", { timeoutMs: 20000 });
      setDocuments(response.documents || []);
      setMessage(`${response.documents?.length || 0} resume documents loaded. Files are private and downloads expire after two minutes.`);
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("file") as File | null;
    if (!file?.size) {
      setMessage("Choose a PDF, DOCX, or text file first.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("The selected file is larger than the 5 MB Resume Vault limit.");
      return;
    }
    setSavingId("upload");
    setMessage("Encrypting the connection and uploading the resume file to private storage...");
    try {
      const response = await apiJson<{ ok: boolean; document: ResumeDocument }>("jobs/resume-vault", {
        method: "POST",
        body: data,
        timeoutMs: 45000,
      });
      form.reset();
      setMessage(`${response.document.title} v${response.document.version} uploaded securely.`);
      await load();
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  async function download(document: ResumeDocument) {
    setSavingId(document.id);
    try {
      const response = await apiJson<{ ok: boolean; download_url: string }>(`jobs/resume-vault/${document.id}/download`, { timeoutMs: 15000 });
      window.open(response.download_url, "_blank", "noopener,noreferrer");
      setMessage(`Opened a temporary private download for ${document.title}.`);
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  async function toggleActive(document: ResumeDocument) {
    setSavingId(document.id);
    try {
      await apiJson(`jobs/resume-vault/${document.id}`, {
        method: "PATCH",
        body: { is_active: !document.is_active },
        timeoutMs: 15000,
      });
      setMessage(`${document.title} marked ${document.is_active ? "inactive" : "active"}.`);
      await load();
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  const grouped = Object.fromEntries(documentTypes.map((type) => [type, documents.filter((document) => document.document_type === type)]));

  return (
    <>
      <section className="jobs-page-heading">
        <div><span className="eyebrow">Resume Vault</span><h1>Keep every application document version under control.</h1><p className="lede">Store the Executive Resume, ATS Resume, Cover Letter, and Manufacturing Portfolio used for job applications. Each upload receives a version number and private storage path.</p></div>
        <div className="actions"><a className="btn primary" href="#upload-resume">Upload document</a><a className="btn" href="/jobs/applications">Applications</a><button className="btn" type="button" onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button></div>
      </section>
      <p className="jobs-inline-status" aria-live="polite">{message}</p>

      <section className="jobs-vault-grid">
        {documentTypes.map((type) => {
          const items = grouped[type] || [];
          const latest = items[0];
          return (
            <article className="jobs-vault-category" key={type}>
              <div className="panel-heading"><div><p className="overline">Document type</p><h2>{jobLabel(type)}</h2></div><span className="status-dot">{items.length} version{items.length === 1 ? "" : "s"}</span></div>
              {latest ? <p>Latest: <strong>{latest.title}</strong> · v{latest.version} · {formatJobDate(latest.updated_at)}</p> : <p>No file uploaded for this document type yet.</p>}
              <div className="jobs-vault-list">
                {items.map((document) => (
                  <div key={document.id} className={!document.is_active ? "inactive" : ""}>
                    <span><strong>{document.title}</strong><small>{document.original_file_name} · {formatFileSize(document.size_bytes)} · v{document.version}</small></span>
                    <span className="actions"><button className="btn" type="button" onClick={() => download(document)} disabled={savingId === document.id}>Download</button><button className="btn" type="button" onClick={() => toggleActive(document)} disabled={savingId === document.id}>{document.is_active ? "Archive" : "Reactivate"}</button></span>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <section className="section jobs-section jobs-two-column" id="upload-resume">
        <form className="jobs-form" onSubmit={upload}>
          <div className="panel-heading"><div><p className="overline">Private upload</p><h2>Add a resume document</h2></div><span className="status-dot">5 MB maximum</span></div>
          <div className="field"><label htmlFor="vault_document_type">Document type</label><select id="vault_document_type" name="document_type" defaultValue="ats_resume">{documentTypes.map((type) => <option value={type} key={type}>{jobLabel(type)}</option>)}</select></div>
          <div className="field"><label htmlFor="vault_title">Document title</label><input id="vault_title" name="title" placeholder="Canada Production Supervisor ATS Resume" /></div>
          <div className="field"><label htmlFor="vault_file">PDF, DOCX, or TXT file</label><input id="vault_file" name="file" type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" required /></div>
          <div className="field"><label htmlFor="vault_notes">Version notes</label><textarea id="vault_notes" name="notes" rows={4} placeholder="Target role, major changes, and where this version should be used." /></div>
          <button className="btn primary" type="submit" disabled={savingId === "upload"}>{savingId === "upload" ? "Uploading..." : "Upload to private vault"}</button>
        </form>
        <aside className="jobs-pipeline-panel">
          <p className="overline">Security boundary</p>
          <h2>Resume files only in Sprint 1</h2>
          <ul className="jobs-reasons">
            <li>Files stay in a private Supabase bucket and are accessed through short-lived signed links.</li>
            <li>The database stores metadata and versions; it does not expose storage paths to the browser.</li>
            <li>Passport, certificates, reference letters, and IELTS are future document types and are not accepted by this endpoint yet.</li>
            <li>Do not upload identity documents or bank records into Resume Vault.</li>
          </ul>
        </aside>
      </section>
    </>
  );
}
