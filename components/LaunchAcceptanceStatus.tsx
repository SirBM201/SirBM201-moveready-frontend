"use client";

import { useEffect, useState } from "react";

type Check={key:string;path:string;expected_status:number;actual_status:number|null;passed:boolean;latency_ms?:number;failure?:string};
type Acceptance={ok:boolean;contract_version:string;checked_at:string;passed:number;total:number;checks:Check[];safety:{read_only:boolean;credentials_sent:boolean;external_action_performed:boolean}};

const labels:Record<string,string>={health:"Backend health",build:"Build fingerprint",auth:"Authentication health",operations:"Operations contract",private_boundary:"Private-route protection"};

export default function LaunchAcceptanceStatus(){
 const[data,setData]=useState<Acceptance|null>(null);const[loading,setLoading]=useState(true);const[message,setMessage]=useState("Running read-only V1 production checks…");
 async function load(){setLoading(true);try{const response=await fetch("/api/launch-acceptance",{cache:"no-store"});const body=await response.json() as Acceptance;setData(body);setMessage(body.ok?"All launch-critical production checks passed.":`${body.passed} of ${body.total} checks passed. Failed checks remain closed and require deployment review.`);}catch{setData(null);setMessage("The acceptance probe could not complete. No production write was attempted.");}finally{setLoading(false)}}
 useEffect(()=>{void load()},[]);
 return <article className="result-block featured" aria-busy={loading}>
  <div className="panel-heading"><div><p className="overline">LQ20 · V1 launch acceptance</p><h2>{data?.ok?"V1 production contract accepted":"V1 production contract needs attention"}</h2></div><span className="status-dot">{data?`${data.passed}/${data.total} passed`:"checking"}</span></div>
  <p aria-live="polite">{message}</p>
  <div className="mini-list">{data?.checks.map(check=><div key={check.key}><strong>{labels[check.key]||check.key}</strong><span>{check.passed?`Passed · HTTP ${check.actual_status}${check.latency_ms!==undefined?` · ${check.latency_ms} ms`:""}`:`Failed · ${check.failure||`HTTP ${check.actual_status??"none"}`} · expected ${check.expected_status}`}</span></div>)}</div>
  <p className="form-status">Read-only checks only: no credentials, OTP request, record mutation, scan, application submission, employer contact, or external action.</p>
  <div className="actions"><button className="btn primary" type="button" onClick={load} disabled={loading}>{loading?"Checking…":"Run acceptance check again"}</button><a className="btn" href="/jobs">Open V1 job journey</a><a className="btn" href="/login">Verify sign-in flow</a></div>
 </article>
}
