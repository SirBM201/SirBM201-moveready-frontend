"use client";
import { useEffect,useRef } from "react";
import { usePathname } from "next/navigation";
const primaryNavigation=[
 {label:"Find",href:"/find",title:"Find realistic jobs, pathways and opportunities"},
 {label:"Qualify",href:"/qualify",title:"Check evidence, work rights, route and application readiness"},
 {label:"Move",href:"/move",title:"Prepare and track applications, documents and travel"},
 {label:"Settle",href:"/settlement",title:"Plan arrival and settlement tasks"},
 {label:"Grow",href:"/progress",title:"Review outcomes and improve your next actions"},
 {label:"Dashboard",href:"/dashboard",title:"Open your private action centre"},
];
const secondaryNavigation=[
 {label:"Start guided journey",href:"/onboarding",title:"Continue from your saved MoveReady progress"},
 {label:"Jobs",href:"/jobs",title:"Discover and assess vacancies"},
 {label:"Job setup",href:"/jobs/setup",title:"Create or repair your matching profile"},
 {label:"Applications",href:"/jobs/applications",title:"Track job applications and follow-ups"},
 {label:"Relocation setup",href:"/onboarding/relocation",title:"Set up route and relocation foundations"},
 {label:"My Journey",href:"/my-journey",title:"Review private journey progress"},
 {label:"Action centre",href:"/action-center",title:"Review ranked private next actions"},
 {label:"Readiness",href:"/readiness-hub",title:"Review document, money and execution readiness"},
 {label:"Documents",href:"/evidence-pack",title:"Organize private evidence"},
 {label:"Language",href:"/language-coach",title:"Practice English and French"},
 {label:"Countries",href:"/country-comparison",title:"Compare countries"},
 {label:"Routes",href:"/compare",title:"Compare relocation routes"},
 {label:"Passport",href:"/passport-index",title:"Review passport mobility information"},
 {label:"Alerts",href:"/alerts",title:"Review private smart alerts"},
 {label:"Settings and privacy",href:"/settings",title:"Manage security, consent and accessibility"},
 {label:"Support",href:"/support-center",title:"Open controlled support"},
 {label:"Service status",href:"/deployment-status",title:"Review operational status"},
];
type Props={sectionLabel?:string;subtitle?:string};
const target=(href:string)=>href.split("#")[0];
function isCurrent(pathname:string,href:string){const path=target(href);if(href.includes("#"))return false;if(path==="/")return pathname==="/";if(path==="/jobs")return pathname==="/jobs"||pathname.startsWith("/jobs/vacancies/");return pathname===path;}
export default function SiteHeader({sectionLabel="Global opportunity and mobility platform",subtitle}:Props){const pathname=usePathname(),detailsRef=useRef<HTMLDetailsElement>(null),label=subtitle||sectionLabel;useEffect(()=>{function close(e:KeyboardEvent){if(e.key==="Escape"&&detailsRef.current?.open){detailsRef.current.open=false;detailsRef.current.querySelector("summary")?.focus();}}document.addEventListener("keydown",close);return()=>document.removeEventListener("keydown",close);},[]);return <header className="topbar"><a className="brand" href="/" aria-label="Project MoveReady home"><strong>Project MoveReady</strong><span>{label}</span></a><nav className="nav" aria-label="Main navigation">{primaryNavigation.map(item=><a href={item.href} key={item.href} title={item.title} aria-current={isCurrent(pathname,item.href)?"page":undefined}>{item.label}</a>)}<details className="nav-more" ref={detailsRef}><summary aria-label="Open more MoveReady tools">More</summary><div className="nav-more-menu">{secondaryNavigation.map(item=><a href={item.href} key={item.href} title={item.title} aria-current={isCurrent(pathname,item.href)?"page":undefined}>{item.label}</a>)}</div></details></nav></header>;}
