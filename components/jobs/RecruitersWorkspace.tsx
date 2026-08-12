"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import { JobCompany, JobRecruiter, connectionStatuses, formValue, jobLabel, optionalFormValue } from "@/lib/jobs";

type RecruiterDraft = { connection_status: string; follow_up_date: string; notes: string };
type ContactView = "all" | "to_contact" | "waiting" | "active" | "follow_up";

const contactViews: { value: ContactView; label: string; statuses?: string[] }[] = [
  { value: "all", label: "All contacts" },
  { value: "to_contact", label: "To contact", statuses: ["not_contacted"] },
  { value: "waiting", label: "Waiting", statuses: ["connection_requested", "contacted"] },
  { value: "active", label: "In conversation", statuses: ["connected", "responded"] },
  { value: "follow_up", label: "Follow up", statuses: ["follow_up"] },
];

function messageFrom(error: unknown) {
  const apiError = error as ApiError;
  if (apiError?.status === 401) return "Sign in to manage your private recruiter contacts.";
  return apiError?.message || "Unable to load recruiter contacts right now.";
}

function draftFor(recruiter?: JobRecruiter): RecruiterDraft {
  return {
    connection_status: recruiter?.connection_status || "not_contacted",
    follow_up_date: recruiter?.follow_up_date || "",
    notes: recruiter?.notes || "",
  };
}

function viewCount(view: ContactView, recruiters: JobRecruiter[]) {
  const statuses = contactViews.find((item) => item.value === view)?.statuses;
  return statuses ? recruiters.filter((recruiter) => statuses.includes(recruiter.connection_status || "not_contacted")).length : recruiters.length;
}

