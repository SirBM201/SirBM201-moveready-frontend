export type PlatformModule = {
  slug: string;
  title: string;
  category: string;
  availability: "available" | "coming_soon" | "partner_approval_pending";
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
    availability: "available",
    summary: "Track official lottery, ballot, invitation-pool, quota, and capped visa opportunities with source-backed guidance and scam warnings.",
    readiness: "The official-opportunities page and API are live. The database-backed list activates fully after the opportunities SQL is run.",
    launchScope: "Opening dates, closing dates, country eligibility, result reminders, confirmation-number reminders, and official-link guidance.",
    href: "/opportunities",
  },
  {
    slug: "watchlist",
    title: "Route watchlist and alerts",
    category: "Opportunity monitoring",
    availability: "available",
    summary: "Follow routes and receive opt-in email, WhatsApp, Telegram, or in-app alerts when dates or requirements change.",
    readiness: "Users can save watchlist alert preferences now. Actual message sending remains provider-approval dependent.",
    launchScope: "Saved routes, alert preferences, reminder windows, notification logs, and WhatsApp template approval where required.",
    href: "/watchlist",
  },
  {
    slug: "documents",
    title: "Document readiness and name consistency",
    category: "Readiness",
    availability: "available",
    summary: "Check missing documents, passport validity, name mismatch, translation, notarization, apostille, and legalization needs.",
    readiness: "The readiness tools page includes live document and name checks through the backend.",
    launchScope: "Document upload, name comparison, route evidence checks, and readiness scoring.",
    href: "/readiness",
  },
  {
    slug: "funds",
    title: "Proof-of-funds planner",
    category: "Readiness",
    availability: "available",
    summary: "Compare available funds to route requirements, family size, currency, sponsor evidence, and large-deposit risk.",
    readiness: "The readiness tools page includes a live proof-of-funds planner through the backend.",
    launchScope: "Savings targets, bank statement maturity, sponsor plans, shortfall alerts, currency conversion, and evidence quality checks.",
    href: "/readiness",
  },
  {
    slug: "refusal-risk",
    title: "Refusal risk analyzer",
    category: "Risk review",
    availability: "available",
    summary: "Review weak application indicators and previous refusal reasons without promising approval.",
    readiness: "The readiness tools page includes a live refusal-risk screener through the backend.",
    launchScope: "Refusal-letter review, common refusal indicators, repair plans, and expert review add-ons.",
    href: "/readiness",
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
    availability: "partner_approval_pending",
    summary: "Coordinate trusted handling for passports, certificates, embassy submissions, and notarization/legalization pickups.",
    readiness: "The service request form is live for early interest while trusted provider onboarding is handled.",
    launchScope: "Courier partners, tracking, insurance options, destination handling rules, special instructions, and pricing.",
    href: "/platform/courier",
  },
  {
    slug: "insurance",
    title: "Insurance readiness and partners",
    category: "Execution services",
    availability: "available",
    summary: "Show travel, health, student, family, Schengen-style, and work-route insurance requirements.",
    readiness: "The insurance guide and backend insurance requirement endpoint are live. Partner quotes require approved providers.",
    launchScope: "Route-aware requirements, quote partners, comparison, coverage notes, and purchase handoff where approved.",
    href: "/insurance-guide",
  },
  {
    slug: "appointments",
    title: "Embassy and application appointment tracker",
    category: "Timeline",
    availability: "coming_soon",
    summary: "Track embassy, visa center, biometrics, document submission, passport collection, and deadline events.",
    readiness: "Users can request this service while manual timeline tracking and reminders are prepared.",
    launchScope: "Appointment dates, biometrics, document submission, collection, deadline reminders, and permitted availability monitoring.",
    href: "/platform/appointments",
  },
  {
    slug: "family-relocation",
    title: "Family relocation planner",
    category: "Readiness",
    availability: "coming_soon",
    summary: "Plan spouse, children, dependent documents, extra funds, accommodation, school, insurance, and arrival tasks.",
    readiness: "Family count already affects starter budget estimates in the route checker.",
    launchScope: "Per-family-member documents, dependent proof, funds adjustment, insurance, school planning, and arrival checklist.",
    href: "/platform/family-relocation",
  },
  {
    slug: "settlement",
    title: "Post-arrival settlement checklist",
    category: "Arrival",
    availability: "coming_soon",
    summary: "Continue after approval with airport pickup, SIM, bank, tax number, registration, housing, school, and transport tasks.",
    readiness: "Users can request post-arrival support while route-specific arrival checklists are prepared.",
    launchScope: "Arrival tasks, local partner services, reminders, family settlement needs, and location-specific guidance.",
    href: "/platform/settlement",
  },
  {
    slug: "partners",
    title: "Partner and expert review network",
    category: "Marketplace",
    availability: "partner_approval_pending",
    summary: "Connect users to vetted experts, couriers, insurers, translators, notaries, admission support, and settlement providers.",
    readiness: "The app has service request capture and an admin dashboard for reviewing provider/service interest.",
    launchScope: "Provider vetting, expert review, service requests, commission tracking, handoff notes, and user support workflow.",
    href: "/platform/partners",
  },
];

export function getPlatformModule(slug: string) {
  return platformModules.find((module) => module.slug === slug);
}
