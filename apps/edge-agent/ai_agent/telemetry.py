from __future__ import annotations

import asyncio
import json
import random
from datetime import datetime
import paho.mqtt.client as mqtt
from .config import AgentConfig

class TelemetryPublisher:
    def __init__(self, config: AgentConfig) -> None:
        self._config = config
        self._client = mqtt.Client()
        self._client.connect(config.mqtt_url.split('://')[1].split(':')[0], int(config.mqtt_url.split(':')[-1]))

    async def loop(self) -> None:
        while True:
            payload = {
                'deviceId': self._config.device_id,
                'ts': datetime.utcnow().isoformat(),
                'cpu': round(random.uniform(20, 60), 2),
                'ram': round(random.uniform(30, 70), 2),
            }
            self._client.publish(f"{self._config.telemetry_topic}/{self._config.device_id}", json.dumps(payload))
            await asyncio.sleep(5)
