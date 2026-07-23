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
    readiness: "The official-opportunities workspace is available. Records should be promoted only after source review and admin approval.",
    launchScope: "Opening dates, closing dates, country eligibility, result reminders, confirmation-number reminders, and official-link guidance.",
    href: "/opportunities",
  },
  {
    slug: "watchlist",
    title: "Route watchlist and alerts",
    category: "Opportunity monitoring",
    availability: "available",
    summary: "Follow routes and receive opt-in email, WhatsApp, Telegram, or in-app alerts when dates or requirements change.",
    readiness: "Users can save watchlist alert preferences now. Message sending remains provider-approval dependent.",
    launchScope: "Saved routes, alert preferences, reminder windows, notification logs, and WhatsApp template approval where required.",
    href: "/watchlist",
  },
  {
    slug: "passport-index",
    title: "Passport Index and destination rules",
    category: "Passport and visa intelligence",
    availability: "available",
    summary: "Check the weekly passport-access overview and open a destination for a cached detailed rule.",
    readiness: "The provider-backed Nigeria overview, destination search, weekly unattended sync, seven-day detail cache, and source-status warnings are live.",
    launchScope: "Passport access map, destination detail, validity, stay, registration, exception, official-link, cache, and scheduled refresh controls.",
    href: "/passport-index",
  },
  {
    slug: "visa-power",
    title: "Visa Power and Travel Benefits",
    category: "Passport and visa intelligence",
    availability: "available",
    summary: "Check whether visas a user already holds can unlock easier travel, no separate visa, or simplified entry in selected destinations.",
    readiness: "The Visa Power page is live with provider-backed passport context, reviewed rules, prior-refusal disclosure, and server-side visa-validity safety gates.",
    launchScope: "Passport power, existing visa stack, destination benefits, max stay notes, conditions, official source URLs, confidence labels, and personal-history warnings.",
    href: "/visa-power",
  },
  {
    slug: "documents",
    title: "Document readiness and name consistency",
    category: "Readiness",
    availability: "available",
    summary: "Check missing documents, passport validity, name mismatch, translation, notarization, apostille, and legalization needs.",
    readiness: "The readiness tools page includes live document and name checks through the backend.",
    launchScope: "Document categories, name comparison, route evidence checks, and readiness scoring.",
    href: "/readiness",
  },
  {
    slug: "funds",
    title: "Proof-of-funds planner",
    category: "Readiness",
    availability: "available",
    summary: "Compare available funds to route requirements, family size, currency, sponsor evidence, and large-deposit risk.",
    readiness: "The readiness tools page includes a live proof-of-funds planner through the backend.",
    launchScope: "Savings targets, family planning pressure, shortfall alerts, large-deposit warnings, and evidence quality checks.",
    href: "/readiness",
  },
  {
    slug: "refusal-risk",
    title: "Refusal risk analyzer",
    category: "Risk review",
    availability: "available",
    summary: "Review weak application indicators and previous refusal reasons without promising approval.",
    readiness: "The readiness tools page includes a live refusal-risk screener through the backend.",
    launchScope: "Previous refusal, common risk indicators, repair plans, and expert review add-ons.",
    href: "/readiness",
  },
  {
    slug: "journey-planner",
    title: "Application-to-arrival Journey Planner",
    category: "Journey management",
    availability: "available",
    summary: "Organize document legalization, family relocation, appointments, and post-arrival settlement in one workspace.",
    readiness: "Four live backend planners now generate source-first steps, risk labels, checklists, and optional timeline events.",
    launchScope: "Legalization path, household plan, appointment countdown, timeline storage, and first-90-days settlement checklist.",
    href: "/journey-planner",
  },
  {
    slug: "legalization",
    title: "Notarization, apostille, and legalization",
    category: "Execution services",
    availability: "available",
    summary: "Organize document authentication flows by issuing country, receiving country, document type, route purpose, and written authority instructions.",
    readiness: "The live legalization planner organizes confirmed handling steps and warnings without guessing which legal process applies. Service requests remain available for provider review.",
    launchScope: "Original or certified copy, translation, notarization, authentication, apostille, embassy legalization, custody, courier, and deadline checks.",
    href: "/legalization",
  },
  {
    slug: "courier",
    title: "Passport and document courier",
    category: "Execution services",
    availability: "partner_approval_pending",
    summary: "Coordinate trusted handling for passports, certificates, embassy submissions, and notarization or legalization pickups.",
    readiness: "The service request form is live for user interest, and provider applications can be captured for admin review.",
    launchScope: "Courier partners, tracking, insurance options, destination handling rules, special instructions, and pricing.",
    href: "/courier",
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
    title: "Embassy and application appointment planner",
    category: "Timeline",
    availability: "available",
    summary: "Work backwards from embassy, visa-centre, biometrics, submission, interview, or passport-collection dates.",
    readiness: "The live appointment planner generates dated tasks and can save them into the existing timeline with user consent. External slot monitoring remains source-permission dependent.",
    launchScope: "Appointment instructions, document review, payment, travel, attendance, follow-up, reminder dates, and timeline storage.",
    href: "/timeline",
  },
  {
    slug: "family-relocation",
    title: "Family relocation planner",
    category: "Readiness",
    availability: "available",
    summary: "Plan spouse, children, other dependants, extra documents, funds, accommodation, school, insurance, medical needs, and arrival tasks.",
    readiness: "The live household planner produces member-level checklists, planning-budget pressure, warnings, and tasks without presenting estimates as official requirements.",
    launchScope: "Per-family-member documents, dependant proof, consent, custody, funds pressure, insurance, school, medical, accommodation, and arrival planning.",
    href: "/family-planner",
  },
  {
    slug: "settlement",
    title: "Post-arrival settlement checklist",
    category: "Arrival",
    availability: "available",
    summary: "Continue after approval with housing, connectivity, registration, banking, tax, insurance, school, transport, work, and family tasks.",
    readiness: "The self-service first-90-days settlement planner is live. Public partner handoff remains restricted to approved providers.",
    launchScope: "Before-travel, first-72-hours, first-two-weeks, first-90-days, fraud checks, family, medical, work, business, school, and pet tasks.",
    href: "/settlement",
  },
  {
    slug: "partners",
    title: "Partner and expert review network",
    category: "Marketplace",
    availability: "partner_approval_pending",
    summary: "Connect users to vetted experts, couriers, insurers, translators, notaries, admission support, and settlement providers.",
    readiness: "Provider application capture and admin screening are available. Public listings stay hidden until approval.",
    launchScope: "Provider vetting, expert review, service requests, commission tracking, handoff notes, and user support workflow.",
    href: "/providers",
  },
];


export function getPlatformModule(slug: string) {
  return platformModules.find((module) => module.slug === slug);
}
