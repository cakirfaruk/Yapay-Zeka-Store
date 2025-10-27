# API Service

NestJS + Prisma tabanlı API, mağaza, cihaz ve lisans akışlarının tamamını sunar.

## Geliştirme

```bash
cd apps/api
pnpm install
pnpm prisma:migrate
pnpm prisma:seed
pnpm start
```

Varsayılan olarak `DATABASE_URL` PostgreSQL bağlantısını, `LICENSE_PRIVATE_KEY_PATH` ise lisans imza anahtarını bekler.

## Önemli Endpoint'ler

- `GET /apps` – katalog listesi
- `GET /apps/:slug` – uygulama detayı
- `POST /checkout/session` – sandbox ödeme ve lisans üretimi
- `POST /devices/claim` / `POST /devices/claim/attach` – cihaz eşleştirme
- `POST /devices/:id/deploy` – OTA dağıtımı kuyruğu
- `POST /licenses/verify` – Ed25519 imzalı lisans doğrulaması
- `GET /admin/review-queue` – admin onay kuyruğu

Tüm korumalı rotalar `x-user-email` başlığı ile dev modunda kullanıcı doğrulaması yapar. Seed verileri `admin@example.com`, `dev@example.com`, `buyer@example.com` hesaplarını içerir.
