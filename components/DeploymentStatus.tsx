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
};

type OperationsStatus = {
  ok: boolean;
  status?: string;
  generated_at?: string;
  public_capabilities?: Record<string, boolean | string>;
  safety_note?: string;
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
  const [build, setBuild] = useState<BuildInfo | null>(null);
  const [operations, setOperations] = useState<OperationsStatus | null>(null);
  const [message, setMessage] = useState("Checking the deployed backend revision and public feature contract...");
  const [loading, setLoading] = useState(false);

  async function loadStatus() {
    setLoading(true);
    setMessage("Checking backend build information and operational controls...");
    try {
      const [buildInfo, operationsInfo] = await Promise.all([
        apiJson<BuildInfo>("build-info", { timeoutMs: 30000, useAuthToken: false }),
        apiJson<OperationsStatus>("operations/status", { timeoutMs: 30000, useAuthToken: false }),
      ]);
      setBuild(buildInfo);
      setOperations(operationsInfo);
      if (buildInfo.route_contract?.ok === false) {
        setMessage(`Backend is responding, but ${buildInfo.route_contract.missing_routes?.length || 0} expected routes are missing. Treat this deployment as incomplete.`);
      } else if (!buildInfo.deployment?.commit_sha) {
        setMessage("Backend is responding and the route contract passed, but Railway did not expose a commit SHA. Compare the release label before treating production as current.");
      } else {
        setMessage(`Backend responded with commit ${buildInfo.deployment.commit_short || buildInfo.deployment.commit_sha}, and its expected route contract passed.`);
      }
    } catch (error) {
      const apiError = error as ApiError;
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
  const schedule = build?.passport_index_schedule || {};
  const routeContract = build?.route_contract || {};
  const features = Object.entries(build?.features || {});
  const capabilities = Object.entries(operations?.public_capabilities || {});

  return (
    <div className="result-stack">
      <article className="result-block featured">
        <div className="panel-heading">
          <div>
            <p className="overline">Production fingerprint</p>
            <h2>{build?.ok ? "Backend is responding" : "Deployment not verified"}</h2>
          </div>
          <span className="status-dot">{routeContract.ok === false ? "route contract failed" : readable(build?.status)}</span>
        </div>
        <p>{message}</p>
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
