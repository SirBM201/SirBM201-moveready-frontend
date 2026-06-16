export const CONFIG = {
  apiBase: process.env.NEXT_PUBLIC_API_BASE || "",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Project MoveReady",
  appDescription:
    "Visa, relocation, document, funds, scholarship, insurance, and budget readiness in one source-backed workflow.",
  supportEmail: "support@example.com",
  features: {
    routeChecker: true,
    countryComparison: true,
    reportPreview: true,
    adminReview: true,
  },
};

export function getApiUrl(path: string): string {
  const base = CONFIG.apiBase.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
