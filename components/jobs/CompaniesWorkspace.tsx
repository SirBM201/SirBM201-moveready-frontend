"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import { JobCompany, companyPriorities, companyStatuses, formValue, jobLabel, optionalFormValue } from "@/lib/jobs";

type TrackingDraft = { priority: string; status: string; notes: string };
type CompanyView = "targets" | "directory";

function messageFrom(error: unknown) {
  const apiError = error as ApiError;
  if (apiError?.status === 401) return "Sign in to choose and manage your private target companies.";
  return apiError?.message || "Unable to load employers right now.";
}

function defaultDraft(company?: JobCompany): TrackingDraft {
  return {
    priority: company?.tracking?.priority || "medium",
    status: company?.tracking?.status || "researching",
    notes: company?.tracking?.notes || "",
  };
}

export default function CompaniesWorkspace() {
  const [companies, setCompanies] = useState<JobCompany[]>([]);
  const [drafts, setDrafts] = useState<Record<string, TrackingDraft>>({});
  const [view, setView] = useState<CompanyView>("targets");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [signedOut, setSignedOut] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("Opening your employer list...");

  async function load() {
    setLoading(true);
    setLoadFailed(false);
    try {
      const response = await apiJson<{ ok: boolean; companies: JobCompany[] }>("jobs/companies", { timeoutMs: 20000 });
      const rows = response.companies || [];
      const targetCount = rows.filter((company) => company.tracking).length;
      setCompanies(rows);
      setDrafts(Object.fromEntries(rows.map((company) => [company.id, defaultDraft(company)])));
      setView((current) => targetCount ? current : "directory");
      setSignedOut(false);
      setMessage(targetCount
        ? `${targetCount} employer${targetCount === 1 ? " is" : "s are"} in your private target list.`
        : "Choose a starter employer below, or add one from your own job search.");
    } catch (error) {
      const apiError = error as ApiError;
      setCompanies([]);
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

  const targetCompanies = useMemo(() => companies.filter((company) => Boolean(company.tracking)), [companies]);
  const directoryCompanies = useMemo(() => companies.filter((company) => !company.tracking), [companies]);

  const visibleCompanies = useMemo(() => {
    const rows = view === "targets" ? targetCompanies : directoryCompanies;
    return rows.filter((company) => {
      const haystack = `${company.company_name} ${company.industry} ${company.country} ${company.province || ""}`.toLowerCase();
      const draft = drafts[company.id];
      return (!search || haystack.includes(search.toLowerCase()))
        && (view !== "targets" || !priorityFilter || draft?.priority === priorityFilter)
        && (view !== "targets" || !statusFilter || draft?.status === statusFilter);
    });
  }, [directoryCompanies, drafts, priorityFilter, search, statusFilter, targetCompanies, view]);

  function updateDraft(companyId: string, field: keyof TrackingDraft, value: string) {
    setDrafts((current) => ({
      ...current,
      [companyId]: { ...(current[companyId] || defaultDraft()), [field]: value },
    }));
  }

  function switchView(nextView: CompanyView) {
    setView(nextView);
    setSearch("");
    setPriorityFilter("");
    setStatusFilter("");
  }

  async function saveTracking(company: JobCompany, addToList = false) {
    const draft = drafts[company.id] || defaultDraft(company);
    setSavingId(company.id);
    setMessage(addToList ? `Adding ${company.company_name} to your list...` : `Saving ${company.company_name}...`);
    try {
      const response = await apiJson<{ ok: boolean; tracking: JobCompany["tracking"] }>(`jobs/companies/${company.id}/tracking`, {
        method: "PUT",
        body: draft,
        timeoutMs: 15000,
      });
      setCompanies((current) => current.map((item) => item.id === company.id
        ? { ...item, tracking: response.tracking || draft }
        : item));
      setMessage(addToList
        ? `${company.company_name} is now in your private target list.`
        : `${company.company_name} tracking has been updated.`);
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
    setMessage("Adding your employer...");
    try {
      const response = await apiJson<{ ok: boolean; company: JobCompany }>("jobs/companies", {
        method: "POST",
        body: {
          company_name: formValue(data, "company_name"),
          industry: formValue(data, "industry"),
          country: formValue(data, "country"),
          province: optionalFormValue(data, "province"),
          website: optionalFormValue(data, "website"),
          career_page: optionalFormValue(data, "career_page"),
          priority: formValue(data, "priority") || "medium",
          status: formValue(data, "status") || "researching",
          notes: optionalFormValue(data, "notes"),
        },
        timeoutMs: 20000,
      });
      const company = response.company;
      form.reset();
      setCompanies((current) => [...current, company].sort((a, b) => a.company_name.localeCompare(b.company_name)));
      setDrafts((current) => ({ ...current, [company.id]: defaultDraft(company) }));
      switchView("targets");
      setMessage(`${company.company_name} was added to your private target list.`);
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  if (loading && !companies.length && !signedOut) {
    return (
      <section className="section jobs-section">
        <article className="jobs-empty jobs-sign-in-card" aria-live="polite">
          <span className="eyebrow">Target companies</span>
          <h1>Opening your employer list...</h1>
          <p>MoveReady is checking the employers you chose and the starter directory.</p>
        </article>
      </section>
    );
  }

  if (signedOut) {
    return (
      <section className="section jobs-section">
        <article className="jobs-empty jobs-sign-in-card">
          <span className="eyebrow">Private target list</span>
          <h1>Sign in to choose target companies.</h1>
          <p>Your employer choices, priority, progress, and private notes stay under your verified MoveReady account.</p>
          <div className="actions"><a className="btn primary" href="/login?next=/jobs/companies">Sign in with email</a><a className="btn" href="/jobs">Back to Jobs</a></div>
        </article>
      </section>
    );
  }

  if (loadFailed) {
    return (
      <section className="section jobs-section">
        <article className="jobs-empty jobs-sign-in-card">
          <span className="eyebrow">Employer list unavailable</span>
          <h1>We could not open your target companies.</h1>
          <p>{message} Your saved information has not been changed.</p>
          <div className="actions"><button className="btn primary" type="button" onClick={load} disabled={loading}>{loading ? "Trying again..." : "Try again"}</button><a className="btn" href="/jobs">Back to Jobs</a></div>
        </article>
      </section>
    );
  }

  return (
    <>
      <section className="jobs-page-heading">
        <div><span className="eyebrow">Target companies</span><h1>Choose employers you genuinely want to pursue.</h1><p className="lede">Keep a short personal list, record what you know, and move each employer from research to application without losing your notes.</p></div>
        <div className="actions"><a className="btn primary" href="#add-company">Add my own company</a><a className="btn" href="/jobs">Jobs Dashboard</a><button className="btn" type="button" onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button></div>
      </section>

      <section className="jobs-status-tabs" aria-label="Employer list view">
        <button type="button" className={view === "targets" ? "active" : ""} onClick={() => switchView("targets")} aria-pressed={view === "targets"}>My target list <strong>{targetCompanies.length}</strong></button>
        <button type="button" className={view === "directory" ? "active" : ""} onClick={() => switchView("directory")} aria-pressed={view === "directory"}>Browse starter employers <strong>{directoryCompanies.length}</strong></button>
      </section>

      <div className="jobs-safety-strip">
        <strong>{view === "targets" ? "Your private list:" : "Starter directory:"}</strong>
        <span>{view === "targets"
          ? "Only employers you chose appear here. Priority, progress, and notes are private to your account."
          : "These Canadian packaging and manufacturing employers are starting points, not guaranteed matches or sponsors. Choose only relevant employers, or add one from your own search."}</span>
      </div>

      <section className="jobs-filter-bar">
        <div className="field"><label htmlFor="company_search">Search this view</label><input id="company_search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Company, industry, country, or region" /></div>
        {view === "targets" ? <>
          <div className="field"><label htmlFor="company_priority_filter">Priority</label><select id="company_priority_filter" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}><option value="">All priorities</option>{companyPriorities.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
          <div className="field"><label htmlFor="company_status_filter">Progress</label><select id="company_status_filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All stages</option>{companyStatuses.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
        </> : null}
        <span className="status-dot">{visibleCompanies.length} shown</span>
      </section>
      <p className="jobs-inline-status" aria-live="polite">{message}</p>

      <section className="jobs-company-grid">
        {visibleCompanies.map((company) => {
          const isTarget = Boolean(company.tracking);
          const draft = drafts[company.id] || defaultDraft(company);
          return (
            <article className={`jobs-company-card${isTarget ? " is-target" : ""}`} key={company.id}>
              <div className="panel-heading">
                <div><p className="overline">{company.province || "Region not recorded"} · {company.country}</p><h2>{company.company_name}</h2></div>
                {isTarget ? <span className={`badge jobs-priority ${draft.priority}`}>{jobLabel(draft.priority)}</span> : <span className="status-dot">Not selected</span>}
              </div>
              <p>{company.industry}</p>
              <div className="jobs-company-facts">
                <div><span>Sponsorship evidence</span><strong>{jobLabel(company.visa_sponsorship_status, "Not verified")}</strong></div>
                <div><span>{company.country.toLowerCase() === "canada" ? "LMIA evidence" : "Work-permit evidence"}</span><strong>{company.country.toLowerCase() === "canada" ? jobLabel(company.lmia_history_status, "Not verified") : "Not recorded"}</strong></div>
                <div><span>Recruiter</span><strong>{company.recruiter?.recruiter_name || "Not linked"}</strong></div>
                <div><span>Source status</span><strong>{jobLabel(company.source_status)}</strong></div>
              </div>

              {isTarget ? <>
                <div className="form-grid two-col jobs-compact-form">
                  <div className="field"><label htmlFor={`priority-${company.id}`}>My priority</label><select id={`priority-${company.id}`} value={draft.priority} onChange={(event) => updateDraft(company.id, "priority", event.target.value)}>{companyPriorities.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
                  <div className="field"><label htmlFor={`status-${company.id}`}>My progress</label><select id={`status-${company.id}`} value={draft.status} onChange={(event) => updateDraft(company.id, "status", event.target.value)}>{companyStatuses.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
                </div>
                <div className="field"><label htmlFor={`notes-${company.id}`}>My private notes</label><textarea id={`notes-${company.id}`} rows={3} value={draft.notes} onChange={(event) => updateDraft(company.id, "notes", event.target.value)} placeholder="Why it fits, roles to watch, people contacted, or the next action." /></div>
              </> : <p className="jobs-form-intro">Add this employer only if it fits your role, destination, and experience. You can research it before applying.</p>}

              <div className="actions">
                <button className="btn primary" type="button" onClick={() => saveTracking(company, !isTarget)} disabled={savingId === company.id}>{savingId === company.id ? "Saving..." : isTarget ? "Save changes" : "Add to my target list"}</button>
                {company.career_page ? <a className="btn" href={company.career_page} target="_blank" rel="noreferrer">Open career page</a> : null}
                {company.website ? <a className="btn" href={company.website} target="_blank" rel="noreferrer">Company website</a> : null}
              </div>
            </article>
          );
        })}

        {!visibleCompanies.length && !loading ? <article className="jobs-empty">
          <h2>{view === "targets" ? "Your target list is empty" : "No starter employer matches this search"}</h2>
          <p>{view === "targets" ? "Browse the starter directory or add an employer you found through a real vacancy." : "Clear the search, or add an employer from your own research."}</p>
          <div className="actions">
            {view === "targets" ? <button className="btn primary" type="button" onClick={() => switchView("directory")}>Browse starter employers</button> : null}
            <a className="btn" href="#add-company">Add my own company</a>
          </div>
        </article> : null}
      </section>

      <section className="section jobs-section" id="add-company">
        <form className="jobs-form jobs-narrow-form" onSubmit={createCompany}>
          <div className="panel-heading"><div><p className="overline">Employer from your search</p><h2>Add a company to my target list</h2></div><span className="status-dot">Private to your account</span></div>
          <p className="jobs-form-intro">Start with the employer’s name, industry, country, and official career page. Add tracking details only when useful.</p>
          <div className="form-grid two-col">
            <div className="field"><label htmlFor="new_company_name">Company name</label><input id="new_company_name" name="company_name" required /></div>
            <div className="field"><label htmlFor="new_company_industry">Industry</label><input id="new_company_industry" name="industry" placeholder="Healthcare, software, manufacturing..." required /></div>
            <div className="field"><label htmlFor="new_company_country">Country</label><input id="new_company_country" name="country" placeholder="Canada, Germany, Portugal..." required /></div>
            <div className="field"><label htmlFor="new_company_career">Official career page</label><input id="new_company_career" name="career_page" type="url" placeholder="https://company.example/careers" /></div>
          </div>
          <details className="jobs-form-more">
            <summary>Add tracking details <span>Optional</span></summary>
            <div className="jobs-form-more-fields">
              <div className="form-grid two-col">
                <div className="field"><label htmlFor="new_company_province">Province, state, or region</label><input id="new_company_province" name="province" /></div>
                <div className="field"><label htmlFor="new_company_website">Company website</label><input id="new_company_website" name="website" type="url" /></div>
                <div className="field"><label htmlFor="new_company_priority">My priority</label><select id="new_company_priority" name="priority" defaultValue="medium">{companyPriorities.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
                <div className="field"><label htmlFor="new_company_status">My progress</label><select id="new_company_status" name="status" defaultValue="researching">{companyStatuses.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div>
              </div>
              <div className="field"><label htmlFor="new_company_notes">Private notes</label><textarea id="new_company_notes" name="notes" rows={3} placeholder="Why this employer fits and what you want to do next." /></div>
            </div>
          </details>
          <button className="btn primary" type="submit" disabled={savingId === "new"}>{savingId === "new" ? "Adding..." : "Add to my target list"}</button>
        </form>
      </section>
    </>
  );
}
