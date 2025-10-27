import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { CheckoutService } from './checkout.service.js';
import { NotFoundException } from '@nestjs/common';

const createPrisma = () => ({
  app: { findUnique: jest.fn() },
  purchase: { create: jest.fn(), update: jest.fn() },
});

const createLicenses = () => ({
  issue: jest.fn(),
});

const asMock = (fn: unknown) => fn as jest.Mock;

describe('CheckoutService', () => {
  let prisma: ReturnType<typeof createPrisma>;
  let licenses: ReturnType<typeof createLicenses>;
  let service: CheckoutService;

  beforeEach(() => {
    prisma = createPrisma();
    licenses = createLicenses();
    service = new CheckoutService(prisma as any, licenses as any);
  });

  it('creates purchase and license for published app', async () => {
    asMock(prisma.app.findUnique).mockResolvedValue({
      id: 'app-1',
      status: 'published',
      priceCents: 3900,
      pricingModel: 'subscription',
    });
    asMock(prisma.purchase.create).mockResolvedValue({ id: 'purchase-1' });
    asMock(licenses.issue).mockResolvedValue({ id: 'license-1', token: 'signed-token' });

    const result = await service.createSession('user-1', 'app-1', 'device-9');

    expect(prisma.purchase.create).toHaveBeenCalled();
    expect(licenses.issue).toHaveBeenCalledWith('app-1', 'user-1', expect.any(String), 'device-9');
    expect(prisma.purchase.update).toHaveBeenCalledWith({
      where: { id: 'purchase-1' },
      data: { licenseId: 'license-1' },
    });
    expect(result).toEqual({ status: 'paid', purchaseId: 'purchase-1', licenseToken: 'signed-token' });
  });

  it('throws when app is missing or not published', async () => {
    asMock(prisma.app.findUnique).mockResolvedValue({ id: 'app-2', status: 'draft' });

    await expect(service.createSession('user-1', 'app-2')).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.purchase.create).not.toHaveBeenCalled();
  });
});
