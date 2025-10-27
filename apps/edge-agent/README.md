# Edge Agent

Python tabanlı ajan simülatörü OTA paketlerini indirir ve telemetri gönderir.

## Kurulum

```bash
cd apps/edge-agent
python -m venv .venv
source .venv/bin/activate
pip install -e .
python -m ai_agent --config config.yaml
```

Config dosyası `mqtt`, `licenses.publicKeys`, `ota.artifactStore`, `ota.jobTopic` ve `gateway.url` alanlarını içerir. Gateway, OTA görevlerini `ota/{deviceId}/job` başlığıyla MQTT üzerinden yayınlar; ajan gelen manifesti doğrulayıp `POST {gateway.url}/ota/jobs/{jobId}/report` ile durumu iletir. Lisans doğrulaması için API'nin yayımladığı Ed25519 açık anahtarını kullanın.
