from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import yaml

@dataclass
class AgentConfig:
    device_id: str
    mqtt_url: str
    telemetry_topic: str
    ota_job_topic: str
    gateway_url: str
    license_public_keys: list[str]
    artifact_store: str


def load_config(path: str) -> AgentConfig:
    data = yaml.safe_load(Path(path).read_text())
    return AgentConfig(
        device_id=data['device']['id'],
        mqtt_url=data['mqtt']['url'],
        telemetry_topic=data['mqtt'].get('telemetryTopic', 'telemetry'),
        ota_job_topic=data['ota'].get('jobTopic', 'ota'),
        gateway_url=data.get('gateway', {}).get('url', 'http://localhost:4000'),
        license_public_keys=data['licenses'].get('publicKeys', []),
        artifact_store=data['ota']['artifactStore'],
    )
