import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [finder, page, routeChecker, styles, workflow, packageJson] = await Promise.all([
  readFile(new URL("../components/OpportunityFinder.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/find/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/RouteReadinessForm.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  readFile(new URL("../.github/workflows/frontend-build.yml", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
]);

assert.match(finder, /apiJson<FinderResponse>\("opportunity-finder\/recommendations"/);
assert.match(finder, /response\.contract_version !== "b11-v1"/);
assert.match(finder, /score_kind/);
assert.match(finder, /Eligibility not determined/);
assert.match(finder, /profile alignment does not confirm/i);

for (const contractField of [
  "candidate_routes",
  "qualification",
  "evidence",
  "costs",
  "timeline_notes",
  "risk_notes",
  "provenance",
  "official_sources",
  "matching_opportunities",
  "profile_gaps",
]) {
  assert.match(finder, new RegExp(`\\b${contractField}\\b`), `B11 must render ${contractField}`);
}

assert.match(finder, /target="_blank" rel="noreferrer"/);
assert.match(finder, /No exchange rate or unrecorded family multiplier is applied/);
assert.match(finder, /No linked HTTPS official source is available/);
assert.match(finder, /aria-pressed/);
assert.match(finder, /aria-live="polite"/);
assert.match(finder, /role=\{state === "error" \? "alert"/);

assert.match(page, /B11 · FIND → QUALIFY/);
assert.match(page, /No approval prediction/);
assert.match(page, /Authorities, schools and employers/i);
assert.match(page, /id="finder-workspace"/);

assert.match(routeChecker, /new URLSearchParams\(window\.location\.search\)/);
assert.match(routeChecker, /params\.get\("country"\)/);
assert.match(routeChecker, /params\.get\("route"\)/);
assert.match(routeChecker, /relocation\/routes\/by-code/);
assert.match(routeChecker, /route_version_id: exactRoute\?\.active_version_id/);
assert.match(routeChecker, /country_id: exactRoute\?\.country_id/);
assert.match(routeChecker, /exact_route_code/);
assert.match(routeChecker, /Exact route selected/);
assert.match(routeChecker, /exactOfficialSources/);
assert.match(routeChecker, /source_url\?\.startsWith\("https:\/\/"\)/);

assert.match(styles, /\.finder-layout/);
assert.match(styles, /\.finder-pathway-button:focus-visible/);
assert.match(styles, /\.route-binding-card/);
assert.match(styles, /@media \(max-width: 620px\)/);
assert.match(workflow, /npm run test:b11/);
assert.match(packageJson, /"test:b11"/);

console.log("B11 Opportunity / Route Finder frontend contract: PASS");
