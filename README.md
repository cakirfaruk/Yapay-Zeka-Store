# Yapay Zeka Yazılım Pazaryeri Monorepo

Next.js 14 + NestJS + Prisma tabanlı uçtan uca MVP. Monorepo pnpm workspaces ile yönetilir.

## Dizim
- `apps/web`: Mağaza, cihaz yönetimi, geliştirici ve admin arayüzleri.
- `apps/api`: NestJS API, Prisma veri modeli ve tohum verileri.
- `apps/device-gateway`: OTA ve telemetri için köprü servisi.
- `apps/edge-agent`: Python ajan simülatörü.
- `packages/*`: Ortak UI kitleri, SDK'lar, protobuf ve konfigürasyonlar.
- `infra`: Docker Compose, K8s manifestleri ve Terraform iskeleti.

## Kurulum
```bash
make bootstrap   # pnpm install + prisma generate
make dev         # docker-compose ile db/redis/mqtt/api/web
make seed        # Prisma seed script
```

Varsayılan servis URL'leri:
- Web: http://localhost:3000/tr
- API: http://localhost:3001

Dev ortamında kimlik doğrulama için `x-user-email` başlığı kullanılır. Seed kullanıcıları: `buyer@example.com`, `dev@example.com`, `admin@example.com`.

### Testler
```bash
pnpm --filter @apps/api test      # Checkout, cihaz claim ve admin kuyruğu unit testleri
pnpm --filter @apps/web test:e2e  # Playwright senaryoları (satın alma + yayın akışı)
pnpm --filter @apps/web test:a11y # axe-core taraması
```

Detaylı dökümantasyon ve runbook'lar için `apps/*/README.md` ve `docs/` klasörünü inceleyin.

Lisans imzası için `LICENSE_PRIVATE_KEY_FALLBACK` değişkeni demo anahtarını sağlar; üretimde kendi Ed25519 anahtarınızı oluşturun.
