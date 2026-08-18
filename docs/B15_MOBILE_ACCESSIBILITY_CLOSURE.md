# B15 — Mobile and accessibility closure

## Scope

B15 closes the responsive-web and accessibility baseline for the existing Launch V1 journeys. It does not create a native iOS or Android application and does not reopen completed backend engines.

## Completed controls

- Phone navigation keeps FIND, QUALIFY, MOVE, Alerts, and Account available above the device safe area.
- The full header remains reachable through More; active pages use `aria-current`, and Escape closes open menus and restores focus.
- The main-content skip link now lands on a programmatically focusable target.
- Touch actions, inputs, selects, text areas, summaries, and important links have a minimum 44-pixel target.
- Direct-label and nested-label forms collapse safely at low width; phone inputs use a 16-pixel font to avoid unwanted browser zoom.
- Long URLs, source labels, status values, tables, and preformatted results no longer force page-width overflow.
- Loading, error, not-found, signed-out, empty, and completed-result states expose bounded status announcements.
- Route comparison groups choices with a fieldset and legend, reports errors, and moves focus to the completed result.
- Device reduced-motion, increased-contrast, and forced-colors preferences are respected alongside verified-account reading preferences.
- Portrait orientation is not locked, and short landscape screens do not lose content behind fixed navigation.
- `/accessibility` explains supported phone, keyboard, screen-reader, and reading-preference behavior and the platform boundaries.

## Verification

Run:

```bash
npm run test:b15
npm run build
```

The production release should also be checked at 320px, 375px, 768px, and desktop width with keyboard-only navigation and browser zoom at 200%.

## Boundaries

- No database migration.
- No new environment variable.
- No change to official-source or no-approval-guarantee rules.
- No native mobile application.
- B16 operational readiness and B17 full final regression remain separate batches.
