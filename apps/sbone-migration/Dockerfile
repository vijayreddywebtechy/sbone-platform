# SBOne platform micro frontend (welcome page, sign-in, enrolment) as a Next.js standalone server.
# Build from the repository root so the @sbone/shared workspace package is available:
#   docker build -f apps/sbone-migration/Dockerfile -t sbone-migration .
# NEXT_PUBLIC_* values are inlined at build time, so pass them as build args:
#   docker build -f apps/sbone-migration/Dockerfile --build-arg NEXT_PUBLIC_PING_REGISTRATION_URL=https://... -t sbone-migration .
# Run (server-side env is read at runtime, no rebuild needed):
#   docker run -p 3000:3000 -e BENEFICIARY_APP_URL=http://host.docker.internal:3010 sbone-migration

FROM node:20-alpine AS build
WORKDIR /repo
# Dependencies first, so they're cached until a package.json or the lockfile changes
COPY package.json package-lock.json ./
COPY apps/sbone-migration/package.json apps/sbone-migration/
COPY packages/shared/package.json packages/shared/
RUN npm ci --workspace sbone-migration --include-workspace-root
COPY packages/shared packages/shared
COPY apps/sbone-migration apps/sbone-migration
ARG NEXT_PUBLIC_PING_REGISTRATION_URL=""
ENV NEXT_PUBLIC_PING_REGISTRATION_URL=$NEXT_PUBLIC_PING_REGISTRATION_URL \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build -w sbone-migration

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
# Standalone output keeps the monorepo layout (outputFileTracingRoot is the repo root)
COPY --from=build --chown=node:node /repo/apps/sbone-migration/.next/standalone ./
COPY --from=build --chown=node:node /repo/apps/sbone-migration/.next/static ./apps/sbone-migration/.next/static
COPY --from=build --chown=node:node /repo/apps/sbone-migration/public ./apps/sbone-migration/public
USER node
EXPOSE 3000
CMD ["node", "apps/sbone-migration/server.js"]
