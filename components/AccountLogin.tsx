"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { ApiError, apiJson, clearStoredAuthToken } from "@/lib/api";
import { clearActiveProfile } from "@/lib/profileStorage";

type RequestCodeResponse = {
  ok: boolean;
  email: string;
  expires_at?: string;
  delivery_status?: string;
  delivery_provider?: string;
  dev_code?: string;
};

type AuthHealth = {
  ok: boolean;
  email_delivery_enabled?: boolean;
  email_delivery_configured?: boolean;
  email_delivery_provider?: string;
  dev_code_allowed?: boolean;
  otp_expires_minutes?: number;
  request_limits?: {
    cooldown_seconds?: number;
    window_minutes?: number;
    max_per_email?: number;
    max_per_ip?: number;
  };
};

type Session = {
  id?: string;
  email?: string;
  status?: string;
  expires_at?: string;
  last_seen_at?: string;
};

type VerifyCodeResponse = {
  ok: boolean;
  session_token: string;
  session: Session;
};

type MeResponse = {
  ok: boolean;
  session: Session;
};

function storeSessionToken(token: string) {
  try {
    localStorage.setItem("moveready_access_token", token);
    localStorage.setItem("moveready_session_token", token);
  } catch {
    // Ignore browser storage failures.
  }
}

function sourcePage() {
  try {
    return typeof window !== "undefined" ? window.location.pathname : "/login";
  } catch {
    return "/login";
  }
}

function safeRedirectTarget() {
  try {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") || params.get("redirect") || "";
    if (next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/api/") && !next.startsWith("/login")) {
      return next;
    }
  } catch {
    // Fall through to the default account center.
  }
  return "/dashboard";
}

