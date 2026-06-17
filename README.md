# Project MoveReady Frontend

Working frontend repository for Project MoveReady, a global visa, travel, and relocation readiness platform.

Final brand name and domain will be decided later. For now, this frontend uses neutral MoveReady/relocation naming.

## Current Status

Next.js frontend scaffold is in place and connected to the deployed backend through `NEXT_PUBLIC_BACKEND_URL` / `NEXT_PUBLIC_API_BASE`.

The public app now includes live route checks, official opportunities, Estonia startup route detail, readiness tools, service request capture, and admin review surfaces.

## Implemented Pages

- `/`
- `/opportunities`
- `/readiness`
- `/platform`
- `/platform/[slug]`
- `/routes/estonia-startup`
- `/country-checker`
- `/route-checker`
- `/document-checklist`
- `/proof-of-funds`
- `/budget-calculator`
- `/scholarships`
- `/insurance-guide`
- `/report-preview`
- `/dashboard`
- `/my-reports`
- `/admin`
- `/admin/sources`
- `/admin/routes`
- `/admin/reviews`
- `/admin/reports`

## Current Live Features

- Country and route data loading from backend/Supabase
- Estonia startup founder route workspace
- Readiness report generation
- Official ballots and quota opportunity listing
- Name consistency checker
- Document readiness checker
- Proof-of-funds planner
- Refusal-risk screener
- Service request forms for coming-soon and partner-dependent services
- Admin service request dashboard
- Admin readiness check dashboard after migration `006_readiness_check_runs.sql`

## Reused Foundation

- Next.js app router structure
- TypeScript setup
- API helper pattern
- Backend rewrite pattern
- Public checker/report flow direction
- Admin-page structure direction

## Not Reused

- Tax calculators
- Tax quiz
- Naija Tax Guide pricing
- WhatsApp/Telegram tax menu patching
- Tax-specific prompts or copy

## Product Rule

The frontend should show trust clearly:

- Last verified date
- Route status
- Risk level
- Source count
- Review due date
- Whether a report needs refresh

AI output should feel helpful, but source freshness should carry the trust.

## Next Frontend Work

- Add auth and saved user profiles
- Add report export/download
- Add provider onboarding screens
- Add paid report flow
- Add richer admin CRUD for routes, sources, opportunities, and partner services