# MoveReady V1 — Locked Launch Implementation Backlog

**Locked:** 24 August 2026  
**Authority:** LQ01 backend-to-frontend audit  
**Objective:** launch a polished, trustworthy, mobile-ready global opportunity and mobility product before finalizing subscription pricing.

## 1. Lock rules

- B19 is frozen at B19.12.
- Final subscription prices are suspended until beta evidence exists.
- Work must follow the order below unless an earlier block is technically dependent on a later foundation.
- A block is complete only after implementation, automated tests, deployed validation and manual acceptance.
- Existing working behaviour must be preserved.
- New databases are added only where an existing canonical record cannot support the requirement.
- No automatic job submission, fabricated candidate facts, unsupported sponsorship claims or invented immigration eligibility.
- Public V1 scope changes require an explicit backlog amendment.

## 2. Definition of launch-ready

Public V1 requires all of the following:

1. A new user completes the primary journey without technical help.
2. Job discovery returns relevant, current vacancies with evidence.
3. Vacancy pages show source, freshness, suitability, work-rights and uncertainty.
4. Résumé and cover-letter outputs are professional, editable and downloadable.
5. Daily alerts work with consent and unsubscribe controls.
6. Campaign, application, employer and recruiter dashboards are understandable.
7. Application tracking and follow-ups work properly on mobile.
8. Route and mobility information is visibly sourced.
9. Subscription sandbox, entitlement and cancellation flows pass.
10. Ten to twenty beta users complete real journeys and critical defects are resolved.

## 3. Locked implementation order

### LQ02 — Integration foundation and test harness

**Goal:** make later frontend work safe and measurable.

Deliverables:

- typed client modules for every B19.2–B19.12 endpoint;
- shared loading, empty, auth-expired and recoverable-error components;
- stable frontend domain types separate from raw API payloads;
- component-test framework;
- browser E2E framework against preview/deployed environments;
- fixture policy with no real personal data;
- CI jobs for component and core-journey E2E tests;
- API compatibility contract between backend and frontend;
- current-`main` product navigation map;
- decision and closure plan for stale PR #9.

Acceptance:

- CI builds and runs unit/component tests;
- signed-out, expired-session, empty and API-failure cases are testable;
- no B19 route is added to UI without a typed client contract.

### LQ03 — Guided onboarding and product shell

**Goal:** one understandable product rather than a collection of pages.

Deliverables:

- simplified responsive navigation;
- FIND → QUALIFY → MOVE → SETTLE → GROW journey model;
- guided first-run onboarding;
- profile-completion recovery loop;
- one primary dashboard and action centre;
- contextual next action;
- progress saved between sessions;
- plain-language labels;
- removal or hiding of launch-irrelevant navigation.

Acceptance:

- at least 90% of beta users complete onboarding without assistance;
- every incomplete requirement explains what to do next;
- no dead-end navigation;
- keyboard and mobile completion pass.

### LQ04 — Vacancy discovery, detail and URL import

**Goal:** relevant, verifiable opportunities with minimal manual entry.

Deliverables:

- dedicated search/results interface;
- vacancy detail page;
- source, observed date, last checked, status and expiry;
- match and application-viability separation;
- sponsorship/work-rights/relocation evidence display;
- current-country/local search support;
- filters, sorting, saved searches and campaign association;
- duplicate/stale/closed vacancy treatment;
- paste-a-vacancy-URL import;
- server-side safe vacancy metadata extraction;
- manual correction before save;
- report broken/suspicious vacancy;
- relevance and freshness benchmark set.

Acceptance:

- source/freshness shown for 100% of displayed vacancies;
- stale/unknown evidence cannot appear verified;
- at least 80% of the first benchmark results are relevant;
- URL import never silently invents missing fields.

### LQ05 — Career Studio: structured résumé and cover letter

**Goal:** close the Teal/Huntr/Rezi quality gap.

Deliverables:

- structured master career profile;
- import from existing PDF/DOCX/TXT with user confirmation;
- guided sections for summary, experience, education, skills and certifications;
- multiple résumé versions;
- ATS-safe launch templates;
- editable cover letters;
- live preview;
- truthful metrics/facts guard;
- version history;
- accessible mobile editing;
- high-quality PDF export;
- high-quality DOCX export;
- storage integration with the existing résumé vault;
- output render-and-visual-QA tests.

