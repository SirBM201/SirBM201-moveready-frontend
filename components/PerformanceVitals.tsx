"use client";

import { useReportWebVitals } from "next/web-vitals";

type MetricPayload = {
  name: string;
  value: number;
  rating: string;
  delta: number;
  id: string;
  navigationType?: string;
};

export default function PerformanceVitals() {
  useReportWebVitals((metric) => {
    const payload: MetricPayload = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    };
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/performance-vitals", new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch("/api/performance-vitals", {
      method: "POST",
      body,
      headers: { "content-type": "application/json" },
      keepalive: true,
    }).catch(() => undefined);
  });
  return null;
}
