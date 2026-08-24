# LQ02 — Integration foundation and test harness

Status: implementation foundation locked.

## Decisions

- The existing `apiJson` transport remains the single auth, timeout, serialization, and error boundary.
- UI code consumes stable camelCase domain models from `lib/jobs/domain.ts`, never raw backend payloads.
- `lib/jobs/adapters.ts` is the only compatibility boundary for snake_case/envelope differences.
- `B19_API_CONTRACTS` is the machine-checked source of truth for all 45 B19.2–B19.12 routes.
- All B19 calls explicitly request the account token.
- Fixtures are synthetic and must not contain real names, emails, phone numbers, tokens, or copied production records.

## Test layers

| Gate | Command | Purpose |
|---|---|---|
| Integration contract | `npm run test:lq02` | Route coverage, auth intent, adapters, shared states, fixture hygiene |
| Type/build integration | `npm run build` | TypeScript, React, Next routing, production bundle |
| Deployed smoke | `E2E_BASE_URL=https://preview.example npm run test:e2e` | Server-rendered route availability on preview/deployed environments |

The deployed smoke is intentionally environment-driven: pull requests without a preview URL do not call production. A hosting integration can set `E2E_BASE_URL` and run the same command after deployment.

## API compatibility policy

1. Backend route changes require updating the registry, client, adapter, fixtures, and this document in one pull request.
2. New payload fields may be added without UI breakage; renamed/removed fields require adapter compatibility.
3. IDs are URL-encoded, authenticated calls are explicit, and raw response objects must not escape adapters.
4. A contract is not considered integrated until a real screen consumes the client in the corresponding delivery block.

## Current-main navigation map

| User intent | Current route | B19 integration target |
|---|---|---|
| Discover jobs | `/jobs` | Readiness entry point |
| Track applications | `/jobs/applications` | Drafts, handoffs, lifecycle, follow-ups, portfolio |
| Research employers | `/jobs/companies` | Employer dashboard |
| Manage recruiter relationships | `/jobs/recruiters` | Recruiter dashboard and events |
| Review performance | `/jobs/automation` | Analytics and campaigns |

## Stale PR #9

Do not merge PR #9 wholesale. It predates the locked launch audit and is non-mergeable. Preserve it only as a reference for any still-useful UI ideas, then close it with a note pointing to LQ01 and LQ02 after this foundation lands.
