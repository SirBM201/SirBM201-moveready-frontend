import assert from "node:assert/strict";
import fs from "node:fs";

const component=fs.readFileSync("components/jobs/V1LaunchJourney.tsx","utf8");
const layout=fs.readFileSync("app/jobs/layout.tsx","utf8");
const nav=fs.readFileSync("components/jobs/JobsNav.tsx","utf8");
assert.match(component,/jobs\/v1-launch-journey/);
assert.match(component,/saved records only/);
assert.match(component,/does not infer eligibility, approval/);
assert.match(component,/Next recorded action/);
assert.match(layout,/<V1LaunchJourney/);
assert.match(nav,/Find → qualify → execute → move/);
console.log("LQ19 V1 journey closure checks passed.");
