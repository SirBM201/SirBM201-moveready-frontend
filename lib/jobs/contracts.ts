export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";
export type B19Block = "B19.2" | "B19.3" | "B19.4" | "B19.5" | "B19.6" | "B19.7" | "B19.8" | "B19.9" | "B19.10" | "B19.11" | "B19.12";
export interface ApiContract {
  key: string;
  block: B19Block;
  method: HttpMethod;
  path: string;
  auth: "required";
  purpose: string;
}
export const B19_API_CONTRACTS: readonly ApiContract[] = [
  ["readiness.get","B19.2","GET","jobs/jobs/:jobId/readiness","Read job readiness"],
  ["readiness.materials","B19.2","PATCH","jobs/jobs/:jobId/readiness/materials","Update readiness materials"],
  ["readiness.transition","B19.2","POST","jobs/jobs/:jobId/readiness/transition","Transition readiness"],
  ["readiness.reconcile","B19.2","POST","jobs/jobs/:jobId/readiness/reconcile","Reconcile readiness"],
  ["readiness.list","B19.2","GET","jobs/readiness","List readiness"],
  ["drafts.create","B19.3","POST","jobs/jobs/:jobId/application-drafts","Create application draft"],
  ["drafts.list","B19.3","GET","jobs/jobs/:jobId/application-drafts","List application drafts"],
  ["drafts.review","B19.3","POST","jobs/application-drafts/:draftId/review","Review application draft"],
  ["handoffs.create","B19.4","POST","jobs/application-drafts/:draftId/handoff","Create handoff"],
  ["handoffs.list","B19.4","GET","jobs/jobs/:jobId/application-handoffs","List job handoffs"],
  ["handoffs.get","B19.4","GET","jobs/application-handoffs/:handoffId","Read handoff"],
  ["handoffs.status","B19.4","POST","jobs/application-handoffs/:handoffId/status","Update handoff status"],
  ["lifecycle.create","B19.5","POST","jobs/application-lifecycles","Create lifecycle"],
  ["lifecycle.list","B19.5","GET","jobs/application-lifecycles","List lifecycles"],
  ["lifecycle.get","B19.5","GET","jobs/application-lifecycles/:lifecycleId","Read lifecycle"],
  ["lifecycle.transition","B19.5","POST","jobs/application-lifecycles/:lifecycleId/transition","Transition lifecycle"],
  ["lifecycle.reconcile","B19.5","POST","jobs/application-lifecycles/:lifecycleId/reconcile","Reconcile lifecycle"],
  ["followups.create","B19.6","POST","jobs/application-lifecycles/:lifecycleId/followups","Create follow-up"],
  ["followups.due","B19.6","GET","jobs/application-followups/due","List due follow-ups"],
  ["followups.reconcile","B19.6","POST","jobs/application-followups/reconcile","Reconcile follow-ups"],
  ["followups.complete","B19.6","POST","jobs/application-followups/:followupId/complete","Complete follow-up"],
  ["portfolio.list","B19.7","GET","jobs/application-portfolio","Read portfolio"],
  ["portfolio.actions","B19.7","GET","jobs/application-portfolio/actions","Read portfolio actions"],
  ["portfolio.next","B19.7","GET","jobs/application-portfolio/next-action","Read next action"],
  ["portfolio.get","B19.7","GET","jobs/application-portfolio/:jobId","Read job portfolio"],
  ["portfolio.reconcile","B19.7","POST","jobs/application-portfolio/:jobId/reconcile","Reconcile portfolio"],
  ["analytics.summary","B19.8","GET","jobs/application-analytics","Read analytics"],
  ["analytics.dashboard","B19.8","GET","jobs/application-analytics/dashboard","Read analytics dashboard"],
  ["analytics.attribution","B19.8","GET","jobs/application-analytics/attribution","Read attribution"],
  ["analytics.funnel","B19.8","GET","jobs/application-analytics/funnel","Read funnel"],
  ["analytics.performance","B19.8","GET","jobs/application-analytics/performance","Read performance"],
  ["analytics.dimension","B19.8","GET","jobs/application-analytics/performance/:dimension","Read dimension performance"],
  ["analytics.recommendations","B19.8","GET","jobs/application-analytics/recommendations","Read recommendations"],
  ["campaigns.create","B19.9","POST","jobs/campaigns","Create campaign"],
  ["campaigns.list","B19.9","GET","jobs/campaigns","List campaigns"],
  ["campaigns.get","B19.9","GET","jobs/campaigns/:campaignId","Read campaign"],
  ["campaigns.update","B19.9","PATCH","jobs/campaigns/:campaignId","Update campaign"],
  ["campaigns.delete","B19.9","DELETE","jobs/campaigns/:campaignId","Delete campaign"],
  ["campaigns.addVacancy","B19.9","POST","jobs/campaigns/:campaignId/vacancies","Add campaign vacancy"],
  ["campaigns.removeVacancy","B19.9","DELETE","jobs/campaigns/:campaignId/vacancies/:vacancyId","Remove campaign vacancy"],
  ["campaigns.progress","B19.9","GET","jobs/campaigns/:campaignId/progress","Read campaign progress"],
  ["employers.dashboard","B19.11","GET","jobs/employers/:employerId/dashboard","Read employer dashboard"],
  ["recruiters.dashboard","B19.12","GET","jobs/recruiters/:recruiterId/dashboard","Read recruiter dashboard"],
  ["recruiters.event","B19.12","POST","jobs/recruiters/:recruiterId/events","Record recruiter relationship event"],
].map(([key, block, method, path, purpose]) => ({ key, block, method, path, auth: "required", purpose })) as ApiContract[];

export const contractByKey = (key: string) => {
  const contract = B19_API_CONTRACTS.find(item => item.key === key);
  if (!contract) throw new Error(`Unknown B19 API contract: ${key}`);
  return contract;
};
export const interpolatePath = (template: string, params: Record<string, string>) =>
  template.replace(/:([A-Za-z][A-Za-z0-9]*)/g, (_, key: string) => {
    const value = params[key];
    if (!value) throw new Error(`Missing path parameter: ${key}`);
    return encodeURIComponent(value);
  });
