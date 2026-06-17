export type PlatformModule = {
  slug: string;
  title: string;
  category: string;
  availability: "available" | "coming_soon" | "partner_approval";
  summary: string;
  readiness: string;
  launchScope: string;
  href: string;
};

export const platformModules: PlatformModule[] = [
  {
    slug: "opportunities",
    title: "Official ballots and quota opportunities",
    category: "Opportunity monitoring",
    availability: "coming_soon",
    summary: "Track official lottery, ballot, invitation-pool, quota, and capped visa opportunities with source-backed guidance and scam warnings.",
    readiness: "The workspace is prepared for official-source monitoring and route alerts.",
    launchScope: "Opening dates, closing dates, country eligibility, result reminders, confirmation-number reminders, and official-link guidance.",
    href: "/platform/opportunities",
  },
  {
    slug: "watchlist",
    title: "Route watchlist and alerts",
    category: "Opportunity monitoring",
    availability: "coming_soon",
    summary: "Follow routes and receive opt-in email, WhatsApp, Telegram, or in-app alerts when dates or requirements change.",
    readiness: "The product surface is ready for user opt-in and notification preferences.",
    launchScope: "Saved routes, alert preferences, reminder windows, notification logs, and WhatsApp template approval where required.",
    href: "/platform/watchlist",
  },
  {
    slug: "documents",
    title: "Document readiness and name consistency",
    category: "Readiness",
    availability: "coming_soon",
    summary: "Check missing documents, passport validity, name mismatch, translation, notarization, apostille, and legalization needs.",
    readiness: "Route-level checklists are already supported by the live MVP.",
    launchScope: "Document upload, name comparison, scanner rules, route evidence checks, and readiness scoring.",
    href: "/platform/documents",
  },
  {
    slug: "funds",
    title: "Proof-of-funds planner",
    category: "Readiness",
    availability: "coming_soon",
    summary: "Compare available funds to route requirements, family size, currency, sponsor evidence, and large-deposit risk.",
    readiness: "Starter budget estimates are already supported by the live MVP.",
    launchScope: "Savings targets, bank statement maturity, sponsor plans, shortfall alerts, currency conversion, and evidence quality checks.",
    href: "/platform/funds",
  },
  {
    slug: "refusal-risk",
    title: "Refusal risk analyzer",
    category: "Risk review",
    availability: "coming_soon",
    summary: "Review weak application indicators and previous refusal reasons without promising approval.",
    readiness: "Risk labels are already used on source-backed route pages and readiness reports.",
    launchScope: "Refusal-letter review, common refusal indicators, repair plans, and expert review add-ons.",
    href: "/platform/refusal-risk",
  },
  {
    slug: "legalization",
    title: "Notarization, apostille, and legalization",
    category: "Execution services",
    availability: "coming_soon",
    summary: "Guide document authentication flows by issuing country, receiving country, document type, and route purpose.",
    readiness: "Route document notes can already show legalization requirements where official sources confirm them.",
    launchScope: "Service requests, provider routing, translation support, document pickup, status tracking, and user instructions.",
    href: "/platform/legalization",
  },
  {
    slug: "courier",
    title: "Passport and document courier",
    category: "Execution services",
    availability: "partner_approval",
    summary: "Coordinate trusted handling for passports, certificates, embassy submissions, and notarization/legalization pickups.",
    readiness: "The service slot is prepared for trusted provider onboarding.",
    launchScope: "Courier partners, tracking, insurance options, destination handling rules, special instructions, and pricing.",
    href: "/platform/courier",
  },
  {
    slug: "insurance",
    title: "Insurance readiness and partners",
    category: "Execution services",
    availability: "coming_soon",
    summary: "Show travel, health, student, family, Schengen-style, and work-route insurance requirements.",
    readiness: "Insurance requirement records are already supported by the backend.",
    launchScope: "Route-aware requirements, quote partners, comparison, coverage notes, and purchase handoff where approved.",
    href: "/platform/insurance",
  },
  {
    slug: "appointments",
    title: "Embassy and application appointment tracker",
    category: "Timeline",
    availability: "coming_soon",
    summary: "Track embassy, visa center, biometrics, document submission, passport collection, and deadline events.",
    readiness: "The first version can start with manual timelines and user reminders.",
    launchScope: "Appointment dates, biometrics, document submission, collection, deadline reminders, and permitted availability monitoring.",
    href: "/platform/appointments",
  },
  {
    slug: "family-relocation",
    title: "Family relocation planner",
    category: "Readiness",
    availability: "coming_soon",
    summary: "Plan spouse, children, dependent documents, extra funds, accommodation, school, insurance, and arrival tasks.",
    readiness: "Family count already affects starter budget estimates.",
    launchScope: "Per-family-member documents, dependent proof, funds adjustment, insurance, school planning, and arrival checklist.",
    href: "/platform/family-relocation",
  },
  {
    slug: "settlement",
    title: "Post-arrival settlement checklist",
    category: "Arrival",
    availability: "coming_soon",
    summary: "Continue after approval with airport pickup, SIM, bank, tax number, registration, housing, school, and transport tasks.",
    readiness: "The service flow is prepared for route-specific arrival checklists.",
    launchScope: "Arrival tasks, local partner services, reminders, family settlement needs, and location-specific guidance.",
    href: "/platform/settlement",
  },
  {
    slug: "partners",
    title: "Partner and expert review network",
    category: "Marketplace",
    availability: "partner_approval",
    summary: "Connect users to vetted experts, couriers, insurers, translators, notaries, admission support, and settlement providers.",
    readiness: "The app is structured for provider onboarding and service requests.",
    launchScope: "Provider vetting, expert review, service requests, commission tracking, handoff notes, and user support workflow.",
    href: "/platform/partners",
  },
];

export function getPlatformModule(slug: string) {
  return platformModules.find((module) => module.slug === slug);
}
