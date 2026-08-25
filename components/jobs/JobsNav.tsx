"use client";
import { useEffect,useRef } from "react";
import { usePathname } from "next/navigation";
const links=[
 {label:"Discover",href:"/jobs"},
 {label:"Readiness",href:"/jobs#vacancies"},
 {label:"Execution",href:"/jobs/execution"},
 {label:"Intelligence",href:"/jobs/intelligence"},
 {label:"Applications",href:"/jobs/applications"},
 {label:"Career Studio",href:"/jobs/career-studio"},
];
const supportingLinks=[
 {label:"Guided setup",href:"/jobs/setup"},{label:"Matching profile",href:"/jobs/profile"},
 {label:"Résumé vault",href:"/jobs/resume-vault"},{label:"Browser assistant",href:"/jobs/browser-assistant"},{label:"Full workspace",href:"/jobs/workspace"},{label:"Automatic search",href:"/jobs/automation"},
 {label:"Companies",href:"/jobs/companies"},{label:"Recruiters",href:"/jobs/recruiters"},
 {label:"Interview preparation",href:"/jobs/interview-preparation"},
];
const current=(pathname:string,href:string)=>href==="/jobs"?pathname==="/jobs"||pathname.startsWith("/jobs/vacancies/"):pathname===href;
export default function JobsNav(){const pathname=usePathname(),detailsRef=useRef<HTMLDetailsElement>(null);useEffect(()=>{function close(event: KeyboardEvent) { if (event.key === "Escape"&&detailsRef.current?.open){detailsRef.current.open=false;detailsRef.current.querySelector("summary")?.focus();}}document.addEventListener("keydown",close);return()=>document.removeEventListener("keydown",close);},[]);return <section className="jobs-nav-wrap"><div><p className="overline">Job journey</p><strong>Discover → qualify → prepare → execute → track</strong></div><nav className="jobs-nav" aria-label="Jobs journey navigation">{links.map(item=><a href={item.href} key={item.label} aria-current={current(pathname,item.href)?"page":undefined}>{item.label}</a>)}<details className="jobs-nav-more" ref={detailsRef}><summary>More tools</summary><div>{supportingLinks.map(item=><a href={item.href} key={item.href} aria-current={pathname===item.href?"page":undefined}>{item.label}</a>)}</div></details></nav></section>;}