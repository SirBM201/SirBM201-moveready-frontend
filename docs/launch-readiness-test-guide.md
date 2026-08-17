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

## B10 Financial Readiness check

```powershell
$FundsPayload = @{
  country_code = "FI"
  route_code = "d-visa"
  currency = "EUR"
  savings = 12000
  expected_funding = 0
  family_size = 1
  proof_of_funds = @{
    amount = $null
    currency = "EUR"
  }
  costs = @{
    flight = 600
    accommodation = 1500
    settlement_reserve = 2000
  }
}

$Funds = Invoke-RestMethod `
  -Method Post `
  -Uri "$Api/api/financial-readiness/check" `
  -ContentType "application/json" `
  -Body ($FundsPayload | ConvertTo-Json -Depth 10)

$Funds.contract_version
$Funds.financial_plan.contract_version
$Funds.financial_plan.assessment.status
$Funds.financial_plan.warnings
```

This unresolved-source scenario must remain fail-closed. It must not treat a missing official requirement as zero. Add a real current requirement and HTTPS authority reference only when testing a route-specific source you have reviewed.

## B11 Opportunity / Route Finder check

1. Sign in with a saved relocation profile containing a goal and target country.
2. Open `/find` and confirm the page loads `b11-v1` recommendations.
3. Confirm the score is labelled profile alignment and qualification remains not determined.
4. Review one candidate’s evidence, planning cost, timeline/risk notes, freshness and official links.
5. Select **Check this exact route**.
6. Confirm Route Checker displays the same country and route before generating a report.
7. Sign out and confirm the Finder shows a sign-in state rather than profile data.

If the route has no current linked HTTPS official source, the UI must show source review needed. Do not promote the route as verified.

## Launch acceptance rule

The MVP is launch-ready only when a normal user can understand this order without help:

**Start → Account/Profile → Check Route → Financial Readiness → Report → Passport → Visa Power → Saved Routes/Alerts → Support only if needed.**

MoveReady must remain advisory. It must not promise visa approval, travel entry, admission, job offers, lottery selection, ballot success, or provider acceptance.
