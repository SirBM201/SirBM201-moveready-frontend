"use client";

import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api";

type RouteItem = {
  id?: string;
  route_code?: string;
  route_name?: string;
  route_category?: string;
  country_name?: string;
  risk_level?: string;
  source_confidence?: string;
  freshness_status?: string;
  summary?: string;
};

export default function LiveRouteGrid() {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [status, setStatus] = useState("Loading live routes...");

  useEffect(() => {
    let cancelled = false;

    apiJson<{ routes: RouteItem[] }>("relocation/routes", { timeoutMs: 15000 })
      .then((data) => {
        if (cancelled) return;
        setRoutes(data.routes || []);
        setStatus(data.routes?.length ? "Live database-backed routes" : "No routes found yet");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("Unable to load live routes. Check backend URL/env if this continues.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <p className="form-status">{status}</p>
      <div className="grid">
        {routes.map((route) => (
          <article className="card" key={route.id || route.route_code}>
            <h3>{route.route_name || "Route pending review"}</h3>
            <p>{route.summary || "Route summary pending admin review."}</p>
            <div className="badge-row">
              {route.country_name ? <span className="badge">{route.country_name}</span> : null}
              {route.route_category ? <span className="badge">{route.route_category}</span> : null}
              {route.risk_level ? <span className="badge">Risk: {route.risk_level}</span> : null}
              {route.source_confidence ? <span className="badge">Confidence: {route.source_confidence}</span> : null}
              {route.freshness_status ? <span className="badge">{route.freshness_status}</span> : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
