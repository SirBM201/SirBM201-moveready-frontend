"use client";

import { useEffect } from "react";

import { apiJson } from "@/lib/api";

type AlertCounts = {
  unread_alerts: number;
  unread_match_alerts?: number;
  unread_scan_issues?: number;
};

type OverviewCountsResponse = {
  counts: AlertCounts;
};

function formatCounter(counts: AlertCounts) {
  const matches = Number(counts.unread_match_alerts || 0);
  const scanIssues = Number(counts.unread_scan_issues || 0);

  if (matches || scanIssues) {
    return `${matches} ${matches === 1 ? "match" : "matches"} · ${scanIssues} ${scanIssues === 1 ? "scan issue" : "scan issues"}`;
  }

  const total = Number(counts.unread_alerts || 0);
  return `${total} unread`;
}

/**
 * Transitional presentation bridge for the job-automation alert header.
 *
 * The automation workspace owns its own overview request. The backend now exposes
 * separate match and scan-issue counters, so this bridge keeps the existing
 * workspace stable while presenting those counters in the alert header. It can
 * be removed once the workspace overview type is next refactored.
 */
export default function JobAutomationAlertCounterBridge() {
  useEffect(() => {
    let cancelled = false;

    async function refreshCounter() {
      try {
        const response = await apiJson<OverviewCountsResponse>("jobs/automation/overview", { timeoutMs: 30000 });
        if (cancelled) return;

        const badge = document.querySelector<HTMLElement>(
          ".jobs-automation-alerts .panel-heading > .status-dot",
        );
        if (!badge) return;

        const label = formatCounter(response.counts);
        badge.textContent = label;
        badge.setAttribute(
          "aria-label",
          `${response.counts.unread_alerts || 0} unread alerts: ${label}`,
        );
      } catch {
        // The workspace already owns error handling. Leave its total-unread
        // fallback untouched when the supplemental counter request fails.
      }
    }

    void refreshCounter();
    const timer = window.setInterval(refreshCounter, 30000);
    const onFocus = () => void refreshCounter();
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return null;
}
