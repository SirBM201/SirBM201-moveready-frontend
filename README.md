# Project MoveReady Frontend

Working frontend repository for Project MoveReady, a global visa, travel, and relocation readiness platform.

Final brand name and domain will be decided later. For now, this frontend uses neutral MoveReady/relocation naming.

## Current Status

Starter Next.js frontend scaffold is in place, adapted from the proven Naija Tax Guide / TaxBridge structure but cleaned of tax-specific content.

The current pages are mostly static/mock-backed until the Supabase schema is run and backend environment variables are connected.

## Implemented Pages

- `/`
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

- Connect route checker form to `/api/relocation/reports`
- Connect countries/routes pages to backend data
- Add loading, empty, and error states
- Add report export/download later
- Add login and saved-report ownership after backend auth is added
