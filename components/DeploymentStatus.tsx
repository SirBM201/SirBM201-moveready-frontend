"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type BuildInfo = {
  ok: boolean;
  status?: string;
  service?: string;
  checked_at?: string;
  deployment?: {
    release_label?: string;
    commit_sha?: string | null;
    commit_short?: string | null;
    environment?: string;
    railway_service?: string | null;
    process_started_at?: string;
    uptime_seconds?: number;
    python_version?: string;
  };
  features?: Record<string, boolean | string | number | null>;
  passport_index_schedule?: {
    cadence?: string;
    weekdays?: string;
    hour_utc?: number;
    minute_utc?: number;
    scheduled_countries?: string[];
    maximum_countries_per_run?: number;
    cache_max_days?: number;
    execution_model?: string;
  };
  expected_endpoints?: string[];
  route_contract?: {
    ok?: boolean;
    expected_count?: number;
    registered_route_count?: number;
    missing_routes?: string[];
  };
  deployment_verification?: {
    commit_available?: boolean;
    instruction?: string;
    older_deploy_warning?: string;
  };
  safety_contract?: Record<string, string>;
  contract_versions?: Record<string, string>;
  operations_contract?: {
    version?: string;
    schedule_count?: number;
    schedules?: Array<{
      code?: string;
      workflow?: string;
      cadence?: string;
      cron?: string;
      endpoint?: string;
      effect?: string;
    }>;
    admin_boundary?: {
      ok?: boolean;
      protected_route_count?: number;
      unprotected_routes?: string[];
      header?: string;
      comparison?: string;
      browser_storage?: string;
    };
    migration_ledger?: {
      version?: string;
      latest_schema_file?: string;
      source?: string;
      database_history_note?: string;
    };
    rollback_policy?: string;
  };
};

type OperationsStatus = {
  ok: boolean;
  status?: string;
  generated_at?: string;
  public_capabilities?: Record<string, boolean | string>;
  safety_note?: string;
  contract_version?: string;
  environment_validation?: {
    status?: string;
    production_runtime?: boolean;
    blocked_checks?: string[];
    controlled_checks?: string[];
  };
};

type FrontendBuildInfo = {
  ok: boolean;
  service?: string;
  contract_version?: string;
  deployment?: {
    provider?: string;
    environment?: string;
    commit_sha?: string | null;
    commit_short?: string | null;
  };
  backend_contract?: {
    expected_operations_version?: string;
    proxy_path?: string;
    configured_transport?: string;
  };
  admin_key_boundary?: string;
};

function readable(value?: string | number | boolean | null) {
  if (value === null || value === undefined || value === "") return "not reported";
  if (typeof value === "boolean") return value ? "enabled" : "disabled";
  return String(value).replace(/_/g, " ");
}

