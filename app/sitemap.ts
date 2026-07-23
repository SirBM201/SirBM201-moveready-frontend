import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://sir-bm-201-moveready-frontend.vercel.app").replace(/\/$/, "");

const publicRoutes = [
  "/",
  "/start",
  "/onboarding",
  "/decision-center",
  "/country-comparison",
  "/compare",
  "/route-checker",
  "/passport-index",
  "/visa-power",
  "/study-planner",
  "/trip-planner",
  "/journey-planner",
  "/evidence-pack",
  "/source-health",
  "/opportunities",
  "/services",
  "/providers",
  "/pricing",
  "/trust",
  "/sources",
  "/safety",
  "/faq",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/refund",
  "/data-deletion",
  "/deployment-status",
  "/platform",
  "/launch-readiness",
  "/partners/apply",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : route.includes("source") || route.includes("opportunit") ? "weekly" : "monthly",
    priority: route === "/" ? 1 : ["/start", "/onboarding", "/route-checker", "/passport-index", "/visa-power"].includes(route) ? 0.8 : 0.6,
  }));
}
