"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { ApiError, apiJson, clearStoredAuthToken } from "@/lib/api";
import { clearActiveProfile } from "@/lib/profileStorage";

type RequestCodeResponse = {
  ok: boolean;
  email: string;
  expires_at?: string;
  delivery_status?: string;
  dev_code?: string;
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

export default function AccountLogin() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [message, setMessage] = useState("Enter your email to request a secure login code.");
  const [loading, setLoading] = useState(false);
  const redirectStarted = useRef(false);

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

  useEffect(() => {
    async function loadSession() {
      try {
        const data = await apiJson<MeResponse>("auth/me", { timeoutMs: 10000 });
        setSession(data.session);
        setEmail(data.session.email || "");
        redirectAfterLogin("existing");
      } catch {
        // No active session yet.
      }
    }
    loadSession();
  }, []);

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        timeoutMs: 15000,
        useAuthToken: false,
      });
      if (data.dev_code) {
        setCode(data.dev_code);
        setMessage(`Development login code received. Code expires at ${formatDate(data.expires_at)}.`);
      } else if (data.delivery_status === "email_delivery_not_configured") {
        setMessage("Login code was created, but email delivery is not configured yet. Connect an approved email provider before public login.");
      } else {
        setMessage(`Login code requested. Check your email. Code expires at ${formatDate(data.expires_at)}.`);
      }
    } catch (error) {
      const apiError = error as ApiError;
      setMessage(apiError?.data?.hint || apiError?.message || "Unable to request login code.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !code.trim()) {
      setMessage("Enter your email and login code.");
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
      setMessage(attempts !== undefined ? `Invalid code. Attempts remaining: ${attempts}.` : apiError?.message || "Unable to verify login code.");
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
          <span className="status-dot">Available now</span>
        </div>

        <form className="form-grid" onSubmit={requestCode}>
          <div className="field">
            <label htmlFor="login_email">Email address</label>
            <input id="login_email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </div>
          <button className="btn primary full" type="submit" disabled={loading}>{loading ? "Please wait..." : "Request login code"}</button>
        </form>

        <form className="form-grid" onSubmit={verifyCode}>
          <div className="field">
            <label htmlFor="login_code">Login code</label>
            <input id="login_code" inputMode="numeric" value={code} onChange={(event) => setCode(event.target.value)} placeholder="6-digit code" />
          </div>
          <button className="btn full" type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify and sign in"}</button>
        </form>

        <p className="form-status">{message}</p>
      </section>

      <section className="result-panel">
        <div className="result-stack">
          <article className="result-block featured">
            <p className="overline">Session status</p>
            <h2>{session ? "Signed in" : "Not signed in yet"}</h2>
            <p>
              Login connects profiles, saved routes, reports, alerts, timeline events, and service requests under one verified account.
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
              <div><strong>Do</strong><span>Keep service requests, reports, and private user records protected.</span></div>
              <div><strong>Do not</strong><span>Turn login into a promise of visa, admission, job, lottery, or ballot approval.</span></div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
