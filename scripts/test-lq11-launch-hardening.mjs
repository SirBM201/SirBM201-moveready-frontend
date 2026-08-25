import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [
  layout,
  vitals,
  vitalsRoute,
  alerts,
  accessibilityCss,
  launchPage,
  packageJson,
  workflow,
] = await Promise.all([
  readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/PerformanceVitals.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/api/performance-vitals/route.ts", import.meta.url), "utf8"),
  readFile(new URL("../components/SmartAlertsCenter.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/accessibility-polish.css", import.meta.url), "utf8"),
  readFile(new URL("../app/launch-readiness/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
  readFile(new URL("../.github/workflows/frontend-build.yml", import.meta.url), "utf8"),
]);

assert.match(layout, /<PerformanceVitals \/>/);
assert.match(vitals, /useReportWebVitals/);
assert.match(vitals, /navigator\.sendBeacon/);
assert.match(vitals, /keepalive:\s*true/);
assert.doesNotMatch(vitals, /email|session|document|application/i);
assert.match(vitalsRoute, /CLS.*FCP.*INP.*LCP.*TTFB/);
assert.match(vitalsRoute, /Cache-Control.*no-store/);
assert.doesNotMatch(vitalsRoute, /cookies\(|headers\(|searchParams|pathname/);

assert.match(alerts, /daily_digest/);
assert.match(alerts, /07:07 UTC/);
assert.match(alerts, /Private in-app digest/);
assert.match(alerts, /External delivery remains disabled/);

assert.match(accessibilityCss, /max-width:\s*360px/);
assert.match(accessibilityCss, /overflow-wrap:\s*anywhere/);
assert.match(accessibilityCss, /min-height:\s*44px/);
assert.match(accessibilityCss, /prefers-reduced-data:\s*reduce/);

assert.match(launchPage, /LQ11/);
assert.match(launchPage, /migration frontier through 055/i);
assert.match(launchPage, /LCP.*2\.5/);
assert.match(launchPage, /INP.*200/);
assert.match(launchPage, /CLS.*0\.1/);
assert.match(packageJson, /"test:lq11"/);
assert.match(workflow, /npm run test:lq11/);

console.log("LQ11 launch hardening frontend contract: PASS");
