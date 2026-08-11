"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import { JobCompany, companyPriorities, companyStatuses, formValue, jobLabel, optionalFormValue } from "@/lib/jobs";

type TrackingDraft = { priority: string; status: string; notes: string };

function messageFrom(error: unknown) {
  const apiError = error as ApiError;
  if (apiError?.status === 401) return "Sign in to manage your private company targets.";
  return apiError?.message || "Unable to load the company database.";
}

export default function CompaniesWorkspace() {
  const [companies, setCompanies] = useState<JobCompany[]>([]);
  const [drafts, setDrafts] = useState<Record<string, TrackingDraft>>({});
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("Loading the target company database...");

  async function load() {
    setLoading(true);
    try {
      const response = await apiJson<{ ok: boolean; companies: JobCompany[] }>("jobs/companies", { timeoutMs: 20000 });
      const rows = response.companies || [];
      setCompanies(rows);
      setDrafts(Object.fromEntries(rows.map((company) => [company.id, {
        priority: company.tracking?.priority || "medium",
        status: company.tracking?.status || "researching",
        notes: company.tracking?.notes || "",
      }])));
      setMessage(`${rows.length} companies loaded. Personal priority, status, and notes are visible only to your account.`);
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => companies.filter((company) => {
    const haystack = `${company.company_name} ${company.industry} ${company.province || ""}`.toLowerCase();
    const draft = drafts[company.id];
    return (!search || haystack.includes(search.toLowerCase()))
      && (!priorityFilter || draft?.priority === priorityFilter)
      && (!statusFilter || draft?.status === statusFilter);
  }), [companies, drafts, priorityFilter, search, statusFilter]);

  function updateDraft(companyId: string, field: keyof TrackingDraft, value: string) {
    setDrafts((current) => ({ ...current, [companyId]: { ...(current[companyId] || { priority: "medium", status: "researching", notes: "" }), [field]: value } }));
  }

  async function saveTracking(company: JobCompany) {
    const draft = drafts[company.id];
    setSavingId(company.id);
    setMessage(`Saving ${company.company_name}...`);
    try {
      await apiJson(`jobs/companies/${company.id}/tracking`, { method: "PUT", body: draft, timeoutMs: 15000 });
      setMessage(`${company.company_name} tracking updated.`);
      await load();
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  async function createCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSavingId("new");
    try {
      const response = await apiJson<{ ok: boolean; company: JobCompany }>("jobs/companies", {
        method: "POST",
        body: {
          company_name: formValue(data, "company_name"),
          industry: formValue(data, "industry"),
          country: formValue(data, "country") || "Canada",
          province: optionalFormValue(data, "province"),
          website: optionalFormValue(data, "website"),
          career_page: optionalFormValue(data, "career_page"),
          priority: formValue(data, "priority") || "medium",
          status: formValue(data, "status") || "researching",
          notes: optionalFormValue(data, "notes"),
        },
        timeoutMs: 20000,
      });
      form.reset();
      setMessage(`${response.company.company_name} added to your private target list.`);
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
        <div><span className="eyebrow">Company database</span><h1>Build a focused employer target list.</h1><p className="lede">Start with the approved Canadian plastics, packaging, tooling, and automotive manufacturers. Add private targets as the search expands.</p></div>
        <div className="actions"><a className="btn primary" href="#add-company">Add company</a><a className="btn" href="/jobs/recruiters">Manage recruiters</a><button className="btn" type="button" onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button></div>
      </section>

      <section className="jobs-filter-bar">
        <div className="field"><label htmlFor="company_search">Search</label><input id="company_search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Company, industry, or province" /></div>
        <div className="field"><label htmlFor="company_priority_filter">Priority</label><select id="company_priority_filter" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}><option value="">All priorities</option>{companyPriorities.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
        <div className="field"><label htmlFor="company_status_filter">Status</label><select id="company_status_filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All statuses</option>{companyStatuses.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
        <span className="status-dot">{filtered.length} shown</span>
      </section>
      <p className="jobs-inline-status" aria-live="polite">{message}</p>

      <section className="jobs-company-grid">
        {filtered.map((company) => {
          const draft = drafts[company.id] || { priority: "medium", status: "researching", notes: "" };
          return (
            <article className="jobs-company-card" key={company.id}>
              <div className="panel-heading">
                <div><p className="overline">{company.province || "Province not recorded"} · {company.country}</p><h2>{company.company_name}</h2></div>
                <span className={`badge jobs-priority ${draft.priority}`}>{jobLabel(draft.priority)}</span>
              </div>
              <p>{company.industry}</p>
              <div className="jobs-company-facts">
                <div><span>Sponsorship</span><strong>{jobLabel(company.visa_sponsorship_status, "Unknown")}</strong></div>
                <div><span>LMIA history</span><strong>{jobLabel(company.lmia_history_status, "Unknown")}</strong></div>
                <div><span>Recruiter</span><strong>{company.recruiter?.recruiter_name || "Not linked"}</strong></div>
                <div><span>Source</span><strong>{jobLabel(company.source_status)}</strong></div>
              </div>
              <div className="form-grid two-col jobs-compact-form">
                <div className="field"><label htmlFor={`priority-${company.id}`}>Priority</label><select id={`priority-${company.id}`} value={draft.priority} onChange={(event) => updateDraft(company.id, "priority", event.target.value)}>{companyPriorities.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
                <div className="field"><label htmlFor={`status-${company.id}`}>Status</label><select id={`status-${company.id}`} value={draft.status} onChange={(event) => updateDraft(company.id, "status", event.target.value)}>{companyStatuses.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
              </div>
              <div className="field"><label htmlFor={`notes-${company.id}`}>Private notes</label><textarea id={`notes-${company.id}`} rows={3} value={draft.notes} onChange={(event) => updateDraft(company.id, "notes", event.target.value)} placeholder="Contact plan, role fit, plant, follow-up, or research note." /></div>
              <div className="actions">
                <button className="btn primary" type="button" onClick={() => saveTracking(company)} disabled={savingId === company.id}>{savingId === company.id ? "Saving..." : "Save tracking"}</button>
                {company.career_page ? <a className="btn" href={company.career_page} target="_blank" rel="noreferrer">Career page</a> : null}
                {company.website ? <a className="btn" href={company.website} target="_blank" rel="noreferrer">Website</a> : null}
              </div>
            </article>
          );
        })}
      </section>

      <section className="section jobs-section" id="add-company">
        <form className="jobs-form jobs-narrow-form" onSubmit={createCompany}>
          <div className="panel-heading"><div><p className="overline">Private target</p><h2>Add another company</h2></div><span className="status-dot">Account only</span></div>
          <div className="form-grid two-col">
            <div className="field"><label htmlFor="new_company_name">Company name</label><input id="new_company_name" name="company_name" required /></div>
            <div className="field"><label htmlFor="new_company_industry">Industry</label><input id="new_company_industry" name="industry" placeholder="Plastic packaging" required /></div>
            <div className="field"><label htmlFor="new_company_country">Country</label><input id="new_company_country" name="country" defaultValue="Canada" required /></div>
            <div className="field"><label htmlFor="new_company_province">Province</label><input id="new_company_province" name="province" /></div>
            <div className="field"><label htmlFor="new_company_website">Website</label><input id="new_company_website" name="website" type="url" /></div>
            <div className="field"><label htmlFor="new_company_career">Career page</label><input id="new_company_career" name="career_page" type="url" /></div>
            <div className="field"><label htmlFor="new_company_priority">Priority</label><select id="new_company_priority" name="priority" defaultValue="medium">{companyPriorities.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
            <div className="field"><label htmlFor="new_company_status">Status</label><select id="new_company_status" name="status" defaultValue="researching">{companyStatuses.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
          </div>
          <div className="field"><label htmlFor="new_company_notes">Private notes</label><textarea id="new_company_notes" name="notes" rows={3} /></div>
          <button className="btn primary" type="submit" disabled={savingId === "new"}>{savingId === "new" ? "Adding..." : "Add company"}</button>
        </form>
      </section>
    </>
  );
}
