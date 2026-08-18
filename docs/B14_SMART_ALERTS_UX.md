# B14 — Smart Alerts UX

## User experience

`/alerts` is the single verified-account inbox for launch-critical changes across:

- Jobs monitoring and follow-ups
- Application deadlines and follow-ups
- Passport, visa and other document expiry metadata
- Relevant reviewed source and opportunity changes
- Optional language reminders
- Evidence refresh reminders

The page requires backend contract `b14-v1`. It has explicit loading, signed-out, older-contract and error states, and never treats an older response as current.

The first card is the highest-ranked alert. Remaining alerts can be filtered by category and priority without changing saved preferences. Each card opens the controlled MoveReady workspace and shows an official-source link only when the backend supplied a safe HTTP(S) URL.

## Preference controls

Users can manage B14 controls on `/alerts` and `/settings`:

- enable or disable jobs, application follow-ups and evidence refresh;
- opt in to language reminders;
- show critical alerts only;
- set bounded document-expiry, language-inactivity and evidence-refresh day thresholds.

Existing in-app, official-source, application-deadline, document-expiry and opportunity consent switches remain authoritative.

## Safety and non-goals

- External email, WhatsApp, SMS, Telegram and push delivery stay disabled.
- The UI does not upload or show raw documents or complete reference numbers.
- Alerts do not replace current official notices, deadlines, time zones, employer instructions, exam results, passport rules, visa conditions or application decisions.
- Source freshness is presented as a review signal, not proof that a rule is unchanged.
- B14 does not perform the B15 cross-engine mobile and accessibility completion sweep.

## Production acceptance

1. `/api/build-info` reports `contract_versions.smart_alerts = b14-v1` and `route_contract.ok = true`.
2. `/alerts` shows `B14 connected` after sign-in.
3. A preference change persists after refresh.
4. The alert count and primary alert reflect only enabled categories.
5. External delivery status remains `not enabled`.
