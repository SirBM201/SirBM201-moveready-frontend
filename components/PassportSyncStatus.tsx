"use client";

import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api";

function readableDate(value: unknown) {
  if (!value) return "Not available yet";
  try {
    return new Date(String(value)).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return String(value);
  }
}

function runStatusText(lastRun: any) {
  if (!lastRun) return "No unattended run has been recorded yet";
  if (lastRun.status === "scheduled_sync_completed") {
    const rowText = Array.isArray(lastRun.row_counts)
      ? lastRun.row_counts.map((item: any) => `${item.country}: ${item.row_count} rows`).join(" · ")
      : "Completed";
    return rowText || "Completed";
  }
  if (lastRun.status === "scheduled_sync_failed") {
    return `Failed with ${lastRun.error_count || 0} recorded error(s)`;
  }
  return String(lastRun.status || "Status unavailable").replaceAll("_", " ");
}

export default function PassportSyncStatus() {
  const [status, setStatus] = useState<any | null>(null);
  const [message, setMessage] = useState("Loading the automatic refresh schedule...");

  useEffect(() => {
    let active = true;
    apiJson<any>("visa-power/provider/schedule/status", {
      useAuthToken: false,
      timeoutMs: 15000,
    })
      .then((data) => {
        if (!active) return;
        setStatus(data);
        setMessage("The overview database is refreshed by a protected unattended schedule; users do not have to open this page first.");
      })
      .catch((error: any) => {
        if (!active) return;
        setMessage(error?.message || "The automatic refresh schedule could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, []);

  const countries = Array.isArray(status?.scheduled_countries)
    ? status.scheduled_countries.join(", ")
    : "Nigeria during launch";
  const lastRun = status?.last_scheduled_run;

  return (
    <section className="section no-top-pad">
      <article className="result-block soft">
        <div className="panel-heading">
          <div>
            <p className="overline">Automatic database refresh</p>
            <h2>Weekly provider sync runs without waiting for a user visit.</h2>
          </div>
          <span className="status-dot">Cost-controlled</span>
        </div>
        <p>{message}</p>
        <div className="mini-list two-col-list">
          <div>
            <strong>Launch passport</strong>
            <span>{countries}</span>
          </div>
          <div>
            <strong>Scheduled weekday</strong>
            <span>{status?.sync_weekdays || "Friday"}</span>
          </div>
          <div>
            <strong>Next database refresh</strong>
            <span>{readableDate(status?.next_sync_due_at)}</span>
          </div>
          <div>
            <strong>Provider-call limit</strong>
            <span>{status?.max_countries_per_sync || 1} passport map call per scheduled run</span>
          </div>
          <div>
            <strong>Last unattended run</strong>
            <span>{runStatusText(lastRun)}</span>
          </div>
          <div>
            <strong>Last run time</strong>
            <span>{readableDate(lastRun?.created_at)}</span>
          </div>
        </div>
        <p className="form-status">
          Destination-specific checks use a separate seven-day cache, so repeatedly opening the same destination does not make a paid provider request every time.
        </p>
      </article>
    </section>
  );
}
