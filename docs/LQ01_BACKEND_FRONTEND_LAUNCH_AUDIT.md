# LQ01 — Backend-to-Frontend V1 Launch Audit

**Audit date:** 24 August 2026  
**Repositories:** `SirBM201/moveready-mvp` and `SirBM201/SirBM201-moveready-frontend`  
**Backend frontier:** B19.12 merged; Supabase confirmed through migration 054  
**Purpose:** establish what a user can actually complete today and lock the work required for a top-quality V1.

## 1. Audit rules

A capability is not launch-ready merely because a service, route, migration, component or static test exists.

| Status | Meaning |
|---|---|
| Implemented | Domain/service/database code exists. |
| Connected | A production frontend calls the authenticated API and handles success, empty, loading and failure states. |
| Proven | The complete user journey has passed automated and manual testing against deployed services. |
| Launch-ready | Connected and proven on desktop and mobile, with security, accessibility, provenance and recovery behaviour validated. |

## 2. Executive finding

MoveReady has a broad and safety-conscious backend, but its newest Jobs execution capabilities are not yet presented as one coherent consumer product.

The frontend currently connects primarily to the original Jobs foundation:

- profile and search setup;
- basic Jobs dashboard;
- companies;
- recruiters;
- job records;
- basic application records;
- résumé vault upload/download;
- automation overview, watches, scans, draft review and controlled handoff.

The frontend does not yet consume the dedicated B19.2–B19.12 surfaces for:

- vacancy readiness;
- material binding and reconciliation;
- vacancy-specific application drafts;
- package review and handoff history;
- post-submission lifecycle;
- due follow-ups;
- application portfolio;
- application analytics;
- search campaigns;
- canonical employer dashboards;
- recruiter relationship dashboards and evidence events.

This gap is the primary reason MoveReady is not yet ready to claim parity with Teal, Huntr, Jobscan, Simplify, Careerflow or Rezi.

## 3. Backend capability audit

| Capability | Backend | Database | Frontend | Proven status | V1 decision |
|---|---|---|---|---|---|
| Email OTP/session account | Implemented | Implemented | Connected | Previously manually tested | Retain and re-test |
| Job-search profile and scope | Implemented | Implemented | Connected | Existing contract tests | Retain and polish |
| Vacancy discovery/monitoring | Implemented | Implemented | Partially connected | Automated contracts pass; live relevance not benchmarked | Must improve and benchmark |
| Vacancy canonical identity/reconciliation | Implemented | Implemented | Mostly implicit | Backend gates pass | Surface freshness and change history |
| Application readiness | Implemented | Implemented | Not connected to dedicated API | Backend gates pass | Must connect |
| Résumé/cover-letter material binding | Implemented | Implemented | Not connected | Backend gates pass | Must connect |
| Vacancy-specific draft packages | Implemented | Implemented | Automation UI has earlier draft flow only | Backend gates pass | Consolidate into Career Studio |
| Approval and controlled handoff | Implemented | Implemented | Earlier automation handoff connected | Dedicated B19 handoff history not connected | Must unify |
| Application lifecycle | Implemented | Implemented | Basic legacy status editing only | Backend gates pass | Must replace with evidence-safe lifecycle UI |
| Follow-up scheduling/reconciliation | Implemented | Implemented | Basic date fields only | Backend gates pass | Must connect |
| Application portfolio/next actions | Implemented | Derived | Not connected | Backend gates pass | Must become primary pipeline |
| Application analytics/learning | Implemented | Derived | Not connected | Backend gates pass | Must connect with plain-language explanations |
| Search campaigns | Implemented | Implemented | Not connected | Backend gates pass | Must connect |
| Employer intelligence | Implemented | Migrations 051–053 | Old company workspace only | Backend gates pass | Must connect canonical dashboard |
| Recruiter relationship intelligence | Implemented | Migration 054 | Old recruiter CRUD only | Backend gates pass | Must connect dashboard/events |
| Passport/Visa Power | Implemented | Implemented | Connected | Existing frontend/backend gates | Re-test provenance and mobile UX |
| Route comparison/readiness | Implemented | Implemented | Connected | Existing gates | Re-test official-source visibility |
| Financial readiness | Implemented | Implemented | Connected | Existing gates | Re-test unknown-rule fail-closed behaviour |
| Language Coach | Implemented | Implemented | Connected | Existing gates | Keep bounded V1 scope |
| Quote-based services billing | Implemented | Implemented | Connected | Controlled/disabled checkout mode | Not subscription billing |
| Subscription/entitlements | Not implemented | Not implemented | Not implemented | Not tested | Build only after feature boundaries stabilize |

## 4. Frontend product audit

### 4.1 What is already useful

The current frontend has real, substantial workspaces rather than a bare prototype:

- guided onboarding and profile editing;
- clear local/international/both search-scope language;
- Jobs dashboard with match and viability separation;
- company and recruiter records;
- application tracking;
- private résumé file vault;
- official vacancy monitoring;
- account action centre;
- source and provenance panels;
- mobility, readiness, evidence, application, alert and settlement workspaces;
- responsive/accessibility styles and contract scripts.

These are strong foundations and should be preserved.

### 4.2 Critical frontend gaps

#### A. The B19 execution engine is hidden

Most B19.2–B19.12 routes have no frontend consumer. Users therefore cannot experience the strongest completed backend work.

#### B. Résumé Vault is not Career Studio

