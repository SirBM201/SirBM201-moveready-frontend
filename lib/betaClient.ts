import{apiJson}from"@/lib/api";
export type BetaReport={id:string;device_class:"phone"|"tablet"|"desktop";journey:string;result:"passed"|"blocked"|"needs_help";severity:"none"|"minor"|"major"|"critical";summary:string;technical_help_required:boolean;created_at:string};
export const betaClient={
 list:async()=>(await apiJson<{items:BetaReport[]}>("beta/reports",{useAuthToken:true,timeoutMs:25000})).items||[],
 create:async(body:Record<string,unknown>)=>(await apiJson<{report:BetaReport}>("beta/reports",{method:"POST",body,useAuthToken:true,timeoutMs:25000})).report
};
