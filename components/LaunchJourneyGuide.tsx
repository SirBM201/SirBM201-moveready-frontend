"use client";

import { useEffect, useMemo, useState } from "react";
import { ApiError, apiJson } from "@/lib/api";
import { jobsClient } from "@/lib/jobs/client";
import type { JobProfile, JobsSummary } from "@/lib/jobs";
import type { Collection, JobReadiness } from "@/lib/jobs/domain";
import styles from "./LaunchJourney.module.css";

type State="loading"|"signed_out"|"ready"|"error";
type Snapshot={profile:JobProfile|null;summary:JobsSummary;readiness:Collection<JobReadiness>};
const phases=[
 {key:"FIND",title:"Find the right opportunity",detail:"Define where and what to search, then review current vacancies.",href:"/jobs",action:"Find vacancies"},
 {key:"QUALIFY",title:"Check whether it is realistic",detail:"Review suitability, work rights, source evidence and readiness.",href:"/jobs",action:"Review suitability"},
 {key:"MOVE",title:"Prepare and track action",detail:"Prepare truthful documents, confirm submission and follow up.",href:"/jobs/applications",action:"Open applications"},
 {key:"SETTLE",title:"Plan the move safely",detail:"Connect route, documents, funds, travel and settlement tasks.",href:"/my-journey",action:"Open my journey"},
 {key:"GROW",title:"Review progress and improve",detail:"Learn from outcomes, alerts and changing goals.",href:"/progress",action:"Review progress"},
] as const;

export default function LaunchJourneyGuide(){
 const [state,setState]=useState<State>("loading"),[data,setData]=useState<Snapshot|null>(null),[message,setMessage]=useState("Checking your saved MoveReady progress…");
 async function load(){setState("loading");try{const [profileResponse,summary,readiness]=await Promise.all([
   apiJson<{profile:JobProfile|null}>("jobs/profile",{timeoutMs:20000}),
   apiJson<JobsSummary>("jobs/summary",{timeoutMs:20000}),
   jobsClient.readiness.list().catch(()=>({items:[],total:0,nextCursor:null})),
 ]);setData({profile:profileResponse.profile,summary,readiness});setState("ready");setMessage("Your progress is loaded from your private account.");}catch(e){setData(null);if(e instanceof ApiError&&e.status===401){setState("signed_out");setMessage("Sign in to start or continue your private journey.");}else{setState("error");setMessage("MoveReady could not load your progress. Your saved records were not changed.");}}}
 useEffect(()=>{void load();},[]);
 const status=useMemo(()=>{const profile=Boolean(data?.profile),vacancies=(data?.summary.recommended_jobs?.length||0)>0,qualified=(data?.readiness.total||0)>0,applications=(data?.summary.counts.applications||0)>0;return [profile&&vacancies,qualified,applications,false,false];},[data]);
 const current=Math.max(0,status.findIndex(done=>!done));
 const completed=status.filter(Boolean).length;
 const next=state==="signed_out"?{title:"Sign in to save your progress",detail:"Your profile, vacancies, readiness and applications are private.",href:"/login?next=/onboarding",action:"Sign in with email"}:
 !data?.profile?{title:"Create your matching profile",detail:"Tell MoveReady your real experience, target roles, search countries and confirmed work rights.",href:"/jobs/setup",action:"Start five-step setup"}:
 !(data.summary.recommended_jobs?.length)?{title:"Find your first evidence-backed vacancy",detail:"Run discovery after your profile is complete. Source and freshness gaps will remain visible.",href:"/jobs/automation",action:"Start vacancy search"}:
 !(data.readiness.total)?{title:"Review one vacancy before applying",detail:"Open a vacancy, verify the source and start its B19 readiness check.",href:"/jobs",action:"Review vacancies"}:
 !(data.summary.counts.applications)?{title:"Move a suitable vacancy into Applications",detail:"Prepare and track action only after source, suitability and readiness review.",href:"/jobs/applications",action:"Open applications"}:
 {title:"Continue from your ranked action centre",detail:"MoveReady will use recorded deadlines, blockers and follow-ups to choose the next step.",href:"/dashboard#command-center",action:"Show my next action"};
 const requirements=[
  ["Matching profile",Boolean(data?.profile)],["At least one vacancy",Boolean(data?.summary.recommended_jobs?.length)],
  ["Readiness started",Boolean(data?.readiness.total)],["Application tracked",Boolean(data?.summary.counts.applications)],
 ];
 return <main className={styles.shell}><div className={styles.inner}><section className={styles.hero}><div><p className="overline">Start without technical help</p><h1>One guided path from finding an opportunity to building your next chapter.</h1><p>MoveReady keeps the main journey simple: FIND → QUALIFY → MOVE → SETTLE → GROW. You can leave and return because progress comes from your saved account records—not a fragile browser checklist.</p></div><aside className={styles.progressCard} aria-busy={state==="loading"}><p className="overline">Main journey progress</p><strong>{state==="loading"?"…":`${completed} of 5 phases`}</strong><div className={styles.track} role="progressbar" aria-valuemin={0} aria-valuemax={5} aria-valuenow={completed}><span style={{width:`${completed*20}%`}} /></div><p>{message}</p><button className="btn" onClick={load} disabled={state==="loading"}>{state==="loading"?"Checking…":"Refresh progress"}</button></aside></section>
 <section className={styles.next}><div><p className="overline">Do this next</p><h2>{next.title}</h2><p>{next.detail}</p></div><a className="btn primary" href={next.href}>{next.action}</a></section>
 <section className={styles.phases} aria-label="MoveReady journey phases">{phases.map((phase,index)=><article className={`${styles.phase} ${status[index]?styles.complete:index===current?styles.current:styles.blocked}`} key={phase.key}><span className={styles.phaseNumber}>{status[index]?"✓":index+1}</span><p className="overline">{phase.key}</p><h2>{phase.title}</h2><p>{phase.detail}</p><a href={phase.href}>{status[index]?"Review phase":index===current?"Continue here":"Preview phase"}</a></article>)}</section>
 <ul className={styles.requirements}>{requirements.map(([label,done])=><li className={done?styles.done:""} key={String(label)}>{String(label)}: {done?"complete":"still needed"}</li>)}</ul>
 <details className={styles.trust}><summary>What MoveReady will never assume</summary><p>Professional fit is not permission to work. A readiness status is not an employment, visa or immigration decision. Missing evidence remains unknown, and no employer form is submitted without your review and action.</p></details></div></main>;
}
