# Project MoveReady Frontend Reuse Plan

Status: Draft for build  
Purpose: Reuse the working Naija Tax Guide / TaxBridge frontend structure while replacing identity, pages, and product logic.

## What To Reuse

- Next.js 16 app structure
- TypeScript configuration pattern
- Shared API helper pattern
- Config helper pattern
- Public page layout approach
- Checker/report preview interaction pattern
- Admin page guard ideas
- Report export/PDF ideas if clean
- Responsive visual approach from the TaxBridge MVP

## What To Replace

- Product name and copy
- Route names and URL structure
- TaxBridge/Naija content
- Tax calculators
- Quiz pages
- Tax-specific plan/pricing text
- Tax compliance wording
- Estonia-only positioning as the main homepage message

## New Public Experience

The first screen should present MoveReady as a practical readiness platform, not a generic travel blog.

Main first-screen message:

`Choose a realistic visa, study, work, business, or relocation pathway, then get your documents, funds, budget, insurance, and next steps ready.`

## Main Navigation

- Route Checker
- Countries
- Documents
- Budget
- Scholarships
- Insurance
- Report Preview

## First Frontend Data Types

- Country
- VisaRoute
- RouteVersion
- TrustedSource
- DocumentRequirement
- BudgetItem
- Scholarship
- InsuranceRequirement
- RelocationReport
- UserProfile

## API Direction

Frontend API calls should eventually map to backend routes like:

- `GET /api/relocation/countries`
- `GET /api/relocation/routes`
- `GET /api/relocation/routes/:id`
- `POST /api/relocation/checklist`
- `POST /api/relocation/budget-estimate`
- `GET /api/relocation/scholarships`
- `GET /api/relocation/insurance-requirements`
- `POST /api/relocation/reports`
- `GET /api/relocation/my/reports`

## Trust UI Requirements

Route and report pages should show:

- Last verified date
- Review due date
- Risk level
- Source count
- Route version status
- Report freshness status

## Build Order

1. Copy clean frontend scaffold from the working TaxBridge/Naija frontend.
2. Rename package and config to MoveReady.
3. Replace public pages with MoveReady pages.
4. Add route checker and report preview as static/mock-backed pages first.
5. Connect API helper to backend once backend endpoints exist.
6. Add admin pages after backend admin routes are ready.
7. Run local build and fix visual/layout issues.

## Design Warning

Do not make the homepage a marketing-only page. The first MVP screen should quickly lead users into a route checker or country comparison workflow.
