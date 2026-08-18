# B16 frontend deployment and operations contract

The Vercel frontend exposes a sanitized build fingerprint at
`/api/frontend-build-info` and expects the Railway backend to report the
`b16-v1` operations contract. The `/deployment-status` page compares both
contracts; a repository commit by itself is not deployment proof.

## Environment boundary

- `MOVEREADY_BACKEND_URL` is the preferred server/build-time backend origin.
- `NEXT_PUBLIC_BACKEND_URL` is a public URL only and remains a compatibility
  input for the rewrite.
- Production origins must be public HTTPS URLs. Invalid configured values fail
  the build instead of silently selecting a different backend.
- Admin keys, Supabase service-role secrets, passwords, signing keys, and
  provider tokens must never use a `NEXT_PUBLIC_*` name.

## Administrator key boundary

Browser admin modules reuse `X-MoveReady-Admin-Key` only through
`sessionStorage`, which limits reuse to the current tab. The root storage guard
removes a key left in persistent `localStorage` by an older deployment. Closing
the tab clears the current key.

## Release and rollback

1. Deploy the Railway B16 backend and verify `/api/build-info` reports
   `contract_versions.operations = b16-v1`.
2. Deploy this frontend and verify `/api/frontend-build-info` reports `b16-v1`.
3. Open `/deployment-status` and require the cross-contract check to pass.
4. If the frontend release fails, promote the last known-good Vercel deployment.
   Do not change Supabase history or rotate secrets merely to roll back UI code.

The authoritative schedule, migration-ledger, environment, and database
forward-repair runbook is `docs/B16_DEPLOYMENT_OPERATIONS.md` in the backend
repository.
