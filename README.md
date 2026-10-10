# sbone-platform

SBOne front ends as Next.js 16 (App Router, React 19) micro frontends sharing one design system, in an npm workspace.

```
sbone-platform/
├── apps/                                 deployable micro frontends
│   ├── sbone-migration/                  public welcome page, sign-in, enrolment   → http://localhost:3000
│   └── sbone-beneficiary-management/     beneficiary management                    → http://localhost:3010
└── packages/                             libraries shared by the apps
    └── shared/                           @sbone/shared — SB1 design system: components, SCSS tokens and
                                          mixins, Benton Sans fonts, logos
```

## Getting started

Run everything from this root folder:

```bash
npm install                 # installs every workspace, one lockfile
npm run dev:migration       # apps/sbone-migration on :3000
npm run dev:beneficiary     # apps/sbone-beneficiary-management on :3010
npm run build               # production build of both apps
npm run lint                # ESLint in both apps
```

Any app script can also be run directly: `npm run <script> -w sbone-migration`.

## Naming conventions

| What | Convention | Example |
| --- | --- | --- |
| Workspace folders | kebab-case, under `apps/` (deployable) or `packages/` (libraries) | `apps/sbone-migration` |
| npm package names | kebab-case, matching the folder; libraries scoped to `@sbone` | `sbone-migration`, `@sbone/shared` |
| Route folders (`app/`) | kebab-case, as they become URL segments; route groups in `(parentheses)` | `app/(application)/verify-identity` |
| React components | PascalCase folder and file, one component per folder | `components/VerifyIdentity/VerifyIdentity.tsx` |
| Component styles | CSS module next to the component, same name | `VerifyIdentity.module.scss` |
| Grouping folders, utilities, hooks | camelCase file, lowercase folder | `utils/classNames.ts`, `components/Welcome/sections` |
| SCSS partials | `_kebab-case.scss` | `styles/_variables.scss` |
| Static assets | kebab-case | `public/images/verify-identity/face-scan.svg` |
| Environment variables | UPPER_SNAKE_CASE | `PING_REGISTRATION_URL` |

## Using the shared design system

Each app lists `"@sbone/shared": "*"` as a dependency; npm links it to `packages/shared/`. Next compiles it from
source (`transpilePackages` in each `next.config.ts`).

```tsx
import { Button, TextField } from "@sbone/shared";
```

```scss
@use '@sbone/shared/styles' as *;
```

Apply the base styles (Benton Sans, colours, reset) by importing `@sbone/shared/styles/global.scss` in the app's
`app/layout.tsx`.

## Adding another micro frontend

1. Create the app under `apps/` with a kebab-case name (e.g. `npx create-next-app@latest apps/sbone-<name>`).
   The `apps/*` workspace pattern picks it up automatically.
2. Add `"@sbone/shared": "*"` to its dependencies, and copy `transpilePackages`, `turbopack.root` and the
   `globals.css`-only Tailwind rule from an existing app's `next.config.ts`.
3. Give it its own port in its `dev`/`start` scripts, add a `dev:<name>` script to the root `package.json`, and run
   `npm install` from the root.
