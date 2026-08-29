"use client";

import { useEffect, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";
import styles from "./V1LaunchJourney.module.css";

type Stage = { key: string; label: string; complete: boolean; href: string };
type Journey = {
  scope: "v1_launch_only";
  stages: Stage[];
  completed_stage_count: number;
  stage_count: number;
  progress_percent: number;
  next_action: { stage: string; title: string; summary: string; href: string };
  safety: { progress_is_record_based: boolean; eligibility_or_approval_inferred: boolean; automatic_external_action: boolean };
};

export default function V1LaunchJourney() {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    apiJson<{ ok: boolean; journey: Journey }>("jobs/v1-launch-journey", { timeoutMs: 25000 })
      .then((response) => setJourney(response.journey))
      .catch((error) => setSignedOut(error instanceof ApiError && error.status === 401));
  }, []);

  if (!journey && !signedOut) return null;

  if (signedOut) {
    return (
      <aside className={styles.shell} aria-label="V1 launch journey">
        <div><strong>V1 journey</strong><p>Sign in to see your saved Find → Qualify → Execute → Move progress.</p></div>
        <a className={styles.action} href="/auth/sign-in">Sign in</a>
      </aside>
    );
  }

  if (!journey) return null;
  return (
    <aside className={styles.shell} aria-label="V1 launch journey">
      <div className={styles.heading}>
        <div><strong>V1 journey</strong><p>{journey.completed_stage_count} of {journey.stage_count} recorded stages complete</p></div>
        <span>{journey.progress_percent}%</span>
      </div>
      <ol className={styles.stages}>
        {journey.stages.map((stage) => <li key={stage.key} data-complete={stage.complete}>{stage.complete ? "✓ " : ""}{stage.label}</li>)}
      </ol>
      <div className={styles.next}>
        <div><small>Next recorded action</small><strong>{journey.next_action.title}</strong><p>{journey.next_action.summary}</p></div>
        <a className={styles.action} href={journey.next_action.href}>Continue</a>
      </div>
      <p className={styles.safety}>Progress reflects saved records only. It does not infer eligibility, approval, or perform an external action.</p>
    </aside>
  );
}
