"use client";

import { useEffect, useMemo, useState } from "react";
import { ApiError, apiJson } from "@/lib/api";
import type { JobLead, JobsSummary } from "@/lib/jobs";
import { formatJobDate, jobLabel } from "@/lib/jobs";
import { AuthExpiredState, EmptyState, RecoverableErrorState } from "@/components/ui/RequestState";
import { sourceView, suitabilityView, vacancyFreshness, vacancyLocation } from "@/lib/jobs/vacancyPresentation";
import styles from "./VacancyJourney.module.css";

type Sort = "recommended" | "freshest" | "match" | "viability";
const timestamp = (job: JobLead) => new Date(job.last_checked_at || job.last_seen_at || job.posted_at || 0).getTime() || 0;

export default function VacancyDiscovery() {
  const [jobs,setJobs]=useState<JobLead[]>([]), [loading,setLoading]=useState(true);
  const [error,setError]=useState<unknown>(null), [query,setQuery]=useState(""), [country,setCountry]=useState("all");
  const [freshness,setFreshness]=useState("all"), [sort,setSort]=useState<Sort>("recommended");
  async function load(){setLoading(true);setError(null);try{const response=await apiJson<JobsSummary>("jobs/summary",{timeoutMs:20000});setJobs(response.recommended_jobs||[]);}catch(e){setError(e);}finally{setLoading(false);}}
  useEffect(()=>{void load();},[]);
  const countries=useMemo(()=>Array.from(new Set(jobs.map(j=>j.country).filter(Boolean))).sort(),[jobs]);
  const visible=useMemo(()=>jobs.filter(job=>{
    const hay=[job.job_title,job.company_name,job.country,job.city,...(job.skills||[])].join(" ").toLowerCase();
    const tone=vacancyFreshness(job).tone;
    return (!query||hay.includes(query.toLowerCase()))&&(country==="all"||job.country===country)&&(freshness==="all"||tone===freshness);
  }).sort((a,b)=>{
    if(sort==="freshest")return timestamp(b)-timestamp(a);
    if(sort==="match")return (b.match_score||0)-(a.match_score||0);
    if(sort==="viability")return (b.application_viability_score||b.application_priority_score||0)-(a.application_viability_score||a.application_priority_score||0);
    return ((b.application_viability_score||0)+(b.match_score||0))-((a.application_viability_score||0)+(a.match_score||0));
  }),[jobs,query,country,freshness,sort]);
  if(loading)return <main className={styles.shell}><div className={styles.skeleton} role="status" aria-label="Loading current vacancies" /></main>;
  if(error instanceof ApiError&&error.status===401)return <main className={styles.shell}><AuthExpiredState detail="Sign in to see vacancies matched against your private profile and work-rights information." /></main>;
  if(error)return <main className={styles.shell}><RecoverableErrorState detail={(error as Error)?.message||"Vacancies could not be loaded. Your saved data was not changed."} action={<button className="btn primary" onClick={load}>Try again</button>} /></main>;
  return <main className={styles.shell}>
    <section className={styles.hero}><div><p className="overline">Find verified opportunities</p><h1>Jobs you can assess before you invest time applying.</h1><p>Every result separates professional match from real-world application viability. Source and freshness gaps stay visible instead of being presented as certainty.</p><div className={styles.actions}><a className="btn primary" href="/jobs/automation">Refresh automatic search</a><a className="btn" href="/jobs/workspace">Open job-search workspace</a></div></div><aside className={styles.trust}><h2>How to read these results</h2><p><strong>Match</strong> measures career alignment. <strong>Viability</strong> considers location, work rights and employer support. Neither score guarantees selection, sponsorship or immigration approval.</p></aside></section>
    <section className={styles.toolbar} aria-label="Vacancy filters"><label>Search jobs<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Title, employer, skill or place" /></label><label>Country<select value={country} onChange={e=>setCountry(e.target.value)}><option value="all">All countries</option>{countries.map(item=><option key={item}>{item}</option>)}</select></label><label>Freshness<select value={freshness} onChange={e=>setFreshness(e.target.value)}><option value="all">Any freshness</option><option value="current">Recently checked</option><option value="aging">Aging</option><option value="stale">Stale</option><option value="unknown">Unknown</option></select></label><label>Sort<select value={sort} onChange={e=>setSort(e.target.value as Sort)}><option value="recommended">Recommended</option><option value="freshest">Freshest checked</option><option value="match">Best match</option><option value="viability">Best viability</option></select></label></section>
    <div className={styles.summary}><p><strong>{visible.length}</strong> of {jobs.length} vacancies shown</p><a href="/jobs/profile">Review matching profile</a></div>
    {visible.length?<section className={styles.grid} id="vacancies">{visible.map(job=>{const fresh=vacancyFreshness(job),source=sourceView(job),fit=suitabilityView(job);return <article className={styles.card} key={job.id}><header><p className={styles.company}>{job.company_name||"Employer not linked"}</p><h2><a href={`/jobs/vacancies/${encodeURIComponent(job.id)}`}>{job.job_title}</a></h2><p className={styles.location}>{vacancyLocation(job)}</p></header><div className={styles.scores}><div className={styles.score}><strong>{fit.match}%</strong><span>Career match</span></div><div className={styles.score}><strong>{fit.viability}%</strong><span>Application viability</span></div></div><div className={styles.signals}><span className={`${styles.signal} ${styles[fresh.tone]}`}>{fresh.label}</span><span className={styles.signal}>{source.name}</span><span className={styles.signal}>{jobLabel(job.application_priority,"Review required")}</span></div><ul className={styles.evidence}><li>{source.warning}</li><li>{fresh.detail}{fresh.referenceAt?` Last evidence: ${formatJobDate(fresh.referenceAt)}.`:""}</li>{fit.viabilityReasons.slice(0,1).map(x=><li key={x}>{x}</li>)}</ul><div className={styles.actions}><a className="btn primary" href={`/jobs/vacancies/${encodeURIComponent(job.id)}`}>Review suitability</a>{source.hasUrl?<a className="btn" href={job.job_url} target="_blank" rel="noreferrer">Open original source</a>:null}</div></article>})}</section>:<EmptyState title="No vacancies match these filters" detail={jobs.length?"Clear or change a filter to see recorded vacancies.":"No vacancy leads are available yet. Run automatic search or add a real vacancy from the job-search workspace."} action={<a className="btn primary" href={jobs.length?"/jobs":"/jobs/automation"}>{jobs.length?"Clear filters":"Start vacancy search"}</a>} />}
  </main>;
}
