# MoveReady B12 — Documents, Evidence and Application UX

Status: implementation and automated acceptance contract.

## Batch boundary

B12 closes the user journey from private document metadata to a route-based evidence pack and then to an auditable application case. It consumes the backend `b12-v1` contract and preserves the already-proven B03 lifecycle. It does not upload documents, submit an authority application, replace official instructions, or begin B13 dashboard orchestration.

## Closed journey

The Evidence Center now leads directly to Application Center after a pack is generated. Application Center mounts the account-owned route/evidence picker that already existed but was previously unreachable. Selecting a pack fills the new-case form, so a user no longer needs to copy a private pack UUID.

The journey keeps these controls visible:

- document type, owner, status, dates, translation, legalization, and expiry are metadata only;
- packs show completeness, missing requirements, expiry risks, warnings, and the recorded official-source note;
- application cases show stage, risk, source state, payment state, appointment, next deadline, warnings, lifecycle events, and timeline-reminder actions;
- terminal outcomes require a factual date and summary;
- raw documents, complete identifiers, and authority correspondence are prohibited.

## Failure and privacy states

Evidence, application, and link-choice workspaces distinguish loading, signed-out, ready/empty, older-backend, partial-link-source, and general failure states. Status messages use polite live regions; hard failures use alert semantics. Retry and sign-in actions remain available.

## Automated acceptance

Run:

```bash
npm run test:b06
npm run test:b08
npm run test:b10
npm run test:b11
npm run test:b12
npm run build
```

The B12 test verifies version gates, private metadata language, document-to-pack-to-case navigation, mounted account-owned link choices, no-copy pack selection, lifecycle/deadline/event controls, distinct failure states, accessibility semantics, and CI execution.

## Production acceptance to perform later

1. Confirm the deployed backend reports `contract_versions.documents_applications=b12-v1`.
2. Sign in and open `/evidence-pack` on a phone-sized screen.
3. Record one non-sensitive test metadata item and generate a pack.
4. Continue to `/applications`, select that pack, and confirm the new-case form is filled without copying its UUID.
5. Create a temporary case, update its stage/deadline, record an event, and review the history.
6. Verify signed-out, empty, retry, and partial-link-source messages are distinct.

Do not put passports, bank statements, certificates, complete application references, raw authority correspondence, OTPs, session tokens, passwords, card data, or private keys into screenshots, issues, logs, chat, or repository files.
