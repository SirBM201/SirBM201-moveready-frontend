# Project MoveReady Frontend

Working frontend repository for Project MoveReady, a global visa, travel, and relocation readiness platform.

Final brand name and domain will be decided later. For now, this frontend uses neutral MoveReady/relocation naming.

## Current Status

Next.js frontend scaffold is in place and connected to the deployed backend through `NEXT_PUBLIC_BACKEND_URL` / `NEXT_PUBLIC_API_BASE`.

The public app now includes live route checks, Passport Index, Visa Power & Travel Benefits, official opportunities, watchlist subscription capture, Estonia startup route detail, readiness tools, readiness report export actions, user profile saving, saved report lookup, service request capture, and admin review surfaces.

A launch simplicity pass has been added so first-time users can follow a plain-language order across Account, Route Checker, Passport Index, Visa Power, Reports, Alerts, and Services.

The Passport Index page is now provider-cache ready. When a passport provider is connected, users can select a passport and see passport rating, rank where available, visa-free rows, visa-on-arrival rows, eVisa/ETA rows, visa-required rows, provider name, last synced date, and twice-weekly refresh status on one page.

## Implemented Pages

- `/`
- `/start`
- `/decision-center`
- `/navigation-map`
- `/opportunities`
- `/watchlist`
- `/readiness`
- `/platform`
- `/platform/[slug]`
- `/routes/estonia-startup`
- `/country-checker`
- `/country-comparison`
- `/passport-index`
- `/visa-power`
- `/route-checker`
- `/document-checklist`
- `/proof-of-funds`
- `/budget-calculator`
- `/scholarships`
- `/insurance-guide`
- `/report-preview`
- `/dashboard`
- `/saved-routes`
- `/timeline`
- `/my-reports`
- `/services`
- `/service-requests`
- `/admin`
- `/admin/sources`
- `/admin/routes`
- `/admin/reviews`
- `/admin/reports`

## Current Live Features

- Country and route data loading from backend/Supabase
- Estonia startup founder route workspace
- Passport Index checks with passport rating, category filters, source status, and provider-cache fields
- Visa Power & Travel Benefits checks for selected existing visas
- Readiness report generation
- Readiness report JSON download and print action from the route checker result
- Saved report lookup from `/my-reports` by report reference, email, or phone
- Official ballots and quota opportunity listing
- Watchlist subscription capture for routes, opportunities, scholarships, countries, and services
- User relocation profile saving and lookup from `/dashboard` after migration `008_user_relocation_profiles.sql`
- Name consistency checker
- Document readiness checker
- Proof-of-funds planner
- Refusal-risk screener
- Service request forms for coming-soon and partner-dependent services
- Admin user profile review dashboard after migration `008_user_relocation_profiles.sql`
- Admin generated report review dashboard at `/admin/reports`
- Admin service request dashboard
- Admin watchlist subscription dashboard after migration `007_watchlist_alert_subscriptions.sql`
- Admin readiness check dashboard after migration `006_readiness_check_runs.sql`

## Launch User Flow

1. Start with the simple guide.
2. Save or load one active profile.
3. Check the route before spending money.
4. Check passport baseline.
5. Check Visa Power for visas already held.
6. Generate or retrieve readiness reports.
7. Save routes and create alerts only when useful.
8. Request support only after the route is clearer.

## Passport Index User Experience

The user should not need to move from page to page just to understand passport access.

On `/passport-index`, the user selects a passport country and clicks **Check my passport**. The result page should show:

- Passport rating / opportunity score
- Passport rank where provider supplies it
- Strength band
- Visa-free list
- Visa on arrival list
- eVisa / ETA list
- Visa-required list
- Conditions and maximum stay where available
- Provider/source status
- Last synced date
- Twice-weekly refresh status
- Safety warning before booking or paying anyone

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
- Passport and visa-benefit source confidence
- Safety reminders before travel booking

AI output should feel helpful, but source freshness should carry the trust.

## Next Frontend Work

- Add paid report flow
- Add PDF report export/download
- Add provider onboarding screens
- Add richer admin CRUD for routes, sources, opportunities, watchlists, profiles, Visa Power rules, passport-index records, and partner services
- Add document vault after privacy, security, and storage rules are finalized
