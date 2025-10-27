import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service.js';
import { createHash, randomBytes } from 'node:crypto';

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  private hash(code: string) {
    return createHash('sha256').update(code).digest('hex');
  }

  private generateCode(length: number) {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i += 1) {
      result += alphabet[bytes[i] % alphabet.length];
    }
    return result;
  }

  async listForUser(userId: string) {
    const organizations = await this.prisma.userOrganization.findMany({ where: { userId } });
    const orgIds = organizations.map((org) => org.organizationId);
    return this.prisma.device.findMany({
      where: { orgId: { in: orgIds } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(deviceId: string, userId: string) {
    const device = await this.prisma.device.findUnique({ where: { id: deviceId } });
    if (!device) throw new NotFoundException('Device not found');
    const membership = await this.prisma.userOrganization.findFirst({
      where: { userId, organizationId: device.orgId },
    });
    if (!membership) throw new ForbiddenException('Device not accessible');
    return device;
  }

  async createClaim(userId: string) {
    const membership = await this.prisma.userOrganization.findFirst({ where: { userId } });
    if (!membership) {
      throw new ForbiddenException('User has no organization');
    }
    const code = this.generateCode(6);
    const expires = new Date(Date.now() + 1000 * 60 * 10);
    await this.prisma.deviceClaim.create({
      data: {
        codeHash: this.hash(code),
        orgId: membership.organizationId,
        userId,
        expiresAt: expires,
      },
    });
    return { code, expiresAt: expires };
  }

  async attach(code: string, hwInfo: any) {
    const claim = await this.prisma.deviceClaim.findFirst({ where: { codeHash: this.hash(code) } });
    if (!claim || claim.expiresAt < new Date()) {
      throw new NotFoundException('Claim code invalid');
    }
    const device = await this.prisma.device.create({
      data: {
        name: hwInfo?.name ?? `Device-${this.generateCode(4)}`,
        hw: hwInfo?.model ?? 'unknown',
        orgId: claim.orgId!,
        tags: hwInfo?.tags ?? [],
        lastSeen: new Date(),
      },
    });
    await this.prisma.deviceClaim.delete({ where: { codeHash: claim.codeHash } });
    return device;
  }

  async updateStatus(deviceId: string, lastSeen: Date) {
    await this.prisma.device.update({
      where: { id: deviceId },
      data: { lastSeen },
    });
  }
}
