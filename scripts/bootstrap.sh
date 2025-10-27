#!/usr/bin/env bash
set -euo pipefail

if ! command -v pnpm >/dev/null; then
  echo "pnpm gerekli" >&2
  exit 1
fi

pnpm install
pnpm --filter @apps/api prisma:generate || true
pnpm --filter @packages/proto run generate 2>/dev/null || true
pnpm --filter @packages/sdk-js run build 2>/dev/null || true
pnpm --filter @packages/sdk-python run build 2>/dev/null || true

echo "Bootstrap tamamlandı. Prisma client ve SDK çıktıları hazırlandı."
