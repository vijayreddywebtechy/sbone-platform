# sbone-beneficiary-management

Micro frontend for managing payment beneficiaries: list, add (payment type → details → review → success) and edit.
Part of the SBOne-Platform workspace — see the root README.

## How it fits into the platform

It's a separate [Next.js multi-zone](https://nextjs.org/docs/app/guides/multi-zones) app, deployed on its own:

- Every page and asset lives under the base path **`/beneficiaries`** (`next.config.ts`).
- The platform (`apps/sbone-migration`) forwards `/beneficiaries/*` here from `proxy.ts`, using **`BENEFICIARY_APP_URL`**
  from its environment. The address is read at runtime, so it can change per environment without a rebuild.
- It renders the same signed-in shell as the platform (`AppShell` from `@sbone/shared`, with `zone="beneficiaries"`),
  so customers see one SBOne app. Links to platform pages (Dashboard, Queries, …) are full page loads into the other
  zone; navigation inside Beneficiaries is client-side.

## Run locally

```bash
# from the repository root, in two terminals
npm run dev:beneficiary   # this app:      http://localhost:3010/beneficiaries
npm run dev:migration     # the platform:  http://localhost:3000/beneficiaries (proxied here)
```

`apps/sbone-migration/.env` points `BENEFICIARY_APP_URL` at `http://localhost:3010` (copy `.env.example` if missing).

## Docker

```bash
# from the repository root (the image needs packages/shared)
docker build -f apps/sbone-beneficiary-management/Dockerfile -t sbone-beneficiary-management .
docker run -p 3010:3010 sbone-beneficiary-management
```

Then set the platform's `BENEFICIARY_APP_URL` to wherever the container is reachable in that environment
(e.g. the internal load balancer or service URL on AWS).

## Data

Beneficiaries are mock data held in memory (`lib/beneficiaries.ts`, `lib/BeneficiariesContext.tsx`) until the
beneficiaries API is available; changes last while you move around the app and reset on reload.

## Shared design system

```tsx
import { AppShell, Button, Panel, TextField } from '@sbone/shared';
```

```scss
@use '@sbone/shared/styles' as *;
```
