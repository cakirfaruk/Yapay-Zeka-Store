from __future__ import annotations

import argparse
import asyncio
from .config import load_config
from .ota_manager import OTAManager
from .telemetry import TelemetryPublisher
from .runner import ApplicationRunner
from .license import LicenseVerifier

async def main() -> None:
    parser = argparse.ArgumentParser(description="Edge agent simulator")
    parser.add_argument('--config', default='config.yaml')
    parser.add_argument('--claim', help='Claim code to attach device', default=None)
    args = parser.parse_args()

    config = load_config(args.config)
    license_verifier = LicenseVerifier(config)
    runner = ApplicationRunner(config)
    ota = OTAManager(config, runner, license_verifier)
    telemetry = TelemetryPublisher(config)

    await asyncio.gather(
        ota.watch_for_jobs(),
        telemetry.loop(),
    )

if __name__ == '__main__':
    asyncio.run(main())
