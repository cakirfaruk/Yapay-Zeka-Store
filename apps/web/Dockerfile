FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-workspace.yaml* pnpm-lock.yaml* ./
COPY packages ./packages
COPY apps/web ./apps/web
RUN corepack enable && pnpm install --frozen-lockfile=false
RUN pnpm --filter @apps/web build
ENV NEXT_PUBLIC_API_URL=http://api:3001
EXPOSE 3000
CMD ["pnpm", "--filter", "@apps/web", "start"]
