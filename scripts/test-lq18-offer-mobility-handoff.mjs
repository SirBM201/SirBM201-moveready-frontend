import fs from "node:fs";
const workspace=fs.readFileSync("components/jobs/ApplicationExecutionWorkspace.tsx","utf8");
const client=fs.readFileSync("lib/jobs/executionClient.ts","utf8");
const checks=[
 [workspace.includes("6 · offer to mobility"),"offer-to-mobility step missing"],
 [workspace.includes("it is not immigration approval"),"offer safety boundary missing"],
 [workspace.includes("No authority submission or travel booking"),"external-action boundary missing"],
 [workspace.includes("Build mobility plan"),"mobility planner handoff missing"],
 [client.includes("mobility-handoff"),"mobility handoff API missing"],
 [client.includes("MobilityHandoff"),"mobility contract missing"],
];
const failed=checks.filter(([ok])=>!ok).map(([,message])=>message);
if(failed.length){console.error(failed.join("\n"));process.exit(1)}
console.log("LQ18 offer-to-mobility handoff contract: PASS");