export default function RecruitersWorkspace() {
  const [companies, setCompanies] = useState<JobCompany[]>([]);
  const [recruiters, setRecruiters] = useState<JobRecruiter[]>([]);
  const [drafts, setDrafts] = useState<Record<string, RecruiterDraft>>({});
  const [view, setView] = useState<ContactView>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [signedOut, setSignedOut] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("Opening your recruiter contacts...");

  async function load(successMessage?: string) {
    setLoading(true);
    setLoadFailed(false);
    try {
      const [companyResponse, recruiterResponse] = await Promise.all([
        apiJson<{ ok: boolean; companies: JobCompany[] }>("jobs/companies", { timeoutMs: 20000 }),
        apiJson<{ ok: boolean; recruiters: JobRecruiter[] }>("jobs/recruiters", { timeoutMs: 20000 }),
      ]);
      const rows = recruiterResponse.recruiters || [];
      setCompanies(companyResponse.companies || []);
      setRecruiters(rows);
      setDrafts(Object.fromEntries(rows.map((recruiter) => [recruiter.id, draftFor(recruiter)])));
      setSignedOut(false);
      setMessage(successMessage || (rows.length
        ? `${rows.length} verified contact${rows.length === 1 ? " is" : "s are"} in your private recruiter list.`
        : "Add a recruiter or hiring contact only after confirming the person and contact channel."));
    } catch (error) {
      const apiError = error as ApiError;
      setCompanies([]);
      setRecruiters([]);
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

  const companyNames = useMemo(() => Object.fromEntries(companies.map((company) => [company.id, company.company_name])), [companies]);
  const targetCompanies = useMemo(() => companies.filter((company) => Boolean(company.tracking)), [companies]);
  const visibleRecruiters = useMemo(() => {
    const statuses = contactViews.find((item) => item.value === view)?.statuses;
    const term = search.trim().toLowerCase();
    return recruiters.filter((recruiter) => {
      const status = recruiter.connection_status || "not_contacted";
      const haystack = [
        recruiter.recruiter_name,
        recruiter.recruitment_company,
        recruiter.specialization,
        recruiter.province,
        companyNames[recruiter.company_id || ""],
      ].filter(Boolean).join(" ").toLowerCase();
      return (!statuses || statuses.includes(status)) && (!term || haystack.includes(term));
    });
  }, [companies, recruiters, search, view, companyNames]);

  const followUpsDue = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return recruiters.filter((recruiter) => recruiter.follow_up_date
      && recruiter.follow_up_date <= today
      && recruiter.connection_status !== "inactive");
  }, [recruiters]);

  function updateDraft(id: string, field: keyof RecruiterDraft, value: string) {
    setDrafts((current) => ({ ...current, [id]: { ...(current[id] || draftFor()), [field]: value } }));
  }

  async function createRecruiter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const linkedin = optionalFormValue(data, "linkedin_url");
    const email = optionalFormValue(data, "email_address");
    const phone = optionalFormValue(data, "phone");
    if (!linkedin && !email && !phone) {
      setMessage("Add at least one verified contact channel: LinkedIn, email, or phone.");
      return;
    }
    setSavingId("new");
    setMessage("Saving this contact to your private recruiter list...");
    try {
      const response = await apiJson<{ ok: boolean; recruiter: JobRecruiter }>("jobs/recruiters", {
        method: "POST",
        body: {
          recruiter_name: formValue(data, "recruiter_name"),
          company_id: optionalFormValue(data, "company_id"),
          recruitment_company: optionalFormValue(data, "recruitment_company"),
          province: optionalFormValue(data, "province"),
          specialization: optionalFormValue(data, "specialization"),
          linkedin_url: linkedin,
          website: optionalFormValue(data, "website"),
          email_address: email,
          phone,
          connection_status: formValue(data, "connection_status") || "not_contacted",
          follow_up_date: optionalFormValue(data, "follow_up_date"),
          notes: optionalFormValue(data, "notes"),
        },
        timeoutMs: 20000,
      });
      form.reset();
      setView("all");
      setSearch("");
      await load(`${response.recruiter.recruiter_name} was added to your private recruiter list.`);
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  async function saveRecruiter(recruiter: JobRecruiter) {
    const draft = drafts[recruiter.id] || draftFor(recruiter);
    setSavingId(recruiter.id);
    setMessage(`Saving your update for ${recruiter.recruiter_name}...`);
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
      await load(`${recruiter.recruiter_name} was updated to ${jobLabel(draft.connection_status)}.`);
    } catch (error) {
      setMessage(messageFrom(error));
    } finally {
      setSavingId("");
    }
  }

  if (loading && !recruiters.length && !signedOut) {
    return <section className="section jobs-section"><article className="jobs-empty jobs-sign-in-card" aria-live="polite"><span className="eyebrow">Recruiter contacts</span><h1>Opening your private contact list...</h1><p>MoveReady is checking your verified recruiters, hiring contacts, and follow-up dates.</p></article></section>;
  }

  if (signedOut) {
    return <section className="section jobs-section"><article className="jobs-empty jobs-sign-in-card"><span className="eyebrow">Private recruiter contacts</span><h1>Sign in to manage recruiter conversations.</h1><p>Names, contact channels, conversation stages, follow-up dates, and notes stay under your verified MoveReady account.</p><div className="actions"><a className="btn primary" href="/login?next=/jobs/recruiters">Sign in with email</a><a className="btn" href="/jobs">Back to Jobs</a></div></article></section>;
  }

  if (loadFailed) {
    return <section className="section jobs-section"><article className="jobs-empty jobs-sign-in-card"><span className="eyebrow">Contacts unavailable</span><h1>We could not open your recruiter list.</h1><p>{message} Your saved contacts have not been changed.</p><div className="actions"><button className="btn primary" type="button" onClick={() => load()} disabled={loading}>{loading ? "Trying again..." : "Try again"}</button><a className="btn" href="/jobs">Back to Jobs</a></div></article></section>;
  }

  return (
    <>
      <section className="jobs-page-heading">
        <div><span className="eyebrow">Recruiter contacts</span><h1>Keep each genuine hiring conversation moving.</h1><p className="lede">Save a verified recruiter or hiring contact, record the last stage, and set one clear follow-up date. MoveReady will bring due follow-ups into your Jobs action centre.</p></div>
        <div className="actions"><a className="btn primary" href="#add-recruiter">Add verified contact</a><a className="btn" href="/jobs/companies">Target companies</a><button className="btn" type="button" onClick={() => load()} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button></div>
      </section>

      <div className="jobs-safety-strip"><strong>Use verified details only:</strong><span>Add contacts from an official company page, a real message, a business card, or a confirmed LinkedIn profile. Never guess an email address or claim a relationship that does not exist.</span></div>

      <section className="section jobs-section jobs-workspace-summary">
        <article className="jobs-next-action">
          <div><p className="overline">Recommended next action</p><h2>{followUpsDue.length ? `Follow up with ${followUpsDue[0].recruiter_name}` : recruiters.length ? "Keep your next contact action specific" : "Add your first verified hiring contact"}</h2><p>{followUpsDue.length ? `${followUpsDue.length} follow-up${followUpsDue.length === 1 ? " is" : "s are"} due now. Open the contact below, record the outcome, and choose the next date.` : recruiters.length ? "Contact a relevant person, then update the stage and set a realistic follow-up date." : "Start with a recruiter or hiring contact connected to one of your real target employers."}</p></div>
          {followUpsDue.length ? <button className="btn primary" type="button" onClick={() => { setView("follow_up"); setSearch(""); }}>Show due contacts</button> : <a className="btn primary" href="#add-recruiter">Add verified contact</a>}
        </article>
        <div className="jobs-workspace-counts"><span><strong>{recruiters.length}</strong> saved contacts</span><span><strong>{viewCount("active", recruiters)}</strong> in conversation</span><span><strong>{followUpsDue.length}</strong> follow-ups due</span></div>
      </section>

      <section className="jobs-status-tabs" aria-label="Recruiter contact view">
        {contactViews.map((item) => <button type="button" className={view === item.value ? "active" : ""} onClick={() => setView(item.value)} aria-pressed={view === item.value} key={item.value}>{item.label} <strong>{viewCount(item.value, recruiters)}</strong></button>)}
      </section>
      <section className="jobs-filter-bar"><div className="field"><label htmlFor="recruiter_search">Search contacts</label><input id="recruiter_search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, employer, agency, skill, or location" /></div><span className="status-dot">{visibleRecruiters.length} shown</span></section>
      <p className="jobs-inline-status" aria-live="polite">{message}</p>

      <section className="jobs-card-grid jobs-recruiter-grid">
        {visibleRecruiters.map((recruiter) => {
          const draft = drafts[recruiter.id] || draftFor(recruiter);
          const organization = recruiter.recruitment_company || companyNames[recruiter.company_id || ""] || "Organization not linked";
          return (
            <article className="jobs-card jobs-contact-card" key={recruiter.id}>
              <div className="panel-heading"><div><p className="overline">{organization}</p><h2>{recruiter.recruiter_name}</h2></div><span className={`badge jobs-connection ${draft.connection_status}`}>{jobLabel(draft.connection_status)}</span></div>
              <p>{[recruiter.specialization, recruiter.province].filter(Boolean).join(" · ") || "Specialization and location not recorded"}</p>
              <div className="jobs-contact-links">
                {recruiter.linkedin_url ? <a href={recruiter.linkedin_url} target="_blank" rel="noreferrer">Open LinkedIn</a> : null}
                {recruiter.email_address ? <a href={`mailto:${recruiter.email_address}`}>Email</a> : null}
                {recruiter.phone ? <a href={`tel:${recruiter.phone}`}>Call</a> : null}
                {recruiter.website ? <a href={recruiter.website} target="_blank" rel="noreferrer">Website</a> : null}
              </div>
              <div className="jobs-record-facts"><span><small>Next follow-up</small><strong>{draft.follow_up_date || "Not scheduled"}</strong></span><span><small>Last contacted</small><strong>{recruiter.last_contacted_at ? new Date(recruiter.last_contacted_at).toLocaleDateString() : "Not recorded"}</strong></span></div>
              <details className="jobs-record-editor">
                <summary>Update conversation <span>Stage, date, and notes</span></summary>
                <div className="jobs-record-editor-fields">
                  <div className="form-grid two-col jobs-compact-form"><div className="field"><label htmlFor={`connection-${recruiter.id}`}>Conversation stage</label><select id={`connection-${recruiter.id}`} value={draft.connection_status} onChange={(event) => updateDraft(recruiter.id, "connection_status", event.target.value)}>{connectionStatuses.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div><div className="field"><label htmlFor={`follow-up-${recruiter.id}`}>Next follow-up</label><input id={`follow-up-${recruiter.id}`} type="date" value={draft.follow_up_date} onChange={(event) => updateDraft(recruiter.id, "follow_up_date", event.target.value)} /></div></div>
                  <div className="field"><label htmlFor={`recruiter-notes-${recruiter.id}`}>Private notes</label><textarea id={`recruiter-notes-${recruiter.id}`} rows={3} value={draft.notes} onChange={(event) => updateDraft(recruiter.id, "notes", event.target.value)} placeholder="What was discussed, what you promised, and the next useful action." /></div>
                  <button className="btn primary" type="button" onClick={() => saveRecruiter(recruiter)} disabled={savingId === recruiter.id}>{savingId === recruiter.id ? "Saving..." : "Save conversation update"}</button>
                </div>
              </details>
            </article>
          );
        })}
        {!visibleRecruiters.length && !loading ? <article className="jobs-empty"><h2>{recruiters.length ? "No contact matches this view" : "No verified contact added yet"}</h2><p>{recruiters.length ? "Choose another stage or clear the search." : "Add a genuine recruiter or hiring contact below. One relevant contact is more useful than a long unverified list."}</p><div className="actions"><a className="btn primary" href="#add-recruiter">Add verified contact</a>{recruiters.length ? <button className="btn" type="button" onClick={() => { setView("all"); setSearch(""); }}>Clear filters</button> : null}</div></article> : null}
      </section>

      <section className="section jobs-section" id="add-recruiter">
        <form className="jobs-form jobs-narrow-form" onSubmit={createRecruiter}>
          <div className="panel-heading"><div><p className="overline">New verified contact</p><h2>Add a recruiter or hiring contact</h2></div><span className="status-dot">Private to your account</span></div>
          <p className="jobs-form-intro">Start with the person’s real name, how the person is connected to your search, and at least one verified contact channel.</p>
          <div className="form-grid two-col">
            <div className="field"><label htmlFor="recruiter_name">Full name</label><input id="recruiter_name" name="recruiter_name" required /></div>
            <div className="field"><label htmlFor="recruiter_company_id">Related target company <span>(optional)</span></label><select id="recruiter_company_id" name="company_id" defaultValue=""><option value="">Not linked to a target company</option>{targetCompanies.map((company) => <option value={company.id} key={company.id}>{company.company_name}</option>)}</select></div>
            <div className="field"><label htmlFor="recruitment_company">Recruitment agency or employer</label><input id="recruitment_company" name="recruitment_company" placeholder="Company or agency name" /></div>
            <div className="field"><label htmlFor="recruiter_linkedin">Verified LinkedIn profile</label><input id="recruiter_linkedin" name="linkedin_url" type="url" placeholder="https://www.linkedin.com/in/..." /></div>
            <div className="field"><label htmlFor="recruiter_email">Verified work email</label><input id="recruiter_email" name="email_address" type="email" /></div>
            <div className="field"><label htmlFor="recruiter_phone">Verified phone <span>(optional)</span></label><input id="recruiter_phone" name="phone" inputMode="tel" /></div>
          </div>
          <details className="jobs-form-more">
            <summary>Add search and follow-up details <span>Optional</span></summary>
            <div className="jobs-form-more-fields">
              <div className="form-grid two-col"><div className="field"><label htmlFor="recruiter_province">Province, state, or region</label><input id="recruiter_province" name="province" /></div><div className="field"><label htmlFor="recruiter_specialization">Recruiting focus</label><input id="recruiter_specialization" name="specialization" placeholder="Manufacturing, healthcare, software..." /></div><div className="field"><label htmlFor="recruiter_website">Official agency or employer page</label><input id="recruiter_website" name="website" type="url" /></div><div className="field"><label htmlFor="recruiter_connection_status">Current conversation stage</label><select id="recruiter_connection_status" name="connection_status" defaultValue="not_contacted">{connectionStatuses.map((item) => <option value={item} key={item}>{jobLabel(item)}</option>)}</select></div><div className="field"><label htmlFor="recruiter_follow_up_date">Next follow-up</label><input id="recruiter_follow_up_date" name="follow_up_date" type="date" /></div></div>
              <div className="field"><label htmlFor="recruiter_notes">Private notes</label><textarea id="recruiter_notes" name="notes" rows={3} placeholder="Source, role discussed, response, or next action." /></div>
            </div>
          </details>
          <button className="btn primary" type="submit" disabled={savingId === "new"}>{savingId === "new" ? "Adding..." : "Add verified contact"}</button>
        </form>
      </section>
    </>
  );
}
