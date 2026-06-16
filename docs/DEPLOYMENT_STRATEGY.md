# MoveReady Frontend Deployment Strategy

Status: staging plan

## Decision

Deploy the MoveReady frontend separately from the backend. The frontend can safely use Vercel or Netlify while the backend runs on a staging provider.

## Recommended Frontend Provider

Vercel is the preferred staging host because this is a Next.js frontend.

Alternative: Netlify Free.

## Required Environment Variables

```text
NEXT_PUBLIC_APP_NAME=Project MoveReady
NEXT_PUBLIC_BACKEND_URL=https://your-backend-staging-domain
NEXT_PUBLIC_API_BASE=
```

## How API Calls Work

The frontend uses `/api/*` internally. The `next.config.mjs` file rewrites those requests to the backend domain stored in `NEXT_PUBLIC_BACKEND_URL`.

Example:

```text
Frontend request: /api/relocation/countries
Backend target:   https://your-backend-staging-domain/api/relocation/countries
```

## Temporary Architecture

```text
MoveReady frontend -> Vercel
MoveReady backend  -> Railway or PythonAnywhere
Database           -> Supabase
```

## Later Production Architecture

After Naija Tax Guide is ready and the Koyeb paid plan is active:

```text
MoveReady frontend -> Vercel or preferred frontend host
MoveReady backend  -> Koyeb additional service
Database           -> Supabase
```

## Notes

Do not expose Supabase service role keys in the frontend. Only the backend should use service-role credentials.
