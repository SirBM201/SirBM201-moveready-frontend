# MoveReady Frontend Deployment Strategy

Status: frontend staging ready

## Backend URL

Use the active Railway backend:

```text
https://moveready-mvp-production.up.railway.app
```

Verified backend endpoints:

```text
/health
/api/health
/api/relocation/countries
```

## Recommended Frontend Provider

Vercel is the preferred staging host because this is a Next.js frontend.

Alternative: Netlify Free.

## Required Vercel Environment Variables

```text
NEXT_PUBLIC_APP_NAME=Project MoveReady
NEXT_PUBLIC_BACKEND_URL=https://moveready-mvp-production.up.railway.app
NEXT_PUBLIC_API_BASE=
```

## How API Calls Work

The frontend uses `/api/*` internally. The `next.config.mjs` file rewrites those requests to the backend domain stored in `NEXT_PUBLIC_BACKEND_URL`.

Example:

```text
Frontend request: /api/relocation/countries
Backend target:   https://moveready-mvp-production.up.railway.app/api/relocation/countries
```

## Temporary Architecture

```text
MoveReady frontend -> Vercel
MoveReady backend  -> Railway
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
