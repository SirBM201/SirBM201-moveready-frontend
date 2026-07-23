"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson, clearStoredAuthToken } from "@/lib/api";
import { readableLabel } from "@/lib/labels";
import { clearActiveProfile, getActiveProfileId, setActiveProfile } from "@/lib/profileStorage";

type AccountCounts = {
  profiles?: number;
  saved_routes?: number;
  watchlist?: number;
  timeline?: number;
  reports?: number;
  journey_plans?: number;
  readiness_checks?: number;
  commercial_quotes?: number;
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
  { key: "profiles", label: "Profiles", helper: "People and plans saved", href: "#profile-chooser" },
  { key: "saved_routes", label: "Saved routes", helper: "Routes to revisit", href: "/saved-routes" },
  { key: "watchlist", label: "Watchlist", helper: "Alerts you asked for", href: "/watchlist" },
  { key: "timeline", label: "Timeline", helper: "Dated actions", href: "/timeline" },
  { key: "reports", label: "Reports", helper: "Readiness reports", href: "/my-reports" },
  { key: "journey_plans", label: "Study and journey plans", helper: "Saved planning runs", href: "/journey-plans" },
  { key: "readiness_checks", label: "Readiness checks", helper: "Risk and evidence checks", href: "/readiness" },
  { key: "commercial_quotes", label: "Quotes", helper: "Scope and payment status", href: "/billing" },
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

function isClosedProfile(profile: AccountProfile) {
  return String(profile.status || "new").toLowerCase() === "closed";
}

function isBackendActive(profile?: AccountProfile | null) {
  return String(profile?.status || "").toLowerCase() === "active";
}

function usableProfiles(summary: AccountSummaryResponse | null) {
  return (summary?.sections?.profiles?.rows || []).filter((profile) => !isClosedProfile(profile));
}

function profileRouteLine(profile?: AccountProfile | null) {
  if (!profile) return "No profile selected yet";
  const target = profile.target_country || "Target country not set";
  const route = readableLabel(profile.route_category || profileGoal(profile));
  const created = profile.created_at ? `Saved ${formatDateTime(profile.created_at)}` : "Saved date not shown";
  return `${target} · ${route} · ${created}`;
}

function profileMoneyLine(profile?: AccountProfile | null) {
  if (!profile) return "Money, family count, and timeline not set";
  const amount = profile.available_funds_amount ?? 0;
  const currency = profile.available_funds_currency || "currency not set";
  const family = profile.family_members_count ?? 0;
  const months = profile.timeline_months ?? 0;
  return `${currency} ${Number(amount).toLocaleString()} · Family members: ${family} · Timeline: ${months} months`;
}

export default function AccountSummary() {
  const [summary, setSummary] = useState<AccountSummaryResponse | null>(null);
  const [activeProfileId, setActiveProfileId] = useState("");
  const [message, setMessage] = useState("Checking for a signed-in session...");
  const [loading, setLoading] = useState(true);
  const [archivingId, setArchivingId] = useState("");
  const [choosingId, setChoosingId] = useState("");

  async function loadSummary() {
    setLoading(true);
    setMessage("Loading account summary...");
    try {
      const data = await apiJson<AccountSummaryResponse>("account/summary", { timeoutMs: 20000 });
      const profiles = usableProfiles(data);
      const storedActiveId = getActiveProfileId();
      const backendActiveProfile = profiles.find((item) => isBackendActive(item));
      const chosenProfile = backendActiveProfile || profiles.find((item) => item.id === storedActiveId) || profiles[0] || data.latest_profile || null;
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
    void loadSummary();
  }, []);

  async function chooseProfile(profile: AccountProfile) {
    const email = summary?.session?.email || profile.email || "";
    const phone = profile.phone || "";
    if (!email && !phone) {
      setMessage("This profile cannot be selected because no matching email or phone was found.");
      return;
    }

    setChoosingId(profile.id);
    setMessage(`Saving ${profileName(profile)} as your active profile...`);
    try {
      await apiJson(`profiles/${profile.id}`, {
        method: "PATCH",
        body: { status: "active", email: email || undefined, phone: !email ? phone : undefined },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setActiveProfile(profile.id, profileName(profile));
      setActiveProfileId(profile.id);
      setMessage(`${profileName(profile)} is now your active profile. Route Checker, Saved Routes, Alerts, Reports, Planning, Timeline, Quotes, and Support will use this account context first.`);
      await loadSummary();
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.data?.error ? `Unable to use this profile: ${apiError.data.error}` : "Unable to save active profile right now.");
    } finally {
      setChoosingId("");
    }
  }

  function switchAccount() {
    clearStoredAuthToken();
    clearActiveProfile();
    setSummary(null);
    setActiveProfileId("");
    setMessage("Signed out on this browser. Opening login so you can use another email.");
    window.location.assign("/login");
  }

  async function hideProfile(profile: AccountProfile) {
    const email = summary?.session?.email || profile.email || "";
    const phone = profile.phone || "";
    if (!email && !phone) {
      setMessage("This profile cannot be hidden because no matching email or phone was found.");
      return;
    }

    const confirmHide = typeof window === "undefined" || window.confirm(`Hide old profile: ${profileName(profile)}? This only removes it from your active account list. It does not delete reports, plans, or quotes already created.`);
    if (!confirmHide) {
      setMessage("No profile was hidden.");
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
      if (profile.id === activeProfileId) {
        clearActiveProfile();
        setActiveProfileId("");
      }
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
  const activeProfile = profiles.find((item) => item.id === activeProfileId) || profiles.find((item) => isBackendActive(item)) || profiles[0] || summary?.latest_profile || null;
  const snapshot = activeProfile?.readiness_snapshot || {};
  const sessionEmail = summary?.session?.email || "Not signed in";

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
          ? "This is your account home. Pick one active profile first, then use it for route checks, reports, saved routes, alerts, timeline, planning history, quotes, and support requests."
          : "Email login helps MoveReady connect profiles, saved routes, reports, alerts, timelines, planning history, quotes, and service requests under one account."}
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

          <article className="result-block soft" style={{ marginTop: 16 }}>
            <div className="panel-heading">
              <div>
                <p className="overline">Use this first</p>
                <h3>Current active profile</h3>
              </div>
              <span className="status-dot">Used by route checker</span>
            </div>
            <div className="mini-list active-profile-summary">
              <div><strong>Signed-in email</strong><span>{sessionEmail}</span></div>
              <div><strong>Active profile</strong><span>{profileName(activeProfile)}</span></div>
              <div><strong>Main goal</strong><span>{readableLabel(profileGoal(activeProfile))}</span></div>
              <div><strong>Route plan</strong><span>{activeProfile?.target_country || "Target country not set"} · {readableLabel(activeProfile?.route_category || profileGoal(activeProfile))}</span></div>
              <div><strong>Money, family, timeline</strong><span>{profileMoneyLine(activeProfile)}</span></div>
              <div><strong>Readiness</strong><span>{snapshot.readiness_score ?? 0} / 100 · {readableLabel(snapshot.readiness_level || "Not calculated")}</span></div>
              <div><strong>Session expires</strong><span>{formatDate(summary.session?.expires_at)}</span></div>
            </div>
            <div className="actions compact-actions">
              <a className="btn primary" href="/route-checker">Check route with this profile</a>
              <a className="btn" href="#profile-chooser">Choose a different profile</a>
              <a className="btn" href="/journey-plans">Open plans</a>
              <a className="btn" href="/my-reports">Open reports</a>
              <a className="btn" href="/billing">Open quotes</a>
            </div>
          </article>

          <article className="result-block soft profile-chooser-panel" id="profile-chooser">
            <div className="panel-heading">
              <div>
                <p className="overline">Profile cleanup</p>
                <h3>Choose or hide saved profiles</h3>
              </div>
              <span className="status-dot">{profileCount} saved</span>
            </div>
            <p className="form-status">
              This list only shows profiles saved under <strong>{sessionEmail}</strong>. If PowerShell, another browser, or another tab is signed in with a different email, it will show a different profile count.
            </p>
            <p className="form-status">
              Use <strong>Use this profile</strong> for the profile MoveReady should use now. Use <strong>Hide old profile</strong> only for old test profiles you no longer want to see.
            </p>

            {profiles.length ? (
              <div className="mini-list profile-list">
                {profiles.length === 1 ? (
                  <div>
                    <strong>Only one profile is visible for this signed-in email.</strong>
                    <span>There is no old profile to hide on this account. Use this profile, or switch email account if your other test records belong to another email.</span>
                    <div className="actions compact-actions">
                      <button className="btn primary" type="button" onClick={() => chooseProfile(profiles[0])} disabled={choosingId === profiles[0].id || loading}>{choosingId === profiles[0].id ? "Saving..." : isBackendActive(profiles[0]) ? "Using this profile" : "Use this profile"}</button>
                      <a className="btn" href="/route-checker">Check route</a>
                      <button className="btn" type="button" onClick={switchAccount}>Switch email account</button>
                    </div>
                  </div>
                ) : (
                  profiles.map((item, index) => {
                    const isActive = item.id === activeProfile?.id;
                    const itemSnapshot = item.readiness_snapshot || {};
                    return (
                      <div className={isActive ? "active-profile-row" : ""} key={item.id}>
                        <strong>{isActive ? "Active now: " : `Profile ${index + 1}: `}{profileName(item)}</strong>
                        <span>{profileRouteLine(item)} · Readiness {itemSnapshot.readiness_score ?? 0}/100{isBackendActive(item) ? " · Saved as account active profile" : ""}</span>
                        <span>{profileMoneyLine(item)}</span>
                        <div className="actions compact-actions">
                          <button className={isActive ? "btn primary" : "btn"} type="button" onClick={() => chooseProfile(item)} disabled={choosingId === item.id || loading}>{choosingId === item.id ? "Saving..." : isActive ? "Using this profile" : "Use this profile"}</button>
                          {isActive ? <a className="btn" href="/route-checker">Check route with this</a> : null}
                          {!isActive ? <button className="btn" type="button" onClick={() => hideProfile(item)} disabled={archivingId === item.id || loading}>{archivingId === item.id ? "Hiding..." : "Hide old profile"}</button> : null}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <article className="result-block soft">
                <h3>No profile list is visible yet</h3>
                <p>
                  Your account says it has {profileCount} profile{profileCount === 1 ? "" : "s"}, but the profile list did not load into the page. Click Refresh summary. If it still does not appear, save the correct current profile again.
                </p>
                <div className="actions">
                  <button className="btn primary" type="button" onClick={loadSummary} disabled={loading}>{loading ? "Refreshing..." : "Refresh summary"}</button>
                  <a className="btn" href="#profile-dashboard">Create or update profile</a>
                </div>
              </article>
            )}
          </article>
        </>
      ) : null}

      <p className="form-status">{message}</p>
      <div className="actions">
        {summary ? <button className="btn" type="button" onClick={loadSummary} disabled={loading}>{loading ? "Refreshing..." : "Refresh summary"}</button> : <a className="btn primary" href="/login">Sign in with email</a>}
        {summary ? <a className="btn primary" href="#profile-chooser">Choose or hide profiles</a> : null}
        <a className="btn primary" href="/route-checker">Check my route</a>
        <a className="btn" href="#profile-dashboard">Create or update profile</a>
        <a className="btn" href="/journey-plans">My plans</a>
        <a className="btn" href="/my-reports">My reports</a>
        <a className="btn" href="/billing">My quotes</a>
        <a className="btn" href="/saved-routes">Saved routes</a>
        {summary ? <button className="btn" type="button" onClick={switchAccount}>Switch email account</button> : null}
      </div>
    </section>
  );
}
