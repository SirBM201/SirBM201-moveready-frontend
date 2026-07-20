# MoveReady MVP User Testing Guide

This guide is written for a simple end-to-end test of the MoveReady MVP after deployment.

## Main user promise

MoveReady should help a user do this in a simple order:

1. Sign in or open Account.
2. Save one active profile.
3. Check a route using that profile.
4. Check Visa Power if the user already holds strong visas.
5. Generate a readiness report.
6. Find the report later.
7. Save a route, create an alert, or request support only when needed.

MoveReady must not promise visa approval, job approval, admission, lottery selection, ballot selection, travel entry, or government approval.

## Browser test order

Use this order for a clean test:

1. Open `/start`.
2. Click **Check my route**.
3. Open **Account**.
4. Sign in with email.
5. Save or select one active profile.
6. Click **Check route with this profile**.
7. On Route Checker, confirm the active profile is shown.
8. Click **Use active profile and generate report**.
9. Confirm a report appears with:
   - report reference,
   - risk label,
   - saved status,
   - checklist,
   - budget estimate,
   - next steps.
10. Open `/visa-power` and select an existing visa such as **Canada visitor visa**.
11. Confirm Visa Power shows possible travel-benefit destinations, conditions, source links, last verified date, confidence level, and safety notes.
12. Click **Open full report** from Route Checker or go to **Reports** and confirm the report can be loaded again.
13. Go to **Saved routes**, **Alerts**, and **Support** and confirm the active profile is prefilled where expected.

## PowerShell smoke test

Set these variables first:

```powershell
$Api = "https://YOUR-BACKEND-DOMAIN/api"
$Token = "PASTE_SESSION_TOKEN_HERE"
$Headers = @{ Authorization = "Bearer $Token" }
```

Check account summary:

```powershell
$Summary = Invoke-RestMethod `
  -Method Get `
  -Uri "$Api/account/summary" `
  -Headers $Headers

$Summary.counts | ConvertTo-Json -Depth 10
$Summary.sections.profiles.rows | Select-Object full_name,email,target_country,main_goal,route_category,status,created_at | Format-Table
```

Expected result:

- Only the correct active profile should remain visible if old profiles were hidden.
- The active profile should have `status` = `active`.
- Browser Account should show the same active profile.

Generate a route report from PowerShell:

```powershell
$Payload = @{
  full_name = "Sir BM"
  email = "bms.concept@hotmail.com"
  phone = ""
  preferred_contact_channel = "email"
  consent_to_contact = $true
  goal = "startup"
  main_goal = "startup"
  route_category = "startup"
  current_country = "Kuwait"
  target_country = "Estonia"
  available_funds_amount = 12000
  available_funds_currency = "EUR"
  family_members_count = 3
  timeline_months = 6
  has_previous_refusal = $false
  source_page = "/powershell-smoke-test"
}

$Report = Invoke-RestMethod `
  -Method Post `
  -Uri "$Api/relocation/reports" `
  -Headers $Headers `
  -ContentType "application/json" `
  -Body ($Payload | ConvertTo-Json -Depth 10)

$Report.report.report_ref
$Report.report.report_title
$Report.report.risk_level
$Report.report.readiness_score
```

Expected result:

- A report reference beginning with `MRR-` is returned.
- The report is saved when contact consent and email are included.
- The report appears on `/my-reports` after clicking **Load reports**.

Check Visa Power from PowerShell:

```powershell
$VisaPowerPayload = @{
  passport_country = "Nigeria"
  held_visas = @("canada_visitor")
  multiple_entry_confirmed = $true
  visa_used_before_confirmed = $false
}

$VisaPower = Invoke-RestMethod `
  -Method Post `
  -Uri "$Api/visa-power/check" `
  -ContentType "application/json" `
  -Body ($VisaPowerPayload | ConvertTo-Json -Depth 10)

$VisaPower.visa_opportunity_score
$VisaPower.matched_destination_count
$VisaPower.matches | Select-Object destination,separate_visa_needed,maximum_stay,last_verified,confidence | Format-Table
```

Expected result:

- The API returns `ok: true`.
- The API returns a starter visa opportunity score.
- The API returns matched destinations and official-source notes.
- The safety note says this is not permission to travel.

## Route checker user test

The Route Checker page should be easy for a non-technical user:

- It should show whether the user is signed in.
- It should show the active profile name and route.
- It should have a clear green button to generate a report quickly.
- It should still allow editing details before generating.
- After generating, the result should show what to do next.

## Visa Power user test

The Visa Power page should:

- Let the user enter passport country.
- Let the user select visas they already hold.
- Show possible travel-benefit destinations.
- Show whether a separate visa may be needed.
- Show maximum-stay notes.
- Show conditions.
- Show official source links.
- Show last verified date and confidence level.
- Clearly say it is planning guidance only, not permission to travel.

## Account page user test

The Account page should be easy to understand:

- It should show the signed-in email.
- It should show the active profile.
- It should explain that the active profile is used by route checks, reports, saved routes, alerts, timeline, and support.
- It should show **Use this profile** for choosing a profile.
- It should show **Hide old profile** only for profiles that are not active.
- It should explain when only one profile is visible.

## Reports page user test

The Reports page should:

- Load reports from the signed-in account.
- Also allow report reference lookup.
- Show risk label, target country, route type, generated date, goal, current country, funds, family count, and source status.
- Open the full report detail page.

## Saved routes, alerts, and support tests

These pages should:

- Show the signed-in email when available.
- Prefer the active profile details.
- Explain that alerts are reminders, not official approval.
- Explain that support requests are private and reviewed before provider handoff.

## MVP acceptance checklist

The MVP is acceptable when:

- New users can understand where to start.
- Signed-in users can see one active profile.
- Route Checker uses the active profile correctly.
- Visa Power shows existing-visa travel benefits safely.
- A report can be generated, opened, printed, downloaded, and loaded later.
- Old profiles can be hidden without deleting reports.
- Buttons use simple language.
- Every important page says the guidance is advisory and not approval.
- Mobile layout remains usable.