The vault stores and downloads PDF, DOCX and text files. It does not yet provide:

- guided résumé section editing;
- ATS-safe templates;
- live preview;
- job-specific variants;
- structured keyword analysis;
- visible before/after recommendations;
- DOCX/PDF generation from editable structured content;
- version comparison.

This is the largest gap versus Teal, Huntr and Rezi.

#### C. Match scoring is not yet a Jobscan-quality report

The Jobs dashboard shows match and viability percentages and reasons, but there is no deep visual Vacancy Alignment Report explaining:

- matched skills;
- missing skills;
- responsibilities;
- qualifications;
- formatting risks;
- unsupported claims;
- source/freshness;
- work-authorisation blockers;
- improvement impact.

MoveReady must not claim a universal ATS pass probability.

#### D. No rapid browser capture/autofill

There is no browser extension, bookmarklet, vacancy URL parser or safe form-field assistant. Manual vacancy entry is too slow compared with Teal, Huntr and Simplify.

#### E. Interview and LinkedIn tools are below competitor standard

Interview preparation exists but is not a persisted mock-interview system with scored, evidence-safe feedback. There is no LinkedIn profile optimizer.

#### F. Dashboards expose old models

Companies and recruiters use the migration-031 CRUD workspaces, not the canonical employer and recruiter relationship dashboards delivered in B19.11–B19.12.

#### G. Testing is contract-heavy, interaction-light

Frontend CI includes a Next build and B06/B08/B10–B16 Node contract scripts. The repository has no dedicated component-test or browser-E2E framework in `package.json`. Critical journeys need deployed Playwright-style acceptance coverage, not only string/contract assertions.

#### H. Billing is the wrong commercial model for subscriptions

The existing billing workspace is designed for scope-based service quotes and controlled payment links. It must remain available for expert/provider services, but it does not provide plan entitlements, usage limits, subscription renewals, cancellations or self-service billing.

## 5. User-journey audit

| Journey | Current result |
|---|---|
| Sign in and complete profile | Substantially connected; re-test required |
| Choose local/international/both search | Connected |
| Discover relevant current vacancies | Technically available; relevance/freshness benchmark missing |
| Open a rich vacancy detail | Inadequate; results are mainly dashboard cards |
| Import vacancy from URL | Missing |
| Build résumé inside MoveReady | Missing |
| Receive deep vacancy alignment report | Partial/basic |
| Generate professional tailored package | Backend exists; complete frontend flow missing |
| Download generated PDF/DOCX | Vault downloads existing files; structured generated-document experience missing |
| Approve and hand off application | Partial through earlier automation UI |
| Track evidence-safe lifecycle | Dedicated backend exists; frontend missing |
| See due follow-ups/next action | Backend exists; fragmented frontend |
| Run multiple search campaigns | Backend exists; frontend missing |
| Understand employer/recruiter relationship | Dedicated backend exists; frontend missing |
| Optimize LinkedIn profile | Missing |
| Complete persisted mock interview | Missing |
| Use on mobile end to end | Responsive work exists; latest B19 journeys cannot be tested until connected |
| Upgrade subscription | Missing |

## 6. Frontend PR #9 disposition

Draft PR #9 was created before major later frontend and B19 work. Its branch is stale and GitHub reports it as non-mergeable. It changes seven files and, in places, replaces richer current dashboard content with a simplified product-journey presentation.

**Audit decision:** do not merge PR #9 wholesale. Preserve the useful FIND → QUALIFY → MOVE → SETTLE → GROW → FIND AGAIN language, but implement the launch journey additively from current `main`. Close PR #9 only through a separate explicit repository action.

## 7. Launch-risk assessment

| Risk | Severity | Reason |
|---|---|---|
| Backend/frontend capability gap | Critical | Best features are not usable from the UI |
| Résumé-output quality | Critical | Direct competitor purchase driver |
| Vacancy relevance/freshness | Critical | Poor results destroy trust immediately |
| Missing E2E coverage | Critical | Builds do not prove journeys |
| Browser capture/autofill gap | High | Adds repetitive manual work |
| Employer/recruiter UI gap | High | New intelligence remains invisible |
| Mobile completion risk | High | Target audience is mobile-heavy |
| Global source coverage | High | Breadth must not become stale or unsupported |
| Subscription/payment gap | High but sequenced later | Cannot monetize reliably yet |
| No beta evidence | High | Price and usability assumptions remain untested |

## 8. Current readiness score after audit

| Area | Score |
|---|---:|
| Backend foundations | 93% |
| Frontend foundations | 75% |
| B19 frontend integration | 30% |
| Competitive résumé/ATS experience | 25% |
| Browser capture/autofill | 0% |
| LinkedIn/mock interview | 20% |
| Mobility/provenance foundation | 80% |
| Subscription monetization | 10% |
| Automated launch acceptance | 35% |
| **Public V1 readiness** | **approximately 62–68%** |

The lower overall score is intentional and more accurate than counting backend modules. A top-quality launch requires the connected, proven experience.

## 9. Audit conclusion

MoveReady has enough backend breadth. The launch problem is now integration, product design, output quality, data quality and proof.

No new standalone backend feature block should begin until the locked V1 backlog is complete. Any proposed work must either:

1. close a documented launch gap;
2. repair a proven regression;
3. improve security, privacy, accessibility, provenance or reliability; or
4. be explicitly approved as a scope change.
