SHELL := /bin/bash
include .env.make 2>/dev/null || true

bootstrap:
@bash scripts/bootstrap.sh

dev:
docker-compose up -d
@echo "Web: http://localhost:3000/tr"
@echo "API: http://localhost:3001"
@echo "Gateway: http://localhost:4000"

seed:
node scripts/load-seed.cjs

ota-demo:
python3 scripts/ota/build_ota.py --help

lint:
pnpm lint

test:
pnpm test
