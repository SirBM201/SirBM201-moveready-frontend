import fs from "node:fs";
const source=fs.readFileSync("components/jobs/IntelligenceWorkspace.tsx","utf8");
const checks=[
 [source.includes("LQ17 · evidence-backed outcome learning"),"LQ17 identity missing"],
 [source.includes("application-analytics/dashboard"),"analytics dashboard not loaded"],
 [source.includes("Unknown responses remain unknown"),"unknown-outcome policy missing"],
 [source.includes("Insufficient sample for a pattern"),"minimum-sample guard missing"],
 [source.includes("Outcome evidence coverage"),"evidence coverage missing"],
 [source.includes("do not predict hiring"),"outcome safety boundary missing"],
];
const failed=checks.filter(([ok])=>!ok).map(([,message])=>message);
if(failed.length){console.error(failed.join("\n"));process.exit(1)}
console.log("LQ17 outcome learning loop contract: PASS");
