from __future__ import annotations

from pathlib import Path
import asyncio
from .config import AgentConfig

class ApplicationRunner:
    def __init__(self, config: AgentConfig) -> None:
        self._config = config
        self._current: str | None = None

    async def deploy(self, app_id: str, artifact: Path) -> None:
        await asyncio.sleep(1)
        self._current = app_id
        print(f'[runner] deployed {app_id} from {artifact}')
