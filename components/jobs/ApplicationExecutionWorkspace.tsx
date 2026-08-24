"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, apiJson } from "@/lib/api";
import type { JobLead, JobsSummary, ResumeDocument } from "@/lib/jobs";
import { AuthExpiredState, RecoverableErrorState } from "@/components/ui/RequestState";
import { executionClient, type Draft, type Followup, type Handoff, type Lifecycle, type PortfolioItem, type ReadinessBundle } from "@/lib/jobs/executionClient";
import styles from "./ApplicationExecution.module.css";

const lifecycleStates=["submitted","screening","interview","offer","hired","rejected","withdrawn"];
const label=(value?:string|null)=>(value||"not started").replace(/_/g," ").replace(/d.title||d.original_file_name||label(d.document_type)bd.title||d.original_file_name||label(d.document_type)w/g,c=>c.toUpperCase());
const errText=(error:unknown)=>(error as Error)?.message||"This action could not be completed. No submission was made.";
const dateValue=()=>{const date=new Date(Date.now()+3*86400000);date.setMinutes(date.getMinutes()-date.getTimezoneOffset());return date.toISOString().slice(0,16);};

export default function ApplicationExecutionWorkspace(){
 const[jobs,setJobs]=useState<JobLead[]>([]),[documents,setDocuments]=useState<ResumeDocument[]>([]),[portfolio,setPortfolio]=useState<PortfolioItem[]>([]);
 const[due,setDue]=useState<Followup[]>([]),[lifecycles,setLifecycles]=useState<Lifecycle[]>([]),[selectedId,setSelectedId]=useState("");
 const[readiness,setReadiness]=useState<ReadinessBundle|null>(null),[drafts,setDrafts]=useState<Draft[]>([]),[handoffs,setHandoffs]=useState<Handoff[]>([]);
 const[cvId,setCvId]=useState(""),[coverId,setCoverId]=useState(""),[requirements,setRequirements]=useState(false),[answers,setAnswers]=useState(false);
 const[manualConfirmed,setManualConfirmed]=useState(false),[evidence,setEvidence]=useState(""),[lifecycleState,setLifecycleState]=useState("screening");
 const[followType,setFollowType]=useState("check_in"),[followDate,setFollowDate]=useState(dateValue),[followNote,setFollowNote]=useState("");
 const[loading,setLoading]=useState(true),[busy,setBusy]=useState(""),[error,setError]=useState<unknown>(null),[message,setMessage]=useState("");

 const loadJob=useCallback(async(jobId:string)=>{
  if(!jobId){setReadiness(null);setDrafts([]);setHandoffs([]);return;}
  const[r,d,h]=await Promise.all([executionClient.readiness.get(jobId),executionClient.drafts.list(jobId),executionClient.handoffs.list(jobId)]);
  setReadiness({...r,job_id:jobId});setDrafts(d);setHandoffs(h);
  setCvId(r.materials?.cv_id||"");setCoverId(r.materials?.cover_letter_id||"");
  setRequirements(Boolean((r.record as Record<string,unknown>)?.requirements_verified));setAnswers(Boolean(r.materials?.application_answers_ready));
 },[]);
 const refreshGlobal=useCallback(async()=>{
  const[p,f,l]=await Promise.all([executionClient.portfolio.list(),executionClient.followups.due(),executionClient.lifecycles.list()]);
  setPortfolio(p);setDue(f);setLifecycles(l);
 },[]);
 const load=useCallback(async()=>{
  setLoading(true);setError(null);
  try{
   const[s,v]=await Promise.all([apiJson<JobsSummary>("jobs/summary",{timeoutMs:20000}),apiJson<{documents:ResumeDocument[]}>("jobs/resume-vault",{timeoutMs:20000}),refreshGlobal()]);
   const rows=s.recommended_jobs||[];setJobs(rows);setDocuments(v.documents||[]);
   const first=selectedId||rows[0]?.id||"";setSelectedId(first);if(first)await loadJob(first);
  }catch(e){setError(e);}finally{setLoading(false);}
 },[loadJob,refreshGlobal,selectedId]);
 useEffect(()=>{void load();},[]);// eslint-disable-line react-hooks/exhaustive-deps
 const mutate=async(key:string,work:()=>Promise<unknown>,success:string)=>{
  setBusy(key);setMessage("");
  try{await work();await Promise.all([selectedId?loadJob(selectedId):Promise.resolve(),refreshGlobal()]);setMessage(success);}
  catch(e){setMessage(errText(e));}finally{setBusy("");}
 };
 const chooseJob=async(id:string)=>{setSelectedId(id);setBusy("job");try{await loadJob(id);}catch(e){setMessage(errText(e));}finally{setBusy("");}};
 const activeResumes=documents.filter(d=>d.is_active&&(d.document_type==="ats_resume"||d.document_type==="executive_resume"));
 const activeCovers=documents.filter(d=>d.is_active&&d.document_type==="cover_letter");
 const currentJob=jobs.find(j=>j.id===selectedId),currentLifecycle=lifecycles.find(l=>l.job_id===selectedId);
 const latestDraft=useMemo(()=>[...drafts].sort((a,b)=>(b.updated_at||"").localeCompare(a.updated_at||""))[0],[drafts]);
 const latestHandoff=useMemo(()=>[...handoffs].sort((a,b)=>(b.updated_at||"").localeCompare(a.updated_at||""))[0],[handoffs]);
 const state=readiness?.readiness?.state||"discovered";
 const bind=(event:FormEvent)=>{event.preventDefault();void mutate("bind",()=>executionClient.readiness.bind(selectedId,{cv_id:cvId||null,cover_letter_id:coverId||null,requirements_verified:requirements,application_answers_ready:answers}),"Active documents and checks are bound to this vacancy.");};
 const createFollow=(event:FormEvent)=>{event.preventDefault();if(!currentLifecycle)return;void mutate("followup",()=>executionClient.followups.create(currentLifecycle.id,{action_type:followType,scheduled_for:new Date(followDate).toISOString(),note:followNote}),"Follow-up scheduled and added to the portfolio.");};

 if(loading)return <main className={styles.shell}><p role="status">Loading application execution controls…</p></main>;
 if(error instanceof ApiError&&error.status===401)return <main className={styles.shell}><AuthExpiredState detail="Sign in to manage private application packages, submission evidence and follow-ups."/></main>;
 if(error)return <main className={styles.shell}><RecoverableErrorState detail={errText(error)} action={<button className="btn primary" onClick={()=>void load()}>Try again</button>}/></main>;

 return <main className={styles.shell}>
  <section className={styles.hero}><div><p className="overline">Application execution</p><h1>Move from ready to applied—with every decision under your control.</h1><p>Bind the right documents, approve the package, hand off to the real employer page, then record evidence and follow-ups. MoveReady never claims to submit on your behalf.</p></div><a className="btn" href="/jobs/applications">Open legacy tracker</a></section>
  <section className={styles.summary} aria-label="Portfolio summary">
   <div className={styles.metric}><strong>{portfolio.length}</strong><span>Portfolio roles</span></div><div className={styles.metric}><strong>{due.length}</strong><span>Follow-ups due</span></div><div className={styles.metric}><strong>{drafts.length}</strong><span>Packages for selected role</span></div><div className={styles.metric}><strong>{label(state)}</strong><span>Readiness state</span></div>
  </section>
  {message?<p className={styles.notice} role="status">{message}</p>:null}
  <div className={styles.layout}>
   <aside className={styles.panel}><h2>Choose a vacancy</h2><div className={styles.list}>{jobs.map(job=><button key={job.id} className={`${styles.job} ${job.id===selectedId?styles.jobActive:""}`} onClick={()=>void chooseJob(job.id)}><strong>{job.job_title}</strong><span>{job.company_name||"Employer not linked"}</span></button>)}</div>{!jobs.length?<p>No recommended vacancies are available yet. <a href="/jobs">Discover vacancies</a>.</p>:null}</aside>
   <section className={styles.pipeline} aria-label="Controlled application pipeline">
    <article className={styles.step}><div className={styles.stepHead}><div><p className="overline">1 · readiness</p><h2>Bind active documents</h2></div><span className={`${styles.state} ${readiness?.readiness?.blocking_issue_count?styles.blocked:styles.attention}`}>{label(state)}</span></div>
     <p>{currentJob?<>Preparing <strong>{currentJob.job_title}</strong> at {currentJob.company_name||"the recorded employer"}.</>:"Choose a vacancy to begin."}</p>
     {readiness?.readiness?.issues?.length?<ul className={styles.issues}>{readiness.readiness.issues.map(issue=><li key={issue.code}>{issue.message}{issue.blocking?" — blocking":""}</li>)}</ul>:<p>No current readiness blockers are reported.</p>}
     <form className={styles.form} onSubmit={bind}><div className={styles.field}><label htmlFor="cv">Active résumé</label><select id="cv" value={cvId} onChange={e=>setCvId(e.target.value)}><option value="">Choose a résumé</option>{activeResumes.map(d=><option key={d.id} value={d.id}>{d.title||d.original_file_name||label(d.document_type)}</option>)}</select></div><div className={styles.field}><label htmlFor="cover">Active cover letter</label><select id="cover" value={coverId} onChange={e=>setCoverId(e.target.value)}><option value="">No cover letter</option>{activeCovers.map(d=><option key={d.id} value={d.id}>{d.title||d.original_file_name||"Cover letter"}</option>)}</select></div><label><input type="checkbox" checked={requirements} onChange={e=>setRequirements(e.target.checked)}/> I reviewed the vacancy requirements</label><label><input type="checkbox" checked={answers} onChange={e=>setAnswers(e.target.checked)}/> Application answers are ready</label><div className={styles.actions}><button className="btn primary" disabled={!selectedId||busy!==""}>Bind active documents</button><button type="button" className="btn" disabled={!selectedId||busy!==""} onClick={()=>void mutate("reconcile",()=>executionClient.readiness.reconcile(selectedId),"Readiness reconciled against current evidence.")}>Recheck readiness</button>{state==="ready_for_review"?<button type="button" className="btn" onClick={()=>void mutate("ready",()=>executionClient.readiness.transition(selectedId,"ready_to_apply"),"You confirmed this application is ready to apply.")}>Confirm ready to apply</button>:null}</div></form>
    </article>
    <article className={styles.step}><div className={styles.stepHead}><div><p className="overline">2 · approval</p><h2>Create application package</h2></div><span className={styles.state}>{label(latestDraft?.status)}</span></div><p>The package stays a draft until you review and explicitly approve it. Stale packages must be regenerated.</p><div className={styles.actions}>{state==="ready_to_apply"?<button className="btn" disabled={busy!==""} onClick={()=>void mutate("start",()=>executionClient.readiness.transition(selectedId,"application_started"),"Application preparation started.")}>Start application</button>:null}<button className="btn primary" disabled={!selectedId||busy!==""||!["ready_to_apply","application_started"].includes(state)} onClick={()=>void mutate("draft",()=>executionClient.drafts.create(selectedId),"Application package created for your review.")}>Create application package</button></div>
     {latestDraft?<div className={styles.draft}><strong>Package status: {label(latestDraft.status)}</strong><pre className={styles.json}>{JSON.stringify({tailoring_brief:latestDraft.tailoring_brief,application_answers:latestDraft.application_answers,safety:latestDraft.safety},null,2)}</pre><div className={styles.actions}>{latestDraft.status==="draft"?<button className="btn" onClick={()=>void mutate("review",()=>executionClient.drafts.review(latestDraft.id,"reviewed"),"Package marked reviewed. Approval is still required.")}>Mark reviewed</button>:null}{latestDraft.status==="reviewed"?<button className="btn primary" onClick={()=>void mutate("approve",()=>executionClient.drafts.review(latestDraft.id,"approved"),"Package approved for controlled handoff.")}>Approve this package</button>:null}</div></div>:null}
    </article>
    <article className={styles.step}><div className={styles.stepHead}><div><p className="overline">3 · handoff</p><h2>Prepare controlled handoff</h2></div><span className={styles.state}>{label(latestHandoff?.status)}</span></div><div className={styles.notice}><strong>No automatic submission.</strong> MoveReady prepares the destination and records your actions. You complete the employer form and remain responsible for the final submission.</div>
     <div className={styles.actions}><button className="btn primary" disabled={latestDraft?.status!=="approved"||busy!==""} onClick={()=>void mutate("handoff",()=>executionClient.handoffs.create(latestDraft!.id),"Controlled handoff prepared.")}>Prepare controlled handoff</button>{latestHandoff?.destination_url&&latestHandoff.status==="prepared"?<a className="btn" href={latestHandoff.destination_url} target="_blank" rel="noreferrer" onClick={()=>void mutate("opened",()=>executionClient.handoffs.status(latestHandoff.id,"opened"),"Employer destination opened; no submission was claimed.")}>Open employer application</a>:null}</div>
     {latestHandoff&&["prepared","opened"].includes(latestHandoff.status)?<><label><input type="checkbox" checked={manualConfirmed} onChange={e=>setManualConfirmed(e.target.checked)}/> I completed the employer submission myself</label><div className={styles.actions}><button className="btn primary" disabled={!manualConfirmed||busy!==""} onClick={()=>void mutate("submitted",async()=>{await executionClient.handoffs.status(latestHandoff.id,"submitted_manual");await executionClient.readiness.transition(selectedId,"applied");await executionClient.lifecycles.create(latestHandoff.id);},"Manual submission confirmed and lifecycle created.")}>Confirm submitted</button><button className="btn" onClick={()=>void mutate("withdraw",()=>executionClient.handoffs.status(latestHandoff.id,"withdrawn"),"Handoff withdrawn without recording a submission.")}>Withdraw handoff</button></div></>:null}
    </article>
    <article className={styles.step}><div className={styles.stepHead}><div><p className="overline">4 · lifecycle</p><h2>Record employer evidence</h2></div><span className={styles.state}>{label(currentLifecycle?.state)}</span></div><p>Stage changes require your confirmation and employer evidence; a prediction is never treated as fact.</p><div className={styles.form}><div className={styles.field}><label htmlFor="stage">New stage</label><select id="stage" value={lifecycleState} onChange={e=>setLifecycleState(e.target.value)}>{lifecycleStates.map(x=><option key={x} value={x}>{label(x)}</option>)}</select></div><div className={styles.field}><label htmlFor="evidence">Employer evidence</label><textarea id="evidence" value={evidence} onChange={e=>setEvidence(e.target.value)} placeholder="Email subject, call note or portal status"/></div></div><div className={styles.actions}><button className="btn primary" disabled={!currentLifecycle||!evidence.trim()||busy!==""} onClick={()=>void mutate("stage",()=>executionClient.lifecycles.transition(currentLifecycle!.id,lifecycleState,{note:evidence.trim()}),"Lifecycle updated with confirmed employer evidence.")}>Confirm lifecycle change</button></div>
    </article>
    <article className={styles.step}><div className={styles.stepHead}><div><p className="overline">5 · follow-up</p><h2>Schedule follow-up</h2></div><span className={styles.state}>{due.filter(x=>x.job_id===selectedId).length} due</span></div><form className={styles.form} onSubmit={createFollow}><div className={styles.field}><label htmlFor="follow-type">Action</label><select id="follow-type" value={followType} onChange={e=>setFollowType(e.target.value)}><option value="check_in">Check in</option><option value="thank_you">Thank you</option><option value="interview_preparation">Interview preparation</option></select></div><div className={styles.field}><label htmlFor="follow-date">When</label><input id="follow-date" type="datetime-local" value={followDate} onChange={e=>setFollowDate(e.target.value)} required/></div><div className={styles.field}><label htmlFor="follow-note">Note</label><textarea id="follow-note" value={followNote} onChange={e=>setFollowNote(e.target.value)}/></div><div className={styles.actions}><button className="btn primary" disabled={!currentLifecycle||busy!==""}>Schedule follow-up</button></div></form>
     {due.filter(x=>x.job_id===selectedId).map(item=><div className={styles.draft} key={item.id}><strong>{label(item.action_type)}</strong><p>{new Date(item.scheduled_for).toLocaleString()} · {item.note||"No note"}</p><button className="btn" onClick={()=>void mutate("complete",()=>executionClient.followups.complete(item.id,"completed",{note:"Completed by user"}),"Follow-up completed with user confirmation.")}>Mark complete</button></div>)}
    </article>
   </section>
  </div>
  <section className={styles.panel}><div className={styles.stepHead}><div><p className="overline">Application portfolio</p><h2>Next actions across every role</h2></div><button className="btn" onClick={()=>void refreshGlobal()}>Refresh portfolio</button></div><div className={styles.portfolio}>{portfolio.map(item=><article className={`${styles.portfolioItem} ${item.due_followup_count?styles.due:""}`} key={item.job_id}><strong>{item.job_title||"Recorded vacancy"}</strong><p>{item.company_name||"Employer not linked"} · {label(item.pipeline_state)}</p>{item.next_action?<p><b>{item.next_action.title||label(item.next_action.type)}</b><br/>{item.next_action.summary}</p>:<p>No action currently due.</p>}<button className="btn" onClick={()=>void chooseJob(item.job_id)}>Open execution</button>{item.reconciliation?.requires_write_reconciliation?<button className="btn" onClick={()=>void mutate("portfolio",()=>executionClient.portfolio.reconcile(item.job_id),"Portfolio record reconciled.")}>Repair portfolio link</button>:null}</article>)}</div>{!portfolio.length?<p>No application lifecycle records yet. Confirm a real employer submission to create one.</p>:null}</section>
 </main>;
}