Acceptance:

- generated PDF and DOCX preserve content and layout;
- no candidate fact enters a document without recorded evidence or user confirmation;
- users can create, edit, preview and download without external software;
- documents render professionally on desktop and mobile preview.

### LQ06 — Vacancy Alignment Report

**Goal:** meet the visible analysis standard users expect from Jobscan without false ATS promises.

Deliverables:

- matched skills and evidence;
- missing or weakly evidenced skills;
- responsibilities and qualification comparison;
- title/seniority alignment;
- formatting and readability checks;
- keyword context, not keyword stuffing;
- work-rights and location blockers;
- unsupported-claim warnings;
- source/freshness panel;
- prioritized improvements;
- before/after comparison;
- transparent score composition;
- explanation that the score is not an ATS pass probability.

Acceptance:

- every score component is explainable;
- work authorization cannot be overridden by résumé similarity;
- missing information remains unknown;
- report passes expert/manual review on a benchmark résumé set.

### LQ07 — Application execution and portfolio integration

**Goal:** expose B19 readiness through follow-up as one workflow.

Deliverables:

- readiness and material binding;
- reconciliation when vacancy/profile/materials change;
- tailored package generation;
- user review and approval;
- controlled employer handoff;
- manual submission confirmation;
- evidence-safe lifecycle;
- interview/offer/rejection evidence;
- follow-up scheduling and completion;
- application portfolio;
- next-action queue;
- application analytics and recommendations.

Acceptance:

- complete vacancy → readiness → draft → approval → handoff → confirmed submission → lifecycle → follow-up E2E passes;
- no automatic submission;
- terminal states do not silently reopen;
- mobile pipeline and follow-up completion pass.

### LQ08 — Campaign, employer and recruiter intelligence UI

**Goal:** expose B19.10–B19.12 in ordinary language.

Deliverables:

- campaign creation and goals;
- campaign vacancies and progress;
- daily/weekly plan;
- employer identity, evidence, history and recommendations;
- priority/watch/excluded targeting;
- recruiter identity and relationship state;
- recruiter event timeline;
- consent-safe outreach brief;
- due follow-up;
- links among campaign, vacancy, employer, recruiter and application.

Acceptance:

- dashboards answer what happened, why it matters, what to do next and what remains uncertain;
- excluded employers do not re-enter campaign recommendations;
- identity never becomes verification, sponsorship or interest;
- no raw internal API terminology in primary UI.

### LQ09 — Browser capture and safe application assistant

**Goal:** close the Teal/Huntr/Simplify convenience gap without uncontrolled automation.

Deliverables:

- Chrome-compatible extension;
- save current vacancy;
- supported-site metadata capture;
- vacancy preview and correction;
- MoveReady match summary;
- selected approved résumé/package;
- reusable candidate-answer profile;
- copy or user-triggered autofill for supported fields;
- screening-question answer suggestions;
- explicit user review and submit;
- post-submit confirmation and tracking;
- privacy disclosure and minimum permissions;
- extension build, signing and store-submission package.

Acceptance:

- extension requests only necessary permissions;
- no passwords, OTPs or employer credentials collected;
- no form submitted without user action;
- capture/autofill works on a defined launch ATS support list;
- unsupported sites fail safely.

### LQ10 — LinkedIn optimizer and mock interview

**Goal:** close the Careerflow gap at a credible V1 level.

Deliverables:

- pasted/exported LinkedIn profile review;
- headline, About, experience and skills guidance;
- target-role keyword alignment;
- no automated LinkedIn login or prohibited scraping;
- vacancy-specific interview-question sets;
- persisted written mock interviews;
- STAR answer builder;
- evidence-safe feedback;
- practice history and improvement plan;
- connection to Language Coach for supported English/French practice.

Acceptance:

- feedback references recorded profile/vacancy facts;
- no invented recruiter or employer insight;
- users can repeat and compare practice;
- voice simulation is not required for V1 unless separately proven stable.

### LQ11 — Alerts, mobile, accessibility and performance

**Goal:** make the connected product dependable for mobile-first users.

Deliverables:

