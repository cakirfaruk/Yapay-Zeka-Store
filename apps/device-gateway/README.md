# Device Gateway

NestJS tabanlı cihaz köprüsü; gRPC, MQTT ve WebSocket ile cihazlardan gelen trafiği orkestre eder.

## Özellikler
- gRPC servisleri (`Register`, `Heartbeat`, `FetchJobs`, `ReportStatus`)
- OTA job yönetimi (in-memory kuyruk + MQTT yayını)
- WebSocket yayınları ile admin panellerine gerçek zamanlı güncellemeler
- REST endpoint'i (`POST /ota/jobs`) ile cihaz bazlı OTA görevi yaratma

## Çalıştırma
```bash
cd apps/device-gateway
pnpm install
pnpm start
```

Ortam değişkenleri:
- `PORT` (varsayılan `4000`)
- `GRPC_URL` (varsayılan `0.0.0.0:50051`)
- `MQTT_URL` (varsayılan `mqtt://localhost:1883`)

Geliştirme için `POST http://localhost:4000/ota/jobs` çağrısı ile `deviceId`, `appId`, `version`, `artifactUrl`, `sha256` alanlarını gönderip job kuyruklayabilirsiniz. Cihaz raporları `POST /ota/jobs/:id/report` ile güncellenir.
