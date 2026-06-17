export type PlatformModule = {
  slug: string;
  title: string;
  category: string;
  phase: string;
  status: "live" | "planned" | "partner_pending";
  summary: string;
  now: string;
  later: string;
  href: string;
};

export const platformModules: PlatformModule[] = [
  {
    slug: "opportunities",
    title: "Official ballots and quota opportunities",
    category: "Opportunity monitoring",
    phase: "Phase 2",
    status: "planned",
    summary: "Track official lottery, ballot, invitation-pool, quota, and capped visa opportunities without using scam-like promises.",
    now: "Architecture and product surface are ready.",
    later: "Add official-source monitoring, open/close windows, country eligibility, result reminders, and scam warnings.",
    href: "/platform/opportunities",
  },
  {
    slug: "watchlist",
    title: "Route watchlist and alerts",
    category: "Opportunity monitoring",
    phase: "Phase 2",
    status: "planned",
    summary: "Let users follow routes and receive opt-in email, WhatsApp, Telegram, or in-app alerts when dates or requirements change.",
    now: "Module placeholder is visible so the product architecture stays clean.",
    later: "Add user watchlists, alert preferences, notification logs, and WhatsApp template approval.",
    href: "/platform/watchlist",
  },
  {
    slug: "documents",
    title: "Document readiness and name consistency",
    category: "Readiness",
    phase: "Phase 2",
    status: "planned",
    summary: "Check missing documents, passport validity, name mismatch, translation, notarization, apostille, and legalization needs.",
    now: "Route-level checklists are live.",
    later: "Add document upload, scanner rules, name comparison, and readiness scoring.",
    href: "/platform/documents",
  },
  {
    slug: "funds",
    title: "Proof-of-funds planner",
    category: "Readiness",
    phase: "Phase 2",
    status: "planned",
    summary: "Compare available funds to route requirements, family size, currency, sponsor evidence, and large-deposit risk.",
    now: "Starter budget estimates are live.",
    later: "Add savings targets, statement maturity, sponsor plan, shortfall alerts, and evidence quality checks.",
    href: "/platform/funds",
  },
  {
    slug: "refusal-risk",
    title: "Refusal risk analyzer",
    category: "Risk review",
    phase: "Phase 2",
    status: "planned",
    summary: "Review weak application indicators and previous refusal reasons without promising approval.",
    now: "Risk labels are already used on routes and reports.",
    later: "Add refusal-letter upload, repair plan, and expert review add-on.",
    href: "/platform/refusal-risk",
  },
  {
    slug: "legalization",
    title: "Notarization, apostille, and legalization",
    category: "Execution services",
    phase: "Phase 2",
    status: "planned",
    summary: "Guide document authentication flows by issuing country, receiving country, document type, and route purpose.",
    now: "Document notes can show legalization requirements.",
    later: "Add service requests, provider routing, translation support, and status tracking.",
    href: "/platform/legalization",
  },
  {
    slug: "courier",
    title: "Passport and document courier",
    category: "Execution services",
    phase: "Phase 3",
    status: "partner_pending",
    summary: "Coordinate trusted handling for passports, certificates, embassy submissions, and notarization/legalization pickups.",
    now: "Service slot is planned but not active.",
    later: "Add courier partners, tracking, insurance option, special handling instructions, and pricing markup.",
    href: "/platform/courier",
  },
  {
    slug: "insurance",
    title: "Insurance readiness and partners",
    category: "Execution services",
    phase: "Phase 2",
    status: "planned",
    summary: "Show travel, health, student, family, Schengen-style, and work-route insurance requirements.",
    now: "Insurance requirement records are already supported by the backend.",
    later: "Add quote partners and route-aware insurance comparison.",
    href: "/platform/insurance",
  },
  {
    slug: "appointments",
    title: "Embassy and application appointment tracker",
    category: "Timeline",
    phase: "Phase 2",
    status: "planned",
    summary: "Track embassy, visa center, biometrics, document submission, passport collection, and deadline events.",
    now: "No external appointment monitoring is active.",
    later: "Start with manual user timelines before any appointment availability integrations.",
    href: "/platform/appointments",
  },
  {
    slug: "family-relocation",
    title: "Family relocation planner",
    category: "Readiness",
    phase: "Phase 2",
    status: "planned",
    summary: "Plan spouse, children, dependent documents, extra funds, accommodation, school, insurance, and arrival tasks.",
    now: "Family count affects starter budget estimate.",
    later: "Add per-family-member documents, budget, timeline, and settlement checklist.",
    href: "/platform/family-relocation",
  },
  {
    slug: "settlement",
    title: "Post-arrival settlement checklist",
    category: "Arrival",
    phase: "Phase 3",
    status: "planned",
    summary: "Help users continue after approval with airport pickup, SIM, bank, tax number, registration, housing, school, and transport tasks.",
    now: "Not active in the MVP.",
    later: "Add arrival tasks, local partner services, and reminders.",
    href: "/platform/settlement",
  },
  {
    slug: "partners",
    title: "Partner and expert review network",
    category: "Marketplace",
    phase: "Phase 3",
    status: "partner_pending",
    summary: "Prepare slots for experts, couriers, insurers, translators, notaries, admission support, and settlement providers.",
    now: "No marketplace is active.",
    later: "Add vetting, provider dashboard, service requests, commission tracking, and dispute handling.",
    href: "/platform/partners",
  },
];

export function getPlatformModule(slug: string) {
  return platformModules.find((module) => module.slug === slug);
}
