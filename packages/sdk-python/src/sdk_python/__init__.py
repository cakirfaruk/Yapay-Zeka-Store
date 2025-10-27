from __future__ import annotations
import base64
import json
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class LicensePayload:
    sub: str
    app_id: str
    exp: str
    features: List[str]
    kid: str


def verify_license(token: str) -> Optional[LicensePayload]:
    try:
        payload_part = token.split('.')[1]
        decoded = json.loads(base64.urlsafe_b64decode(payload_part + '=='))
        return LicensePayload(
            sub=decoded['sub'],
            app_id=decoded['appId'],
            exp=decoded['exp'],
            features=decoded.get('features', []),
            kid=decoded['kid'],
        )
    except Exception:
        return None
