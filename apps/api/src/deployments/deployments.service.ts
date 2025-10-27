import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service.js';
import { DeploymentStatus } from '@prisma/client';

@Injectable()
export class DeploymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async enqueue(deviceId: string, appVersionId: string, requestedBy: string) {
    const version = await this.prisma.appVersion.findUnique({ where: { id: appVersionId } });
    if (!version) throw new NotFoundException('Version not found');

    return this.prisma.deployment.create({
      data: {
        deviceId,
        appId: version.appId,
        appVersionId,
        status: DeploymentStatus.queued,
        logs: `Deployment requested by ${requestedBy} at ${new Date().toISOString()}`,
      },
    });
  }

  async listForDevice(deviceId: string) {
    return this.prisma.deployment.findMany({
      where: { deviceId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
