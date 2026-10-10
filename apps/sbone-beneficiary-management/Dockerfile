# Beneficiary Management micro frontend (Next.js standalone server).
# Build from the repository root so the @sbone/shared workspace package is available:
#   docker build -f apps/sbone-beneficiary-management/Dockerfile -t sbone-beneficiary-management .
# Run (the platform forwards /beneficiaries here via its BENEFICIARY_APP_URL):
#   docker run -p 3010:3010 sbone-beneficiary-management

FROM node:20-alpine AS build
WORKDIR /repo
# Dependencies first, so they're cached until a package.json or the lockfile changes
COPY package.json package-lock.json ./
COPY apps/sbone-beneficiary-management/package.json apps/sbone-beneficiary-management/
COPY packages/shared/package.json packages/shared/
RUN npm ci --workspace sbone-beneficiary-management --include-workspace-root
COPY packages/shared packages/shared
COPY apps/sbone-beneficiary-management apps/sbone-beneficiary-management
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build -w sbone-beneficiary-management

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3010 \
    HOSTNAME=0.0.0.0
# Standalone output keeps the monorepo layout (outputFileTracingRoot is the repo root)
COPY --from=build --chown=node:node /repo/apps/sbone-beneficiary-management/.next/standalone ./
COPY --from=build --chown=node:node /repo/apps/sbone-beneficiary-management/.next/static ./apps/sbone-beneficiary-management/.next/static
COPY --from=build --chown=node:node /repo/apps/sbone-beneficiary-management/public ./apps/sbone-beneficiary-management/public
USER node
EXPOSE 3010
CMD ["node", "apps/sbone-beneficiary-management/server.js"]
