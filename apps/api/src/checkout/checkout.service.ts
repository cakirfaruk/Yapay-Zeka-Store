import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service.js';
import { LicensesService } from '../licenses/licenses.service.js';
import { LicenseKind } from '@prisma/client';

@Injectable()
export class CheckoutService {
  constructor(private readonly prisma: PrismaService, private readonly licenses: LicensesService) {}

  async createSession(userId: string, appId: string, deviceId?: string | null) {
    const app = await this.prisma.app.findUnique({ where: { id: appId } });
    if (!app || app.status !== 'published') {
      throw new NotFoundException('App is not available for purchase');
    }

    const purchase = await this.prisma.purchase.create({
      data: {
        appId: app.id,
        buyerId: userId,
        amountCents: app.priceCents,
        provider: 'dummy',
        status: 'succeeded',
      },
    });

    const licenseKind = app.pricingModel === 'subscription' ? LicenseKind.subscription : LicenseKind.perpetual;
    const license = await this.licenses.issue(app.id, userId, licenseKind, deviceId);

    await this.prisma.purchase.update({
      where: { id: purchase.id },
      data: { licenseId: license.id },
    });

    return {
      status: 'paid',
      purchaseId: purchase.id,
      licenseToken: license.token,
    };
  }
}