function formatDate(value?: string) {
  if (!value) return "Not set";
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function readable(value?: string) {
  return String(value || "not configured").replace(/_/g, " ");
}

export default function AccountLogin() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [authHealth, setAuthHealth] = useState<AuthHealth | null>(null);
  const [readinessLoading, setReadinessLoading] = useState(true);
  const [message, setMessage] = useState("Checking secure email login readiness...");
  const [loading, setLoading] = useState(false);
  const redirectStarted = useRef(false);

  const loginAvailable = Boolean(authHealth?.email_delivery_configured || authHealth?.dev_code_allowed);
  const readinessLabel = readinessLoading ? "Checking" : loginAvailable ? "Available" : "Controlled rollout";

  function redirectAfterLogin(reason: "verified" | "existing") {
    if (redirectStarted.current) return;
    redirectStarted.current = true;
    const target = safeRedirectTarget();
    if (reason === "existing") {
      setMessage(target === "/dashboard" ? "You are already signed in. Opening Account Center..." : "You are already signed in. Continuing to the requested page...");
    } else {
      setMessage(target === "/dashboard" ? "Login successful. Opening Account Center..." : "Login successful. Continuing to the requested page...");
    }
    window.setTimeout(() => {
      window.location.assign(target);
    }, 350);
  }

  async function loadReadiness(silent = false) {
    if (!silent) setMessage("Refreshing secure login readiness...");
    setReadinessLoading(true);
    try {
      const data = await apiJson<AuthHealth>("auth/health", { timeoutMs: 10000, useAuthToken: false });
      setAuthHealth(data);
      const ready = Boolean(data.email_delivery_configured || data.dev_code_allowed);
      if (!silent) {
        setMessage(ready
          ? "Secure login is ready. Enter your email to request a one-time code."
          : "Public email login is not active yet. MoveReady must verify its OTP email provider before accepting code requests.");
      } else if (!ready) {
        setMessage("Public email login is not active yet. MoveReady must verify its OTP email provider before accepting code requests.");
      } else {
        setMessage("Enter your email to request a secure one-time login code.");
      }
    } catch {
      setAuthHealth(null);
      setMessage("Unable to verify login readiness. Code requests remain disabled until the backend status can be confirmed.");
    } finally {
      setReadinessLoading(false);
    }
  }

  useEffect(() => {
    async function loadPage() {
      await loadReadiness(true);
      try {
        const data = await apiJson<MeResponse>("auth/me", { timeoutMs: 10000 });
        setSession(data.session);
        setEmail(data.session.email || "");
        redirectAfterLogin("existing");
      } catch {
        // No active session yet.
      }
    }
    void loadPage();
  }, []);

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!loginAvailable) {
      setMessage("Login code requests are not enabled until MoveReady verifies its email provider.");
      return;
    }
    if (!email.trim()) {
      setMessage("Enter your email address first.");
      return;
    }
    setLoading(true);
    setMessage("Requesting login code...");
    try {
      const data = await apiJson<RequestCodeResponse>("auth/request-code", {
        method: "POST",
        body: { email: email.trim(), source_page: sourcePage() },
        timeoutMs: 20000,
        useAuthToken: false,
      });
      if (data.dev_code) {
        setCode(data.dev_code);
        setMessage(`Development login code received. Code expires at ${formatDate(data.expires_at)}.`);
      } else {
        setMessage(`Login code sent through ${readable(data.delivery_provider)}. Check your email. Code expires at ${formatDate(data.expires_at)}.`);
      }
    } catch (error) {
      const apiError = error as ApiError;
      const retryAfter = apiError?.data?.retry_after_seconds;
      if (apiError?.status === 429 && retryAfter) {
        setMessage(`Too many login-code requests. Try again in about ${retryAfter} seconds.`);
      } else {
        setMessage(apiError?.data?.hint || apiError?.data?.error || apiError?.message || "Unable to request login code.");
      }
      void loadReadiness(true);
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !code.trim()) {
      setMessage("Enter your email and six-digit login code.");
      return;
    }
    setLoading(true);
    setMessage("Verifying login code...");
    try {
      const data = await apiJson<VerifyCodeResponse>("auth/verify-code", {
        method: "POST",
        body: { email: email.trim(), code: code.trim() },
        timeoutMs: 15000,
        useAuthToken: false,
      });
      storeSessionToken(data.session_token);
      setSession(data.session);
      redirectAfterLogin("verified");
    } catch (error) {
      const apiError = error as ApiError;
      const attempts = apiError?.data?.attempts_remaining;
      setMessage(attempts !== undefined ? `Invalid code. Attempts remaining: ${attempts}.` : apiError?.data?.error || apiError?.message || "Unable to verify login code.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    redirectStarted.current = false;
    setLoading(true);
    try {
      await apiJson("auth/logout", { method: "POST", timeoutMs: 10000 });
    } catch {
      // Still clear local token.
    } finally {
      clearStoredAuthToken();
      clearActiveProfile();
      try {
        localStorage.removeItem("moveready_session_token");
      } catch {
        // Ignore storage failures.
      }
      setSession(null);
      setCode("");
      setMessage("You have signed out on this device.");
      setLoading(false);
    }
  }

  return (
    <div className="live-workspace">
      <section className="workflow-panel live-form">
        <div className="panel-heading">
          <div>
            <p className="overline">Email login</p>
            <h2>Sign in to MoveReady</h2>
          </div>
          <span className="status-dot">{readinessLabel}</span>
        </div>

        <div className="result-block soft" style={{ marginBottom: 16 }}>
          <div className="mini-list">
            <div><strong>Email provider</strong><span>{readable(authHealth?.email_delivery_provider)}</span></div>
            <div><strong>Delivery configured</strong><span>{authHealth?.email_delivery_configured ? "Yes" : "No"}</span></div>
            <div><strong>Code validity</strong><span>{authHealth?.otp_expires_minutes ? `${authHealth.otp_expires_minutes} minutes` : "Not confirmed"}</span></div>
            <div><strong>Request protection</strong><span>{authHealth?.request_limits?.cooldown_seconds ? `${authHealth.request_limits.cooldown_seconds}-second resend cooldown` : "Backend-controlled"}</span></div>
          </div>
          <button className="btn" type="button" disabled={readinessLoading || loading} onClick={() => loadReadiness(false)}>{readinessLoading ? "Checking..." : "Refresh login status"}</button>
        </div>

        <form className="form-grid" onSubmit={requestCode}>
          <div className="field">
            <label htmlFor="login_email">Email address</label>
            <input id="login_email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </div>
          <button className="btn primary full" type="submit" disabled={loading || readinessLoading || !loginAvailable}>{loading ? "Please wait..." : loginAvailable ? "Request login code" : "Login email not active"}</button>
        </form>

        <form className="form-grid" onSubmit={verifyCode}>
          <div className="field">
            <label htmlFor="login_code">Login code</label>
            <input id="login_code" inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit code" />
          </div>
          <button className="btn full" type="submit" disabled={loading || code.length !== 6}>{loading ? "Verifying..." : "Verify and sign in"}</button>
        </form>

        <p className="form-status">{message}</p>
      </section>

      <section className="result-panel">
        <div className="result-stack">
          <article className="result-block featured">
            <p className="overline">Session status</p>
            <h2>{session ? "Signed in" : "Not signed in yet"}</h2>
            <p>
              Login connects profiles, saved routes, reports, alerts, timeline events, quotes, provider handoffs, and private support cases under one verified account.
            </p>
            {session ? (
              <div className="mini-list">
                <div><strong>Email</strong><span>{session.email || email}</span></div>
                <div><strong>Status</strong><span>{session.status || "active"}</span></div>
                <div><strong>Expires</strong><span>{formatDate(session.expires_at)}</span></div>
              </div>
            ) : null}
            <div className="actions">
              <a className="btn primary" href="/dashboard">Open Account Center</a>
              {session ? <button className="btn" type="button" onClick={logout} disabled={loading}>Sign out</button> : null}
            </div>
          </article>

          <article className="result-block">
            <p className="overline">Trust and privacy</p>
            <h2>What login should and should not do</h2>
            <div className="mini-list">
              <div><strong>Do</strong><span>Use verified identity to connect user-owned records safely.</span></div>
              <div><strong>Do</strong><span>Rate-limit code requests and expire previous unused codes.</span></div>
              <div><strong>Do</strong><span>Keep service requests, reports, handoffs, cases, and private user records protected.</span></div>
              <div><strong>Do not</strong><span>Ask users to send OTP codes to MoveReady staff or providers.</span></div>
              <div><strong>Do not</strong><span>Turn login into a promise of visa, admission, job, lottery, or ballot approval.</span></div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
