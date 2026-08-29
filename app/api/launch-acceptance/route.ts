import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PRODUCTION_BACKEND = "https://moveready-mvp-production.up.railway.app";
const checks = [
  { key: "health", path: "/api/health", expected: 200 },
  { key: "build", path: "/api/build-info", expected: 200 },
  { key: "auth", path: "/api/auth/health", expected: 200 },
  { key: "operations", path: "/api/operations/status", expected: 200 },
  { key: "private_boundary", path: "/api/jobs/options", expected: 401 },
] as const;

function backendOrigin() {
  const raw = (process.env.MOVEREADY_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || PRODUCTION_BACKEND).trim();
  const url = new URL(raw);
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") throw new Error("production_backend_requires_https");
  return url.origin;
}

async function probe(origin: string, check: typeof checks[number]) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  const started = Date.now();
  try {
    const response = await fetch(`${origin}${check.path}`, { cache: "no-store", redirect: "manual", signal: controller.signal, headers: { Accept: "application/json" } });
    return { key: check.key, path: check.path, expected_status: check.expected, actual_status: response.status, passed: response.status === check.expected, latency_ms: Date.now() - started };
  } catch (error) {
    return { key: check.key, path: check.path, expected_status: check.expected, actual_status: null, passed: false, latency_ms: Date.now() - started, failure: error instanceof Error && error.name === "AbortError" ? "timeout" : "unreachable" };
  } finally { clearTimeout(timer); }
}

export async function GET() {
  const checkedAt = new Date().toISOString();
  try {
    const origin = backendOrigin();
    const results = await Promise.all(checks.map((check) => probe(origin, check)));
    const passed = results.filter((result) => result.passed).length;
    return NextResponse.json({ ok: passed === results.length, contract_version: "lq20.1-v1", scope: "v1_launch_only", checked_at: checkedAt, backend_origin: new URL(origin).hostname, passed, total: results.length, checks: results, safety: { read_only: true, credentials_sent: false, external_action_performed: false } }, { status: passed === results.length ? 200 : 503, headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch {
    return NextResponse.json({ ok: false, contract_version: "lq20.1-v1", scope: "v1_launch_only", checked_at: checkedAt, passed: 0, total: checks.length, checks: checks.map((check) => ({ key: check.key, path: check.path, expected_status: check.expected, actual_status: null, passed: false, failure: "invalid_backend_configuration" })), safety: { read_only: true, credentials_sent: false, external_action_performed: false } }, { status: 503, headers: { "Cache-Control": "no-store, max-age=0" } });
  }
}
