import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sir-bm-201-moveready-frontend.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/dashboard",
        "/settings",
        "/activity",
        "/applications",
        "/application-alerts",
        "/my-reports",
        "/saved-routes",
        "/timeline",
        "/billing",
        "/support-center",
      ],
    },
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
    host: siteUrl,
  };
}
