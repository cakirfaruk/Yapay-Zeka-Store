#!/usr/bin/env node
import { spawn } from 'node:child_process';

const cmd = spawn('pnpm', ['--filter', '@apps/api', 'prisma:seed'], {
  stdio: 'inherit',
  env: process.env,
});

cmd.on('exit', (code) => {
  process.exit(code ?? 0);
});
