"use client";

import { useEffect, useMemo, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type ActionItem = {
  kind: string;
  title: string;
  summary: string;
  priority: "low" | "medium" | "high" | "critical";
  href: string;
  reason?: string;
};

type EngineStatus = {
  key: string;
  phase: "FIND" | "QUALIFY" | "MOVE";
  title: string;
  state: "attention" | "active" | "ready" | "not_started" | "needs_assessment";
  summary: string;
  href: string;
  action_label: string;
  record_count: number;
  attention_count: number;
};

type CommandCenterResponse = {
  ok: boolean;
  contract_version?: string;
  primary_action?: ActionItem;
  engine_statuses?: EngineStatus[];
  action_count?: number;
  partial_errors?: Record<string, string>;
  safety_note?: string;
};

const phases = [
  { key: "FIND", title: "FIND", detail: "Opportunity and route" },
  { key: "QUALIFY", title: "QUALIFY", detail: "Passport, language, and funds" },
  { key: "MOVE", title: "MOVE", detail: "Documents and applications" },
] as const;

function readable(value?: string) {
  return String(value || "needs assessment").replaceAll("_", " ");
}

export default function DashboardCommandCenter() {
  const [data, setData] = useState<CommandCenterResponse | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "signed_out" | "older_contract" | "error">("loading");
  const [message, setMessage] = useState("Connecting your seven MoveReady engines...");

  async function load() {
    setState("loading");
    setMessage("Connecting your seven MoveReady engines...");
    try {
      const response = await apiJson<CommandCenterResponse>("account/action-center", {
        query: { limit: 250 },
        timeoutMs: 40000,
      });
      if (response.contract_version !== "b13-v1") {
        setData(null);
        setState("older_contract");
        setMessage("The dashboard is waiting for the B13 backend deployment. No older response will be treated as current.");
        return;
      }
      setData(response);
      setState("ready");
      const unavailable = Object.keys(response.partial_errors || {}).length;
      setMessage(unavailable
        ? `${unavailable} private source(s) are temporarily unavailable; available engines remain read-only.`
        : "One profile now drives one next action across FIND, QUALIFY, and MOVE.");
    } catch (error) {
      const apiError = error as ApiError;
      setData(null);
      if (apiError?.status === 401) {
        setState("signed_out");
        setMessage("Sign in with your verified MoveReady account to see a private next action.");
      } else {
        setState("error");
        setMessage("The private command center is unavailable. Your underlying workspace records were not changed.");
      }
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const grouped = useMemo(() => Object.fromEntries(
    phases.map((phase) => [phase.key, (data?.engine_statuses || []).filter((engine) => engine.phase === phase.key)]),
  ) as Record<(typeof phases)[number]["key"], EngineStatus[]>, [data]);

  const primary = data?.primary_action;

  return (
    <section className="section no-top-pad" id="command-center" aria-busy={state === "loading"}>
      <article className="result-block featured">
        <div className="panel-heading">
          <div>
            <p className="overline">B13 · Unified command center</p>
            <h2>Your next best action</h2>
          </div>
          <span className="status-dot">{state === "ready" ? "B13 connected" : readable(state)}</span>
        </div>

        {state !== "ready" || !primary ? (
          <div className="result-block soft">
            <h3>{state === "loading" ? "Loading your private account" : "Command center not ready"}</h3>
            <p aria-live="polite">{message}</p>
            <div className="actions">
              {state === "signed_out" && <a className="btn primary" href="/login">Sign in</a>}
              {state !== "loading" && <button className="btn" type="button" onClick={load}>Try again</button>}
              <a className="btn" href="/my-journey">Open My Journey</a>
            </div>
          </div>
        ) : (
          <>
            <div className="result-block" style={{ marginTop: 14 }}>
              <p className="overline">{primary.priority} priority · {primary.reason || "Next recorded step"}</p>
              <h2>{primary.title}</h2>
              <p>{primary.summary}</p>
              <div className="actions">
                <a className="btn primary" href={primary.href}>Do this next</a>
                <a className="btn" href="/action-center">Review all {data.action_count || 0} actions</a>
                <button className="btn" type="button" onClick={load}>Refresh</button>
              </div>
            </div>
            <p aria-live="polite">{message}</p>

            <div className="grid">
              {phases.map((phase) => (
                <article className="card" key={phase.key}>
                  <p className="overline">{phase.title}</p>
                  <h3>{phase.detail}</h3>
                  <div className="mini-list">
                    {grouped[phase.key].map((engine) => (
                      <div key={engine.key}>
                        <strong>{engine.title} · {readable(engine.state)}</strong>
                        <span>{engine.summary}</span>
                        <a className="text-link" href={engine.href}>{engine.action_label}</a>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <details className="result-block soft" style={{ marginTop: 14 }}>
              <summary><strong>Why these statuses are planning signals</strong></summary>
              <p>{data.safety_note}</p>
            </details>
          </>
        )}
      </article>
    </section>
  );
}
