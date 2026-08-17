# B02 — Passport provenance UX

## User-facing trust contract

Passport Index must never collapse provider discovery data and MoveReady-reviewed official evidence into one truth label.

- **Provider / discovery data**: useful for discovery/comparison; never described as government verified merely because a provider supplied a source URL.
- **Verified official source**: only a government/embassy mapping that passed the backend controlled review lifecycle and remains within its review period.
- **Pending review**: candidate authority mapping exists but has not passed review.
- **Needs review**: verification has expired or requires re-checking; fail closed.
- **Retired**: no longer usable as current official evidence.

The Passport page explains these states before the explorer. Destination detail continues to surface backend `source_status`, source link and safety note; backend B01/038 remains authoritative for verification status.

## UX requirements
- Plain-language provenance explanation appears before reliance on destination results.
- Provider data is explicitly called discovery information.
- A source link alone is not called proof of visa eligibility.
- Users are instructed to check the destination authority before booking/applying/paying.
- Existing responsive result-block/mini-list primitives are reused so the trust explanation remains mobile friendly.

## Safety boundary
Frontend copy cannot promote a mapping. Verification is controlled by migration 038 + B01 backend operations. If backend status is pending/needs-review, the frontend must not infer verified status from source name, domain or URL.
