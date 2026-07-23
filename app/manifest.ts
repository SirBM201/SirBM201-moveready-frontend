import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Project MoveReady",
    short_name: "MoveReady",
    description: "Source-backed relocation, visa, travel, evidence, application, and settlement readiness.",
    start_url: "/onboarding",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    categories: ["travel", "productivity", "education"],
    lang: "en",
  };
}
