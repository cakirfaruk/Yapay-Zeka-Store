#!/usr/bin/env node
import { execSync } from 'node:child_process';
import path from 'node:path';
const root = path.resolve('packages/proto');
const proto = path.join(root, 'src', 'device-gateway.proto');
try {
  execSync(`pnpm dlx protoc --version`, { stdio: 'inherit' });
} catch (err) {
  console.warn('protoc yok, codegen atlandı.');
  process.exit(0);
}
execSync(`pnpm dlx protoc \
  --ts_out=${path.join(root, 'generated', 'ts')} \
  --proto_path=${path.join(root, 'src')} ${proto}`, { stdio: 'inherit' });
console.log('Proto codegen tamam.');
