from __future__ import annotations

import base64
import json
import nacl.signing
from .config import AgentConfig

class LicenseVerifier:
    def __init__(self, config: AgentConfig) -> None:
        self._keys = [nacl.signing.VerifyKey(base64.b64decode(key)) for key in config.license_public_keys]

    async def verify(self, token: str) -> bool:
        try:
            payload_b64, signature_b64, _kid = token.split('.')
            payload = base64.urlsafe_b64decode(payload_b64 + '==')
            signature = base64.urlsafe_b64decode(signature_b64 + '==')
        except Exception:
            return False
        for key in self._keys:
            try:
                key.verify(payload, signature)
                data = json.loads(payload)
                return data.get('appId') is not None
            except Exception:
                continue
        return False
