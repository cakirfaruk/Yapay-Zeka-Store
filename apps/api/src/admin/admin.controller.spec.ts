import { describe, expect, it } from '@jest/globals';
import { AdminController } from './admin.controller.js';

const prisma = {
  app: { findMany: async () => [{ id: 'app-1', status: 'in_review' }] },
  payout: { findMany: async () => [{ id: 'payout-1', month: '2024-05' }] },
};

describe('AdminController', () => {
  const controller = new AdminController(prisma as any);

  it('returns review queue filtered by status', async () => {
    const response = await controller.reviewQueue('in_review');
    expect(response.items).toHaveLength(1);
    expect(response.items[0].status).toBe('in_review');
  });

  it('returns payouts for current month by default', async () => {
    const response = await controller.payouts();
    expect(response.month).toMatch(/\d{4}-\d{2}/);
    expect(response.items).toHaveLength(1);
  });
});
