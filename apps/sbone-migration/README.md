This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## SB design system

This app is one of the SBOne micro frontends in the SBOne-Platform workspace — see the root README. Run it from the
repository root with `npm run dev:migration` (http://localhost:3000).

The Standard Bank design system lives in the root `packages/shared/` folder as the `@sbone/shared` package; this app's own
SCSS is in `styles/`.

```tsx
import { Button, TextField } from "@sbone/shared";
```

```scss
@use '@sbone/shared/styles' as *;
```

## Enrolment (Ping registration)

"Enroll to SBOne" in the sign-in panel opens `/enroll` (`app/enroll/route.ts`), which redirects to Ping registration.
Set the registration URL in `.env.local`, and configure Ping to return the customer to `/verify-identity`:

```bash
PING_REGISTRATION_URL=https://<ping-host>/<registration-path>
```

Without it (local development) `/enroll` skips Ping and goes straight to `/verify-identity`.

## Docker

```bash
# from the repository root (the image needs packages/shared)
docker build -f apps/sbone-migration/Dockerfile -t sbone-migration .
docker run -p 3000:3000 -e BENEFICIARY_APP_URL=http://host.docker.internal:3010 sbone-migration
```

`BENEFICIARY_APP_URL` and `PING_REGISTRATION_URL` are read at runtime. `NEXT_PUBLIC_PING_REGISTRATION_URL` is inlined at
build time, so pass it with `--build-arg NEXT_PUBLIC_PING_REGISTRATION_URL=...`.
