"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type Preferences = {
  onboarding_status?: string;
  onboarding_step?: string;
};

type AccountSummary = {
  ok: boolean;
  counts?: Record<string, number>;
};

type ApplicationAlertResponse = {
  ok: boolean;
  alert_count?: number;
};

type Step = {
  key: string;
  number: number;
  title: string;
  detail: string;
  href: string;
  action: string;
  complete: boolean;
};

export default function GuidedOnboarding() {
  const [preferences, setPreferences] = useState<Preferences>({ onboarding_status: "not_started", onboarding_step: "profile" });
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [applicationAlerts, setApplicationAlerts] = useState(0);
  const [message, setMessage] = useState("Checking your verified account progress...");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setMessage("Checking profiles, routes, evidence, applications, and alerts...");
    try {
      const [preferenceResponse, accountResponse, alertResponse] = await Promise.all([
        apiJson<{ ok: boolean; preferences: Preferences }>("account/preferences", { timeoutMs: 20000 }),
        apiJson<AccountSummary>("account/summary", { timeoutMs: 30000 }),
        apiJson<ApplicationAlertResponse>("applications/alerts", { timeoutMs: 20000 }).catch(() => ({ ok: false, alert_count: 0 })),
      ]);
      setPreferences(preferenceResponse.preferences || {});
      setCounts(accountResponse.counts || {});
      setApplicationAlerts(alertResponse.alert_count || 0);
      setMessage("Guided setup progress loaded.");
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.status === 401
        ? "Sign in with your verified account to save guided setup progress."
        : "Guided setup is waiting for migration 030 and the latest backend deployment.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const steps: Step[] = useMemo(() => [
    {
      key: "profile",
      number: 1,
      title: "Create one active relocation profile",
      detail: "Record your current country, target country, goal, budget, family size, and timeline once.",
      href: "/dashboard#profile-dashboard",
      action: "Create or review profile",
      complete: (counts.profiles || 0) > 0,
    },
    {
      key: "route",
      number: 2,
      title: "Check and save a serious route",
      detail: "Compare official-source-backed options, run the route checker, and save only routes you may genuinely pursue.",
      href: "/route-checker",
      action: "Check a route",
      complete: (counts.saved_routes || 0) > 0 || (counts.readiness_checks || 0) > 0,
    },
    {
      key: "evidence",
      number: 3,
      title: "Organize evidence metadata",
      detail: "Record expiry, translation, legalization, readiness, and missing categories without uploading raw documents.",
      href: "/evidence-pack",
      action: "Build evidence pack",
      complete: (counts.evidence_documents || 0) > 0 || (counts.evidence_packs || 0) > 0,
    },
    {
      key: "application",
      number: 4,
      title: "Open an application case when execution starts",
      detail: "Connect the real route, authority, evidence, appointment, deadline, fee, source, and decision history.",
      href: "/applications",
      action: "Open Application Center",
      complete: (counts.application_cases || 0) > 0,
    },
    {
      key: "alerts",
      number: 5,
      title: "Review alert and reminder controls",
      detail: "Keep in-app deadline, source, document-expiry, and opportunity alerts enabled only for the items you want to monitor.",
      href: "/settings",
      action: "Review alert settings",
      complete: (counts.watchlist || 0) > 0 || applicationAlerts > 0 || preferences.onboarding_step === "completed",
    },
  ], [counts, applicationAlerts, preferences]);

  const completed = steps.filter((step) => step.complete).length;
  const nextStep = steps.find((step) => !step.complete) || steps[steps.length - 1];
  const progress = Math.round((completed / steps.length) * 100);

  async function saveProgress(status: string, step: string) {
    setMessage("Saving guided setup progress...");
    try {
      const response = await apiJson<{ ok: boolean; preferences: Preferences }>("account/preferences", {
        method: "PUT",
        body: { onboarding_status: status, onboarding_step: step },
        timeoutMs: 20000,
      });
      setPreferences(response.preferences || { onboarding_status: status, onboarding_step: step });
      setMessage(status === "completed" ? "Guided setup marked complete." : status === "skipped" ? "Guided setup skipped. You can return at any time." : "Guided setup progress saved.");
    } catch (error) {
      setMessage(`Unable to save guided setup progress: ${(error as ApiError)?.message || "unknown error"}`);
    }
  }

  async function continueSetup() {
    await saveProgress(completed === steps.length ? "completed" : "in_progress", completed === steps.length ? "completed" : nextStep.key);
    window.location.href = nextStep.href;
  }

  return (
    <div className="result-stack">
      <article className="result-block featured">
        <div className="panel-heading">
          <div>
            <p className="overline">Guided account setup</p>
            <h2>{completed} of {steps.length} foundations completed</h2>
          </div>
          <span className="status-dot">{progress}%</span>
        </div>
        <div aria-label={`Setup progress ${progress}%`} style={{ height: 12, borderRadius: 999, background: "rgba(15, 23, 42, 0.12)", overflow: "hidden", margin: "14px 0" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "currentColor", opacity: 0.75 }} />
        </div>
        <p>{message}</p>
        <div className="actions">
          <button className="btn primary" type="button" onClick={continueSetup} disabled={loading}>{completed === steps.length ? "Confirm setup complete" : `Continue with step ${nextStep.number}`}</button>
          <button className="btn" type="button" onClick={() => saveProgress("skipped", nextStep.key)}>Skip guided setup</button>
          <button className="btn" type="button" onClick={load} disabled={loading}>{loading ? "Checking..." : "Refresh progress"}</button>
        </div>
      </article>

      <section className="grid">
        {steps.map((step) => (
          <article className={`card ${step.complete ? "soft" : ""}`} key={step.key}>
            <p className="overline">Step {step.number} · {step.complete ? "Completed" : "Next action"}</p>
            <h3>{step.title}</h3>
            <p>{step.detail}</p>
            <a className={step.complete ? "btn" : "btn primary"} href={step.href}>{step.complete ? "Review" : step.action}</a>
          </article>
        ))}
      </section>

      <article className="result-block soft">
        <p className="overline">Important boundary</p>
        <p>Completing these steps does not mean a visa, admission, residence permit, job, booking, boarding, entry, refund, or provider outcome is guaranteed. Every active route and application still requires current official-source confirmation.</p>
      </article>
    </div>
  );
}