function formatDate(value?: string) {
  if (!value) return "Not reported";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatUptime(seconds?: number) {
  if (seconds === undefined || seconds === null) return "Not reported";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

export default function DeploymentStatus() {
  const [frontend, setFrontend] = useState<FrontendBuildInfo | null>(null);
  const [build, setBuild] = useState<BuildInfo | null>(null);
  const [operations, setOperations] = useState<OperationsStatus | null>(null);
  const [message, setMessage] = useState("Checking the deployed backend revision and public feature contract...");
  const [loading, setLoading] = useState(false);

  async function loadStatus() {
    setLoading(true);
    setMessage("Checking backend build information and operational controls...");
    try {
      const [frontendResponse, buildInfo, operationsInfo] = await Promise.all([
        fetch("/api/frontend-build-info", { cache: "no-store" }),
        apiJson<BuildInfo>("build-info", { timeoutMs: 30000, useAuthToken: false }),
        apiJson<OperationsStatus>("operations/status", { timeoutMs: 30000, useAuthToken: false }),
      ]);
      if (!frontendResponse.ok) throw new Error(`Frontend fingerprint returned HTTP ${frontendResponse.status}`);
      const frontendInfo = await frontendResponse.json() as FrontendBuildInfo;
      setFrontend(frontendInfo);
      setBuild(buildInfo);
      setOperations(operationsInfo);
      if (frontendInfo.contract_version !== "b16-v1") {
        setMessage("The frontend is responding, but it does not report the B16 deployment contract. Treat this deployment as incomplete.");
      } else if (buildInfo.contract_versions?.operations !== "b16-v1") {
        setMessage("The frontend reports B16, but Railway is serving an older backend operations contract.");
      } else if (buildInfo.operations_contract?.admin_boundary?.ok === false) {
        setMessage("The B16 backend is responding, but one or more administrator routes are missing the required protection boundary.");
      } else if (buildInfo.route_contract?.ok === false) {
        setMessage(`Backend is responding, but ${buildInfo.route_contract.missing_routes?.length || 0} expected routes are missing. Treat this deployment as incomplete.`);
      } else if (!buildInfo.deployment?.commit_sha) {
        setMessage("Backend is responding and the route contract passed, but Railway did not expose a commit SHA. Compare the release label before treating production as current.");
      } else {
        setMessage(`Frontend and backend report B16. Railway commit ${buildInfo.deployment.commit_short || buildInfo.deployment.commit_sha} passed the route, admin-boundary, schedule, and migration-ledger contracts.`);
      }
    } catch (error) {
      const apiError = error as ApiError;
      setFrontend(null);
      setBuild(null);
      setOperations(null);
      setMessage(apiError?.message || "Unable to verify the deployed backend. It may be sleeping, unavailable, or serving an older route contract.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStatus();
  }, []);

  const deployment = build?.deployment || {};
  const frontendDeployment = frontend?.deployment || {};
  const schedule = build?.passport_index_schedule || {};
  const routeContract = build?.route_contract || {};
  const features = Object.entries(build?.features || {});
  const capabilities = Object.entries(operations?.public_capabilities || {});
  const operationsContract = build?.operations_contract || {};
  const adminBoundary = operationsContract.admin_boundary || {};
  const migrationLedger = operationsContract.migration_ledger || {};
  const b16Connected = frontend?.contract_version === "b16-v1"
    && build?.contract_versions?.operations === "b16-v1"
    && routeContract.ok === true
    && adminBoundary.ok === true;

  return (
    <div className="result-stack" aria-busy={loading}>
      <article className="result-block featured">
        <div className="panel-heading">
          <div>
            <p className="overline">Production fingerprint</p>
            <h2>{b16Connected ? "B16 deployment contract connected" : "Deployment not verified"}</h2>
          </div>
          <span className="status-dot">{b16Connected ? "B16 connected" : routeContract.ok === false ? "route contract failed" : readable(build?.status)}</span>
        </div>
        <p aria-live="polite">{message}</p>
        <div className="mini-list">
          <div><strong>Release</strong><span>{deployment.release_label || "Not reported"}</span></div>
          <div><strong>Commit</strong><span>{deployment.commit_sha || "Railway commit metadata unavailable"}</span></div>
          <div><strong>Environment</strong><span>{readable(deployment.environment)}</span></div>
          <div><strong>Railway service</strong><span>{deployment.railway_service || "Not reported"}</span></div>
          <div><strong>Process started</strong><span>{formatDate(deployment.process_started_at)}</span></div>
          <div><strong>Current uptime</strong><span>{formatUptime(deployment.uptime_seconds)}</span></div>
          <div><strong>Python</strong><span>{deployment.python_version || "Not reported"}</span></div>
          <div><strong>Checked</strong><span>{formatDate(build?.checked_at)}</span></div>
        </div>
        <div className="actions">
          <button className="btn primary" type="button" disabled={loading} onClick={loadStatus}>{loading ? "Checking..." : "Refresh deployment check"}</button>
          <a className="btn" href="/launch-readiness">Launch readiness</a>
          <a className="btn" href="/admin#operations-status">Protected operations</a>
        </div>
      </article>

      <article className="result-block">
        <div className="panel-heading">
          <div><p className="overline">Frontend fingerprint</p><h3>{frontend?.ok ? "Vercel frontend is responding" : "Frontend fingerprint unavailable"}</h3></div>
          <span className="status-dot">{frontend?.contract_version || "not verified"}</span>
        </div>
        <div className="mini-list">
          <div><strong>Provider</strong><span>{frontendDeployment.provider || "Not reported"}</span></div>
          <div><strong>Environment</strong><span>{readable(frontendDeployment.environment)}</span></div>
          <div><strong>Commit</strong><span>{frontendDeployment.commit_sha || "Vercel commit metadata unavailable"}</span></div>
          <div><strong>Backend proxy</strong><span>{frontend?.backend_contract?.proxy_path || "Not reported"} over {frontend?.backend_contract?.configured_transport || "not reported"}</span></div>
          <div><strong>Expected backend operations</strong><span>{frontend?.backend_contract?.expected_operations_version || "Not reported"}</span></div>
          <div><strong>Admin key storage</strong><span>{frontend?.admin_key_boundary || "Not reported"}</span></div>
        </div>
      </article>

      <article className="result-block">
        <div className="panel-heading">
          <div><p className="overline">Live route registration</p><h3>{routeContract.ok ? "Expected routes are registered" : "Route contract needs attention"}</h3></div>
          <span className="status-dot">{routeContract.ok ? "passed" : "failed"}</span>
        </div>
        <div className="mini-list">
          <div><strong>Expected routes</strong><span>{routeContract.expected_count ?? "Not reported"}</span></div>
          <div><strong>All registered Flask routes</strong><span>{routeContract.registered_route_count ?? "Not reported"}</span></div>
          <div><strong>Missing routes</strong><span>{routeContract.missing_routes?.join(", ") || "None reported"}</span></div>
        </div>
      </article>

      <article className="result-block">
        <div className="panel-heading">
          <div><p className="overline">B16 operations contract</p><h3>Schedules, admin boundary, and migration frontier</h3></div>
          <span className="status-dot">{operationsContract.version || "not reported"}</span>
        </div>
        <div className="mini-list">
          <div><strong>Protected admin routes</strong><span>{adminBoundary.protected_route_count ?? "Not reported"}</span></div>
          <div><strong>Unprotected admin routes</strong><span>{adminBoundary.unprotected_routes?.join(", ") || "None reported"}</span></div>
          <div><strong>Admin header</strong><span>{adminBoundary.header || "Not reported"} · {readable(adminBoundary.comparison)}</span></div>
          <div><strong>Canonical schedules</strong><span>{operationsContract.schedule_count ?? "Not reported"}</span></div>
          <div><strong>Migration frontier</strong><span>{migrationLedger.latest_schema_file || "Not reported"}</span></div>
          <div><strong>Environment validation</strong><span>{readable(operations?.environment_validation?.status)}</span></div>
        </div>
        <div className="grid" style={{ marginTop: 16 }}>
          {(operationsContract.schedules || []).map((item) => (
            <article className="card" key={item.code}>
              <p className="overline">{readable(item.cadence)} · {item.cron} UTC cron</p>
              <h3>{readable(item.code)}</h3>
              <p>{item.effect}</p>
              <p><strong>Endpoint:</strong> {item.endpoint}</p>
            </article>
          ))}
        </div>
        <p className="form-status">{migrationLedger.database_history_note}</p>
        <p>{operationsContract.rollback_policy}</p>
      </article>

      <article className="result-block">
        <p className="overline">Passport Index schedule</p>
        <h3>{readable(schedule.cadence)} unattended refresh</h3>
        <div className="mini-list">
          <div><strong>Weekday</strong><span>{schedule.weekdays || "Not reported"}</span></div>
          <div><strong>Time</strong><span>{schedule.hour_utc ?? "?"}:{String(schedule.minute_utc ?? 0).padStart(2, "0")} UTC</span></div>
          <div><strong>Countries</strong><span>{schedule.scheduled_countries?.join(", ") || "Not reported"}</span></div>
          <div><strong>Maximum per run</strong><span>{schedule.maximum_countries_per_run ?? "Not reported"}</span></div>
          <div><strong>Cache age</strong><span>{schedule.cache_max_days ?? "Not reported"} days</span></div>
          <div><strong>Execution</strong><span>{schedule.execution_model || "Not reported"}</span></div>
        </div>
      </article>

      <article className="result-block">
        <p className="overline">Public capability contract</p>
        <h3>What production currently claims</h3>
        <div className="badge-row">
          {capabilities.map(([key, value]) => <span className="badge" key={key}>{readable(key)}: {readable(value)}</span>)}
        </div>
        {operations?.safety_note ? <p className="form-status">{operations.safety_note}</p> : null}
      </article>

      <article className="result-block">
        <p className="overline">Backend feature flags</p>
        <h3>Code and configuration snapshot</h3>
        <div className="badge-row">
          {features.map(([key, value]) => <span className="badge" key={key}>{readable(key)}: {readable(value)}</span>)}
        </div>
      </article>

      <article className="result-block soft">
        <p className="overline">Verification rule</p>
        <h3>Do not infer deployment success from a repository commit alone</h3>
        <p>{build?.deployment_verification?.instruction || "Compare the live backend commit with the latest main-branch commit."}</p>
        <p>{build?.deployment_verification?.older_deploy_warning}</p>
        <div className="mini-list">
          {Object.entries(build?.safety_contract || {}).map(([key, value]) => (
            <div key={key}><strong>{readable(key)}</strong><span>{value}</span></div>
          ))}
        </div>
      </article>

      <article className="result-block soft">
        <p className="overline">Expected backend routes</p>
        <div className="mini-list">
          {(build?.expected_endpoints || []).map((endpoint) => <div key={endpoint}><strong>{endpoint}</strong></div>)}
        </div>
      </article>
    </div>
  );
}
