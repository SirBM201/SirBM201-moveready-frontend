import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function firstEnvironment(...names: string[]) {
  for (const name of names) {
    const value = (process.env[name] || "").trim();
    if (value) return value;
  }
  return "";
}

export async function GET() {
  const commit = firstEnvironment("VERCEL_GIT_COMMIT_SHA", "GIT_COMMIT_SHA", "COMMIT_SHA");
  const backend = firstEnvironment("MOVEREADY_BACKEND_URL", "NEXT_PUBLIC_BACKEND_URL");
  let backendTransport = "default_contract";
  if (backend) {
    try {
      backendTransport = new URL(backend).protocol === "https:" ? "https" : "invalid_for_production";
    } catch {
      backendTransport = "invalid";
    }
  }

  return NextResponse.json(
    {
      ok: true,
      service: "moveready-frontend",
      contract_version: "b16-v1",
      deployment: {
        provider: process.env.VERCEL ? "Vercel" : "local_or_other",
        environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
        commit_sha: commit || null,
        commit_short: commit ? commit.slice(0, 12) : null,
      },
      backend_contract: {
        expected_operations_version: "b16-v1",
        proxy_path: "/api/*",
        configured_transport: backendTransport,
      },
      admin_key_boundary: "server key is never configured as NEXT_PUBLIC_*; browser admin tools use current-tab session storage only",
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
