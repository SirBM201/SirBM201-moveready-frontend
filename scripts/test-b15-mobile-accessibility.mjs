import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [
  layout,
  header,
  mobileNav,
  jobsNav,
  accessibilityCss,
  responsiveCss,
  loading,
  errorPage,
  notFound,
  manifest,
  sitemap,
  comparison,
  login,
  settings,
  alerts,
  dashboard,
  accessibilityPage,
  footer,
  workflow,
  packageJson,
] = await Promise.all([
  readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/SiteHeader.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/MobileQuickNav.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/jobs/JobsNav.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/accessibility-polish.css", import.meta.url), "utf8"),
  readFile(new URL("../app/responsive-polish.css", import.meta.url), "utf8"),
  readFile(new URL("../app/loading.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/error.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/not-found.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/manifest.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
  readFile(new URL("../components/RouteComparisonWorkspace.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/AccountLogin.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/AccountSettingsWorkspace.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/SmartAlertsCenter.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/DashboardCommandCenter.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/accessibility/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/SiteFooter.tsx", import.meta.url), "utf8"),
  readFile(new URL("../.github/workflows/frontend-build.yml", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
]);

assert.match(layout, /className="skip-link" href="#main-content"/);
assert.match(layout, /id="main-content" tabIndex=\{-1\}/);
assert.doesNotMatch(layout, /maximumScale|userScalable/);
assert.doesNotMatch(manifest, /orientation:\s*"portrait-primary"/);

for (const navigation of [header, mobileNav, jobsNav]) {
  assert.match(navigation, /usePathname/);
  assert.match(navigation, /aria-current=/);
}
assert.match(header, /event\.key === "Escape"/);
assert.match(header, /querySelector\("summary"\)\?\.focus\(\)/);
assert.match(jobsNav, /event\.key === "Escape"/);
for (const label of ["Start", "Jobs", "Actions", "Alerts", "Account"]) {
  assert.match(mobileNav, new RegExp(`label:\\s*"${label}"`));
}

const css = accessibilityCss + responsiveCss;
assert.match(css, /focus-visible/);
assert.match(css, /prefers-reduced-motion:\s*reduce/);
assert.match(css, /prefers-contrast:\s*more/);
assert.match(css, /forced-colors:\s*active/);
assert.match(css, /max-width:\s*420px/);
assert.match(css, /min-height:\s*44px/);
assert.match(css, /font-size:\s*16px/);
assert.match(css, /grid-template-columns:\s*repeat\(5/);
assert.match(css, /safe-area-inset-bottom/);

assert.match(loading, /role="status"/);
assert.match(loading, /aria-busy="true"/);
assert.match(errorPage, /headingRef\.current\?\.focus\(\)/);
assert.match(errorPage, /role="alert"/);
assert.match(notFound, /aria-labelledby="global-not-found-title"/);

assert.match(comparison, /<fieldset/);
assert.match(comparison, /<legend/);
assert.match(comparison, /resultRef\.current\?\.focus\(\)/);
assert.match(comparison, /aria-live="polite"/);
assert.match(comparison, /role="alert"/);
assert.match(comparison, /aria-busy=\{loading\}/);

for (const component of [login, settings, alerts, dashboard]) {
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /aria-busy=/);
}

assert.match(accessibilityPage, /B15 · Mobile and accessibility completion/);
assert.match(accessibilityPage, /Responsive web, not a native app/);
assert.match(accessibilityPage, /Official sources remain final/);
assert.match(header + footer + sitemap, /\/accessibility/);
assert.match(settings, /id="accessibility"/);
assert.match(workflow, /npm run test:b15/);
assert.match(packageJson, /"test:b15"/);
assert.doesNotMatch(accessibilityPage + header + mobileNav, /Moses|SirBM|founder/i);

console.log("B15 Mobile and Accessibility frontend contract: PASS");
