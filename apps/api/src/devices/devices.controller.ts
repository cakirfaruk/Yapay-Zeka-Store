import { Body, Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { DevicesService } from './devices.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { DeploymentsService } from '../deployments/deployments.service.js';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService, private readonly deployments: DeploymentsService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async list(@Req() req: any) {
    return this.devicesService.listForUser(req.user.id);
  }

  @Post('claim')
  @UseGuards(AuthGuard, RolesGuard)
  async claim(@Req() req: any) {
    return this.devicesService.createClaim(req.user.id);
  }

  @Post('claim/attach')
  async attach(@Body('code') code: string, @Body('hwInfo') hwInfo: any) {
    return this.devicesService.attach(code, hwInfo);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async get(@Param('id') id: string, @Req() req: any) {
    return this.devicesService.get(id, req.user.id);
  }

  @Post(':id/deploy')
  @UseGuards(AuthGuard, RolesGuard)
  async deploy(@Param('id') id: string, @Body('appVersionId') appVersionId: string, @Req() req: any) {
    await this.devicesService.get(id, req.user.id);
    return this.deployments.enqueue(id, appVersionId, req.user.id);
  }
}
