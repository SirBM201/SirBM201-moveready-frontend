import { apiJson } from "@/lib/api";
import {
  adaptAnalytics, adaptCampaign, adaptCollection, adaptDraft, adaptEmployerDashboard,
  adaptFollowup, adaptHandoff, adaptLifecycle, adaptPortfolioItem, adaptReadiness,
  adaptRecruiterDashboard,
} from "./adapters";
import { contractByKey, interpolatePath } from "./contracts";
import type { JsonObject } from "./domain";

export type JobsTransport = <T = unknown>(
  path: string,
  init?: Omit<RequestInit, "body"> & { body?: unknown; query?: Record<string, string | number | boolean | null | undefined>; useAuthToken?: boolean },
) => Promise<T>;
const defaultTransport: JobsTransport = apiJson;
const call = async (transport: JobsTransport, key: string, params: Record<string,string> = {}, body?: unknown, query?: JsonObject) => {
  const contract = contractByKey(key);
  return transport(interpolatePath(contract.path, params), {
    method: contract.method,
    ...(body === undefined ? {} : { body }),
    ...(query ? { query: query as Record<string, string | number | boolean | null | undefined> } : {}),
    useAuthToken: true,
  });
};

export const createJobsClient = (transport: JobsTransport = defaultTransport) => ({
  readiness: {
    get: async (jobId: string) => adaptReadiness(await call(transport,"readiness.get",{jobId})),
    list: async (query?: JsonObject) => adaptCollection(await call(transport,"readiness.list",{},undefined,query),adaptReadiness,"readiness"),
    updateMaterials: async (jobId: string, body: JsonObject) => adaptReadiness(await call(transport,"readiness.materials",{jobId},body)),
    transition: async (jobId: string, body: JsonObject) => adaptReadiness(await call(transport,"readiness.transition",{jobId},body)),
    reconcile: async (jobId: string, body: JsonObject = {}) => adaptReadiness(await call(transport,"readiness.reconcile",{jobId},body)),
  },
  drafts: {
    create: async (jobId: string, body: JsonObject) => adaptDraft(await call(transport,"drafts.create",{jobId},body)),
    list: async (jobId: string) => adaptCollection(await call(transport,"drafts.list",{jobId}),adaptDraft,"drafts"),
    review: async (draftId: string, body: JsonObject) => adaptDraft(await call(transport,"drafts.review",{draftId},body)),
  },
  handoffs: {
    create: async (draftId: string, body: JsonObject) => adaptHandoff(await call(transport,"handoffs.create",{draftId},body)),
    list: async (jobId: string) => adaptCollection(await call(transport,"handoffs.list",{jobId}),adaptHandoff,"handoffs"),
    get: async (handoffId: string) => adaptHandoff(await call(transport,"handoffs.get",{handoffId})),
    updateStatus: async (handoffId: string, body: JsonObject) => adaptHandoff(await call(transport,"handoffs.status",{handoffId},body)),
  },
  lifecycles: {
    create: async (body: JsonObject) => adaptLifecycle(await call(transport,"lifecycle.create",{},body)),
    list: async (query?: JsonObject) => adaptCollection(await call(transport,"lifecycle.list",{},undefined,query),adaptLifecycle,"lifecycles"),
    get: async (lifecycleId: string) => adaptLifecycle(await call(transport,"lifecycle.get",{lifecycleId})),
    transition: async (lifecycleId: string, body: JsonObject) => adaptLifecycle(await call(transport,"lifecycle.transition",{lifecycleId},body)),
    reconcile: async (lifecycleId: string, body: JsonObject = {}) => adaptLifecycle(await call(transport,"lifecycle.reconcile",{lifecycleId},body)),
  },
  followups: {
    create: async (lifecycleId: string, body: JsonObject) => adaptFollowup(await call(transport,"followups.create",{lifecycleId},body)),
    due: async (query?: JsonObject) => adaptCollection(await call(transport,"followups.due",{},undefined,query),adaptFollowup,"followups"),
    reconcile: async (body: JsonObject = {}) => adaptCollection(await call(transport,"followups.reconcile",{},body),adaptFollowup,"followups"),
    complete: async (followupId: string, body: JsonObject = {}) => adaptFollowup(await call(transport,"followups.complete",{followupId},body)),
  },
  portfolio: {
    list: async (query?: JsonObject) => adaptCollection(await call(transport,"portfolio.list",{},undefined,query),adaptPortfolioItem,"portfolio"),
    actions: async () => adaptCollection(await call(transport,"portfolio.actions"),adaptPortfolioItem,"actions"),
    nextAction: async () => adaptPortfolioItem(await call(transport,"portfolio.next")),
    get: async (jobId: string) => adaptPortfolioItem(await call(transport,"portfolio.get",{jobId})),
    reconcile: async (jobId: string, body: JsonObject = {}) => adaptPortfolioItem(await call(transport,"portfolio.reconcile",{jobId},body)),
  },
  analytics: Object.fromEntries(["summary","dashboard","attribution","funnel","performance","recommendations"].map(key => [
    key, async (query?: JsonObject) => adaptAnalytics(await call(transport,`analytics.${key}`,{},undefined,query)),
  ])) as Record<"summary"|"dashboard"|"attribution"|"funnel"|"performance"|"recommendations",(query?: JsonObject)=>Promise<ReturnType<typeof adaptAnalytics>>>,
  performanceBy: async (dimension: string, query?: JsonObject) => adaptAnalytics(await call(transport,"analytics.dimension",{dimension},undefined,query)),
  campaigns: {
    create: async (body: JsonObject) => adaptCampaign(await call(transport,"campaigns.create",{},body)),
    list: async (query?: JsonObject) => adaptCollection(await call(transport,"campaigns.list",{},undefined,query),adaptCampaign,"campaigns"),
    get: async (campaignId: string) => adaptCampaign(await call(transport,"campaigns.get",{campaignId})),
    update: async (campaignId: string, body: JsonObject) => adaptCampaign(await call(transport,"campaigns.update",{campaignId},body)),
    remove: async (campaignId: string) => call(transport,"campaigns.delete",{campaignId}),
    addVacancy: async (campaignId: string, body: JsonObject) => adaptCampaign(await call(transport,"campaigns.addVacancy",{campaignId},body)),
    removeVacancy: async (campaignId: string, vacancyId: string) => adaptCampaign(await call(transport,"campaigns.removeVacancy",{campaignId,vacancyId})),
    progress: async (campaignId: string) => adaptCampaign(await call(transport,"campaigns.progress",{campaignId})),
  },
  employers: {
    dashboard: async (employerId: string) => adaptEmployerDashboard(await call(transport,"employers.dashboard",{employerId})),
  },
  recruiters: {
    dashboard: async (recruiterId: string) => adaptRecruiterDashboard(await call(transport,"recruiters.dashboard",{recruiterId})),
    recordEvent: async (recruiterId: string, body: JsonObject) => adaptRecruiterDashboard(await call(transport,"recruiters.event",{recruiterId},body)),
  },
});
export const jobsClient = createJobsClient();
