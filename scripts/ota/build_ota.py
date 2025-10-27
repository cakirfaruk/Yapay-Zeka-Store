#!/usr/bin/env python3
import argparse
import json
import tarfile
from pathlib import Path


def build_single_bundle(input_dir: Path, output: Path, app: str, semver: str):
    manifest = {
        "appId": app,
        "semver": semver,
        "artifact": {"path": "payload/", "format": "tar", "sha256": "stub"},
    }
    with tarfile.open(output, "w") as tar:
        tar.add(input_dir, arcname="payload")
        data = json.dumps(manifest).encode()
        info = tarfile.TarInfo(name="manifest.json")
        info.size = len(data)
        tar.addfile(info, io.BytesIO(data))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--app", required=True)
    parser.add_argument("--semver", required=True)
    parser.add_argument("--input", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    build_single_bundle(Path(args.input), Path(args.out), args.app, args.semver)
    print("OTA bundle created", args.out)


if __name__ == "__main__":
    import io
    main()
