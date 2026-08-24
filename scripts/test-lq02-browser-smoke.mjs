import assert from "node:assert/strict";

const base = (process.env.E2E_BASE_URL || "").replace(/\/$/, "");
if (!base) {
  console.log("LQ02 browser smoke skipped: set E2E_BASE_URL for preview or deployed checks.");
  process.exit(0);
}
const routes = ["/", "/jobs", "/jobs/applications", "/jobs/companies", "/jobs/recruiters"];
for (const route of routes) {
  const response = await fetch(`${base}${route}`, { redirect: "follow", signal: AbortSignal.timeout(20_000) });
  assert.ok(response.status < 500, `${route} returned ${response.status}`);
  const html = await response.text();
  assert.match(html, /MoveReady/i, `${route} did not render the MoveReady shell`);
}
console.log(`LQ02 deployed journey smoke passed for ${routes.length} routes at ${base}.`);
