# Project MoveReady Frontend

Working frontend repository for Project MoveReady, a global visa, travel, and relocation readiness platform.

Final brand name and domain will be decided later. For now, this frontend should use neutral MoveReady/relocation naming.

## Direction

This frontend should reuse proven patterns from the existing Naija Tax Guide / TaxBridge frontend, especially:

- Next.js app router structure
- API helper pattern
- Public checker/report flow
- Admin page structure
- Report preview/export ideas
- Clean public landing and tool pages

It should not carry over tax-specific content, tax calculators, quiz logic, plan text, or old brand language.

## MVP Pages

- `/`
- `/route-checker`
- `/country-checker`
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

## Product Rule

The frontend should show trust clearly:

- Last verified date
- Route status
- Risk level
- Source count
- Review due date
- Whether a report needs refresh

AI output should feel helpful, but source freshness should carry the trust.
