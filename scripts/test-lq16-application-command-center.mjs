import fs from "node:fs";

const read = path => fs.readFileSync(path, "utf8");
const workspace = read("components/jobs/ApplicationExecutionWorkspace.tsx");
const client = read("lib/jobs/executionClient.ts");
const vacancy = read("components/jobs/VacancyDetail.tsx");

const checks = [
  [workspace.includes("LQ16 · guided application execution"), "LQ16 execution identity is missing"],
  [workspace.includes("portfolio.overview()"), "execution overview is not loaded"],
  [workspace.includes("Blocking evidence gap"), "blocking evidence is not visible"],
  [workspace.includes("Open next action"), "top execution command is missing"],
  [workspace.includes('new URLSearchParams(window.location.search).get("jobId")'), "vacancy deep-link selection is missing"],
  [workspace.includes("MoveReady never submits or contacts an employer for you"), "manual-control boundary is missing"],
  [client.includes("PortfolioSummary"), "portfolio summary contract is missing"],
  [client.includes("execution_command_version"), "LQ16 contract version is not adapted"],
  [vacancy.includes("/jobs/execution?jobId="), "readiness action does not enter controlled execution"],
];

const failed = checks.filter(([ok]) => !ok).map(([, message]) => message);
if (failed.length) {
  console.error(failed.join("\n"));
  process.exit(1);
}
console.log("LQ16 application command center contract: PASS");
