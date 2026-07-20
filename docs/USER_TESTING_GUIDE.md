# MoveReady MVP user testing guide

This guide is for testing the app like a normal user. Use one email account for each test so profile, reports, saved routes, alerts, timeline, and support requests stay together.

## Main test account rule

Use one email at a time.

Example:

```text
bms.concept@hotmail.com
```

Do not mix it with another address such as:

```text
bms.concept+promo1@hotmail.com
```

MoveReady treats those as different accounts.

## Best simple browser flow

1. Open `/start`.
2. Click **Start with route checker** or open **Account** from the top menu.
3. Open `/login` and sign in with one email.
4. After successful login, open `/dashboard`.
5. Confirm the dashboard shows the signed-in email.
6. Click **Choose or hide profiles** if there is more than one profile.
7. Click **Use this profile** on the correct current profile.
8. Click **Hide old profile** only on old test profiles you do not want to use again.
9. Open `/route-checker`.
10. Confirm the form says **Using active profile** and shows the correct name, target country, and route type.
11. Click **Load my active profile** if the details do not look correct.
12. Generate a readiness report.
13. Open the report detail page.
14. Open `/my-reports` and confirm the new report appears.
15. Save a route from `/saved-routes` or from a generated report.
16. Create an alert from `/watchlist`.
17. Add a timeline event from `/timeline`.
18. Create a support request from `/service-requests`.
19. Return to `/dashboard` and confirm counts update.

## Expected dashboard result

A clean account should show one active profile and only relevant user records.

The active profile should show:

```text
status: active
```

Old hidden profiles should not appear in the dashboard profile chooser.

## Expected route checker result

After the active profile is selected, `/route-checker` should show a message like:

```text
Signed in as bms.concept@hotmail.com
Using active profile: Sir BM (Estonia · Startup / entrepreneur).
```

The form should use the active profile details before generating a report.

## PowerShell API test setup

Set the API base URL:

```powershell
$Api = "https://moveready-mvp-production.up.railway.app/api"
```

Set your session token after signing in from the browser or API:

```powershell
$Token = "PASTE_SESSION_TOKEN_HERE"
$Headers = @{ Authorization = "Bearer $Token" }
```

## Check account summary

```powershell
$Summary = Invoke-RestMethod `
  -Method Get `
  -Uri "$Api/account/summary" `
  -Headers $Headers

$Summary.counts | ConvertTo-Json -Depth 10
```

## Check profile rows

```powershell
$Summary.sections.profiles.rows |
  Select-Object full_name,target_country,main_goal,route_category,status,created_at |
  Format-Table
```

Expected result after profile cleanup:

```text
full_name  target_country  main_goal  route_category  status
Sir BM     Estonia         startup    startup         active
```

## Check reports

```powershell
$Summary.sections.reports.rows |
  Select-Object report_ref,title,risk_label,source_status,generated_at |
  Format-Table
```

## Check saved routes

```powershell
$Summary.sections.saved_routes.rows |
  Select-Object title,target_country,route_category,status,created_at |
  Format-Table
```

## Check alerts

```powershell
$Summary.sections.watchlist.rows |
  Select-Object title,target_country,route_category,status,preferred_channel,created_at |
  Format-Table
```

## Check timeline

```powershell
$Summary.sections.timeline.rows |
  Select-Object event_title,target_country,route_category,status,due_date,created_at |
  Format-Table
```

## Check support requests

```powershell
$Summary.sections.service_requests.rows |
  Select-Object service_type,target_country,route_category,status,created_at |
  Format-Table
```

## Simple user acceptance test

A non-technical user should be able to answer these questions within five minutes:

1. Where do I start?
2. Which profile is active?
3. How do I check my route?
4. Where is my report?
5. Where are my saved routes?
6. How do I receive alerts?
7. How do I request support?
8. What does MoveReady not guarantee?

If any answer is hard to find, that page needs more plain guidance.

## Important trust checks

MoveReady should always avoid these claims:

```text
Visa approval guaranteed
Job guaranteed
Lottery or ballot selection guaranteed
Admission guaranteed
Appointment guaranteed
Provider result guaranteed
```

Reports and guidance should remain advisory and source-first.
