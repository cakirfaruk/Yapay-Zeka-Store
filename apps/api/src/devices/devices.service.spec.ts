import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { DevicesService } from './devices.service.js';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const createPrisma = () => ({
  userOrganization: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
  deviceClaim: {
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
  device: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
});

const asMock = (fn: unknown) => fn as jest.MockedFunction<any>;

describe('DevicesService', () => {
  let prisma: ReturnType<typeof createPrisma>;
  let service: DevicesService;

  beforeEach(() => {
    prisma = createPrisma();
    service = new DevicesService(prisma as any);
  });

  it('creates claim code when user belongs to an organization', async () => {
    asMock(prisma.userOrganization.findFirst).mockResolvedValue({ organizationId: 'org-1' });
    const result = await service.createClaim('user-1');
    expect(result.code).toHaveLength(6);
    expect(prisma.deviceClaim.create).toHaveBeenCalled();
  });

  it('throws when creating claim without organization', async () => {
    asMock(prisma.userOrganization.findFirst).mockResolvedValue(null);
    await expect(service.createClaim('user-2')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('attaches device with valid code and removes claim', async () => {
    asMock(prisma.deviceClaim.findFirst).mockResolvedValue({
      codeHash: 'hash',
      orgId: 'org-1',
      expiresAt: new Date(Date.now() + 1000),
    });
    asMock(prisma.device.create).mockResolvedValue({ id: 'device-1', orgId: 'org-1' });

    const device = await service.attach('ABC123', { name: 'Edge Kit', model: 'jetson' });

    expect(device).toEqual({ id: 'device-1', orgId: 'org-1' });
    expect(prisma.deviceClaim.delete).toHaveBeenCalledWith({ where: { codeHash: expect.any(String) } });
  });

  it('throws when claim expired', async () => {
    asMock(prisma.deviceClaim.findFirst).mockResolvedValue({
      codeHash: 'hash',
      expiresAt: new Date(Date.now() - 1000),
    });
    await expect(service.attach('CODE', {})).rejects.toBeInstanceOf(NotFoundException);
  });
});
