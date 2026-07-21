# MoveReady Launch Simplicity Pass — 2026-07-21

## Goal

Make MoveReady easier for first-time users, users with low technical confidence, and users from any country or education level.

## Implemented in this pass

- Added a reusable beginner-friendly guide component.
- Added plain-language guidance to Route Checker.
- Added plain-language guidance to Account Center.
- Added plain-language guidance to Passport Index.
- Added plain-language guidance to Visa Power.
- Added Passport Index and Visa Power to the footer so users can find them even if they miss the top menu.

## Simple user order

1. Start with your own details.
2. Check your route before spending money.
3. Check your passport alone.
4. Check visas you already hold.
5. Save one active profile.
6. Generate a readiness report.
7. Create alerts only for routes you care about.
8. Request support only after your route is clearer.

## Trust rule

MoveReady must remain advisory. It must not promise visa approval, admission, job offers, lottery selection, ballot success, travel entry, appointment access, or provider approval.

## Pages to test after Vercel deploy

- `/start`
- `/dashboard`
- `/route-checker`
- `/passport-index`
- `/visa-power`
- `/my-reports`
- `/saved-routes`
- `/watchlist`
- `/services`

## Launch-readiness note

Passport Index and Visa Power are now part of the launch-core user flow because they do not require third-party provider approval. They must still show source and safety warnings because travel rules change often.