- daily and weekly alert preferences;
- in-app delivery;
- approved email delivery where configured;
- consent, unsubscribe and quiet controls;
- responsive review of every primary journey;
- touch targets, keyboard navigation, focus and screen-reader labels;
- reduced-motion and contrast support;
- loading/performance budget;
- graceful slow-network and offline-transition handling;
- cross-browser matrix.

Acceptance:

- zero critical mobile or accessibility defects;
- alert duplication prevented;
- delivery status is not fabricated;
- core pages meet agreed performance budgets.

### LQ12 — Mobility provenance and trust completion

**Goal:** ensure MoveReady’s differentiator is credible.

Deliverables:

- official source and reviewed date on material route facts;
- stale-source warnings;
- fail-closed unknown thresholds;
- route comparison consistency;
- family/work-rights context;
- document/funds/settlement links from job journey;
- legal/advisory boundaries;
- source-health operational review.

Acceptance:

- 100% of material launch-route claims have approved provenance or are clearly unavailable;
- no unsourced proof-of-funds threshold;
- job fit never becomes immigration eligibility.

### LQ13 — Subscription foundation and provisional gates

**Goal:** prepare monetization without fixing the final price prematurely.

Deliverables:

- provider-neutral plan catalog;
- customer/subscription records;
- entitlements;
- usage ledger;
- checkout adapter;
- idempotent webhooks;
- billing portal;
- renewals, cancellations, grace and failed payments;
- free/paid gate configuration;
- test-mode checkout;
- quote billing retained separately for expert/provider services;
- provisional plan copy clearly marked non-final internally.

Acceptance:

- test checkout, renewal, cancellation, failure and replay pass;
- cancellation does not delete user records;
- paid-created records remain readable after downgrade;
- final price is not committed until beta review.

### LQ14 — Controlled beta, pricing validation and launch

**Goal:** prove value and set price from evidence.

Deliverables:

- 10–20 beta users;
- local, international, sponsorship-required and already-abroad journeys;
- mobile-first representation;
- onboarding and funnel analytics;
- structured interviews;
- willingness-to-pay test;
- defect triage;
- final free/paid limits;
- final monthly/annual/founding prices;
- production payment activation;
- launch runbook, support and rollback plan.

Acceptance:

- onboarding completion at least 90%;
- relevant first-page vacancy benchmark at least 80%;
- main application journey completion at least 90% among valid test cases;
- zero unresolved critical security/privacy/payment/data-loss defects;
- at least 80% of beta users rate the product useful;
- at least 70% intend to continue;
- launch owner explicitly approves public release.

## 4. Explicitly deferred from public V1

These are not permitted to delay V1 unless later promoted through an explicit backlog amendment:

- uncontrolled mass auto-apply;
- native iOS/Android apps;
- full voice/video AI interviewer;
- proprietary global immigration-law coverage for every country;
- employer HRIS integrations;
- enterprise global-mobility administration;
- full human immigration-expert marketplace;
- accommodation, courier or flight fulfillment operated directly by MoveReady;
- outcome guarantees;
- large community/social network;
- salary negotiation marketplace;
- multilingual product UI beyond the proven launch languages.

## 5. Work packaging

Each LQ block must use:

1. a dedicated feature branch;
2. a written contract and acceptance list;
3. focused tests;
4. complete existing repository gates;
5. preview/deployed verification;
6. manual test instructions only where automation cannot prove the outcome;
7. merge only when required database changes are confirmed and all gates are green.

## 6. Estimated effort

| Group | Focused development estimate |
|---|---:|
| LQ02–LQ04 | 5–7 days |
| LQ05–LQ06 | 7–10 days |
| LQ07–LQ08 | 5–7 days |
| LQ09–LQ10 | 7–10 days |
| LQ11–LQ13 | 6–9 days |
| LQ14 beta/repair | calendar-dependent |
| **Total engineering before beta completion** | **30–43 focused days** |

This estimate is intentionally more conservative than the earlier launch estimate because the locked scope now includes competitive résumé authoring, visible alignment reporting, browser capture/autofill, LinkedIn review and mock interviews.

## 7. Immediate next action

Begin **LQ02 — Integration foundation and test harness** from current frontend `main`.

Do not start subscription pricing implementation, B19.13 or another unrelated module.
