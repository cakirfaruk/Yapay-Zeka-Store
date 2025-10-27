FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml* pnpm-lock.yaml* ./
COPY packages ./packages
COPY apps/api ./apps/api
COPY infra ./infra
RUN corepack enable && pnpm install --frozen-lockfile=false
RUN pnpm --filter @apps/api prisma:generate
RUN pnpm --filter @apps/api build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/infra ./infra
ENV NODE_ENV=production PORT=3001
CMD ["node", "dist/main.js"]
