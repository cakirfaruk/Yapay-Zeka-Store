import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service.js';
import { createHash } from 'node:crypto';
import { nanoid } from 'nanoid';

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  private hash(code: string) {
    return createHash('sha256').update(code).digest('hex');
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
    const code = nanoid(6).toUpperCase();
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
        name: hwInfo?.name ?? `Device-${nanoid(4)}`,
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
