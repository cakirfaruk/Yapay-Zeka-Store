import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DeploymentsService } from './deployments.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Controller('deployments')
@UseGuards(AuthGuard, RolesGuard)
export class DeploymentsController {
  constructor(private readonly deployments: DeploymentsService) {}

  @Get('device/:deviceId')
  async list(@Param('deviceId') deviceId: string) {
    return this.deployments.listForDevice(deviceId);
  }
}
