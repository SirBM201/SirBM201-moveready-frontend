import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const componentsUrl = new URL("../components/", import.meta.url);

const [
  frontendBuildInfo,
  deploymentStatus,
  deploymentPage,
  nextConfig,
  envExample,
  layout,
  storageGuard,
  workflow,
  packageJson,
  adminPage,
  componentNames,
] = await Promise.all([
  readFile(new URL("app/api/frontend-build-info/route.ts", root), "utf8"),
  readFile(new URL("components/DeploymentStatus.tsx", root), "utf8"),
  readFile(new URL("app/deployment-status/page.tsx", root), "utf8"),
  readFile(new URL("next.config.mjs", root), "utf8"),
  readFile(new URL(".env.example", root), "utf8"),
  readFile(new URL("app/layout.tsx", root), "utf8"),
  readFile(new URL("components/AdminKeyStorageGuard.tsx", root), "utf8"),
  readFile(new URL(".github/workflows/frontend-build.yml", root), "utf8"),
  readFile(new URL("package.json", root), "utf8"),
  readFile(new URL("app/admin/page.tsx", root), "utf8"),
  readdir(componentsUrl),
]);

const adminComponentNames = componentNames.filter((name) => /^Admin.*\.tsx$/.test(name));
const adminComponents = await Promise.all(
  adminComponentNames.map(async (name) => [name, await readFile(new URL(name, componentsUrl), "utf8")]),
);

assert.match(frontendBuildInfo, /contract_version:\s*"b16-v1"/);
assert.match(frontendBuildInfo, /expected_operations_version:\s*"b16-v1"/);
assert.match(frontendBuildInfo, /VERCEL_GIT_COMMIT_SHA/);
assert.match(frontendBuildInfo, /configured_transport/);
assert.match(frontendBuildInfo, /Cache-Control.*no-store/);
assert.doesNotMatch(frontendBuildInfo, /process\.env\.(?:ADMIN|SUPABASE_SERVICE_ROLE|SECRET|PASSWORD|TOKEN)/);

assert.match(deploymentPage, /B16 · Deployment and operations hardening/);
assert.match(deploymentStatus, /Frontend fingerprint/);
assert.match(deploymentStatus, /operations_contract/);
assert.match(deploymentStatus, /admin_boundary/);
assert.match(deploymentStatus, /schedule_count/);
assert.match(deploymentStatus, /Migration frontier/);
assert.match(deploymentStatus, /b16Connected/);
assert.match(deploymentStatus, /aria-live="polite"/);
assert.match(deploymentStatus, /aria-busy=\{loading\}/);

assert.match(nextConfig, /MOVEREADY_BACKEND_URL/);
assert.match(nextConfig, /NEXT_PUBLIC_BACKEND_URL/);
assert.match(nextConfig, /Production backend must use a public HTTPS origin/);
assert.match(nextConfig, /MoveReady backend configuration is invalid/);
assert.doesNotMatch(nextConfig, /catch\s*\([^)]*\)\s*\{\s*return PRODUCTION_BACKEND/);

assert.match(envExample, /^MOVEREADY_BACKEND_URL=https:\/\//m);
assert.match(envExample, /^NEXT_PUBLIC_BACKEND_URL=https:\/\//m);
assert.doesNotMatch(envExample, /^NEXT_PUBLIC_.*(?:ADMIN|SECRET|SERVICE_ROLE|PASSWORD|TOKEN)=/mi);
assert.match(envExample, /Never place admin keys, service-role secrets/);

assert.match(layout, /<AdminKeyStorageGuard \/>/);
assert.match(storageGuard, /localStorage\.removeItem\(ADMIN_KEY_STORAGE\)/);
assert.doesNotMatch(storageGuard, /localStorage\.(?:getItem|setItem)/);

for (const [name, source] of adminComponents) {
  if (name === "AdminKeyStorageGuard.tsx") continue;
  assert.doesNotMatch(source, /localStorage\.(?:getItem|setItem)\([^)]*moveready_admin_key/, `${name} must not persist the administrator key`);
  if (source.includes("moveready_admin_key")) {
    assert.match(source, /sessionStorage/, `${name} must limit administrator-key reuse to the current tab`);
  }
  if (source.includes('type="password"')) {
    assert.doesNotMatch(source, /type="password"(?![^>]*autoComplete="off")/g, `${name} admin-key inputs must disable browser autofill`);
  }
}

assert.match(adminPage, /migration ledger through 039/);
assert.match(adminPage, /current browser tab/);
assert.match(workflow, /NEXT_PUBLIC_API_BASE:\s*""/);
assert.match(workflow, /NEXT_PUBLIC_BACKEND_URL:\s*https:\/\/example\.invalid/);
assert.match(workflow, /MOVEREADY_BACKEND_URL:\s*https:\/\/example\.invalid/);
assert.match(workflow, /npm run test:b16/);
assert.match(packageJson, /"test:b16"/);

console.log(`B16 Deployment and Operations frontend contract: PASS (${adminComponentNames.length - 1} admin modules checked)`);
