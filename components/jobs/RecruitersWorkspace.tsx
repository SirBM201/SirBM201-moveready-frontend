"use client";

import { FormEvent, useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import { JobCompany, JobRecruiter, connectionStatuses, formValue, jobLabel, optionalFormValue } from "@/lib/jobs";

type RecruiterDraft = { connection_status: string; follow_up_date: string; notes: string };

function messageFrom(error: unknown) {
  const apiError = error as ApiError;
  if (apiError?.status === 401) return "Sign in to manage your private recruiter contacts.";
  return apiError?.message || "Unable to load recruiters.";
}

export default function RecruitersWorkspace() {
  const [companies, setCompanies] = useState<JobCompany[]>([]);
  const [recruiters, setRecruiters] = useState<JobRecruiter[]>([]);
  const [drafts, setDrafts] = useState<Record<string, RecruiterDraft>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("Loading recruiter contacts...");

  async function load() {
    setLoading(true);
    try {
      const [companyResponse, recruiterResponse] = await Promise.all([
        apiJson<{ ok: boolean; companies: JobCompany[] }>("jobs/companies", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; recruiters: JobRecruiter[] }>("jobs/recruiters", { timeoutMs: 20000 }),
      ]);
      const rows = recruiterResponse.recruiters || [];
      setCompanies(companyResponse.companies || []);
      setRecruiters(rows);
      setDrafts(Object.fromEntries(rows.map((recruiter) => [recruiter.id, {
        connection_status: recruiter.connection_status || "not_contacted",
        follow_up_date: recruiter.follow_up_date || "",
        notes: recruiter.notes || "",
      }])));
      setMessage(`${rows.length} recruiter contacts loaded.`);
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function updateDraft(id: string, field: keyof RecruiterDraft, value: string) {
    setDrafts((current) => ({ ...current, [id]: { ...(current[id] || { connection_status: "not_contacted", follow_up_date: "", notes: "" }), [field]: value } }));
  }

  async function createRecruiter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSavingId("new");
    try {
      const response = await apiJson<{ ok: boolean; recruiter: JobRecruiter }>("jobs/recruiters", {
        method: "POST",
        body: {
          recruiter_name: formValue(data, "recruiter_name"),
          company_id: optionalFormValue(data, "company_id"),
          recruitment_company: optionalFormValue(data, "recruitment_company"),
          province: optionalFormValue(data, "province"),
          specialization: optionalFormValue(data, "specialization"),
          linkedin_url: optionalFormValue(data, "linkedin_url"),
          website: optionalFormValue(data, "website"),
          email_address: optionalFormValue(data, "email_address"),
          phone: optionalFormValue(data, "phone"),
          connection_status: formValue(data, "connection_status") || "not_contacted",
          follow_up_date: optionalFormValue(data, "follow_up_date"),
          notes: optionalFormValue(data, "notes"),
        },
        timeoutMs: 20000,
      });
      form.reset();
      setMessage(`${response.recruiter.recruiter_name} added to your recruiter pipeline.`);
      await load();
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  async function saveRecruiter(recruiter: JobRecruiter) {
    const draft = drafts[recruiter.id];
    setSavingId(recruiter.id);
    try {
      await apiJson(`jobs/recruiters/${recruiter.id}`, {
        method: "PATCH",
        body: {
          connection_status: draft.connection_status,
          connected: draft.connection_status === "connected",
          follow_up_date: draft.follow_up_date || null,
          notes: draft.notes,
          last_contacted_at: ["contacted", "responded", "follow_up"].includes(draft.connection_status) ? new Date().toISOString() : undefined,
        },
        timeoutMs: 15000,
      });
      setMessage(`${recruiter.recruiter_name} updated.`);
      await load();
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  const companyNames = Object.fromEntries(companies.map((company) => [company.id, company.company_name]));

  return (
    <>
      <section className="jobs-page-heading">
        <div><span className="eyebrow">Recruiter database</span><h1>Keep every recruiter conversation organized.</h1><p className="lede">Record the person, agency or employer, specialization, contact channel, connection stage, and next follow-up—without mixing it into your personal contacts.</p></div>
        <div className="actions"><a className="btn primary" href="#add-recruiter">Add recruiter</a><a className="btn" href="/jobs/companies">Target companies</a><button className="btn" type="button" onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button></div>
      </section>
      <p className="jobs-inline-status" aria-live="polite">{message}</p>

      <section className="jobs-card-grid jobs-recruiter-grid">
        {recruiters.map((recruiter) => {
          const draft = drafts[recruiter.id] || { connection_status: "not_contacted", follow_up_date: "", notes: "" };
          return (
            <article className="jobs-card" key={recruiter.id}>
              <div className="panel-heading"><div><p className="overline">{recruiter.recruitment_company || companyNames[recruiter.company_id || ""] || "Independent recruiter"}</p><h2>{recruiter.recruiter_name}</h2></div><span className={`badge jobs-connection ${draft.connection_status}`}>{jobLabel(draft.connection_status)}</span></div>
              <p>{recruiter.specialization || "Specialization not recorded"}{recruiter.province ? ` · ${recruiter.province}` : ""}</p>
              <div className="jobs-contact-links">
                {recruiter.linkedin_url ? <a href={recruiter.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a> : null}
                {recruiter.website ? <a href={recruiter.website} target="_blank" rel="noreferrer">Website</a> : null}
                {recruiter.email_address ? <a href={`mailto:${recruiter.email_address}`}>{recruiter.email_address}</a> : null}
                {recruiter.phone ? <span>{recruiter.phone}</span> : null}
              </div>
              <div className="form-grid two-col jobs-compact-form">
                <div className="field"><label htmlFor={`connection-${recruiter.id}`}>Connection status</label><select id={`connection-${recruiter.id}`} value={draft.connection_status} onChange={(event) => updateDraft(recruiter.id, "connection_status", event.target.value)}>{connectionStatuses.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
                <div className="field"><label htmlFor={`follow-up-${recruiter.id}`}>Follow-up date</label><input id={`follow-up-${recruiter.id}`} type="date" value={draft.follow_up_date} onChange={(event) => updateDraft(recruiter.id, "follow_up_date", event.target.value)} /></div>
              </div>
              <div className="field"><label htmlFor={`recruiter-notes-${recruiter.id}`}>Private notes</label><textarea id={`recruiter-notes-${recruiter.id}`} rows={3} value={draft.notes} onChange={(event) => updateDraft(recruiter.id, "notes", event.target.value)} /></div>
              <button className="btn primary" type="button" onClick={() => saveRecruiter(recruiter)} disabled={savingId === recruiter.id}>{savingId === recruiter.id ? "Saving..." : "Save contact update"}</button>
            </article>
          );
        })}
        {!recruiters.length && !loading ? <article className="jobs-empty"><h3>No recruiter recorded yet</h3><p>Add the first verified recruiter or recruitment company below. Do not guess personal email addresses.</p></article> : null}
      </section>

      <section className="section jobs-section" id="add-recruiter">
        <form className="jobs-form jobs-narrow-form" onSubmit={createRecruiter}>
          <div className="panel-heading"><div><p className="overline">New contact</p><h2>Add a recruiter</h2></div><span className="status-dot">Private CRM</span></div>
          <div className="form-grid two-col">
            <div className="field"><label htmlFor="recruiter_name">Recruiter name</label><input id="recruiter_name" name="recruiter_name" required /></div>
            <div className="field"><label htmlFor="recruiter_company_id">Target company</label><select id="recruiter_company_id" name="company_id" defaultValue=""><option value="">Not linked</option>{companies.map((company) => <option value={company.id} key={company.id}>{company.company_name}</option>)}</select></div>
            <div className="field"><label htmlFor="recruitment_company">Recruitment company</label><input id="recruitment_company" name="recruitment_company" /></div>
            <div className="field"><label htmlFor="recruiter_province">Province</label><input id="recruiter_province" name="province" /></div>
            <div className="field"><label htmlFor="recruiter_specialization">Specialization</label><input id="recruiter_specialization" name="specialization" placeholder="Manufacturing and skilled trades" /></div>
            <div className="field"><label htmlFor="recruiter_linkedin">LinkedIn</label><input id="recruiter_linkedin" name="linkedin_url" type="url" /></div>
            <div className="field"><label htmlFor="recruiter_website">Website</label><input id="recruiter_website" name="website" type="url" /></div>
            <div className="field"><label htmlFor="recruiter_email">Email</label><input id="recruiter_email" name="email_address" type="email" /></div>
            <div className="field"><label htmlFor="recruiter_phone">Phone</label><input id="recruiter_phone" name="phone" /></div>
            <div className="field"><label htmlFor="recruiter_connection_status">Connection status</label><select id="recruiter_connection_status" name="connection_status" defaultValue="not_contacted">{connectionStatuses.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
            <div className="field"><label htmlFor="recruiter_follow_up_date">Follow-up date</label><input id="recruiter_follow_up_date" name="follow_up_date" type="date" /></div>
          </div>
          <div className="field"><label htmlFor="recruiter_notes">Private notes</label><textarea id="recruiter_notes" name="notes" rows={3} /></div>
          <button className="btn primary" type="submit" disabled={savingId === "new"}>{savingId === "new" ? "Adding..." : "Add recruiter"}</button>
        </form>
      </section>
    </>
  );
}
