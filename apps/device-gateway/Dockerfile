FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml* pnpm-lock.yaml* ./
COPY packages ./packages
COPY apps/device-gateway ./apps/device-gateway
RUN corepack enable && pnpm install --frozen-lockfile=false
CMD ["pnpm", "--filter", "@apps/device-gateway", "start"]
