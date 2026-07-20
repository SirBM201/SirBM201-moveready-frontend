# MoveReady Launch Readiness Test Guide

This guide is for final MVP testing before public launch.

## Simple user flow to test

1. Open `/start`.
2. Click **Check my route**.
3. Confirm that the active Account profile loads in the route checker.
4. Generate a readiness report.
5. Open the full report.
6. Open **Reports** and confirm the new report is listed.
7. Open **Passport** and check one passport country.
8. Open **Visa Power** and check one existing visa, for example Canada visitor visa.
9. Open **Saved routes** and confirm route loading works.
10. Open **Alerts** and confirm saved alert records load.
11. Open **Services** and submit or load a support request.
12. Open **Account** and confirm counts and active profile are clear.

## PowerShell setup

Set the backend API base URL first. Do not use the frontend Vercel URL here.

```powershell
$Api = "https://YOUR-BACKEND-DOMAIN"
```

If `$Api` is empty, PowerShell will show `Invalid URI: The hostname could not be parsed`.

## Health check

```powershell
Invoke-RestMethod -Method Get -Uri "$Api/"
```

## Visa Power check

```powershell
$VisaPowerPayload = @{
  passport_country = "Nigeria"
  held_visas = @("canada_visitor")
  multiple_entry_confirmed = $true
  visa_used_before_confirmed = $false
}

$VisaPower = Invoke-RestMethod `
  -Method Post `
  -Uri "$Api/api/visa-power/check" `
  -ContentType "application/json" `
  -Body ($VisaPowerPayload | ConvertTo-Json -Depth 10)

$VisaPower.combined_opportunity_score
$VisaPower.passport_only_score
$VisaPower.visa_opportunity_score
$VisaPower.matched_destination_count
$VisaPower.matches | Select-Object destination,separate_visa_needed,maximum_stay,confidence,condition_status | Format-Table
```

## Passport Index check

```powershell
$PassportPayload = @{
  passport_country = "Nigeria"
}

$Passport = Invoke-RestMethod `
  -Method Post `
  -Uri "$Api/api/visa-power/passport-index/check" `
  -ContentType "application/json" `
  -Body ($PassportPayload | ConvertTo-Json -Depth 10)

$Passport.passport_opportunity_score
$Passport.passport_index.country
$Passport.passport_index.passport_strength_band
$Passport.passport_index.summary
```

## Readiness tools check

```powershell
$FundsPayload = @{
  available_funds_amount = 12000
  required_funds_amount = 15000
  target_timeline_months = 6
  family_members_count = 3
  currency = "EUR"
  recent_large_deposits = $false
}

$Funds = Invoke-RestMethod `
  -Method Post `
  -Uri "$Api/api/readiness/funds-plan" `
  -ContentType "application/json" `
  -Body ($FundsPayload | ConvertTo-Json -Depth 10)

$Funds | ConvertTo-Json -Depth 10
```

## Launch acceptance rule

The MVP is launch-ready only when a normal user can understand this order without help:

**Start → Account/Profile → Check Route → Report → Passport → Visa Power → Saved Routes/Alerts → Support only if needed.**

MoveReady must remain advisory. It must not promise visa approval, travel entry, admission, job offers, lottery selection, ballot success, or provider acceptance.
