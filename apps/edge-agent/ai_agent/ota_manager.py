from __future__ import annotations

from pathlib import Path
import json
import aiohttp
import hashlib
from urllib.parse import urlparse
import paho.mqtt.client as mqtt
from asyncio import Queue
from .config import AgentConfig
from .runner import ApplicationRunner
from .license import LicenseVerifier

class OTAManager:
    def __init__(self, config: AgentConfig, runner: ApplicationRunner, license_verifier: LicenseVerifier) -> None:
        self._config = config
        self._runner = runner
        self._license = license_verifier
        self._job_topic = f"{self._config.ota_job_topic}/{self._config.device_id}/job"
        self._status_endpoint = f"{self._config.gateway_url}/ota/jobs"

    async def download_artifact(self, url: str, expected_sha: str) -> Path:
        path = Path('/tmp') / Path(url).name
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as resp:
                resp.raise_for_status()
                data = await resp.read()
        digest = hashlib.sha256(data).hexdigest()
        if digest != expected_sha:
            raise ValueError('SHA mismatch')
        path.write_bytes(data)
        return path

    async def watch_for_jobs(self) -> None:
        queue: Queue[bytes] = Queue()

        def on_message(_: mqtt.Client, __: object, msg: mqtt.MQTTMessage) -> None:
            queue.put_nowait(msg.payload)

        parsed = urlparse(self._config.mqtt_url)
        client = mqtt.Client()
        client.on_message = on_message
        client.connect(parsed.hostname or 'localhost', parsed.port or 1883)
        client.subscribe(self._job_topic)
        client.loop_start()

        async with aiohttp.ClientSession() as session:
            try:
                while True:
                    payload = await queue.get()
                    try:
                        manifest = json.loads(payload.decode('utf-8'))
                    except Exception as err:
                        print(f'[ota] invalid job payload: {err}')
                        continue
                    job_id = manifest.get('jobId')
                    if not job_id:
                        continue
                    try:
                        await self.handle_job(manifest)
                    except Exception as exc:  # noqa: BLE001
                        await self._report_status(session, job_id, 'failed', str(exc))
                    else:
                        await self._report_status(session, job_id, 'installed', 'Deployment completed')
            finally:
                client.loop_stop()
                client.disconnect()

    async def handle_job(self, manifest: dict) -> None:
        token = manifest.get('licenseToken')
        if token and not await self._license.verify(token):
            raise ValueError('License verification failed')
        artifact_path = await self.download_artifact(manifest['artifactUrl'], manifest['sha256'])
        await self._runner.deploy(manifest['appId'], artifact_path)

    async def _report_status(self, session: aiohttp.ClientSession, job_id: str, status: str, logs: str | None = None) -> None:
        payload = {
            'status': status,
            'logs': logs,
            'deviceId': self._config.device_id,
        }
        url = f"{self._status_endpoint}/{job_id}/report"
        async with session.post(url, json=payload) as resp:
            if resp.status >= 400:
                body = await resp.text()
                print(f'[ota] status report failed: {resp.status} {body}')
