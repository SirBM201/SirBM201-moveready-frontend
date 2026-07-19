"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import { getActiveProfileId, setActiveProfile } from "@/lib/profileStorage";
import { readableLabel } from "@/lib/labels";

type AccountCounts = {
  profiles?: number;
  saved_routes?: number;
  watchlist?: number;
  timeline?: number;
  reports?: number;
  service_requests?: number;
};

type AccountProfile = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  current_country?: string | null;
  residence_country?: string | null;
  nationality?: string | null;
  target_country?: string | null;
  target_city?: string | null;
  main_goal?: string | null;
  goal?: string | null;
  route_category?: string | null;
  available_funds_amount?: number | null;
  available_funds_currency?: string | null;
  family_members_count?: number | null;
  timeline_months?: number | null;
  status?: string | null;
  created_at?: string;
  readiness_snapshot?: {
    readiness_score?: number;
    readiness_level?: string;
    risk_flags?: string[];
  };
};

type AccountSummaryResponse = {
  ok: boolean;
  session?: {
    email?: string;
    status?: string;
    expires_at?: string;
  };
  counts?: AccountCounts;
  latest_profile?: AccountProfile | null;
  sections?: {
    profiles?: {
      ok?: boolean;
      count?: number;
      rows?: AccountProfile[];
    };
  };
  next_actions?: string[];
};

const summaryTiles = [
  { key: "profiles", label: "Profiles", helper: "People/plans saved", href: "#profile-chooser" },
  { key: "saved_routes", label: "Saved routes", helper: "Routes to revisit", href: "/saved-routes" },
  { key: "watchlist", label: "Watchlist", helper: "Alerts you asked for", href: "/watchlist" },
  { key: "timeline", label: "Timeline", helper: "Dated actions", href: "/timeline" },
  { key: "reports", label: "Reports", helper: "Readiness reports", href: "/my-reports" },
  { key: "service_requests", label: "Support requests", helper: "Private help requests", href: "/service-requests" },
] as const;

