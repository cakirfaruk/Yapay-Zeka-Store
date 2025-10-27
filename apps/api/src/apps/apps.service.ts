import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service.js';
import { AppStatus, AppVersionStatus, Role } from '@prisma/client';

export interface AppListQuery {
  search?: string;
  category?: string;
  board?: string;
  limit?: number;
  page?: number;
}

@Injectable()
export class AppsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: AppListQuery, role?: Role) {
    const page = query.page ?? 1;
    const take = Math.min(query.limit ?? 12, 50);
    const skip = (page - 1) * take;
    const where = {
      AND: [
        role === Role.ADMIN || role === Role.DEVELOPER
          ? {}
          : { status: AppStatus.published },
        query.category ? { category: query.category } : {},
        query.board ? { supportedBoards: { has: query.board } } : {},
        query.search
          ? {
              OR: [
                { name: { contains: query.search, mode: 'insensitive' } },
                { synopsis: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.app.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: {
          currentVersion: true,
          owner: true,
        },
      }),
      this.prisma.app.count({ where }),
    ]);
    return { items, total, page, limit: take };
  }

  async getBySlug(slug: string, includeDraft = false) {
    const app = await this.prisma.app.findUnique({
      where: { slug },
      include: {
        owner: true,
        versions: { orderBy: { createdAt: 'desc' } },
        reviews: { include: { reviewer: true } },
      },
    });
    if (!app || (!includeDraft && app.status !== AppStatus.published)) {
      throw new NotFoundException('Application not found');
    }
    return app;
  }

  async submitForReview(appId: string) {
    const app = await this.prisma.app.update({
      where: { id: appId },
      data: { status: AppStatus.in_review },
    });
    return app;
  }

  async approve(appId: string, reviewerId: string) {
    const app = await this.prisma.app.update({
      where: { id: appId },
      data: { status: AppStatus.published },
      include: { versions: true },
    });
    const [latest] = app.versions;
    if (latest) {
      await this.prisma.appVersion.update({
        where: { id: latest.id },
        data: { status: AppVersionStatus.approved },
      });
      await this.prisma.app.update({
        where: { id: appId },
        data: { currentVersionId: latest.id },
      });
    }
    await this.prisma.appReview.create({
      data: {
        appId,
        reviewerId,
        status: AppStatus.published,
        notes: 'Approved by admin',
      },
    });
    return app;
  }

  async requestChanges(appId: string, reviewerId: string, notes: string) {
    await this.prisma.app.update({
      where: { id: appId },
      data: { status: AppStatus.changes_requested },
    });
    await this.prisma.appReview.create({
      data: {
        appId,
        reviewerId,
        status: AppStatus.changes_requested,
        notes,
      },
    });
  }

  async suspend(appId: string, reviewerId: string, reason: string) {
    await this.prisma.app.update({
      where: { id: appId },
      data: { status: AppStatus.suspended },
    });
    await this.prisma.appReview.create({
      data: {
        appId,
        reviewerId,
        status: AppStatus.suspended,
        notes: reason,
      },
    });
  }
}
