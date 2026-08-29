import{apiJson}from"@/lib/api";
export type ReadinessIssue={code:string;message:string;blocking:boolean;severity?:string;category?:string;action?:string};
export type ExecutionReadiness={state:string;issues:ReadinessIssue[];gaps?:ReadinessIssue[];next_actions?:Array<{code:string;label:string;action:string;priority:number}>;score?:number;evidence_coverage?:number;blocking_issue_count:number;can_mark_ready?:boolean;can_start_application?:boolean;can_record_submission?:boolean};
export type ReadinessBundle={job_id:string;readiness:ExecutionReadiness;record:Record<string,unknown>;materials:{cv_id?:string|null;cv_valid?:boolean|null;cover_letter_id?:string|null;cover_letter_valid?:boolean|null;application_answers_ready?:boolean};reconciliation?:Record<string,unknown>};
export type Draft={id:string;job_id:string;status:string;tailoring_brief?:Record<string,unknown>;cv_draft?:Record<string,unknown>;cover_letter_draft?:Record<string,unknown>;application_answers?:Record<string,unknown>;safety?:Record<string,unknown>;created_at?:string;updated_at?:string};
export type Handoff={id:string;job_id:string;draft_id:string;status:string;destination_url?:string|null;safety?:Record<string,unknown>;created_at?:string;updated_at?:string};
export type Lifecycle={id:string;job_id:string;handoff_id:string;state:string;latest_evidence?:Record<string,unknown>;state_changed_at?:string;terminal_at?:string|null};
export type Followup={id:string;lifecycle_id:string;job_id:string;action_type:string;status:string;scheduled_for:string;note?:string|null;outcome?:string|null};
export type PortfolioItem={job_id:string;job_title?:string;company_name?:string;pipeline_state?:string;terminal?:boolean;priority_score?:number;due_followup_count?:number;progress?:{stage:string;percent:number;completed:boolean};next_action?:{type?:string;title?:string;summary?:string;href?:string;blocking?:boolean;gap_code?:string};reconciliation?:{requires_write_reconciliation?:boolean};[key:string]:unknown};
export type PortfolioSummary={terminal:number;actionable:number;blocking:number;ready_to_apply:number;in_progress:number;due_followups:number;reconciliation_required:number};
export type MobilityHandoff={contract_version:string;job_id:string;job_title?:string;company_name?:string;destination_country?:string|null;lifecycle_state:string;offer_evidence_recorded:boolean;work_authorized:boolean;sponsorship_status:string;relocation_support_status:string;available:boolean;ready_for_mobility_planning:boolean;blocking_gap_count:number;gaps:Array<{code:string;message:string;action:string;href:string;blocking:boolean}>;next_actions:Array<{code:string;message:string;action:string;href:string;blocking:boolean}>;planning_links:{route:string;evidence:string;finances:string;journey:string};safety:Record<string,boolean>};
const get=<T>(path:string)=>apiJson<T>(path,{timeoutMs:25000,useAuthToken:true});
const post=<T>(path:string,body:Record<string,unknown>={})=>apiJson<T>(path,{method:"POST",body,timeoutMs:30000,useAuthToken:true});
export const executionClient={
 readiness:{
  get:async(jobId:string)=>(await get<{readiness:ExecutionReadiness;record:Record<string,unknown>;materials:ReadinessBundle["materials"];reconciliation?:Record<string,unknown>}>(`jobs/jobs/${encodeURIComponent(jobId)}/readiness`))as ReadinessBundle,
  reconcile:(jobId:string)=>post<ReadinessBundle>(`jobs/jobs/${encodeURIComponent(jobId)}/readiness/reconcile`),
  bind:(jobId:string,body:Record<string,unknown>)=>apiJson<ReadinessBundle>(`jobs/jobs/${encodeURIComponent(jobId)}/readiness/materials`,{method:"PATCH",body,timeoutMs:30000,useAuthToken:true}),
  transition:(jobId:string,target_state:string)=>post<ReadinessBundle>(`jobs/jobs/${encodeURIComponent(jobId)}/readiness/transition`,{target_state,user_confirmed:true}),
 },
 drafts:{
  list:async(jobId:string)=>(await get<{items:Draft[]}>(`jobs/jobs/${encodeURIComponent(jobId)}/application-drafts`)).items||[],
  create:async(jobId:string)=>(await post<{draft:Draft}>(`jobs/jobs/${encodeURIComponent(jobId)}/application-drafts`)).draft,
  review:async(draftId:string,action:"reviewed"|"approved")=>(await post<{draft:Draft}>(`jobs/application-drafts/${encodeURIComponent(draftId)}/review`,{action})).draft,
 },
 handoffs:{
  list:async(jobId:string)=>(await get<{items:Handoff[]}>(`jobs/jobs/${encodeURIComponent(jobId)}/application-handoffs`)).items||[],
  create:async(draftId:string)=>(await post<{handoff:Handoff}>(`jobs/application-drafts/${encodeURIComponent(draftId)}/handoff`)).handoff,
  status:async(handoffId:string,action:"opened"|"submitted_manual"|"withdrawn")=>(await post<{handoff:Handoff}>(`jobs/application-handoffs/${encodeURIComponent(handoffId)}/status`,{action})).handoff,
 },
 lifecycles:{
  list:async()=>(await get<{items:Lifecycle[]}>("jobs/application-lifecycles")).items||[],
  create:async(handoffId:string)=>(await post<{lifecycle:Lifecycle}>("jobs/application-lifecycles",{handoff_id:handoffId})).lifecycle,
  transition:async(id:string,target_state:string,evidence:Record<string,unknown>)=>(await post<{lifecycle:Lifecycle}>(`jobs/application-lifecycles/${encodeURIComponent(id)}/transition`,{target_state,employer_evidence:evidence,user_confirmed:true})).lifecycle,
 },
 followups:{
  due:async()=>(await get<{items:Followup[]}>("jobs/application-followups/due")).items||[],
  create:async(lifecycleId:string,body:{action_type:string;scheduled_for:string;note?:string})=>(await post<{followup:Followup}>(`jobs/application-lifecycles/${encodeURIComponent(lifecycleId)}/followups`,body)).followup,
  complete:async(id:string,outcome:string,evidence:Record<string,unknown>)=>(await post<{followup:Followup}>(`jobs/application-followups/${encodeURIComponent(id)}/complete`,{outcome,evidence,user_confirmed:true})).followup,
 },
 portfolio:{
  overview:()=>get<{items:PortfolioItem[];summary:PortfolioSummary;execution_command_version?:string}>("jobs/application-portfolio"),
  list:async()=>(await get<{items:PortfolioItem[]}>("jobs/application-portfolio")).items||[],
  actions:()=>get<{actions:Record<string,unknown>[];next?:Record<string,unknown>|null}>("jobs/application-portfolio/actions"),
  next:()=>get<{action:Record<string,unknown>;portfolio_count:number}>("jobs/application-portfolio/next-action"),
  mobility:async(jobId:string)=>(await get<{handoff:MobilityHandoff}>(`jobs/application-portfolio/${encodeURIComponent(jobId)}/mobility-handoff`)).handoff,
  reconcile:(jobId:string)=>post<{changed:boolean;plan:Record<string,unknown>}>(`jobs/application-portfolio/${encodeURIComponent(jobId)}/reconcile`),
 },
};