function formatDate(value?: string) {
  if (!value) return "Not set";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatDateTime(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function profileName(profile?: AccountProfile | null) {
  return profile?.full_name || profile?.email || profile?.phone || profile?.target_country || "Saved profile";
}

function profileGoal(profile?: AccountProfile | null) {
  return profile?.main_goal || profile?.goal || profile?.route_category || "relocation";
}

function usableProfiles(summary: AccountSummaryResponse | null) {
  return (summary?.sections?.profiles?.rows || []).filter((profile) => profile.status !== "closed");
}

function profileRouteLine(profile?: AccountProfile | null) {
  if (!profile) return "No profile selected yet";
  const target = profile.target_country || "Target country not set";
  const route = readableLabel(profile.route_category || profileGoal(profile));
  const created = profile.created_at ? ` · Saved ${formatDateTime(profile.created_at)}` : "";
  return `${target} · ${route}${created}`;
}

export default function AccountSummary() {
  const [summary, setSummary] = useState<AccountSummaryResponse | null>(null);
  const [activeProfileId, setActiveProfileId] = useState("");
  const [message, setMessage] = useState("Checking for a signed-in session...");
  const [loading, setLoading] = useState(true);
  const [archivingId, setArchivingId] = useState("");

  async function loadSummary() {
    setLoading(true);
    setMessage("Loading account summary...");
    try {
      const data = await apiJson<AccountSummaryResponse>("account/summary", { timeoutMs: 15000 });
      const profiles = usableProfiles(data);
      const storedActiveId = getActiveProfileId();
      const chosenProfile = profiles.find((item) => item.id === storedActiveId) || profiles[0] || data.latest_profile || null;
      if (chosenProfile?.id) {
        setActiveProfile(chosenProfile.id, profileName(chosenProfile));
        setActiveProfileId(chosenProfile.id);
      } else {
        setActiveProfileId("");
      }
      setSummary(data);
      setMessage("Account summary loaded.");
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.status === 401) {
        setMessage("Sign in to see records connected to your account.");
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

  function chooseProfile(profile: AccountProfile) {
    setActiveProfile(profile.id, profileName(profile));
    setActiveProfileId(profile.id);
    setMessage(`${profileName(profile)} is now your active profile. Route Checker and Saved Routes will use this profile first.`);
  }

  async function hideProfile(profile: AccountProfile) {
    const email = summary?.session?.email || profile.email || "";
    const phone = profile.phone || "";
    if (!email && !phone) {
      setMessage("This profile cannot be hidden because no matching email or phone was found.");
      return;
    }
    setArchivingId(profile.id);
    setMessage("Hiding old profile...");
    try {
      await apiJson(`profiles/${profile.id}`, {
        method: "PATCH",
        body: { status: "closed", email: email || undefined, phone: !email ? phone : undefined },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setMessage("Old profile hidden. Your account summary has been refreshed.");
      await loadSummary();
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.data?.error ? `Unable to hide profile: ${apiError.data.error}` : "Unable to hide profile right now.");
    } finally {
      setArchivingId("");
    }
  }

  const counts = summary?.counts || {};
  const profiles = usableProfiles(summary);
  const profileCount = counts.profiles ?? summary?.sections?.profiles?.count ?? profiles.length;
  const activeProfile = profiles.find((item) => item.id === activeProfileId) || profiles[0] || summary?.latest_profile || null;
  const snapshot = activeProfile?.readiness_snapshot || {};

  return (
    <section className="result-block featured" id="active-profile">
      <div className="panel-heading">
        <div>
          <p className="overline">Account summary</p>
          <h2>{summary?.session?.email ? `Signed in as ${summary.session.email}` : "Connect your account records"}</h2>
        </div>
        <span className="status-dot">{summary ? "Signed in" : loading ? "Checking" : "Sign in"}</span>
      </div>

      <p>
        {summary
          ? "This is your account home. Pick one active profile first, then use it for route checks, reports, saved routes, alerts, timeline, and support requests."
          : "Email login helps MoveReady connect profiles, saved routes, reports, alerts, timelines, and service requests under one account."}
      </p>

      {summary ? (
        <>
          <div className="grid">
            {summaryTiles.map((tile) => (
              <a className="card" href={tile.href} key={tile.key}>
                <h3>{counts[tile.key] ?? 0}</h3>
                <p><strong>{tile.label}</strong><br />{tile.helper}</p>
              </a>
            ))}
          </div>

          <article className="result-block soft" id="profile-chooser">
            <div className="panel-heading">
              <div>
                <p className="overline">Choose active profile</p>
                <h3>Choose active profile</h3>
              </div>
              <span className="status-dot">{activeProfile ? "Profile selected" : "Select profile"}</span>
            </div>
            <p className="form-status">
              This is the profile MoveReady will use for Route Checker, Saved Routes, Reports, Watchlist, Timeline, and Support. Use this button whenever you have more than one saved test profile.
            </p>

            {profiles.length ? (
              <div className="mini-list">
                {profiles.map((item) => {
                  const isActive = item.id === activeProfile?.id;
                  const itemSnapshot = item.readiness_snapshot || {};
                  return (
                    <div key={item.id}>
                      <strong>{isActive ? "Active now: " : "Saved profile: "}{profileName(item)}</strong>
                      <span>{profileRouteLine(item)} · {itemSnapshot.readiness_score ?? 0}/100</span>
                      <div className="actions compact-actions">
                        <button className={isActive ? "btn primary" : "btn"} type="button" onClick={() => chooseProfile(item)} disabled={isActive}>{isActive ? "Using this profile" : "Use this profile"}</button>
                        {!isActive ? <button className="btn" type="button" onClick={() => hideProfile(item)} disabled={archivingId === item.id || loading}>{archivingId === item.id ? "Hiding..." : "Hide old profile"}</button> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <article className="result-block soft">
                <h3>No profile list is visible yet</h3>
                <p>
                  Your account says it has {profileCount} profile{profileCount === 1 ? "" : "s"}, but the profile list did not load into the page. Click Refresh summary. If it still does not appear, open “Create or update profile” and save the correct current profile again.
                </p>
                <div className="actions">
                  <button className="btn primary" type="button" onClick={loadSummary} disabled={loading}>{loading ? "Refreshing..." : "Refresh summary"}</button>
                  <a className="btn" href="#profile-dashboard">Create or update profile</a>
                </div>
              </article>
            )}
          </article>

          <div className="mini-list">
            <div><strong>Active profile</strong><span>{profileName(activeProfile)}</span></div>
            <div><strong>Main goal</strong><span>{readableLabel(profileGoal(activeProfile))}</span></div>
            <div><strong>Route plan</strong><span>{activeProfile?.target_country || "Target country not set"} · {readableLabel(activeProfile?.route_category || profileGoal(activeProfile))}</span></div>
            <div><strong>Readiness</strong><span>{snapshot.readiness_score ?? 0} / 100 · {readableLabel(snapshot.readiness_level || "Not calculated")}</span></div>
            <div><strong>Session expires</strong><span>{formatDate(summary.session?.expires_at)}</span></div>
          </div>
        </>
      ) : null}

      <p className="form-status">{message}</p>
      <div className="actions">
        {summary ? <button className="btn" type="button" onClick={loadSummary} disabled={loading}>{loading ? "Refreshing..." : "Refresh summary"}</button> : <a className="btn primary" href="/login">Sign in with email</a>}
        {summary ? <a className="btn primary" href="#profile-chooser">Choose active profile</a> : null}
        <a className="btn primary" href="/route-checker">Check my route</a>
        <a className="btn" href="#profile-dashboard">Create or update profile</a>
        <a className="btn" href="/my-reports">My reports</a>
        <a className="btn" href="/saved-routes">Saved routes</a>
      </div>
    </section>
  );
}
