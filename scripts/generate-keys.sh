#!/usr/bin/env bash
set -euo pipefail
mkdir -p infra/keys
KEY_NAME="ota_signing_ed25519"
PUB="infra/keys/${KEY_NAME}.pub"
PRIV="infra/keys/${KEY_NAME}.pk"
if [ -f "$PRIV" ]; then
  echo "Private key already exists at $PRIV" >&2
  exit 1
fi
openssl genpkey -algorithm ED25519 -out "$PRIV"
openssl pkey -in "$PRIV" -pubout > "$PUB"
cat <<EOFCONF > infra/keys/${KEY_NAME}.sample.json
{
  "kid": "ota-key-1",
  "publicKeyPath": "${PUB}"
}
EOFCONF
echo "Keys created. Store private key securely."
