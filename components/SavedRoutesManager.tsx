"use client";

import { FormEvent, useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type SavedRoute = {
  id: string;
  save_type: string;
  saved_title: string;
  route_code?: string | null;
  country_code?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  current_country?: string | null;
  target_country?: string | null;
  main_goal?: string | null;
  route_category?: string | null;
  notes?: string | null;
  notify_on_changes?: boolean;
  status?: string;
  created_at?: string;
};

type Profile = {
  id?: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  current_country?: string | null;
  target_country?: string | null;
  main_goal?: string | null;
  route_category?: string | null;
  timeline_months?: number | null;
  family_members_count?: number | null;
  available_funds_amount?: number | null;
  available_funds_currency?: string | null;
  has_previous_refusal?: boolean;
  preferred_contact_channel?: string | null;
};

type GeneratedReport = {
  report_ref?: string;
  report_title?: string;
  stored?: boolean;
};

type AccountSummary = {
  ok: boolean;
  session?: { email?: string };
  latest_profile?: Profile | null;
  sections?: {
    saved_routes?: {
      rows?: SavedRoute[];
      count?: number;
    };
  };
};

const defaultForm = {
  save_type: "route",
  saved_title: "Estonia startup founder pathway",
  route_code: "startup-founder",
  country_code: "EE",
  full_name: "",
  email: "",
  phone: "",
  current_country: "Kuwait",
  target_country: "Estonia",
  main_goal: "startup",
  route_category: "startup",
  notes: "",
};

function sourcePage() {
  try {
    return typeof window !== "undefined" ? window.location.pathname : "/saved-routes";
  } catch {
    return "/saved-routes";
  }
}

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function cleanNumber(value: unknown, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function routeMainGoal(route: SavedRoute, profile: Profile | null) {
  return route.main_goal || route.route_category || profile?.main_goal || profile?.route_category || "relocation";
}

export default function SavedRoutesManager() {
  const [form, setForm] = useState(defaultForm);
  const [notifyOnChanges, setNotifyOnChanges] = useState(true);
  const [consent, setConsent] = useState(false);
  const [lookupContact, setLookupContact] = useState("");
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [message, setMessage] = useState("Loading verified saved routes if you are signed in...");
  const [loading, setLoading] = useState(false);
  const [accountEmail, setAccountEmail] = useState("");
  const [latestProfile, setLatestProfile] = useState<Profile | null>(null);
  const [reportingRouteId, setReportingRouteId] = useState("");
  const [generatedRefs, setGeneratedRefs] = useState<Record<string, string>>({});

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function loadVerifiedRoutes(silent = false) {
    if (!silent) {
      setLoading(true);
      setMessage("Loading routes from your verified account...");
    }
    try {
      const data = await apiJson<AccountSummary>("account/summary", { timeoutMs: 15000 });
      const rows = data.sections?.saved_routes?.rows || [];
      const email = data.session?.email || "";
      const profile = data.latest_profile || null;
      setSavedRoutes(rows);
      setAccountEmail(email);
      setLatestProfile(profile);
      setLookupContact(email);
      if (email) setForm((current) => ({ ...current, email }));
      setMessage(rows.length ? "Verified account saved routes loaded." : "No saved routes are connected to this verified account yet.");
    } catch {
      if (!silent) setMessage("Sign in first, or use email/phone lookup below.");
      if (silent) setMessage("Save a route or load routes by email/phone.");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    loadVerifiedRoutes(true);
  }, []);

  async function saveRoute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const contactEmail = form.email.trim() || accountEmail;
    if (!contactEmail && !form.phone.trim()) {
      setMessage("Enter an email or phone number, or sign in with email OTP first.");
      return;
    }
    if (!consent) {
      setMessage("Confirm contact consent before saving.");
      return;
    }

    setLoading(true);
    setMessage("Saving route...");
    try {
      const data = await apiJson<{ saved_route: SavedRoute }>("saved-routes", {
        method: "POST",
        body: {
          ...form,
          email: contactEmail,
          notify_on_changes: notifyOnChanges,
          consent_to_contact: consent,
          source_page: sourcePage(),
        },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setSavedRoutes((current) => [data.saved_route, ...current.filter((item) => item.id !== data.saved_route.id)]);
      setLookupContact(data.saved_route.email || data.saved_route.phone || "");
      setMessage(accountEmail ? "Route saved to your verified account." : "Route saved. You can retrieve it later with the same email or phone.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 503 ? "Unable to save route. Confirm the saved-routes migration has been run and backend redeployed." : "Unable to save route.");
    } finally {
      setLoading(false);
    }
  }

  async function loadRoutes() {
    const contact = lookupContact.trim();
    if (!contact) {
      await loadVerifiedRoutes(false);
      return;
    }

    setLoading(true);
    setMessage("Loading saved routes...");
    try {
      const isEmail = contact.includes("@");
      const data = await apiJson<{ saved_routes: SavedRoute[] }>("saved-routes", {
        query: isEmail ? { email: contact, status: "active" } : { phone: contact, status: "active" },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setSavedRoutes(data.saved_routes || []);
      setMessage(data.saved_routes?.length ? "Saved routes loaded." : "No active saved routes found.");
    } catch {
      setMessage("Unable to load saved routes.");
    } finally {
      setLoading(false);
    }
  }

  async function generateReportFromRoute(route: SavedRoute) {
    const email = route.email || accountEmail || latestProfile?.email || "";
    const phone = route.phone || latestProfile?.phone || "";
    if (!email && !phone) {
      setMessage("Sign in or attach an email/phone to this saved route before generating a report.");
      return;
    }

    setReportingRouteId(route.id);
    setMessage(`Generating readiness report for ${route.saved_title}...`);
    try {
      const mainGoal = routeMainGoal(route, latestProfile);
      const data = await apiJson<{ report: GeneratedReport }>("relocation/reports", {
        method: "POST",
        body: {
          full_name: route.full_name || latestProfile?.full_name || "",
          email,
          phone,
          preferred_contact_channel: latestProfile?.preferred_contact_channel || "email",
          consent_to_contact: true,
          goal: mainGoal,
          main_goal: mainGoal,
          route_category: route.route_category || latestProfile?.route_category || mainGoal,
          current_country: route.current_country || latestProfile?.current_country || "",
          target_country: route.target_country || latestProfile?.target_country || "",
          available_funds_amount: cleanNumber(latestProfile?.available_funds_amount, 0),
          available_funds_currency: latestProfile?.available_funds_currency || "EUR",
          family_members_count: cleanNumber(latestProfile?.family_members_count, 0),
          timeline_months: cleanNumber(latestProfile?.timeline_months, 0),
          has_previous_refusal: Boolean(latestProfile?.has_previous_refusal),
          source_page: sourcePage(),
          metadata: {
            saved_route_id: route.id,
            saved_route_title: route.saved_title,
            generated_from: "saved_routes_page",
            report_basis: latestProfile ? "saved_route_plus_latest_profile" : "saved_route_only",
          },
        },
        timeoutMs: 20000,
        useAuthToken: false,
      });
      const ref = data.report?.report_ref || "";
      if (ref) setGeneratedRefs((current) => ({ ...current, [route.id]: ref }));
      setMessage(ref ? `Readiness report generated and saved. Reference: ${ref}. Open My Reports to review it.` : "Readiness report generated and saved. Open My Reports to review it.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.data?.error ? `Unable to generate report: ${apiError.data.error}` : "Unable to generate report from this saved route.");
    } finally {
      setReportingRouteId("");
    }
  }

  async function archiveRoute(route: SavedRoute) {
    const contact = route.email || route.phone || lookupContact || accountEmail;
    if (!contact) {
      setMessage("Unable to archive without the original contact or verified session.");
      return;
    }

    setLoading(true);
    try {
      const isEmail = contact.includes("@");
      await apiJson(`saved-routes/${route.id}`, {
        method: "PATCH",
        body: { status: "archived", email: isEmail ? contact : undefined, phone: !isEmail ? contact : undefined },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      setSavedRoutes((current) => current.filter((item) => item.id !== route.id));
      setMessage("Saved route archived.");
    } catch {
      setMessage("Unable to archive saved route.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="live-workspace">
      <form className="workflow-panel live-form" onSubmit={saveRoute}>
        <div className="panel-heading">
          <div>
            <p className="overline">Saved routes</p>
            <h2>Save a route or opportunity</h2>
          </div>
          <span className="status-dot">{accountEmail ? "Verified" : "Available"}</span>
        </div>
        {accountEmail ? <p className="form-status">Signed in as {accountEmail}. New saved routes will be connected to this verified account.</p> : null}

        <div className="form-grid two-col">
          <div className="field"><label htmlFor="save_type">Save type</label><select id="save_type" value={form.save_type} onChange={(event) => update("save_type", event.target.value)}><option value="route">Route</option><option value="opportunity">Opportunity</option><option value="scholarship">Scholarship</option><option value="country">Country</option><option value="service">Service</option></select></div>
          <div className="field"><label htmlFor="saved_title">Title</label><input id="saved_title" value={form.saved_title} onChange={(event) => update("saved_title", event.target.value)} /></div>
          <div className="field"><label htmlFor="route_code">Route code</label><input id="route_code" value={form.route_code} onChange={(event) => update("route_code", event.target.value)} /></div>
          <div className="field"><label htmlFor="country_code">Country code</label><input id="country_code" value={form.country_code} onChange={(event) => update("country_code", event.target.value.toUpperCase())} /></div>
          <div className="field"><label htmlFor="full_name">Full name</label><input id="full_name" value={form.full_name} onChange={(event) => update("full_name", event.target.value)} /></div>
          <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder={accountEmail || "you@example.com"} /></div>
          <div className="field"><label htmlFor="phone">WhatsApp / phone</label><input id="phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} /></div>
          <div className="field"><label htmlFor="current_country">Current country</label><input id="current_country" value={form.current_country} onChange={(event) => update("current_country", event.target.value)} /></div>
          <div className="field"><label htmlFor="target_country">Target country</label><input id="target_country" value={form.target_country} onChange={(event) => update("target_country", event.target.value)} /></div>
          <div className="field"><label htmlFor="main_goal">Main goal</label><input id="main_goal" value={form.main_goal} onChange={(event) => update("main_goal", event.target.value)} /></div>
          <div className="field"><label htmlFor="route_category">Route category</label><input id="route_category" value={form.route_category} onChange={(event) => update("route_category", event.target.value)} /></div>
          <div className="field"><label htmlFor="notes">Notes</label><input id="notes" value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Why this route matters" /></div>
        </div>

        <label className="checkbox-field"><input type="checkbox" checked={notifyOnChanges} onChange={(event) => setNotifyOnChanges(event.target.checked)} /><span>Notify me when important route details change</span></label>
        <label className="checkbox-field"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I agree that MoveReady may contact me about this saved route.</span></label>
        <button className="btn primary full" type="submit" disabled={loading}>{loading ? "Saving..." : "Save route"}</button>
        <p className="form-status">{message}</p>
      </form>

      <section className="result-panel">
        <article className="result-block featured">
          <p className="overline">Retrieve saved routes</p>
          <h2>Load your route list</h2>
          <div className="form-grid two-col">
            <div className="field"><label htmlFor="lookup_contact">Email or phone</label><input id="lookup_contact" value={lookupContact} onChange={(event) => setLookupContact(event.target.value)} placeholder="you@example.com or +965..." /></div>
            <button className="btn primary" type="button" onClick={loadRoutes} disabled={loading}>{loading ? "Loading..." : "Load saved routes"}</button>
          </div>
          <div className="actions">
            <button className="btn" type="button" onClick={() => loadVerifiedRoutes(false)} disabled={loading}>{loading ? "Loading..." : "Load my verified routes"}</button>
          </div>
        </article>

        {savedRoutes.length ? (
          <div className="result-stack compact-stack">
            {savedRoutes.map((route) => (
              <article className="result-block" key={route.id}>
                <div className="panel-heading">
                  <div>
                    <p className="overline">{route.save_type}</p>
                    <h2>{route.saved_title}</h2>
                  </div>
                  <span className="status-dot">{route.status || "active"}</span>
                </div>
                <div className="badge-row">
                  {route.target_country ? <span className="badge">Target: {route.target_country}</span> : null}
                  {route.route_category ? <span className="badge">Route: {route.route_category}</span> : null}
                  {route.country_code ? <span className="badge">{route.country_code}</span> : null}
                  {route.notify_on_changes ? <span className="badge">Monitoring requested</span> : null}
                  <span className="badge">{formatDate(route.created_at)}</span>
                </div>
                {route.notes ? <p>{route.notes}</p> : null}
                {generatedRefs[route.id] ? <p className="form-status">Generated report: {generatedRefs[route.id]}</p> : null}
                <div className="actions">
                  <button className="btn primary" type="button" onClick={() => generateReportFromRoute(route)} disabled={reportingRouteId === route.id || loading}>{reportingRouteId === route.id ? "Generating..." : "Generate report"}</button>
                  <a className="btn" href={`/watchlist?type=route&route=${encodeURIComponent(route.route_code || route.saved_title)}`}>Create alert</a>
                  <a className="btn" href="/my-reports">My reports</a>
                  <button className="btn" type="button" onClick={() => archiveRoute(route)} disabled={loading}>Archive</button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
