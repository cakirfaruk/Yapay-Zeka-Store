import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service.js';
import { LicenseKind, Prisma } from '@prisma/client';
import nacl from 'tweetnacl';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

interface LicensePayload {
  sub: string;
  appId: string;
  deviceId?: string | null;
  exp?: string | null;
  features?: string[];
  kid: string;
}

function decodeBase64Url(value: string): Uint8Array {
  return Buffer.from(value, 'base64url');
}

function encodeBase64Url(value: Uint8Array): string {
  return Buffer.from(value).toString('base64url');
}

@Injectable()
export class LicensesService {
  private privateKey?: Uint8Array;
  private kid: string;
  private publicKeys: Record<string, Uint8Array> = {};

  constructor(private readonly prisma: PrismaService) {
    this.kid = process.env.LICENSE_KID ?? 'dev-license-key';
    const privateKeyPath = process.env.LICENSE_PRIVATE_KEY_PATH;
    if (privateKeyPath && existsSync(privateKeyPath)) {
      const raw = readFileSync(privateKeyPath, 'utf8').trim();
      this.privateKey = raw.startsWith('-----BEGIN')
        ? Buffer.from(raw.split('\n').filter((line) => !line.includes('BEGIN') && !line.includes('END')).join(''), 'base64')
        : Buffer.from(raw, 'base64');
    } else if (process.env.LICENSE_PRIVATE_KEY_BASE64) {
      this.privateKey = Buffer.from(process.env.LICENSE_PRIVATE_KEY_BASE64, 'base64');
    }
    if (!this.privateKey) {
      const fallback = process.env.LICENSE_PRIVATE_KEY_FALLBACK ?? 'gz/mJAkje51i7HdYdSCRHpp1nOwdGXVbfakBuW3KPULsFyuTrV5WO/STLHDhJFA0w1Rn7y79TWTr+BloNGfivw==';
      this.privateKey = Buffer.from(fallback, 'base64');
    }

    const publicDir = process.env.PUBLIC_LICENSE_KEYS_DIR ?? path.join(process.cwd(), 'infra/keys/public');
    if (existsSync(publicDir)) {
      const files = readdirSync(publicDir).filter((file) => file.endsWith('.pub'));
      for (const file of files) {
        const content = readFileSync(path.join(publicDir, file), 'utf8').trim();
        const [currentKid] = file.split('.');
        const cleaned = content.startsWith('-----BEGIN')
          ? content
              .split('\n')
              .filter((line) => !line.includes('BEGIN') && !line.includes('END'))
              .join('')
          : content;
        this.publicKeys[currentKid] = Buffer.from(cleaned, 'base64');
      }
    }
  }

  private ensureSigningKey() {
    if (!this.privateKey) {
      throw new InternalServerErrorException('License signing key not configured');
    }
  }

  private async getApp(appId: string) {
    const app = await this.prisma.app.findUnique({ where: { id: appId } });
    if (!app) {
      throw new NotFoundException('App not found');
    }
    return app;
  }

  async issue(appId: string, buyerId: string, kind: LicenseKind, deviceId?: string | null) {
    this.ensureSigningKey();
    const app = await this.getApp(appId);
    const payload: LicensePayload = {
      sub: buyerId,
      appId: app.slug,
      deviceId: deviceId ?? null,
      exp: kind === LicenseKind.subscription ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() : null,
      features: [],
      kid: this.kid,
    };
    const payloadBuffer = Buffer.from(JSON.stringify(payload));
    const signature = nacl.sign.detached(payloadBuffer, this.privateKey!);
    const token = `${encodeBase64Url(payloadBuffer)}.${encodeBase64Url(signature)}.${payload.kid}`;
    return this.prisma.license.create({
      data: {
        appId: appId,
        buyerId,
        deviceId: deviceId ?? null,
        kind,
        payload: payload as unknown as Prisma.JsonObject,
        token,
      },
    });
  }

  async verify(token: string) {
    const [payloadB64, signatureB64, kid] = token.split('.');
    if (!payloadB64 || !signatureB64 || !kid) {
      return { valid: false, reason: 'Malformed token' };
    }
    const payloadBuffer = decodeBase64Url(payloadB64);
    const signature = decodeBase64Url(signatureB64);
    const publicKey = this.publicKeys[kid];
    if (!publicKey) {
      return { valid: false, reason: 'Unknown key id' };
    }
    const valid = nacl.sign.detached.verify(payloadBuffer, signature, publicKey);
    return { valid, payload: JSON.parse(Buffer.from(payloadBuffer).toString('utf8')) };
  }
}
