import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [domain, adapter, detail, backendContract] = await Promise.all([
  read("lib/jobs/domain.ts"),
  read("lib/jobs/adapters.ts"),
  read("components/jobs/VacancyDetail.tsx"),
  read("docs/LQ15_READINESS_GAP_ENGINE.md"),
]);

for (const marker of ["ReadinessGap", "ReadinessAction", "evidenceCoverage", "gapSummary"]) assert.match(domain, new RegExp(marker));
assert.match(adapter, /container\.readiness/);
assert.match(adapter, /next_actions/);
assert.match(adapter, /evidence_coverage/);
assert.match(detail, /LQ15 readiness gap engine/);
assert.match(detail, /Unknown is not ready/);
assert.match(detail, /What blocks or weakens this opportunity/);
assert.match(detail, /Do these next/);
assert.match(backendContract, /No immigration eligibility or hiring probability/i);

console.log("LQ15 Readiness Gap Engine contract: PASS");

