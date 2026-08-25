import{apiJson}from"@/lib/api";
export type Campaign={id:string;name:string;status:string;target_countries?:string[];target_occupations?:string[];target_employers?:string[];work_authorized_countries?:string[];sponsorship_required?:boolean;relocation_support_preferred?:boolean;search_intensity?:string;notes?:string;updated_at?:string;[key:string]:unknown};
export type CampaignProgress={campaign_id:string;status:string;vacancies_associated:number;applications_tracked:number;pipeline_states:Record<string,number>;interviews:number;offers_or_hires:number;terminal_outcomes:number};
export type Employer={id:string;canonical_name?:string;normalized_name?:string;domain?:string;country?:string;industry?:string;identity_basis?:string;campaign_targets?:Array<{campaign_id:string;target_type:string;reason?:string}>;[key:string]:unknown};
export type EmployerDashboard={employer:Employer;opportunity_history:Record<string,unknown>;timeline:Array<Record<string,unknown>>;campaign_fit:Record<string,unknown>;recommendation:Record<string,unknown>;safety:Record<string,boolean>};
export type Recruiter={id:string;recruiter_name:string;recruitment_company?:string;specialization?:string;canonical_employer_id?:string;connection_status?:string;follow_up_date?:string;[key:string]:unknown};
export type RecruiterDashboard={recruiter:Record<string,unknown>;relationship:Record<string,unknown>;follow_up:Record<string,unknown>;timeline:Array<Record<string,unknown>>;relationships:{vacancies:Array<Record<string,unknown>>;applications:Array<Record<string,unknown>>;vacancy_count:number;application_count:number};safety:Record<string,boolean>};
const get=<T>(p:string)=>apiJson<T>(p,{timeoutMs:25000,useAuthToken:true});
const post=<T>(p:string,body:Record<string,unknown>)=>apiJson<T>(p,{method:"POST",body,timeoutMs:30000,useAuthToken:true});
export const intelligenceClient={
 campaigns:{
  list:async()=>(await get<{items:Campaign[]}>("jobs/campaigns")).items||[],
  create:async(body:Record<string,unknown>)=>(await post<{campaign:Campaign}>("jobs/campaigns",body)).campaign,
  progress:(id:string)=>get<CampaignProgress>(`jobs/campaigns/${encodeURIComponent(id)}/progress`),
  addVacancy:(id:string,job_id:string)=>post(`jobs/campaigns/${encodeURIComponent(id)}/vacancies`,{job_id,association_reason:"Added by user from intelligence workspace"}),
 },
 employers:{
  list:async()=>(await get<{items:Employer[]}>("jobs/employers")).items||[],
  dashboard:(id:string)=>get<EmployerDashboard>(`jobs/employers/${encodeURIComponent(id)}/dashboard`),
  target:(campaignId:string,employerId:string,target_type:"priority"|"watch"|"excluded"|"remove",reason:string)=>post(`jobs/campaigns/${encodeURIComponent(campaignId)}/employers/${encodeURIComponent(employerId)}/target`,{target_type,reason}),
 },
 recruiters:{
  list:async()=>(await get<{recruiters:Recruiter[]}>("jobs/recruiters")).recruiters||[],
  dashboard:(id:string)=>get<RecruiterDashboard>(`jobs/recruiters/${encodeURIComponent(id)}/dashboard`),
  event:(id:string,body:Record<string,unknown>)=>post<RecruiterDashboard>(`jobs/recruiters/${encodeURIComponent(id)}/events`,{...body,automatic_send:false}),
 },
};