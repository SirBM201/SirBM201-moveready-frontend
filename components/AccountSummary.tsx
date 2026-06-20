"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type AccountCounts = {
  profiles?: number;
  saved_routes?: number;
  watchlist?: number;
  timeline?: number;
  reports?: number;
  service_requests?: number;
};

type AccountSummaryResponse = {
  ok: boolean;
  session?: {
    email?: string;
    status?: string;
    expires_at?: string;
  };
  counts?: AccountCounts;
  latest_profile?: {
    full_name?: string | null;
    target_country?: string | null;
    main_goal?: string | null;
    readiness_snapshot?: {
      readiness_score?: number;
      readiness_level?: string;
    };
  } | null;
  next_actions?: string[];
};

const summaryTiles = [
  { key: "profiles", label: "Profiles", href: "#profile-dashboard" },
  { key: "saved_routes", label: "Saved routes", href: "/saved-routes" },
  { key: "watchlist", label: "Watchlist", href: "/watchlist" },
  { key: "timeline", label: "Timeline", href: "/timeline" },
  { key: "reports", label: "Reports", href: "/my-reports" },
  { key: "service_requests", label: "Service requests", href: "/service-requests" },
] as const;

function formatDate(value?: string) {
  if (!value) return "Not set";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AccountSummary() {
  const [summary, setSummary] = useState<AccountSummaryResponse | null>(null);
  const [message, setMessage] = useState("Checking for a verified session...");
  const [loading, setLoading] = useState(true);

  async function loadSummary() {
    setLoading(true);
    setMessage("Loading account summary...");
    try {
      const data = await apiJson<AccountSummaryResponse>("account/summary", { timeoutMs: 15000 });
      setSummary(data);
      setMessage("Account summary loaded.");
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.status === 401) {
        setMessage("Sign in to see records connected to your verified account.");
      } else {
        setMessage(apiError?.message || "Unable to load account summary yet.");
      }
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  const counts = summary?.counts || {};
  const profile = summary?.latest_profile || null;
  const snapshot = profile?.readiness_snapshot || {};

  return (
    <section className="result-block featured">
      <div className="panel-heading">
        <div>
          <p className="overline">Verified account summary</p>
          <h2>{summary?.session?.email ? `Signed in as ${summary.session.email}` : "Connect your account records"}</h2>
        </div>
        <span className="status-dot">{summary ? "Verified" : loading ? "Checking" : "Sign in"}</span>
      </div>

      <p>
        {summary
          ? "These are the MoveReady records currently connected to your verified email session."
          : "Email OTP login lets MoveReady safely connect profiles, saved routes, reports, alerts, timelines, and service requests under one account."}
      </p>

      {summary ? (
        <>
          <div className="grid">
            {summaryTiles.map((tile) => (
              <a className="card" href={tile.href} key={tile.key}>
                <h3>{counts[tile.key] ?? 0}</h3>
                <p>{tile.label}</p>
              </a>
            ))}
          </div>

          <div className="mini-list">
            <div><strong>Latest profile</strong><span>{profile?.full_name || profile?.target_country || "No profile connected yet"}</span></div>
            <div><strong>Goal</strong><span>{profile?.main_goal || "Not set"}</span></div>
            <div><strong>Readiness</strong><span>{snapshot.readiness_score ?? 0} / 100 · {snapshot.readiness_level || "Not calculated"}</span></div>
            <div><strong>Session expires</strong><span>{formatDate(summary.session?.expires_at)}</span></div>
          </div>
        </>
      ) : null}

      <p className="form-status">{message}</p>
      <div className="actions">
        {summary ? <button className="btn" type="button" onClick={loadSummary} disabled={loading}>{loading ? "Refreshing..." : "Refresh summary"}</button> : <a className="btn primary" href="/login">Sign in with email</a>}
      </div>
    </section>
  );
}
