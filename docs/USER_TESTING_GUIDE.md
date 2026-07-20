# MoveReady MVP user testing guide

This guide is for testing the app like a normal user. Use one email account for each test so profile, reports, saved routes, watchlist, timeline, and service requests stay together.

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

## Browser test flow

1. Open `/login`.
2. Request login code.
3. Enter the code.
4. After successful login, open `/dashboard`.
5. Confirm the dashboard shows the signed-in email.
6. Go to **Choose or hide saved profiles**.
7. Click **Use this profile** on the correct profile.
8. Click **Hide old profile** only on old test profiles.
9. Open `/route-checker`.
10. Confirm the form uses the active profile first.
11. Generate a readiness report.
12. Open the report detail page.
13. Open `/my-reports` and confirm the new report appears.
14. Save a route from `/saved-routes` or from a generated report.
15. Create a watchlist alert.
16. Add a timeline event.
17. Create a service request.
18. Return to `/dashboard` and confirm counts update.

## Expected dashboard result

A clean account should show one active profile and only relevant user records.

The active profile should show:

```text
status: active
```

Old hidden profiles should not appear in the dashboard profile chooser.

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

## Check watchlist

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

## Check service requests

```powershell
$Summary.sections.service_requests.rows |
  Select-Object service_type,target_country,route_category,status,created_at |
  Format-Table
```

## Simple user acceptance test

A non-technical user should be able to answer these questions within five minutes:

1. Where do I start?
2. What is my active profile?
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
