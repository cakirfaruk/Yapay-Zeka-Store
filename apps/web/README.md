# Web Uygulaması

Next.js 14 (App Router) + Tailwind tabanlı mağaza ve yönetim arayüzü.

## Komutlar

```bash
cd apps/web
pnpm install
pnpm dev
```

- `NEXT_PUBLIC_API_URL` varsayılan olarak `http://localhost:3001`
- `/auth/test-login?email=buyer@example.com` rotası test amacıyla cookie yazar
- Playwright testleri: `pnpm exec playwright install && pnpm test:e2e`
