import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { AppStatus, Role } from '@prisma/client';
import { PrismaService } from '../common/prisma.service.js';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('review-queue')
  async reviewQueue(@Query('status') status?: AppStatus) {
    const targetStatus = status ?? AppStatus.in_review;
    const apps = await this.prisma.app.findMany({
      where: { status: targetStatus },
      include: { owner: true, versions: true },
    });
    return { items: apps };
  }

  @Get('payouts')
  async payouts(@Query('month') month?: string) {
    const targetMonth = month ?? new Date().toISOString().slice(0, 7);
    const payouts = await this.prisma.payout.findMany({ where: { month: targetMonth }, include: { developer: true } });
    return { month: targetMonth, items: payouts };
  }
}
